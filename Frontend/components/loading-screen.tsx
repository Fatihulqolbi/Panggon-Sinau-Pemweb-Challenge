"use client"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="relative flex flex-col items-center gap-8">
        {/* Glowing Orb */}
        <div className="relative">
          {/* Outer Glow */}
          <div className="absolute inset-0 animate-ping opacity-75">
            <div className="h-40 w-40 rounded-full bg-white/20 blur-xl"></div>
          </div>
          
          {/* Rotating Rings */}
          <div className="relative h-40 w-40">
            {/* Ring 1 */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="h-full w-full rounded-full border-[6px] border-t-white/90 border-r-transparent border-b-transparent border-l-transparent shadow-lg shadow-white/50"></div>
            </div>
            
            {/* Ring 2 */}
            <div className="absolute inset-4 animate-spin-reverse">
              <div className="h-full w-full rounded-full border-[6px] border-t-transparent border-r-yellow-300/90 border-b-transparent border-l-transparent shadow-lg shadow-yellow-300/50"></div>
            </div>
            
            {/* Ring 3 */}
            <div className="absolute inset-8 animate-spin-slow">
              <div className="h-full w-full rounded-full border-[6px] border-t-transparent border-r-transparent border-b-cyan-300/90 border-l-transparent shadow-lg shadow-cyan-300/50"></div>
            </div>

            {/* Center Core */}
            <div className="absolute inset-12 flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-white via-purple-200 to-pink-200 animate-pulse shadow-2xl shadow-white/50"></div>
            </div>
          </div>
        </div>

        {/* Loading Text with Shimmer */}
        <div className="relative overflow-hidden">
          <h2 className="text-3xl font-bold text-white tracking-wider">
            Loading
          </h2>
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-white shadow-lg shadow-white/50" style={{ animationDelay: '0s' }}></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50" style={{ animationDelay: '0.15s' }}></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  )
}
