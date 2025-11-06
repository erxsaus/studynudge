import { Card } from "@/components/ui/card";

interface StreakCalendarProps {
  streak: number;
  studyDays: string[];
}

export default function StreakCalendar({ streak, studyDays }: StreakCalendarProps) {
  const today = new Date();
  const days: { date: Date; hasStudy: boolean }[] = [];

  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date,
      hasStudy: studyDays.includes(dateStr),
    });
  }

  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Study Streak</h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-primary" data-testid="text-streak-count">
            {streak}
          </span>
          <span className="text-muted-foreground">days</span>
        </div>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const isToday = day.date.toDateString() === today.toDateString();
              return (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    day.hasStudy
                      ? 'bg-chart-2'
                      : 'bg-muted'
                  } ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  title={day.date.toLocaleDateString()}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-chart-2/50" />
          <div className="w-3 h-3 rounded-sm bg-chart-2" />
        </div>
        <span>More</span>
      </div>
    </Card>
  );
}
