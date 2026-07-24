import { motion } from "framer-motion";
import { Activity, Sparkles } from "lucide-react";
import type { AgentId } from "@/lib/agents/types";
import { AgentCard, type AgentView } from "./agent-card";

export function AgentPipeline({
  agents,
  expanded,
  onToggle,
  running,
}: {
  agents: AgentView[];
  expanded: AgentId | null;
  onToggle: (id: AgentId) => void;
  running: boolean;
}) {
  const completed = agents.filter((a) => a.status === "completed").length;
  return (
    <section className="glass rounded-3xl p-5 ring-1 ring-white/[.03] lg:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
            <Activity size={14} />
            سير العمل
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold">
            مسار الوكلاء
          </h2>
        </div>
        <div className="text-left">
          <div
            className="font-mono text-lg font-semibold text-slate-200"
            dir="ltr"
          >
            {completed}
            <span className="text-slate-600">/{agents.length}</span>
          </div>
          <div className="text-[10px] text-slate-600">اكتمل</div>
        </div>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[.06]" aria-label={`اكتمل ${completed} من ${agents.length}`}>
        <motion.div
          initial={false}
          animate={{ width: `${(completed / agents.length) * 100}%` }}
          className="h-full rounded-full bg-gradient-to-l from-violet-500 via-sky-400 to-emerald-400"
        />
      </div>
      <div className="relative space-y-3">
        <div className="absolute bottom-4 right-9 top-4 w-px bg-gradient-to-b from-violet-500/50 via-sky-400/25 to-emerald-400/20" />
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <AgentCard
              agent={agent}
              expanded={expanded === agent.id}
              onToggle={() => onToggle(agent.id)}
            />
          </motion.div>
        ))}
      </div>
      {!running && completed === 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[.02] p-3 text-xs text-slate-500">
          <Sparkles size={14} />
          يبدأ الوكلاء عملهم بالتتابع فور إعداد المقترح.
        </div>
      )}
    </section>
  );
}
