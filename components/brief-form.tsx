import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Square,
} from "lucide-react";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { parseBrief } from "@/lib/brief-intelligence";

export const sampleBrief: BriefInput = {
  brief:
    "أنشئ جناحًا تفاعليًا لبنك سعودي مشارك في سيتي سكيب الرياض. يستهدف الجناح المهنيين الشباب، ويعزز الثقافة المالية وعادات الادخار، ويتضمن تجربة رقمية لا تُنسى. الميزانية المتاحة 120,000 ريال سعودي، ومساحة الجناح 6 × 6 أمتار، ومدة التفعيل أربعة أيام.",
  client: "بنك سعودي",
  event: "سيتي سكيب الرياض",
  industry: "الخدمات المالية",
  audience: "المهنيون الشباب",
  location: "الرياض",
  duration: "4 أيام",
  space: "6 × 6 أمتار",
  budget: 120000,
  budgetIncludesVat: true,
  venue: "",
  eventType: "معرض / جناح",
  objective: "تعزيز الثقافة المالية وعادات الادخار",
};
const empty: BriefInput = {
  brief: "",
  client: "",
  event: "",
  industry: "",
  audience: "",
  location: "",
  duration: "",
  space: "",
  objective: "",
  venue: "",
  eventType: "",
  budgetIncludesVat: true,
};

export function BriefForm({
  running,
  onSubmit,
  onCancel,
  onReset,
}: {
  running: boolean;
  onSubmit: (data: BriefInput) => void;
  onCancel: () => void;
  onReset: () => void;
}) {
  const [form, setForm] = useState<BriefInput>(sampleBrief);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const update = (key: keyof BriefInput, value: string | number | boolean | undefined) =>
    setForm((f) => ({ ...f, [key]: value }));
  const loadSample = () => {
    setForm(sampleBrief);
    setError("");
  };
  const reset = () => {
    setForm(empty);
    setError("");
    onReset();
  };
  const submit = () => {
    if (form.brief.trim().length < 20)
      return setError("أضف تفاصيل أكثر قليلًا حتى يتوفر للوكلاء سياق كافٍ.");
    setError("");
    onSubmit(form);
  };
  const intelligence = parseBrief(form);
  const fields: [keyof BriefInput, string, string][] = [
    ["client", "العميل أو العلامة", "مثال: بنك سعودي"],
    ["event", "اسم الفعالية", "مثال: سيتي سكيب الرياض"],
    ["industry", "القطاع", "مثال: الخدمات المالية"],
    ["audience", "الجمهور المستهدف", "مثال: المهنيون الشباب"],
    ["location", "المدينة أو الموقع", "مثال: الرياض"],
    ["duration", "مدة الفعالية", "مثال: 4 أيام"],
    ["space", "المساحة المتاحة", "مثال: 6 × 6 أمتار"],
    ["venue", "الموقع أو القاعة", "مثال: واجهة الرياض"],
    ["eventType", "نوع الفعالية", "مثال: معرض تجاري"],
    ["objective", "الهدف الرئيسي", "مثال: تعزيز الثقة المالية"],
  ];
  return (
    <section className="glass relative overflow-hidden rounded-3xl p-5 ring-1 ring-white/[.03] lg:p-7">
      <div className="pointer-events-none absolute -left-20 -top-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-emerald-300">
            01 · ابدأ بالموجز
          </div>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            ماذا سنبتكر؟
          </h2>
        </div>
        <button
          type="button"
          onClick={loadSample}
          disabled={running}
          className="flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[.08] px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-400/[.14] disabled:opacity-40"
        >
          <Sparkles size={13} />
          استخدم المثال
        </button>
      </div>
      <label htmlFor="brief" className="sr-only">
        موجز الفعالية
      </label>
      <textarea
        id="brief"
        dir="auto"
        value={form.brief}
        disabled={running}
        onChange={(e) => update("brief", e.target.value)}
        placeholder="صف الفعالية والجمهور والهدف والتجربة التي تريد ابتكارها..."
        className="field min-h-44 resize-none px-4 py-4 text-sm leading-6 disabled:opacity-60"
      />
      <div className="mt-2 flex justify-between text-[11px]">
        <span className="text-red-300">{error}</span>
        <span dir="ltr" className="text-slate-600">{form.brief.length} / 5,000</span>
      </div>
      {(intelligence.detected.length > 0 || intelligence.missing.length > 0) && (
        <div className="mt-3 rounded-xl border border-sky-400/10 bg-sky-400/[.035] p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-sky-200">فهم الموجز</span>
            <span className="text-[10px] text-slate-500">يستخرج النظام هذه المعلومات قبل تشغيل الوكلاء</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {intelligence.detected.map((item) => (
              <span key={item.label} className="rounded-full border border-sky-400/15 bg-sky-400/[.06] px-2.5 py-1 text-[10px] text-sky-100">
                {item.label}: <bdi className="font-semibold">{item.value}</bdi>
              </span>
            ))}
            {intelligence.missing.slice(0, 2).map((item) => (
              <span key={item} className="rounded-full border border-amber-400/15 bg-amber-400/[.05] px-2.5 py-1 text-[10px] text-amber-200">يلزم تأكيد: {item}</span>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/[.07] bg-white/[.025] px-4 py-3 text-right text-sm text-slate-300"
      >
        <span>
          إعدادات المشروع{" "}
          <span className="mr-2 text-xs text-slate-600">
            كلما زاد السياق، تحسنت النتيجة
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {fields.map(([key, label, placeholder]) => (
            <label key={key} className="text-xs text-slate-400">
              {label}
              <input
                dir="auto"
                className="field mt-1.5 px-3 py-2.5 text-sm"
                disabled={running}
                placeholder={placeholder}
                value={String(form[key] ?? "")}
                onChange={(e) => update(key, e.target.value)}
              />
            </label>
          ))}
          <label className="text-xs text-slate-400">
            الميزانية بالريال السعودي
            <input
              type="number"
              min="1"
              dir="ltr"
              className="field mt-1.5 px-3 py-2.5 text-right text-sm"
              disabled={running}
              placeholder="120000"
              value={form.budget ?? ""}
              onChange={(e) =>
                update(
                  "budget",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </label>
          <label className="col-span-full flex cursor-pointer items-center gap-2 rounded-xl border border-white/[.07] bg-white/[.025] px-3 py-3 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={form.budgetIncludesVat}
              disabled={running}
              onChange={(event) => update("budgetIncludesVat", event.target.checked)}
              className="h-4 w-4 accent-violet-500"
            />
            الميزانية تشمل ضريبة القيمة المضافة (15%) حيث تنطبق
          </label>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={running ? onCancel : submit}
          className={`group flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${running ? "border border-red-400/25 bg-red-400/10 text-red-300 hover:bg-red-400/15" : "bg-gradient-to-l from-violet-500 to-indigo-500 text-white shadow-[0_10px_35px_rgba(108,99,255,.28)] hover:brightness-110"}`}
        >
          {running ? (
            <>
              <Square size={15} />
              إلغاء التشغيل
            </>
          ) : (
            <>
              ابدأ إعداد المقترح
              <ArrowRight
                size={16}
                className="rotate-180 transition-transform group-hover:-translate-x-1"
              />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={running}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[.04] disabled:opacity-40"
        >
          <RotateCcw size={15} />
          إعادة ضبط
        </button>
      </div>
    </section>
  );
}
