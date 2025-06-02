import { cn } from "@/lib/utils";
import type { ComponentProps, KeyboardEvent } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // make sure to install lucide-react or use your icon set

export type ErrorMessage =
  | string
  | FieldError
  | Merge<FieldError, FieldErrorsImpl>;

export type TextFieldProps<P extends FieldValues> = UseControllerProps<P> &
  ComponentProps<"input"> &
  ComponentProps<"textarea"> & {
    label?: string;
    loading?: boolean;
    rows?: number;
    isCapitalize?: boolean;
    isTrimStartDisabled?: boolean;
    error?: boolean;
    errorMessage?: ErrorMessage;
    startIcon?: React.ElementType;
  };

export function TextField<P extends FieldValues>({
  control,
  name,
  defaultValue,
  label = "",
  rules,
  type,
  required,
  disabled,
  placeholder = "",
  isCapitalize = false,
  isTrimStartDisabled = false,
  rows,
  className,
  error,
  errorMessage,
  startIcon: StartIcon,
  ...inputFieldProps
}: Omit<TextFieldProps<P>, "onChange" | "value">) {
  const {
    field: { value, onChange, ...restField },
  } = useController({ name, control, defaultValue, rules });

  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "-" && type === "number") {
      event.preventDefault();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = event.target.value ?? null;

    if (typeof value === "string" && value.trim() === "") {
      value = null;
    } else if (!isTrimStartDisabled && typeof value === "string") {
      value = value.trimStart();
    }

    if (value && type === "number") {
      onChange(Number(value));
    } else if (isCapitalize) {
      onChange(value ? value?.toUpperCase() : null);
    } else {
      onChange(value);
    }
  };

  const commonProps = {
    disabled,
    required,
    onKeyDown: handleKeyDown,
    className: cn(
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
      error ? "border-red-300 focus-visible:ring-red-500" : "border-input"
    ),
    placeholder: placeholder ?? label,
    onChange: handleChange,
    value: typeof value === "string" ? value.trimStart() : value ?? "",
    ...restField,
    ...inputFieldProps,
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {!rows ? (
        <div className="relative">
          {StartIcon && (
            <StartIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          )}
          <Input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            {...commonProps}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      ) : (
        <Textarea {...commonProps} rows={rows} />
      )}

      {errorMessage && (
        <span className="font-medium text-sm text-red-800">
          {String(errorMessage)}
        </span>
      )}
    </div>
  );
}
