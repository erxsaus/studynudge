import StudyCalendar from '../StudyCalendar';

export default function StudyCalendarExample() {
  const activities = [
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Mathematics", minutes: 60, notes: "Learned about derivatives", color: "#3b82f6" },
        { name: "Spanish", minutes: 45, notes: "Practiced verbs", color: "#10b981" },
      ],
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Web Development", minutes: 90, notes: "Built React components", color: "#f59e0b" },
      ],
    },
  ];

  return (
    <div className="p-4">
      <StudyCalendar activities={activities} />
    </div>
  );
}
