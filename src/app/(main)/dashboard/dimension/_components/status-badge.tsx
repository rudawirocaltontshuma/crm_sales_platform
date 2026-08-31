import { Badge } from "@/components/ui/badge";
import { statusTone, toneClass } from "@/lib/dimension-format";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 font-medium", toneClass(statusTone(status)), className)}
    >
      {status}
    </Badge>
  );
}

export function InitialsAvatar({ initials, tone, className }: { initials: string; tone?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full font-medium text-xs",
        tone ?? "bg-primary/10 text-primary",
        className,
      )}
    >
      {initials}
    </span>
  );
}
