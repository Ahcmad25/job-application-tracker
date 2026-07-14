type LoadingSpinnerProps = {
  label?: string;
};

export function LoadingSpinner({
  label = "Loading...",
}: LoadingSpinnerProps): React.ReactElement {
  return (
    <div
      className="flex min-h-40 items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}