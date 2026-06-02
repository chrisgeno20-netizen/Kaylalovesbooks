import { Feeling } from "@/types";
import { cn } from "@/lib/utils";

export function FeelingBadge({ feeling }: { feeling: Feeling }) {
  const styles = {
    dnf: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
    liked: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    really_liked: "bg-[#f4efe6] text-[#7a8771] border-[#e4dfd3] dark:bg-[#7a8771]/20 dark:text-[#7a8771] dark:border-[#7a8771]/30",
    loved: "bg-[#fdfbf7] text-[#9c3d2e] border-[#9c3d2e]/20 dark:bg-[#9c3d2e]/10 dark:text-[#9c3d2e] dark:border-[#9c3d2e]/30 font-medium",
  };

  const labels = {
    dnf: "DNF",
    liked: "Liked",
    really_liked: "Really Liked",
    loved: "Loved",
  };

  return (
    <span 
      className={cn(
        "text-xs px-2.5 py-1 rounded-full border",
        styles[feeling]
      )}
      data-testid={`badge-feeling-${feeling}`}
    >
      {labels[feeling]}
    </span>
  );
}
