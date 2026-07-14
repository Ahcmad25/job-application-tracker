import type {
  InputHTMLAttributes,
  Ref,
} from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export function InputField({
  label,
  error,
  id,
  inputRef,
  className = "",
  ...props
}: InputFieldProps): React.ReactElement {
  const inputId = id ?? props.name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        {...props}
        ref={inputRef}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={`w-full rounded-lg border px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
        } ${className}`}
      />

      {error ? (
        <p
          id={errorId}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}