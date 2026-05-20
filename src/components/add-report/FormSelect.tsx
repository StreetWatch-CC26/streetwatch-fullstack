"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  className,
}: FormSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-base font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(error && "border-destructive focus:ring-destructive")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
