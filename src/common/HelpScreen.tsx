// src/components/HelpScreen.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HelpScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpScreen({ open, onOpenChange }: HelpScreenProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help & Support</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p>This is some sample help content. You can put FAQs, support links, or guides here.</p>
          <ul className="list-disc list-inside">
            <li>How to use the dashboard</li>
            <li>Contact support</li>
            <li>FAQs</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
