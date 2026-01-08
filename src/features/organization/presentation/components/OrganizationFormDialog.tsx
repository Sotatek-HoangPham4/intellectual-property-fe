"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type OrganizationFormValues = {
  name: string;
  description?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  defaultValues?: OrganizationFormValues;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (values: OrganizationFormValues) => Promise<void> | void;
};

export function OrganizationFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  submitLabel,
  loading,
  onSubmit,
}: Props) {
  const [values, setValues] = React.useState<OrganizationFormValues>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
  });

  React.useEffect(() => {
    if (open) {
      setValues({
        name: defaultValues?.name ?? "",
        description: defaultValues?.description ?? "",
      });
    }
  }, [open, defaultValues]);

  const canSubmit = values.name.trim().length > 0 && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input
              id="org-name"
              value={values.name}
              onChange={(e) =>
                setValues((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="VD: Acme Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-desc">Description</Label>
            <Input
              id="org-desc"
              value={values.description ?? ""}
              onChange={(e) =>
                setValues((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Mô tả ngắn (optional)"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!canSubmit) return;
              await onSubmit({
                name: values.name.trim(),
                description: values.description?.trim() || undefined,
              });
            }}
            disabled={!canSubmit}
          >
            {loading ? "Saving..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
