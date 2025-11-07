"use client";

export function InputField({
  label,
  value,
  onChange,
  className = "",
  placeholder = "",
  disabled = false,
}: {
  label: string;
  value: number | string;
  onChange?: (v: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value === 0 ? "" : value}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "" || val === "-") {
            onChange?.(0);
          } else {
            const num = Number(val);
            if (!isNaN(num)) {
              onChange?.(num);
            }
          }
        }}
        placeholder={placeholder}
        className="
          w-full
          rounded-md
          border border-gray-300
          bg-white
          px-2.5 py-1.5
          text-sm
          text-gray-900
          transition-all
          duration-150
          focus:border-blue-500
          focus:ring-1
          focus:ring-blue-400
          outline-none
          placeholder:text-gray-400
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        "
        disabled={disabled}
      />
    </div>
  );
}
