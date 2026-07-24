import type { AIProvider } from "@/lib/ai/provider";
import { proposalSchema, type Architecture, type BudgetPlan, type DesignPackage, type Experience, type Requirements, type Review } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { runAgent } from "./agent-runner";
export async function runProposalAgent(provider: AIProvider, brief: BriefInput, requirements: Requirements, experience: Experience, design: DesignPackage, architecture: Architecture, budget: BudgetPlan, review: Review, signal?: AbortSignal) {
  const draft = await runAgent(provider, "proposal", proposalSchema, { brief, requirements, experience, design, architecture, budget, review }, "أنشئ المقترح العربي المعتمد والجاهز للعميل. استخدم أسماء المشروع والعميل والفعالية والمفهوم الواردة في السياق حرفيًا، وحافظ على أرقام الميزانية المحققة كما هي تمامًا.", signal);
  return proposalSchema.parse({
    ...draft,
    title: `${experience.conceptName} — ${requirements.client} في ${requirements.event}`,
    subtitle: experience.conceptTagline,
    concept: { name: experience.conceptName, tagline: experience.conceptTagline, overview: experience.conceptOverview },
    visitorJourney: experience.visitorJourney,
    budgetSummary: { currency: "SAR", total: budget.estimatedTotal, contingency: budget.contingency, vatAmount: budget.vatAmount, totalWithVat: budget.totalWithVat, budgetIncludesVat: budget.budgetIncludesVat, remaining: budget.remainingBudget, items: budget.budgetItems },
    implementationTimeline: budget.timeline,
    successMetrics: requirements.successCriteria
  });
}
