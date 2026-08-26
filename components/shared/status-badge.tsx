import { cn } from "@/lib/utils";

const toneClass = {
  success: "badge-success",
  warning: "badge-warning",
  info: "badge-info",
  muted: "badge-muted",
} as const;

type StatusBadgeProps = {
  label: string;
  tone?: keyof typeof toneClass;
  className?: string;
};

export function StatusBadge({
  label,
  tone = "muted",
  className,
}: StatusBadgeProps) {
  return <span className={cn(toneClass[tone], className)}>{label}</span>;
}

export function campaignStatusTone(
  status: string,
): keyof typeof toneClass {
  switch (status) {
    case "sent":
      return "success";
    case "sending":
    case "scheduled":
      return "info";
    case "failed":
      return "warning";
    default:
      return "muted";
  }
}

export function conversationStatusTone(
  status: string,
): keyof typeof toneClass {
  return status === "open" ? "success" : "muted";
}
