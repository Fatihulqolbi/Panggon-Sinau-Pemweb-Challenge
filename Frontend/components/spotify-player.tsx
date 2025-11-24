"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music2 } from "lucide-react"

export function SpotifyPlayer() {
  return (
    <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Music2 className="h-5 w-5" />
          Spotify Player
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 dark:bg-gray-800">
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4t95PAs1EpY?utm_source=generator"
          width="100%"
          height="500"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </CardContent>
    </Card>
  )
}
