import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";

interface SessionProgressCardProps {
  name: string;
  totalMinutes: number;
  sessionsCount: number;
  streak: number;
  color: string;
  onClick: () => void;
}

export default function SessionProgressCard({
  name,
  totalMinutes,
  sessionsCount,
  streak,
  color,
  onClick,
}: SessionProgressCardProps) {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <Card
      className="p-4 hover-elevate active-elevate-2 cursor-pointer"
      onClick={onClick}
      data-testid={`card-session-progress-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {sessionsCount} sessions
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {streak} day streak
            </Badge>
          </div>
        </div>
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color }}>
              {hours}
            </div>
            <div className="text-xs text-muted-foreground">hrs</div>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Total: {hours}h {mins}m studied
      </div>
    </Card>
  );
}
