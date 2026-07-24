import { useState } from "react";
import { Braces, ChevronDown, Database, Link2 } from "lucide-react";
import type { AgentId } from "@/lib/agents/types";

export function SharedContext({
  outputs,
  runId,
}: {
  outputs: Partial<Record<AgentId, unknown>>;
  runId?: string;
}) {
  const [open, setOpen] = useState(false);
  const keys = Object.keys(outputs);
  return (
    <section className="glass rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-right"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-400/10 text-sky-300">
            <Database size={17} />
          </span>
          <span>
            <span className="block text-sm font-semibold">
              سياق المشروع المشترك
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
              <Link2 size={10} />
              {keys.length} مخرجات مشتركة ·{" "}
              <bdi>{runId ? runId.slice(0, 8) : "جاهز"}</bdi>
            </span>
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-white/[.07] p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {keys.length ? (
              keys.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-sky-400/15 bg-sky-400/[.07] px-2.5 py-1 text-[10px] uppercase tracking-wider text-sky-300"
                >
                  {key}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-600">
                تظهر المخرجات المنظّمة هنا مع اكتمال الوكلاء.
              </span>
            )}
          </div>
          <div
            className="scrollbar max-h-64 overflow-auto rounded-xl bg-[#050914] p-3"
            dir="auto"
          >
            <div className="mb-2 flex items-center gap-2 text-[10px] tracking-widest text-slate-600">
              <Braces size={12} />
              حالة المشروع
            </div>
            <pre className="whitespace-pre-wrap break-words text-[10px] leading-5 text-slate-400">
              {JSON.stringify(outputs, null, 2) || "{}"}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
