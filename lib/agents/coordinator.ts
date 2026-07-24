import { getProvider } from "@/lib/ai";
import type { AgentEvent, AgentId, ProjectState } from "./types";
import { runRequirementsAgent } from "./requirements-agent";
import { runExperienceAgent } from "./experience-agent";
import { runDesignerAgent } from "./designer-agent";
import { runArchitectAgent } from "./architect-agent";
import { runBudgetAgent } from "./budget-agent";
import { runReviewerAgent } from "./reviewer-agent";
import { runProposalAgent } from "./proposal-agent";

const names: Record<AgentId, string> = { coordinator: "المنسّق", requirements: "محلل المتطلبات", experience: "استراتيجي التجربة", designer: "مصمم التصورات", architect: "مهندس الحلول", budget: "مخطط الميزانية والتسليم", reviewer: "المراجع النقدي", proposal: "محرر المقترح" };
const now = () => new Date().toISOString();
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function orchestrate(state: ProjectState, emit: (event: AgentEvent) => void, signal?: AbortSignal) {
  const provider = getProvider();
  const ensureActive = () => { if (signal?.aborted) throw new DOMException("تم إلغاء التشغيل", "AbortError"); };
  const start = (id: AgentId, message: string) => { state.statuses[id] = "thinking"; emit({ type: "agent_started", agentId: id, agentName: names[id], message, timestamp: now() }); };
  const progress = (id: AgentId, message: string) => emit({ type: "agent_progress", agentId: id, message, timestamp: now() });
  const complete = (id: AgentId, summary: string, output: unknown) => { state.statuses[id] = "completed"; state.updatedAt = now(); emit({ type: "agent_completed", agentId: id, summary, output, timestamp: now() }); };

  try {
    ensureActive();
    start("coordinator", "تهيئة ملف المشروع وتحديد مسار العمل"); await pause(250);
    progress("coordinator", "توزيع المهام على الوكلاء المتخصصين"); await pause(220);
    complete("coordinator", "اكتمل إعداد المشروع · 7 مراحل متخصصة", { runId: state.runId, provider: provider.name, revisionLimit: 1 });

    start("requirements", "تحليل الأهداف والقيود ومعايير النجاح");
    progress("requirements", "تمييز المعلومات المؤكدة عن افتراضات التخطيط");
    const requirements = await runRequirementsAgent(provider, state.formValues, signal); ensureActive(); state.outputs.requirements = requirements;
    complete("requirements", `${requirements.requestedDeliverables.length} مخرجات · ${requirements.assumptions.length} افتراضات`, requirements);

    start("experience", "صياغة الفكرة الرئيسية ورحلة الزائر");
    progress("experience", "تحديد اللحظات والمناطق وآليات التفاعل");
    let experience = await runExperienceAgent(provider, state.formValues, requirements, false, signal); ensureActive(); state.outputs.experience = experience;
    complete("experience", `${experience.conceptName} · رحلة من ${experience.visitorJourney.length} خطوات`, experience);

    start("designer", "تحويل المسارات الإبداعية إلى لوحات تصميمية");
    progress("designer", "إعداد موجهات تصورات ثلاثية الأبعاد قابلة للتنفيذ");
    const design = await runDesignerAgent(provider, state.formValues, requirements, experience, signal); ensureActive(); state.outputs.designer = design;
    complete("designer", `${design.boards.length} تصورات ثلاثية الأبعاد جاهزة للتوليد`, design);

    start("architect", "تحويل الفكرة إلى خطة تقنية قابلة للتنفيذ");
    progress("architect", "مراجعة الأجهزة وتدفق البيانات ومتطلبات التشغيل");
    let architecture = await runArchitectAgent(provider, state.formValues, requirements, experience, design, false, signal); ensureActive(); state.outputs.architect = architecture;
    complete("architect", `${architecture.hardwareRequirements.length} متطلبات أجهزة · جاهز دون اتصال`, architecture);

    start("budget", "توزيع الميزانية وبناء خطة التسليم");
    progress("budget", "مراجعة تكلفة كل بند مقابل سقف الميزانية");
    const budget = await runBudgetAgent(provider, state.formValues, requirements, experience, architecture, signal); ensureActive(); state.outputs.budget = budget;
    complete("budget", `${budget.estimatedTotal.toLocaleString("ar-SA")} ر.س مخطط · ${budget.remainingBudget.toLocaleString("ar-SA")} ر.س متبقي`, budget);

    start("reviewer", "مراجعة المقترح مقابل ثمانية معايير للجودة");
    let review = await runReviewerAgent(provider, state.formValues, requirements, experience, design, architecture, budget, false, signal); ensureActive(); state.outputs.reviewer = review; state.reviewResult = review;
    complete("reviewer", `${review.decision} · ${review.overallScore}/100`, review);
    emit({ type: "review_completed", decision: review.decision, score: review.overallScore, timestamp: now() });

    if (review.decision === "REVISE" && state.revisionCount < 1) {
      state.revisionCount += 1;
      const targets = [...new Set(review.revisionInstructions.map((x) => x.agentId).filter((id): id is AgentId => id === "experience" || id === "architect"))];
      targets.forEach((id) => { state.statuses[id] = "needs_revision"; emit({ type: "agent_status", agentId: id, status: "needs_revision", message: "طلب المراجع تعديلًا موجهًا", timestamp: now() }); });
      emit({ type: "revision_started", agentIds: targets, timestamp: now() }); await pause(300);
      if (targets.includes("experience")) { start("experience", "إضافة الرحلة السريعة التي طلبها المراجع"); experience = await runExperienceAgent(provider, state.formValues, requirements, true, signal); ensureActive(); state.outputs.experience = experience; complete("experience", "اكتملت المراجعة · أضيفت الرحلة السريعة", experience); }
      if (targets.includes("architect")) { start("architect", "إضافة حدود السلامة والبدائل التشغيلية"); architecture = await runArchitectAgent(provider, state.formValues, requirements, experience, design, true, signal); ensureActive(); state.outputs.architect = architecture; complete("architect", "اكتملت المراجعة · عُززت الضوابط والبدائل", architecture); }
      start("reviewer", "التحقق من التعديلات الموجهة"); review = await runReviewerAgent(provider, state.formValues, requirements, experience, design, architecture, budget, true, signal); ensureActive(); state.outputs.reviewer = review; state.reviewResult = review;
      complete("reviewer", `${review.decision} · ${review.overallScore}/100 بعد المراجعة`, review); emit({ type: "review_completed", decision: review.decision, score: review.overallScore, timestamp: now() });
    }

    start("proposal", "صياغة المقترح النهائي بلغة جاهزة للعميل");
    progress("proposal", "توحيد الفكرة والميزانية والجدول والتوصيات");
    const proposal = await runProposalAgent(provider, state.formValues, requirements, experience, design, architecture, budget, review, signal); ensureActive(); state.outputs.proposal = proposal; state.finalProposal = proposal;
    complete("proposal", "المقترح النهائي جاهز للعرض والتصدير", proposal);
    emit({ type: "run_completed", finalProposal: proposal, timestamp: now() });
  } catch (error) {
    if (signal?.aborted || (error instanceof DOMException && error.name === "AbortError")) return;
    const message = error instanceof Error ? error.message : "حدث خطأ غير متوقع في التنسيق";
    state.errors.push(message); emit({ type: "run_failed", error: `${message} يمكنك تفعيل DEMO_MODE=true مؤقتًا للتشغيل دون رصيد API.`, timestamp: now() });
  }
}
