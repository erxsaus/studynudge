import StudySessionCard from '../StudySessionCard';

export default function StudySessionCardExample() {
  return (
    <div className="p-4 space-y-4">
      <StudySessionCard
        id="1"
        name="Mathematics"
        description="Advanced calculus and linear algebra practice"
        dailyTargetMinutes={60}
        todayMinutes={30}
        onStart={() => console.log('Start Mathematics session')}
        onOpenNotes={() => console.log('Open notes for Mathematics')}
      />
      <StudySessionCard
        id="2"
        name="Spanish"
        description="Vocabulary building and conversation practice"
        dailyTargetMinutes={45}
        todayMinutes={45}
        onStart={() => console.log('Start Spanish session')}
        onOpenNotes={() => console.log('Open notes for Spanish')}
      />
    </div>
  );
}
