import StudyLogForm from '../StudyLogForm';

export default function StudyLogFormExample() {
  return (
    <StudyLogForm
      sessionName="Mathematics"
      minutesCompleted={60}
      onSave={(content, media) => console.log('Saved:', content, media)}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
