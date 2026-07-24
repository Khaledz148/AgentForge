import type { AIProvider } from "@/lib/ai/provider";
import { designSchema, type Experience, type Requirements } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { saudiEventContext } from "@/lib/saudi-event-context";
import { runAgent } from "./agent-runner";

export const runDesignerAgent = (provider: AIProvider, brief: BriefInput, requirements: Requirements, experience: Experience, signal?: AbortSignal) => runAgent(
  provider,
  "designer",
  designSchema,
  { brief, requirements, experience, saudiEventContext },
  "أنشئ ثلاث لوحات توجيه تصميمي، واحدة لكل فكرة. كل لوحة يجب أن تحتوي على وصف بصري واقعي وموجه دقيق لتوليد تصور ثلاثي الأبعاد لجناح فعالية. ركز على المساحة، حركة الزوار، المواد، الإضاءة، وقابلية التنفيذ. لا تذكر شعارات أو كتابة داخل الصورة.",
  signal,
);
