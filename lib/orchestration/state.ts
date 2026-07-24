import type { AgentId, ProjectState } from "@/lib/agents/types";
import type { BriefInput } from "@/lib/schemas/brief-schema";

const ids: AgentId[] = ["coordinator", "requirements", "experience", "designer", "architect", "budget", "reviewer", "proposal"];
export function createState(brief: BriefInput): ProjectState {
  const now = new Date().toISOString();
  return { runId: crypto.randomUUID(), originalBrief: brief.brief, formValues: brief,
    statuses: Object.fromEntries(ids.map((id) => [id, "waiting"])) as ProjectState["statuses"],
    outputs: {}, revisionCount: 0, errors: [], startedAt: now, updatedAt: now };
}
