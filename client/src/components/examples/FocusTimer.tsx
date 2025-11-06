import FocusTimer from '../FocusTimer';

export default function FocusTimerExample() {
  return (
    <FocusTimer
      sessionName="Mathematics"
      targetMinutes={60}
      onComplete={(mins) => console.log(`Completed ${mins} minutes`)}
      onCancel={() => console.log('Timer cancelled')}
    />
  );
}
