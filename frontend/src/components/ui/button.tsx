import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
};

export function Button({
  children,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}