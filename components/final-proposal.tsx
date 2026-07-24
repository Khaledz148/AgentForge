import {
  Check,
  Clipboard,
  Download,
  Flag,
  Layers3,
  Lightbulb,
  LoaderCircle,
  ImageIcon,
  Printer,
  Rocket,
  Route,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type { DesignPackage, Proposal } from "@/lib/schemas/agent-schemas";
import type { MockupResult } from "@/lib/mockups";

const money = new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 });
function Section({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: typeof Lightbulb;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm lg:p-7">
      <div className="mb-4 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={19} />
        </span>
        <div>
          <div className="text-[10px] font-bold text-indigo-500">
            {eyebrow}
          </div>
          <h3 className="mt-1 font-display text-xl font-bold">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

export function FinalProposal({
  proposal,
  design,
  mockups,
  mockupLoading,
  onNew,
}: {
  proposal: Proposal;
  design?: DesignPackage;
  mockups: MockupResult[];
  mockupLoading: boolean;
  onNew: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const selectedBoard = design?.boards.find(
    (board) => board.ideaId === design.selectedIdeaId,
  );
  const selectedMockup = mockups.find(
    (mockup) => mockup.ideaId === design?.selectedIdeaId,
  );
  const copy = async () => {
    const readable = `${proposal.title}\n${proposal.subtitle}\n\n${proposal.executiveSummary}\n\n${proposal.challenge}\n\n${proposal.closingStatement}`;
    await navigator.clipboard.writeText(readable);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(proposal, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "agentforge-proposal.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section id="proposal" className="mt-8">
      <div className="no-print mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold text-emerald-300">
            03 · مقترح جاهز للتنفيذ
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold">
            المقترح النهائي
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copy}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-300 hover:bg-white/[.08]"
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}{" "}
            {copied ? "تم النسخ" : "نسخ المقترح"}
          </button>
          <button
            onClick={download}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-300 hover:bg-white/[.08]"
          >
            <Download size={14} />
            تنزيل JSON
          </button>
          <button
            onClick={() => window.print()}
            disabled={!selectedMockup?.imageUrl}
            title={!selectedMockup?.imageUrl ? "تُتاح نسخة PDF بعد اكتمال التصور الموصى به" : undefined}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-300 hover:bg-white/[.08] disabled:cursor-wait disabled:opacity-45"
          >
            {mockupLoading ? <LoaderCircle size={14} className="animate-spin" /> : <Printer size={14} />}
            {mockupLoading ? "تجهيز صورة PDF…" : "طباعة / PDF"}
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-2 rounded-xl bg-violet-500 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-400"
          >
            <Rocket size={14} />
            مشروع جديد
          </button>
        </div>
      </div>
      <article className="proposal-print overflow-hidden rounded-[2rem] bg-[#eef1f8] p-3 text-slate-900 shadow-2xl sm:p-6 lg:p-10">
        <header className="relative overflow-hidden rounded-3xl bg-[#10182b] p-7 text-white sm:p-10 lg:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="absolute bottom-0 right-8 h-px w-1/2 bg-gradient-to-r from-transparent to-emerald-300" />
          <div className="relative">
            <div className="mb-10 flex items-center gap-2 text-xs font-bold text-violet-300">
              <Image src="/agentforge-mark.svg" alt="" width={32} height={32} />
              أعدّه AgentForge
            </div>
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              {proposal.title}
            </h1>
            <p className="mt-4 text-lg text-emerald-300">{proposal.subtitle}</p>
            <p className="mt-8 max-w-3xl text-sm leading-7 text-slate-300">
              {proposal.executiveSummary}
            </p>
          </div>
        </header>
        <section className="proposal-mockup mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.55fr_.75fr]">
            <div className="relative min-h-[260px] overflow-hidden bg-[#10182b] sm:min-h-[420px]">
              {selectedMockup?.imageUrl ? (
                <Image
                  src={selectedMockup.imageUrl}
                  alt={`التصور المعماري للمسار الموصى به: ${selectedBoard?.ideaName || proposal.concept.name}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  unoptimized={selectedMockup.imageUrl.startsWith("data:")}
                  priority
                />
              ) : (
                <div className="no-print flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-slate-400">
                  {mockupLoading ? <LoaderCircle size={30} className="animate-spin text-sky-300" /> : <ImageIcon size={30} className="text-violet-300" />}
                  <span className="text-xs">{mockupLoading ? "يُجهّز وكيل التصميم التصور الموصى به…" : "تعذر إرفاق التصور البصري."}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070b17]/90 to-transparent" />
              <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#070b17]/70 px-3 py-2 text-[10px] font-bold text-white backdrop-blur">
                <Image src="/agentforge-mark.svg" alt="" width={22} height={22} />
                تصور من AgentForge
              </div>
            </div>
            <div className="flex flex-col justify-between bg-[#10182b] p-6 text-white sm:p-8">
              <div>
                <div className="text-[10px] font-bold text-emerald-300">المسار التصميمي الموصى به</div>
                <h2 className="mt-3 font-display text-2xl font-bold">{selectedBoard?.ideaName || proposal.concept.name}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{selectedBoard?.visualNarrative || proposal.concept.overview}</p>
              </div>
              <div className="mt-8 border-r-2 border-violet-400 pr-4 text-[11px] leading-6 text-slate-400">
                تصور تخطيطي واقعي يوضح الاتجاه البصري المقترح. تُعتمد المقاسات والخامات النهائية بعد الرفع الميداني والمخططات التنفيذية.
              </div>
            </div>
          </div>
        </section>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Section icon={Flag} eyebrow="الفرصة" title="التحدي">
            <p className="text-sm leading-7 text-slate-600">
              {proposal.challenge}
            </p>
          </Section>
          <Section
            icon={Lightbulb}
            eyebrow="المفهوم المركزي"
            title={proposal.concept.name}
          >
            <p className="mb-3 font-semibold text-indigo-600">
              “{proposal.concept.tagline}”
            </p>
            <p className="text-sm leading-7 text-slate-600">
              {proposal.concept.overview}
            </p>
          </Section>
        </div>
        <div className="mt-4">
          <Section
            icon={Route}
            eyebrow="تصميم التجربة"
            title="رحلة الزائر"
          >
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {proposal.visitorJourney.map((x) => (
                <div key={x.step} className="rounded-xl bg-slate-50 p-4">
                  <div className="font-mono text-xs font-bold text-indigo-500">
                    {x.step}
                  </div>
                  <h4 className="mt-2 font-bold">{x.title}</h4>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {x.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Section
            icon={Layers3}
            eyebrow="اللحظات التفاعلية"
            title="أبرز التجارب"
          >
            <div className="space-y-3">
              {proposal.experienceHighlights.map((x) => (
                <div
                  key={x.title}
                  className="border-r-2 border-indigo-400 pr-4"
                >
                  <h4 className="text-sm font-bold">{x.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {x.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
          <Section
            icon={WalletCards}
            eyebrow="الميزانية"
            title="ملخص الميزانية"
          >
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                [proposal.budgetSummary.budgetIncludesVat ? "الإجمالي شامل الضريبة" : "الإجمالي قبل الضريبة", proposal.budgetSummary.budgetIncludesVat ? proposal.budgetSummary.totalWithVat : proposal.budgetSummary.total],
                ["الاحتياطي", proposal.budgetSummary.contingency],
                ["المتبقي", proposal.budgetSummary.remaining],
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[9px] font-bold text-slate-400">
                    {k}
                  </div>
                  <div className="mt-1 text-sm font-bold">
                    {money.format(Number(v))}{" "}
                    <span className="text-[9px] text-slate-400">ر.س</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mb-3 text-[10px] leading-5 text-slate-500">ضريبة القيمة المضافة التقديرية (15% حيث تنطبق): {money.format(proposal.budgetSummary.vatAmount)} ر.س</p>
            <div className="space-y-2">
              {proposal.budgetSummary.items.map((x) => (
                <div
                  key={x.category}
                  className="flex justify-between border-b border-slate-100 pb-2 text-xs"
                >
                  <span className="text-slate-600">{x.category}</span>
                  <span className="font-mono font-semibold">
                    {money.format(x.totalCost)} ر.س
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div className="mt-4">
          <Section
            icon={Rocket}
            eyebrow="التسليم"
            title="الجدول الزمني للتنفيذ"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {proposal.implementationTimeline.map((x, i) => (
                <div
                  key={x.phase}
                  className="relative rounded-xl border border-slate-100 p-4"
                >
                  <span className="absolute left-3 top-3 font-mono text-[10px] text-slate-300">
                    0{i + 1}
                  </span>
                  <h4 className="pl-5 text-sm font-bold">{x.phase}</h4>
                  <p className="mt-1 text-[10px] font-semibold text-indigo-500">
                    {x.duration}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">{x.owner}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Section
            icon={ShieldAlert}
            eyebrow="ضمان التنفيذ"
            title="المخاطر وإجراءات الحد منها"
          >
            <div className="space-y-4">
              {proposal.risksAndMitigations.map((x) => (
                <div key={x.risk}>
                  <h4 className="text-sm font-bold">{x.risk}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {x.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </Section>
          <Section icon={Check} eyebrow="القياس" title="مؤشرات النجاح">
            <div className="space-y-3">
              {proposal.successMetrics.map((x) => (
                <p
                  key={x}
                  className="flex gap-2 text-sm leading-6 text-slate-600"
                >
                  <Check size={15} className="mt-1 shrink-0 text-emerald-500" />
                  {x}
                </p>
              ))}
            </div>
          </Section>
        </div>
        <footer className="mt-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-7 text-white sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="text-[10px] font-bold text-indigo-200">
                الخطوات التالية المقترحة
              </div>
              <div className="mt-4 space-y-2">
                {proposal.nextSteps.map((x, i) => (
                  <p key={x} className="text-sm">
                    <span className="ml-2 text-indigo-200">0{i + 1}</span>
                    {x}
                  </p>
                ))}
              </div>
            </div>
            <blockquote className="flex items-center border-r border-white/25 pr-6 font-display text-xl font-semibold leading-8">
              “{proposal.closingStatement}”
            </blockquote>
          </div>
        </footer>
      </article>
    </section>
  );
}
