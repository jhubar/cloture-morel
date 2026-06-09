import { useId } from "react";
import { cn } from "@/lib/utils";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

const fieldClasses =
  "w-full rounded-lg border border-sand-300 bg-white px-3.5 py-2.5 text-base text-bark placeholder:text-bark-muted/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30";

type InputProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">;

export function TextField({
  label,
  error,
  required,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={className}>
      <FieldLabel htmlFor={fieldId} label={label} required={required} />
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, error && "border-terracotta focus:ring-terracotta/30")}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-bark-muted">{hint}</p>}
      <FieldError id={`${fieldId}-error`} error={error} />
    </div>
  );
}

type TextareaProps = BaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export function TextAreaField({
  label,
  error,
  required,
  hint,
  className,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={className}>
      <FieldLabel htmlFor={fieldId} label={label} required={required} />
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, error && "border-terracotta focus:ring-terracotta/30")}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-bark-muted">{hint}</p>}
      <FieldError id={`${fieldId}-error`} error={error} />
    </div>
  );
}

type SelectProps = BaseProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function SelectField({
  label,
  error,
  required,
  hint,
  className,
  id,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <div className={className}>
      <FieldLabel htmlFor={fieldId} label={label} required={required} />
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClasses, "appearance-none", error && "border-terracotta focus:ring-terracotta/30")}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-bark-muted">{hint}</p>}
      <FieldError id={`${fieldId}-error`} error={error} />
    </div>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-forest-dark">
      {label}
      {required && <span className="ml-0.5 text-terracotta">*</span>}
    </label>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-terracotta">
      {error}
    </p>
  );
}
