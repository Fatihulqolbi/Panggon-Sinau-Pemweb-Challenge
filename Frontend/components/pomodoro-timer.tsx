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
    <Card className="bg-white dark:bg-gray-800 border-2 border-teal-200 dark:border-gray-700 shadow-xl">
      <CardContent className="p-8 dark:bg-gray-800">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-[#4FB7B3] dark:text-[#A8FBD3] mb-2">
              Pomodoro Timer
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "focus" ? "Waktune Fokus!" : "Waktune Istirahat"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-7xl font-bold text-[#4FB7B3] dark:text-[#A8FBD3] tabular-nums">
              {formatTime(time)}
            </div>

            <Progress value={progress} className="h-3" />
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="bg-[#4FB7B3] hover:bg-[#31326F] text-white transition-colors"
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
              className="border-[#4FB7B3] text-[#4FB7B3] hover:bg-teal-50 dark:hover:bg-teal-950/20"
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
                  ? "bg-[#4FB7B3] hover:bg-[#31326F] text-white transition-colors"
                  : "border-[#4FB7B3] text-[#4FB7B3] hover:bg-teal-50 dark:hover:bg-teal-950/20"
              }
            >
              Focus (25:00)
            </Button>
            <Button
              onClick={() => switchMode("break")}
              variant={mode === "break" ? "default" : "outline"}
              className={
                mode === "break"
                  ? "bg-[#6379AB] hover:bg-[#31326F] text-white transition-colors"
                  : "border-[#4FB7B3] text-[#4FB7B3] hover:bg-teal-50 dark:hover:bg-teal-950/20"
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

