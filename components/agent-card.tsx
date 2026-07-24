import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Compass,
  Cuboid,
  FileText,
  Network,
} from "lucide-react";
import type { AgentId, AgentStatus } from "@/lib/agents/types";
import { StatusBadge } from "./status-badge";

const icons = {
  coordinator: Network,
  requirements: ClipboardCheck,
  experience: Compass,
  designer: Cuboid,
  architect: BrainCircuit,
  budget: CircleDollarSign,
  reviewer: Bot,
  proposal: FileText,
};
export interface AgentView {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  message: string;
  summary?: string;
  output?: unknown;
  startedAt?: number;
  completedAt?: number;
}

export function AgentCard({
  agent,
  expanded,
  onToggle,
}: {
  agent: AgentView;
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = icons[agent.id];
  const duration = agent.startedAt
    ? Math.max(
        1,
        Math.round(
          ((agent.completedAt || Date.now()) - agent.startedAt) / 1000,
        ),
      )
    : 0;
  return (
    <motion.article
      layout
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all hover:border-white/[.14] ${agent.status === "thinking" ? "border-violet-400/55 bg-violet-500/[.08] shadow-[0_0_30px_rgba(108,99,255,.18)]" : agent.status === "needs_revision" ? "border-amber-400/35 bg-amber-500/[.05]" : "border-white/[.08] bg-white/[.025]"}`}
    >
      {agent.status === "thinking" && (
        <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-violet-300 to-transparent animate-scan" />
      )}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 text-right"
        aria-expanded={expanded}
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${agent.status === "thinking" ? "border-violet-400/30 bg-violet-400/15 text-violet-300" : agent.status === "completed" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[.04] text-slate-400"}`}
        >
          <Icon size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display text-sm font-semibold text-slate-100">
              {agent.name}
            </span>
            <StatusBadge status={agent.status} />
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            {agent.role}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`mt-1 text-slate-600 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[.06] pt-3">
        <p aria-live="polite" className="min-w-0 truncate text-xs text-slate-400">
          {agent.summary || agent.message}
        </p>
        {duration > 0 && (
          <span className="shrink-0 font-mono text-[10px] text-slate-600">
            {duration}s
          </span>
        )}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="scrollbar mt-3 max-h-52 overflow-auto rounded-xl bg-[#070b17]/70 p-3"
              dir="auto"
            >
              <pre className="whitespace-pre-wrap break-words text-[10px] leading-5 text-slate-400">
                {agent.output
                  ? JSON.stringify(agent.output, null, 2)
                  : "سيظهر الناتج المنظّم هنا عند اكتمال عمل الوكيل."}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
