import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play, CheckCircle2, BookOpen } from "lucide-react";

interface StudySessionCardProps {
  id: string;
  name: string;
  description: string;
  dailyTargetMinutes: number;
  todayMinutes?: number;
  onStart: () => void;
  onOpenNotes: () => void;
}

export default function StudySessionCard({
  name,
  description,
  dailyTargetMinutes,
  todayMinutes = 0,
  onStart,
  onOpenNotes,
}: StudySessionCardProps) {
  const progress = Math.min((todayMinutes / dailyTargetMinutes) * 100, 100);
  const isCompleted = todayMinutes >= dailyTargetMinutes;

  return (
    <Card className="p-4" data-testid={`card-session-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate" data-testid="text-session-name">
              {name}
            </h3>
            {isCompleted && (
              <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {dailyTargetMinutes} min goal
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid="text-progress">
              {todayMinutes} / {dailyTargetMinutes} min
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={onOpenNotes}
            data-testid="button-open-notes"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={isCompleted ? "secondary" : "default"}
            onClick={onStart}
            data-testid="button-start-session"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  );
}
