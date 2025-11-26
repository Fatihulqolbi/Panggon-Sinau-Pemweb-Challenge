"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "@/contexts/timer-context";

export function PomodoroTimer() {
  const { mode, time, isActive, progress, toggleTimer, resetTimer, switchMode } = useTimer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-md border-2 border-purple-300/40 dark:border-purple-700/40 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              Pomodoro Timer
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mode === "focus" ? "Waktune Fokus!" : "Waktune Istirahat"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-7xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {formatTime(time)}
            </div>

            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 shadow-lg hover:scale-105"
            >
              {isActive ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>

          <div className="flex gap-2 justify-center pt-4">
            <Button
              onClick={() => switchMode("focus")}
              variant={mode === "focus" ? "default" : "outline"}
              className={
                mode === "focus"
                  ? "bg-purple-500 hover:bg-purple-600 text-white transition-all duration-300 shadow-lg"
                  : "border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              }
            >
              Focus (25:00)
            </Button>
            <Button
              onClick={() => switchMode("break")}
              variant={mode === "break" ? "default" : "outline"}
              className={
                mode === "break"
                  ? "bg-pink-500 hover:bg-pink-600 text-white transition-all duration-300 shadow-lg"
                  : "border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
              }
            >
              Break (05:00)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

