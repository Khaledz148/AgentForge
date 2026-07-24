"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Calculator, Circle, Cpu, Github, Sparkles, UsersRound, WandSparkles } from "lucide-react";
import { BriefForm } from "@/components/brief-form";
import { AgentPipeline } from "@/components/agent-pipeline";
import { SharedContext } from "@/components/shared-context";
import { ReviewScore } from "@/components/review-score";
import { FinalProposal } from "@/components/final-proposal";
import { TrustCenter } from "@/components/trust-center";
import { SaudiReadiness } from "@/components/saudi-readiness";
import type { AgentView } from "@/components/agent-card";
import type { AgentEvent, AgentId } from "@/lib/agents/types";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import type { DesignPackage, Proposal, Review } from "@/lib/schemas/agent-schemas";
import { DesignGallery } from "@/components/design-gallery";
import type { MockupResult } from "@/lib/mockups";

const definitions: Omit<AgentView, "status" | "message">[] = [
  { id: "coordinator", name: "المنسّق", role: "يرتب العمل ويوزّع المهام" },
  {
    id: "requirements",
    name: "محلل المتطلبات",
    role: "يحوّل الموجز إلى متطلبات واضحة",
  },
  {
    id: "experience",
    name: "استراتيجي التجربة",
    role: "يصمم الفكرة ورحلة الزائر",
  },
  {
    id: "designer",
    name: "مصمم التصورات",
    role: "يحوّل الأفكار إلى تصورات ثلاثية الأبعاد",
  },
  {
    id: "architect",
    name: "مهندس الحلول",
    role: "يحوّل الفكرة إلى حل قابل للتنفيذ",
  },
  {
    id: "budget",
    name: "مخطط الميزانية والتسليم",
    role: "يضبط الميزانية وخطة التسليم",
  },
  {
    id: "reviewer",
    name: "المراجع النقدي",
    role: "يدقّق المقترح ويطلب التحسينات",
  },
  {
    id: "proposal",
    name: "محرر المقترح",
    role: "يصوغ النسخة الجاهزة للعميل",
  },
];
const freshAgents = (): AgentView[] =>
  definitions.map((x) => ({
    ...x,
    status: "waiting",
    message: "بانتظار اكتمال المرحلة السابقة",
  }));

export default function Home() {
  const [agents, setAgents] = useState<AgentView[]>(freshAgents);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState<AgentId | null>(null);
  const [outputs, setOutputs] = useState<Partial<Record<AgentId, unknown>>>({});
  const [review, setReview] = useState<Review>();
  const [proposal, setProposal] = useState<Proposal>();
  const [design, setDesign] = useState<DesignPackage>();
  const [mockups, setMockups] = useState<MockupResult[]>([]);
  const [mockupLoading, setMockupLoading] = useState(false);
  const [mockupError, setMockupError] = useState("");
  const [revisionCount, setRevisionCount] = useState(0);
  const [runId, setRunId] = useState<string>();
  const [error, setError] = useState("");
  const [health, setHealth] = useState<{
    provider: string;
    demo: boolean;
    configured: boolean;
  }>({ provider: "openai", demo: false, configured: false });
  const abortRef = useRef<AbortController>();
  const mockupAbortRef = useRef<AbortController>();
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => undefined);
    return () => {
      abortRef.current?.abort();
      mockupAbortRef.current?.abort();
    };
  }, []);
  const update = (id: AgentId, values: Partial<AgentView>) =>
    setAgents((a) => a.map((x) => (x.id === id ? { ...x, ...values } : x)));
  const reset = () => {
    abortRef.current?.abort();
    mockupAbortRef.current?.abort();
    setAgents(freshAgents());
    setRunning(false);
    setExpanded(null);
    setOutputs({});
    setReview(undefined);
    setProposal(undefined);
    setDesign(undefined);
    setMockups([]);
    setMockupLoading(false);
    setMockupError("");
    setRevisionCount(0);
    setRunId(undefined);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const generateMockups = async (packageDesign: DesignPackage) => {
    mockupAbortRef.current?.abort();
    setMockupError("");
    setMockupLoading(true);
    if (health.demo) {
      setMockups([
        { ideaId: packageDesign.boards[0]?.ideaId, imageUrl: "/mockups/future-path.png" },
        { ideaId: packageDesign.boards[1]?.ideaId, imageUrl: "/mockups/financial-garden.png" },
        { ideaId: packageDesign.boards[2]?.ideaId, imageUrl: "/mockups/challenge-studio.png" },
      ]);
      setMockupLoading(false);
      return;
    }
    const controller = new AbortController();
    mockupAbortRef.current = controller;
    try {
      const response = await fetch("/api/mockups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boards: packageDesign.boards }),
        signal: controller.signal,
      });
      const data = await response.json() as {
        mockups?: MockupResult[];
        error?: string;
      };
      setMockups(data.mockups || []);
      if (!response.ok) throw new Error(data.error || "تعذر إنشاء التصورات.");
    } catch (mockupFailure) {
      if ((mockupFailure as Error).name !== "AbortError") {
        setMockupError(
          mockupFailure instanceof Error
            ? mockupFailure.message
            : "تعذر إنشاء التصورات تلقائيًا.",
        );
      }
    } finally {
      if (!controller.signal.aborted) setMockupLoading(false);
    }
  };
  const handleEvent = (e: AgentEvent) => {
    if (e.type === "run_started") setRunId(e.runId);
    if (e.type === "agent_started")
      update(e.agentId, {
        status: "thinking",
        message: e.message,
        startedAt: Date.now(),
        completedAt: undefined,
      });
    if (e.type === "agent_progress") update(e.agentId, { message: e.message });
    if (e.type === "agent_status")
      update(e.agentId, { status: e.status, message: e.message });
    if (e.type === "agent_completed") {
      update(e.agentId, {
        status: "completed",
        summary: e.summary,
        output: e.output,
        completedAt: Date.now(),
      });
      setOutputs((o) => ({ ...o, [e.agentId]: e.output }));
      if (e.agentId === "reviewer") setReview(e.output as Review);
      if (e.agentId === "designer") {
        const completedDesign = e.output as DesignPackage;
        setDesign(completedDesign);
        void generateMockups(completedDesign);
      }
    }
    if (e.type === "revision_started") setRevisionCount(1);
    if (e.type === "run_completed") {
      setProposal(e.finalProposal);
      setRunning(false);
      setTimeout(
        () =>
          document
            .getElementById("proposal")
            ?.scrollIntoView({ behavior: "smooth" }),
        350,
      );
    }
    if (e.type === "run_failed") {
      setError(e.error);
      setRunning(false);
    }
  };
  const submit = async (data: BriefInput) => {
    if (running) return;
    reset();
    setRunning(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("تعذر التحقق من موجز الفعالية.");
      const reader = response.body?.getReader();
      if (!reader)
        throw new Error("هذا المتصفح لا يدعم تدفق النتائج.");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";
        for (const chunk of chunks) {
          const line = chunk.split("\n").find((x) => x.startsWith("data: "));
          if (line) handleEvent(JSON.parse(line.slice(6)) as AgentEvent);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setError(e instanceof Error ? e.message : "تعذر توليد المقترح");
      setRunning(false);
    }
  };
  const activeName = useMemo(
    () => agents.find((x) => x.status === "thinking")?.name,
    [agents],
  );
  return (
    <main className="min-h-screen pb-20">
      <header className="no-print sticky top-0 z-40 border-b border-white/[.07] bg-[#070b17]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center shadow-glow">
              <Image src="/agentforge-mark.svg" alt="شعار AgentForge" width={40} height={40} priority />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#070b17] bg-emerald-400" />
            </span>
            <div>
              <div className="font-display text-base font-bold tracking-tight">
                AgentForge
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[.2em] text-slate-500">
                من الموجز إلى التنفيذ
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-white/[.08] bg-white/[.03] px-3 py-1.5 text-[10px] text-slate-400 sm:flex">
              <Circle
                size={7}
                className={
                  health.configured
                    ? "fill-emerald-400 text-emerald-400"
                    : "fill-red-400 text-red-400"
                }
              />
              {health.demo
                ? "الوضع التجريبي"
                : `${health.provider.toUpperCase()} · ${health.configured ? "متصل" : "غير متصل"}`}
            </span>
            <button
              onClick={reset}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[.05]"
            >
              مشروع جديد
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <section className="no-print pb-7 pt-10 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.07] px-3 py-1.5 text-[11px] font-semibold text-violet-300">
              <WandSparkles size={13} />
              استقلالية · تنسيق · مراجعة ذاتية
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.18] sm:text-5xl lg:text-[3.5rem]">
              موجز واحد. {" "}
              <span className="bg-gradient-to-l from-violet-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                فريق فعاليات متكامل.
              </span>
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              فريق من الوكلاء المتخصصين يحوّل موجز فعاليتك إلى مقترح تنفيذي
              مدقّق ومنضبط بالميزانية، مع إظهار القرارات والتسليمات لحظة بلحظة.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 text-xs text-slate-300">
              {[{ icon: UsersRound, label: "8 وكلاء متخصصين" }, { icon: BadgeCheck, label: "مراجعة نقدية" }, { icon: Calculator, label: "ميزانية محسوبة" }].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/[.08] bg-white/[.035] px-3 py-2">
                  <Icon size={14} className="text-emerald-300" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
        <div className="no-print grid items-start gap-6 lg:grid-cols-[minmax(0,1.06fr)_minmax(430px,.94fr)]">
          <div className="space-y-5">
            <BriefForm
              running={running}
              onSubmit={submit}
              onCancel={() => {
                abortRef.current?.abort();
                mockupAbortRef.current?.abort();
                setRunning(false);
                setMockupLoading(false);
              }}
              onReset={reset}
            />
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-red-400/20 bg-red-400/[.07] p-4 text-sm text-red-300"
              >
                {error}
              </div>
            )}
            <SharedContext outputs={outputs} runId={runId} />
            <TrustCenter />
            <SaudiReadiness />
            {running && (
              <div aria-live="polite" className="flex items-center gap-3 rounded-2xl border border-violet-400/15 bg-violet-400/[.05] p-4 text-xs text-slate-400">
                <Sparkles size={16} className="animate-pulse text-violet-300" />
                <span>
                  <strong className="text-slate-200">
                    {activeName || "المنسّق"}
                  </strong>{" "}
                  {" "}يحدّث خطة المشروع الآن. ستظهر المخرجات المنظّمة تلقائيًا عند اكتمال كل مرحلة.
                </span>
              </div>
            )}
          </div>
          <AgentPipeline
            agents={agents}
            expanded={expanded}
            onToggle={(id) => setExpanded((x) => (x === id ? null : id))}
            running={running}
          />
        </div>
        {review && (
          <div className="no-print mt-7">
            <ReviewScore review={review} revisionCount={revisionCount} />
          </div>
        )}
        {proposal && (
          <FinalProposal
            proposal={proposal}
            design={design}
            mockups={mockups}
            mockupLoading={mockupLoading}
            onNew={reset}
          />
        )}
        {design && (
          <DesignGallery
            design={design}
            mockups={mockups}
            loading={mockupLoading}
            error={mockupError}
          />
        )}
        <footer className="no-print mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/[.06] pt-6 text-[10px] text-slate-600 sm:flex-row">
          <span className="flex items-center gap-2">
            <Cpu size={12} />
            صُمم لتخطيط فعاليات سريع وشفاف
          </span>
          <span className="flex items-center gap-2">
            <Github size={12} />
            مخرجات متحقق منها · ميزانية منضبطة · تحديثات مباشرة
          </span>
        </footer>
      </div>
    </main>
  );
}
