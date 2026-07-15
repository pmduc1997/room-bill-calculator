"use client";

import { NumericFormat } from "react-number-format";

export function InputField({
  label,
  value,
  onChange,
  className = "",
  placeholder = "",
  disabled = false,
  error = false,
}: {
  label: string;
  value: number | string;
  onChange?: (v: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}) {
  const inputClass = [
    "w-full rounded-lg border px-3 py-2 text-sm text-brand-ink",
    "transition-all duration-150 outline-none",
    "placeholder:text-brand-muted/50",
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    disabled
      ? "bg-brand-surface border-brand-border text-brand-muted cursor-not-allowed"
      : error
      ? "bg-brand-error-bg border-brand-error focus:border-brand-error focus:ring-1 focus:ring-brand-error/40"
      : "bg-white border-brand-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30",
  ].join(" ");

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-brand-muted">{label}</label>
      <NumericFormat
        value={value === 0 ? "" : value}
        onValueChange={(values) => {
          const { floatValue } = values;
          onChange?.(floatValue ?? 0);
        }}
        placeholder={placeholder}
        allowNegative={false}
        decimalScale={0}
        thousandSeparator={true}
        allowLeadingZeros={false}
        className={inputClass}
        disabled={disabled}
      />
    </div>
  );
}
