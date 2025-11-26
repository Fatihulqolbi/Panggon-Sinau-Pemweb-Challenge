"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function SpotifyPlayer() {
  return (
    <Card className="border-purple-300/40 dark:border-purple-700/40 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
      <CardHeader className="border-b-2 border-pink-300/40 dark:border-pink-700/40 pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-pink-600 dark:text-pink-400">
          <Image 
            src="/png-clipart-spotify-for-os-x-el-capitan-spotify-logo-thumbnail-removebg-preview.png" 
            alt="Spotify Logo" 
            width={24} 
            height={24}
            className="h-6 w-6"
          />
          Spotify Player
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2">
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
