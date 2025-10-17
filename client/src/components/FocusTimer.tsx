import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FocusTimerProps {
  sessionName: string;
  targetMinutes: number;
  onComplete: (minutesCompleted: number) => void;
  onCancel: () => void;
}

export default function FocusTimer({
  sessionName,
  targetMinutes,
  onComplete,
  onCancel,
}: FocusTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = Math.min((minutes / targetMinutes) * 100, 100);

  useEffect(() => {
    if (minutes >= targetMinutes && isRunning) {
      setIsRunning(false);
      
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      onComplete(minutes);
    }
  }, [minutes, targetMinutes, isRunning, onComplete]);

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-6">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2" data-testid="text-timer-session">
            {sessionName}
          </h2>
          <p className="text-muted-foreground">
            Target: {targetMinutes} minutes
          </p>
        </div>

        <div className="relative flex items-center justify-center mb-8">
          <svg className="w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-light font-mono" data-testid="text-timer-display">
                {formatTime(minutes, remainingSeconds)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {minutes} / {targetMinutes} min
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={onCancel}
            data-testid="button-cancel-timer"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={() => setIsRunning(!isRunning)}
            data-testid="button-toggle-timer"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start
              </>
            )}
          </Button>
          {minutes > 0 && (
            <Button
              size="lg"
              variant="default"
              onClick={() => onComplete(minutes)}
              data-testid="button-complete-timer"
            >
              <Check className="h-5 w-5 mr-2" />
              Done
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
