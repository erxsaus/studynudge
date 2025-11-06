import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface StudyActivity {
  date: string;
  sessions: {
    name: string;
    minutes: number;
    notes?: string;
    color: string;
  }[];
}

interface StudyCalendarProps {
  activities: StudyActivity[];
}

export default function StudyCalendar({ activities }: StudyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<StudyActivity | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getActivityForDate = (date: Date | null): StudyActivity | undefined => {
    if (!date) return undefined;
    const dateStr = date.toISOString().split('T')[0];
    return activities.find(a => a.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date().toDateString();

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{monthName}</h3>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={previousMonth} data-testid="button-prev-month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={nextMonth} data-testid="button-next-month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const activity = getActivityForDate(day);
            const isToday = day?.toDateString() === today;
            const totalMinutes = activity?.sessions.reduce((sum, s) => sum + s.minutes, 0) || 0;
            const hasActivity = activity && activity.sessions.length > 0;

            return (
              <button
                key={index}
                onClick={() => activity && setSelectedDate(activity)}
                disabled={!day}
                className={`aspect-square flex flex-col items-center justify-center rounded-md text-sm transition-colors ${
                  !day
                    ? "invisible"
                    : hasActivity
                    ? "bg-primary/10 hover-elevate active-elevate-2 font-medium"
                    : "hover-elevate active-elevate-2"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
                data-testid={day ? `calendar-day-${day.getDate()}` : undefined}
              >
                {day && (
                  <>
                    <span className={hasActivity ? "text-foreground" : "text-muted-foreground"}>
                      {day.getDate()}
                    </span>
                    {hasActivity && (
                      <span className="text-xs text-primary font-normal mt-0.5">
                        {totalMinutes}m
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && new Date(selectedDate.date).toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </DialogTitle>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Study Sessions</h4>
                <div className="space-y-3">
                  {selectedDate.sessions.map((session, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: session.color }}
                          />
                          <span className="font-medium">{session.name}</span>
                        </div>
                        <Badge variant="secondary">{session.minutes} min</Badge>
                      </div>
                      {session.notes && (
                        <div className="pl-5">
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {session.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total time studied:</span>
                  <span className="font-semibold">
                    {selectedDate.sessions.reduce((sum, s) => sum + s.minutes, 0)} minutes
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
