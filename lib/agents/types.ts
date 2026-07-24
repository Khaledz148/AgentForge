import type { BriefInput } from "@/lib/schemas/brief-schema";
import type { Architecture, BudgetPlan, DesignPackage, Experience, Proposal, Requirements, Review } from "@/lib/schemas/agent-schemas";

export type AgentId = "coordinator" | "requirements" | "experience" | "designer" | "architect" | "budget" | "reviewer" | "proposal";
export type AgentStatus = "waiting" | "thinking" | "completed" | "needs_revision" | "failed";

export type AgentEvent =
  | { type: "run_started"; runId: string; timestamp: string }
  | { type: "agent_started"; agentId: AgentId; agentName: string; message: string; timestamp: string }
  | { type: "agent_progress"; agentId: AgentId; message: string; timestamp: string }
  | { type: "agent_completed"; agentId: AgentId; summary: string; output: unknown; timestamp: string }
  | { type: "agent_status"; agentId: AgentId; status: AgentStatus; message: string; timestamp: string }
  | { type: "review_completed"; decision: "PASS" | "REVISE"; score: number; timestamp: string }
  | { type: "revision_started"; agentIds: AgentId[]; timestamp: string }
  | { type: "run_completed"; finalProposal: Proposal; timestamp: string }
  | { type: "run_failed"; error: string; timestamp: string };

export interface ProjectState {
  runId: string; originalBrief: string; formValues: BriefInput;
  statuses: Record<AgentId, AgentStatus>; outputs: Partial<{
    requirements: Requirements; experience: Experience; designer: DesignPackage; architect: Architecture;
    budget: BudgetPlan; reviewer: Review; proposal: Proposal;
  }>;
  reviewResult?: Review; revisionCount: number; finalProposal?: Proposal;
  errors: string[]; startedAt: string; updatedAt: string;
}
