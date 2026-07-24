import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import type { Review } from "@/lib/schemas/agent-schemas";

export function ReviewScore({
  review,
  revisionCount,
}: {
  review: Review;
  revisionCount: number;
}) {
  const labels: Record<string, string> = {
    "Requirement coverage": "تغطية المتطلبات",
    Creativity: "الإبداع",
    Feasibility: "الجدوى",
    "Budget accuracy": "دقة الميزانية",
    "Technical clarity": "الوضوح التقني",
    "Visitor value": "قيمة الزائر",
    "Client value": "قيمة العميل",
    "Presentation quality": "جودة العرض",
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-5 lg:p-7"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div
          className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#23D5AB ${review.overallScore * 3.6}deg,rgba(148,163,184,.1) 0)`,
          }}
        >
          <div className="grid h-[94px] w-[94px] place-items-center rounded-full bg-[#0c1324]">
            <div className="text-center">
              <div className="font-display text-3xl font-bold">
                {review.overallScore}
              </div>
              <div className="text-[9px] tracking-widest text-slate-500">
                درجة الجودة
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${review.decision === "PASS" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-amber-400/25 bg-amber-400/10 text-amber-300"}`}
            >
              {review.decision === "PASS" ? (
                <CheckCircle2 size={14} />
              ) : (
                <RefreshCw size={14} />
              )}{" "}
              {review.decision === "PASS" ? "معتمد" : "يحتاج مراجعة"}
            </span>
            {revisionCount > 0 && (
              <span className="text-xs text-slate-500">
                تم تحسين المقترح بعد دورة مراجعة واحدة
              </span>
            )}
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            اكتملت المراجعة النقدية
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            راجع الوكيل النقدي تغطية المتطلبات وجودة الفكرة وقابلية التنفيذ
            ودقة الميزانية قبل اعتماد النسخة النهائية.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(review.scoreBreakdown).map(([name, score]) => (
          <div
            key={name}
            className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"
          >
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate text-slate-400">
                {labels[name] || name}
              </span>
              <span className="font-mono text-slate-200">{score}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className="h-full rounded-full bg-gradient-to-l from-violet-500 to-emerald-400"
              />
            </div>
          </div>
        ))}
      </div>
      {review.strengths.length > 0 && (
        <div className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/[.04] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <ShieldCheck size={14} />
            نقاط القوة
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {review.strengths.map((x) => (
              <p key={x} className="text-xs leading-5 text-slate-400">
                • {x}
              </p>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
