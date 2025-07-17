import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <Loading />
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-muted/50", className)}>
      {/* Add your skeleton content here */}
      <div className="h-4 w-32 rounded-md bg-muted/30" />
      <div className="mt-2 h-4 w-24 rounded-md bg-muted/30" />
    </div>
  );
}
