import type { AIProvider } from "@/lib/ai/provider";
import { budgetSchema, type Architecture, type BudgetPlan, type Experience, type Requirements } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { runAgent } from "./agent-runner";

export async function runBudgetAgent(provider: AIProvider, brief: BriefInput, requirements: Requirements, experience: Experience, architecture: Architecture, signal?: AbortSignal) {
  const raw = await runAgent(provider, "budget", budgetSchema, { brief, requirements, experience, architecture }, "أنشئ ميزانية تفصيلية وخطة تسليم باللغة العربية.", signal);
  return normalizeBudget(raw, requirements.budget, requirements.budgetIncludesVat);
}

export function normalizeBudget(plan: BudgetPlan, maximum: number, budgetIncludesVat = true): BudgetPlan {
  const safeMax = maximum || plan.totalBudget;
  const workingCap = budgetIncludesVat ? Math.floor(safeMax / 1.15) : safeMax;
  let items = plan.budgetItems.map((item) => ({ ...item, quantity: Math.max(1, item.quantity), unitCost: Math.max(0, item.unitCost), totalCost: Math.max(1, item.quantity) * Math.max(0, item.unitCost) }));
  let subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
  let contingency = Math.min(Math.max(0, plan.contingency), workingCap * 0.1);
  if (subtotal + contingency > workingCap) {
    const targetSubtotal = workingCap * 0.92;
    const factor = targetSubtotal / Math.max(subtotal, 1);
    items = items.map((item) => ({ ...item, unitCost: Math.floor(item.unitCost * factor), totalCost: Math.floor(item.quantity * item.unitCost * factor) }));
    subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    contingency = Math.max(0, workingCap - subtotal);
  }
  const estimatedTotal = subtotal + contingency;
  const vatAmount = Math.round(estimatedTotal * 0.15);
  const totalWithVat = estimatedTotal + vatAmount;
  return budgetSchema.parse({ ...plan, totalBudget: safeMax, budgetItems: items, subtotal, contingency, estimatedTotal, vatRate: 0.15, vatAmount, totalWithVat, budgetIncludesVat, remainingBudget: (budgetIncludesVat ? safeMax - totalWithVat : safeMax - estimatedTotal), uncertaintyWarning: plan.uncertaintyWarning || "يعتمد التقدير على خدمات الموقع وعروض أسعار الإنتاج النهائية." });
}
