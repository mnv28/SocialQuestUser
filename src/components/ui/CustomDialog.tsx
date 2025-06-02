import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onCancel?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode; // typically buttons
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          {children}

          <div className="flex justify-end space-x-2">{actions}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
