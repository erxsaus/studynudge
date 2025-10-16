import ProgressRing from '../ProgressRing';

export default function ProgressRingExample() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <ProgressRing label="Today's Goal" value={45} max={60} unit="min" />
      <ProgressRing label="Weekly Target" value={180} max={300} unit="min" />
    </div>
  );
}
