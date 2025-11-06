import { useState } from 'react';
import CreateSessionDialog from '../CreateSessionDialog';
import { Button } from '@/components/ui/button';

export default function CreateSessionDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <CreateSessionDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={(session) => console.log('Created session:', session)}
      />
    </div>
  );
}
