"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./chess-board"
import GameControls from "./game-controls"
import GameInfo from "./game-info"
import { initialBoardState, PieceType, PieceColor, type ChessPiece, type Position } from "@/lib/chess-types"
import { isValidMove, makeMove, isCheck, isCheckmate, isStalemate } from "@/lib/chess-rules"
import { getAIMove } from "@/lib/chess-ai"

export default function ChessGame() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoardState())
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>(PieceColor.WHITE)
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [gameStatus, setGameStatus] = useState<string>("ongoing")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [capturedPieces, setCapturedPieces] = useState<{
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }>({
    [PieceColor.WHITE]: [],
    [PieceColor.BLACK]: [],
  })
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [playAgainstAI, setPlayAgainstAI] = useState(true) // Player is WHITE, AI is BLACK

  // Calculate valid moves when a piece is selected
  useEffect(() => {
    if (selectedPiece) {
      const moves: Position[] = []
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isValidMove(board, selectedPiece, { row, col }, currentPlayer)) {
            moves.push({ row, col })
          }
        }
      }
      setValidMoves(moves)
    } else {
      setValidMoves([])
    }
  }, [selectedPiece, board, currentPlayer])

  // Check for check, checkmate, or stalemate after each move
  useEffect(() => {
    if (isCheckmate(board, currentPlayer)) {
      const winner = currentPlayer === PieceColor.WHITE ? "Black" : "White"
      setGameStatus(`checkmate-${winner}`)
    } else if (isStalemate(board, currentPlayer)) {
      setGameStatus("stalemate")
    } else if (isCheck(board, currentPlayer)) {
      setGameStatus(`check-${currentPlayer}`)
    } else {
      setGameStatus("ongoing")
    }
  }, [board, currentPlayer])

  // AI move logic
  useEffect(() => {
    if (playAgainstAI && currentPlayer === PieceColor.BLACK && !gameStatus.includes("checkmate") && gameStatus !== "stalemate") {
      setIsAIThinking(true)
      
      // Add delay for more natural feel
      const aiMoveTimeout = setTimeout(() => {
        const aiMove = getAIMove(board, PieceColor.BLACK)
        
        if (aiMove) {
          const result = makeMove(board, aiMove.from, aiMove.to)

          // Update captured pieces if a piece was captured
          if (result.capturedPiece) {
            setCapturedPieces((prev) => ({
              ...prev,
              [PieceColor.BLACK]: [...prev[PieceColor.BLACK], result.capturedPiece!],
            }))
          }

          // Add move to history
          const fromNotation = `${String.fromCharCode(97 + aiMove.from.col)}${8 - aiMove.from.row}`
          const toNotation = `${String.fromCharCode(97 + aiMove.to.col)}${8 - aiMove.to.row}`
          const pieceSymbol =
            board[aiMove.from.row][aiMove.from.col]?.type === PieceType.PAWN
              ? ""
              : board[aiMove.from.row][aiMove.from.col]?.type.charAt(0)

          setMoveHistory((prev) => [...prev, `${pieceSymbol}${fromNotation}-${toNotation}`])

          // Update board and switch player
          setBoard(result.newBoard)
          setCurrentPlayer(PieceColor.WHITE)
        }
        
        setIsAIThinking(false)
      }, 500) // 500ms delay for AI to "think"

      return () => clearTimeout(aiMoveTimeout)
    }
  }, [currentPlayer, board, gameStatus, playAgainstAI])

  const handleSquareClick = (position: Position) => {
    // Don't allow moves during AI thinking or if game is over
    if (isAIThinking || gameStatus.includes("checkmate") || gameStatus === "stalemate") {
      return
    }

    // Only allow player (WHITE) to move when playing against AI
    if (playAgainstAI && currentPlayer === PieceColor.BLACK) {
      return
    }

    const piece = board[position.row][position.col]

    // If a piece is already selected
    if (selectedPiece) {
      // If clicking on the same piece, deselect it
      if (selectedPiece.row === position.row && selectedPiece.col === position.col) {
        setSelectedPiece(null)
        return
      }

      // If clicking on a valid move position
      if (validMoves.some((move) => move.row === position.row && move.col === position.col)) {
        const result = makeMove(board, selectedPiece, position)

        // Update captured pieces if a piece was captured
        if (result.capturedPiece) {
          setCapturedPieces((prev) => {
            const oppositeColor = currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE
            return {
              ...prev,
              [currentPlayer]: [...prev[currentPlayer], result.capturedPiece],
            }
          })
        }

        // Add move to history
        const fromNotation = `${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}`
        const toNotation = `${String.fromCharCode(97 + position.col)}${8 - position.row}`
        const pieceSymbol =
          board[selectedPiece.row][selectedPiece.col]?.type === PieceType.PAWN
            ? ""
            : board[selectedPiece.row][selectedPiece.col]?.type.charAt(0)

        setMoveHistory((prev) => [...prev, `${pieceSymbol}${fromNotation}-${toNotation}`])

        // Update board and switch player
        setBoard(result.newBoard)
        setCurrentPlayer((prev) => (prev === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE))
        setSelectedPiece(null)
      }
      // If clicking on another piece of the same color, select that piece instead
      else if (piece && piece.color === currentPlayer) {
        setSelectedPiece(position)
      }
    }
    // If no piece is selected and clicking on a piece of the current player's color
    else if (piece && piece.color === currentPlayer) {
      setSelectedPiece(position)
    }
  }

  const resetGame = () => {
    setBoard(initialBoardState())
    setCurrentPlayer(PieceColor.WHITE)
    setSelectedPiece(null)
    setValidMoves([])
    setGameStatus("ongoing")
    setMoveHistory([])
    setCapturedPieces({
      [PieceColor.WHITE]: [],
      [PieceColor.BLACK]: [],
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
      <div className="flex-1 flex flex-col items-center">
        {isAIThinking && (
          <div className="mb-4 px-4 py-2 bg-teal-100 dark:bg-gray-700 border border-teal-300 dark:border-gray-600 rounded-lg">
            <p className="text-sm text-teal-800 dark:text-teal-300 font-medium">
              AI sedang berpikir...
            </p>
          </div>
        )}
        <ChessBoard
          board={board}
          selectedPiece={selectedPiece}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
        />
        <GameControls onReset={resetGame} gameStatus={gameStatus} />
      </div>
      <div className="flex-1">
        <GameInfo
          currentPlayer={currentPlayer}
          gameStatus={gameStatus}
          moveHistory={moveHistory}
          capturedPieces={capturedPieces}
          isAIGame={playAgainstAI}
          isAIThinking={isAIThinking}
        />
      </div>
    </div>
  )
}
