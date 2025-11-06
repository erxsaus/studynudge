import EmptyState from '../EmptyState';

export default function EmptyStateExample() {
  return (
    <div className="p-4">
      <EmptyState
        title="No Study Sessions"
        description="Create your first study session to start tracking your learning progress"
        actionLabel="Create Session"
        onAction={() => console.log('Create session clicked')}
      />
    </div>
  );
}
