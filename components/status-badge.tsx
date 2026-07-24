import { Check, CircleAlert, CircleX, LoaderCircle, Pause } from "lucide-react";
import type { AgentStatus } from "@/lib/agents/types";

const config = {
  waiting: {
    label: "بانتظار الدور",
    cls: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: Pause,
  },
  thinking: {
    label: "قيد العمل",
    cls: "bg-violet-500/10 text-violet-300 border-violet-400/30",
    icon: LoaderCircle,
  },
  completed: {
    label: "اكتمل",
    cls: "bg-emerald-500/10 text-emerald-300 border-emerald-400/25",
    icon: Check,
  },
  needs_revision: {
    label: "يحتاج تعديلًا",
    cls: "bg-amber-500/10 text-amber-300 border-amber-400/25",
    icon: CircleAlert,
  },
  failed: {
    label: "فشل",
    cls: "bg-red-500/10 text-red-300 border-red-400/25",
    icon: CircleX,
  },
} as const;
export function StatusBadge({ status }: { status: AgentStatus }) {
  const x = config[status];
  const Icon = x.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${x.cls}`}
    >
      <Icon size={11} className={status === "thinking" ? "animate-spin" : ""} />
      {x.label}
    </span>
  );
}
