import SessionProgressCard from '../SessionProgressCard';

export default function SessionProgressCardExample() {
  return (
    <div className="p-4 space-y-4">
      <SessionProgressCard
        name="Mathematics"
        totalMinutes={420}
        sessionsCount={8}
        streak={5}
        color="#3b82f6"
        onClick={() => console.log('Clicked Mathematics')}
      />
      <SessionProgressCard
        name="Spanish"
        totalMinutes={315}
        sessionsCount={7}
        streak={3}
        color="#10b981"
        onClick={() => console.log('Clicked Spanish')}
      />
    </div>
  );
}
