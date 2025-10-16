import StreakCalendar from "@/components/StreakCalendar";
import ProgressRing from "@/components/ProgressRing";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Award } from "lucide-react";

export default function Progress() {
  const today = new Date();
  const studyDays: string[] = [];
  
  for (let i = 0; i < 45; i++) {
    if (Math.random() > 0.35) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      studyDays.push(date.toISOString().split('T')[0]);
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-semibold" data-testid="text-page-title">
            Progress
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold" data-testid="text-total-sessions">
              24
            </div>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="h-6 w-6 text-chart-2 mx-auto mb-2" />
            <div className="text-2xl font-bold" data-testid="text-total-minutes">
              1,250
            </div>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </Card>
          <Card className="p-4 text-center">
            <Award className="h-6 w-6 text-chart-3 mx-auto mb-2" />
            <div className="text-2xl font-bold" data-testid="text-streak">
              7
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
        </div>

        <StreakCalendar streak={7} studyDays={studyDays} />

        <div>
          <h2 className="text-lg font-semibold mb-4">Daily Goals</h2>
          <div className="grid grid-cols-2 gap-4">
            <ProgressRing label="Today's Goal" value={95} max={120} unit="min" />
            <ProgressRing label="Weekly Target" value={450} max={600} unit="min" />
          </div>
        </div>
      </main>
    </div>
  );
}
