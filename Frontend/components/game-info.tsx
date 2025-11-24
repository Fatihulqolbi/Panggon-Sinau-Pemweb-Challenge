"use client"

import { PieceColor, type ChessPiece } from "@/lib/chess-types"
import { getPieceSymbol } from "@/lib/chess-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GameInfoProps {
  currentPlayer: PieceColor
  gameStatus: string
  moveHistory: string[]
  capturedPieces: {
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }
  isAIGame?: boolean
  isAIThinking?: boolean
}

export default function GameInfo({ 
  currentPlayer, 
  gameStatus, 
  moveHistory, 
  capturedPieces,
  isAIGame = false,
  isAIThinking = false 
}: GameInfoProps) {
  return (
    <div className="space-y-4">
      <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">Game Status</CardTitle>
        </CardHeader>
        <CardContent className="dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded-full ${currentPlayer === PieceColor.WHITE ? "bg-white border border-gray-300" : "bg-black"}`}
            ></div>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {isAIGame 
                ? currentPlayer === PieceColor.WHITE 
                  ? "Your turn (White)" 
                  : "AI thinking... (Black)"
                : `${currentPlayer === PieceColor.WHITE ? "White" : "Black"}'s turn`
              }
            </span>
          </div>

          {gameStatus === "ongoing" ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Game in progress</p>
          ) : gameStatus.includes("check") && !gameStatus.includes("checkmate") ? (
            <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
              {gameStatus.split("-")[1] === PieceColor.WHITE ? "White" : "Black"} is in check!
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="moves">
        <TabsList className="grid grid-cols-2 bg-gray-100 dark:bg-gray-700">
          <TabsTrigger value="moves" className="dark:data-[state=active]:bg-gray-600">Move History</TabsTrigger>
          <TabsTrigger value="captured" className="dark:data-[state=active]:bg-gray-600">Captured Pieces</TabsTrigger>
        </TabsList>

        <TabsContent value="moves">
          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-4 dark:bg-gray-800">
              {moveHistory.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                    <div key={i} className="col-span-2 grid grid-cols-2 border-b border-gray-100 dark:border-gray-700 py-1">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        <span className="text-gray-500 dark:text-gray-400 mr-2">{i + 1}.</span>
                        {moveHistory[i * 2]}
                      </div>
                      {moveHistory[i * 2 + 1] && <div className="text-sm text-gray-900 dark:text-gray-200">{moveHistory[i * 2 + 1]}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No moves yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captured">
          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-4 dark:bg-gray-800">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">White captured:</h3>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces[PieceColor.BLACK].length > 0 ? (
                      capturedPieces[PieceColor.BLACK].map((piece, i) => (
                        <span key={i} className="text-xl text-black">
                          {getPieceSymbol(piece)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">Black captured:</h3>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces[PieceColor.WHITE].length > 0 ? (
                      capturedPieces[PieceColor.WHITE].map((piece, i) => (
                        <span key={i} className="text-xl text-white">
                          {getPieceSymbol(piece)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">None</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
