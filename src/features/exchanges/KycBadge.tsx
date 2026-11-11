import { cn } from "@/lib/utils";
import type { KycPolicy } from "./kyc";

const LABELS: Record<KycPolicy, { text: string; title: string; className: string }> = {
  required: {
    text: "Required",
    title: "ID verification needed before you can trade",
    className: "bg-secondary/10 text-secondary",
  },
  optional: {
    text: "Optional",
    title: "Trading and limited withdrawals work without ID; higher limits need verification",
    className: "bg-tertiary/10 text-tertiary",
  },
};

// KYC policy as a small pill. Neither value is "good" or "bad", so neither uses green or red.
export const KycBadge = ({ policy }: { policy: KycPolicy | null }) => {
  if (!policy) {
    return (
      <span className="text-xs text-on-surface-variant" title="Not checked">
        —<span className="sr-only">Not checked</span>
      </span>
    );
  }
  const label = LABELS[policy];
  return (
    <span
      title={label.title}
      className={cn("inline-block px-2 py-0.5 rounded-md font-label text-[10px] font-bold uppercase tracking-wider", label.className)}
    >
      {label.text}
    </span>
  );
};
