import { ChessPiece, Position, PieceColor, PieceType } from "./chess-types"
import { isValidMove } from "./chess-rules"

// Simple AI for chess - makes random valid moves with basic strategy
export function getAIMove(
  board: (ChessPiece | null)[][],
  aiColor: PieceColor
): { from: Position; to: Position } | null {
  const allPossibleMoves: { from: Position; to: Position; score: number }[] = []

  // Find all possible moves for AI
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol]
      if (piece && piece.color === aiColor) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol }, aiColor)) {
              const score = evaluateMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol })
              allPossibleMoves.push({
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol },
                score,
              })
            }
          }
        }
      }
    }
  }

  if (allPossibleMoves.length === 0) {
    return null
  }

  // Sort moves by score (higher is better)
  allPossibleMoves.sort((a, b) => b.score - a.score)

  // Take one of the top 3 moves randomly (adds some unpredictability)
  const topMoves = allPossibleMoves.slice(0, Math.min(3, allPossibleMoves.length))
  const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)]

  return selectedMove
}

// Evaluate a move and return a score
function evaluateMove(board: (ChessPiece | null)[][], from: Position, to: Position): number {
  let score = 0
  const piece = board[from.row][from.col]
  const targetPiece = board[to.row][to.col]

  if (!piece) return 0

  // Capture value
  if (targetPiece) {
    score += getPieceValue(targetPiece.type) * 10
  }

  // Center control bonus
  const centerDistance = Math.abs(to.row - 3.5) + Math.abs(to.col - 3.5)
  score += (7 - centerDistance) * 2

  // Piece development bonus (move pieces from starting position)
  if (piece.type === PieceType.KNIGHT || piece.type === PieceType.BISHOP) {
    if (piece.color === PieceColor.WHITE && from.row === 7) {
      score += 5
    } else if (piece.color === PieceColor.BLACK && from.row === 0) {
      score += 5
    }
  }

  // Pawn advancement bonus
  if (piece.type === PieceType.PAWN) {
    if (piece.color === PieceColor.WHITE) {
      score += (7 - to.row) * 2
    } else {
      score += to.row * 2
    }
  }

  // Small random factor for variety
  score += Math.random() * 3

  return score
}

// Get piece value for evaluation
function getPieceValue(type: PieceType): number {
  switch (type) {
    case PieceType.PAWN:
      return 1
    case PieceType.KNIGHT:
      return 3
    case PieceType.BISHOP:
      return 3
    case PieceType.ROOK:
      return 5
    case PieceType.QUEEN:
      return 9
    case PieceType.KING:
      return 0 // King can't be captured in our evaluation
    default:
      return 0
  }
}
