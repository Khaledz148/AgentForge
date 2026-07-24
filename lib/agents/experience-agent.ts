import type { AIProvider } from "@/lib/ai/provider";
import { experienceSchema, type Requirements } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { parseBrief } from "@/lib/brief-intelligence";
import { saudiEventContext } from "@/lib/saudi-event-context";
import { runAgent } from "./agent-runner";
export const runExperienceAgent = (provider: AIProvider, brief: BriefInput, requirements: Requirements, revision = false, signal?: AbortSignal) => runAgent(provider, "experience", experienceSchema, { brief, requirements, parsedBrief: parseBrief(brief), saudiEventContext, revision }, revision ? "راجع التجربة وفق ملاحظات المراجع، بما يشمل رحلة سريعة لأوقات الذروة." : "ابتكر ثلاثة مسارات مختلفة ومناسبة للموجز، ثم اختر مسارًا واحدًا موصى به. املأ الحقول الأساسية للمفهوم والرحلة بناءً على المسار المختار.", signal);
