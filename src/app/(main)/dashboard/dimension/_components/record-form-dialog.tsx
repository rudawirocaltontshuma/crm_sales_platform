"use client";

import * as React from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface RecordField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  colSpan?: 1 | 2;
}

interface RecordFormDialogProps {
  title: string;
  description: string;
  fields: readonly RecordField[];
  triggerLabel: string;
  submitLabel?: string;
  successMessage: string;
}

/**
 * Client-only create form. This portfolio demo has no backend, so submitting
 * simply confirms with a toast and resets — nothing is persisted.
 */
export function RecordFormDialog({
  title,
  description,
  fields,
  triggerLabel,
  submitLabel = "Save record",
  successMessage,
}: RecordFormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpen(false);
    setValues({});
    toast.success(successMessage, {
      description: "Demo mode — this record is not persisted anywhere.",
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setValues({});
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus data-icon="inline-start" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.colSpan === 2 ? "space-y-2 sm:col-span-2" : "space-y-2"}>
                <Label htmlFor={`field-${field.name}`}>{field.label}</Label>
                {field.type === "select" ? (
                  <Select
                    value={values[field.name] ?? ""}
                    onValueChange={(value) => setValues((current) => ({ ...current, [field.name]: value }))}
                  >
                    <SelectTrigger id={`field-${field.name}`} className="w-full">
                      <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(field.options ?? []).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : null}
                {field.type === "textarea" ? (
                  <Textarea
                    id={`field-${field.name}`}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                    rows={4}
                  />
                ) : null}
                {field.type !== "select" && field.type !== "textarea" ? (
                  <Input
                    id={`field-${field.name}`}
                    type={field.type ?? "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
