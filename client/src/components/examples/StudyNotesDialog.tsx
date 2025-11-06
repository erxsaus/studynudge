import { useState } from 'react';
import StudyNotesDialog from '../StudyNotesDialog';
import { Button } from '@/components/ui/button';

export default function StudyNotesDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Notes Dialog</Button>
      <StudyNotesDialog
        open={open}
        onOpenChange={setOpen}
        sessionName="Mathematics"
        onSave={(content, media) => console.log('Saved notes:', content, media)}
      />
    </div>
  );
}
