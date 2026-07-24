import type { AIProvider } from "@/lib/ai/provider";
import { architectSchema, type DesignPackage, type Experience, type Requirements } from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";
import { runAgent } from "./agent-runner";
export const runArchitectAgent = (provider: AIProvider, brief: BriefInput, requirements: Requirements, experience: Experience, design: DesignPackage, revision = false, signal?: AbortSignal) => runAgent(provider, "architect", architectSchema, { brief, requirements, experience, design, revision }, revision ? "راجع البنية مع ضوابط سلامة المحتوى وبدائل تشغيلية سريعة." : "حوّل التجربة والتصور التصميمي إلى حل واقعي وقابل للتنفيذ.", signal);
