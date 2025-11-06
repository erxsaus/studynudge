import StreakCalendar from '../StreakCalendar';

export default function StreakCalendarExample() {
  const today = new Date();
  const studyDays: string[] = [];
  
  for (let i = 0; i < 40; i++) {
    if (Math.random() > 0.4) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      studyDays.push(date.toISOString().split('T')[0]);
    }
  }

  return (
    <div className="p-4">
      <StreakCalendar streak={7} studyDays={studyDays} />
    </div>
  );
}
