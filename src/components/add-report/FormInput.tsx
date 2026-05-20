"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  className?: string;
}

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  readOnly,
  error,
  className,
}: FormInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-base font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(
          readOnly && "bg-muted cursor-not-allowed",
          error && "border-destructive focus-visible:ring-destructive",
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
