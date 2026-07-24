import type { AIProvider } from "@/lib/ai/provider";
import { requirementsSchema } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { parseBrief } from "@/lib/brief-intelligence";
import { saudiEventContext } from "@/lib/saudi-event-context";
import { runAgent } from "./agent-runner";
export const runRequirementsAgent = (provider: AIProvider, brief: BriefInput, signal?: AbortSignal) => runAgent(provider, "requirements", requirementsSchema, { brief, parsedBrief: parseBrief(brief), saudiEventContext }, "أنشئ وثيقة المتطلبات المنظّمة باللغة العربية. استخدم الحقول المستخرجة حتميًا عندما تكون موثوقة، واذكر أي معلومات تحتاج إلى تأكيد.", signal);
