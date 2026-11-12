import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  isLoading: boolean;
  modal?: boolean;
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

function Spinner({
  isLoading,
  modal = false,
  size = "md",
  label = "Loading...",
  className,
}: SpinnerProps) {
  if (!isLoading) {
    return null;
  }

  const content = (
    <>
      <Loader2
        aria-hidden="true"
        className={cn(
          "animate-spin text-blue-600",
          sizeStyles[size],
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </>
  );

  if (modal) {
    return (
      <div
        aria-label={label}
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        role="dialog"
      >
        {content}
      </div>
    );
  }

  return (
    <div
      aria-label={label}
      aria-live="polite"
      className="inline-flex items-center justify-center"
      role="status"
    >
      {content}
    </div>
  );
}

export { Spinner };
export type { SpinnerProps, SpinnerSize };
