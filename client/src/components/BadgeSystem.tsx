import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Trophy, 
  Star, 
  Crown, 
  Sparkles, 
  Award,
  Zap,
  Target,
  Gem,
  Medal
} from "lucide-react";

interface BadgeSystemProps {
  currentStreak: number;
}

interface BadgeMilestone {
  days: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const badges: BadgeMilestone[] = [
  {
    days: 7,
    title: "Week Warrior",
    description: "7 day streak",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    days: 30,
    title: "Monthly Master",
    description: "30 day streak",
    icon: Star,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    days: 90,
    title: "Quarterly Champion",
    description: "90 day streak",
    icon: Trophy,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    days: 365,
    title: "Yearly Legend",
    description: "1 year streak",
    icon: Crown,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    days: 730,
    title: "2 Year Titan",
    description: "2 year streak",
    icon: Sparkles,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    days: 1095,
    title: "3 Year Elite",
    description: "3 year streak",
    icon: Zap,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    days: 1460,
    title: "4 Year Prodigy",
    description: "4 year streak",
    icon: Target,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    days: 1825,
    title: "5 Year Virtuoso",
    description: "5 year streak",
    icon: Gem,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    days: 2190,
    title: "6 Year Grandmaster",
    description: "6 year streak",
    icon: Award,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    days: 2555,
    title: "7 Year Legend",
    description: "7 year streak",
    icon: Medal,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    days: 2920,
    title: "8 Year Immortal",
    description: "8 year streak",
    icon: Crown,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    days: 3285,
    title: "9 Year Eternal",
    description: "9 year streak",
    icon: Sparkles,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    days: 3650,
    title: "10 Year Deity",
    description: "10 year streak",
    icon: Trophy,
    color: "text-gradient bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500",
    bgColor: "bg-gradient-to-r from-yellow-500/10 via-pink-500/10 to-purple-500/10",
  },
];

export default function BadgeSystem({ currentStreak }: BadgeSystemProps) {
  const earnedBadges = badges.filter((badge) => currentStreak >= badge.days);
  const nextBadge = badges.find((badge) => currentStreak < badge.days);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Achievements</h3>
        <Badge variant="outline" className="gap-1">
          <Flame className="h-3 w-3" />
          {currentStreak} day streak
        </Badge>
      </div>

      {earnedBadges.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Earned Badges ({earnedBadges.length})
          </p>
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <Card
                  key={badge.days}
                  className={`p-4 ${badge.bgColor}`}
                  data-testid={`badge-earned-${badge.days}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${badge.bgColor}`}>
                      <Icon className={`h-6 w-6 ${badge.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {badge.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {nextBadge && (
        <Card className="p-4 border-dashed">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {(() => {
                const Icon = nextBadge.icon;
                return <Icon className="h-6 w-6 text-muted-foreground" />;
              })()}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-muted-foreground">
                {nextBadge.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {nextBadge.days - currentStreak} more days to unlock
              </p>
            </div>
          </div>
        </Card>
      )}

      {earnedBadges.length === 0 && (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-muted">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold">Start Your Journey</h4>
            <p className="text-sm text-muted-foreground">
              Study consistently to earn your first badge at 7 days!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
