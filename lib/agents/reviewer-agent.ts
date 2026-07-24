import type { AIProvider } from "@/lib/ai/provider";
import { reviewerSchema, type Architecture, type BudgetPlan, type DesignPackage, type Experience, type Requirements } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { runAgent } from "./agent-runner";
export const runReviewerAgent = (provider: AIProvider, brief: BriefInput, requirements: Requirements, experience: Experience, design: DesignPackage, architecture: Architecture, budget: BudgetPlan, revision = false, signal?: AbortSignal) => runAgent(provider, "reviewer", reviewerSchema, { brief, requirements, experience, design, architecture, budget, revision }, "راجع الخطة الكاملة وفق محاور التقييم الثمانية، بما فيه قابلية تنفيذ التصور التصميمي. أعد تعليمات مراجعة موجهة أو PASS.", signal);
