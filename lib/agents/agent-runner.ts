import type { z } from "zod";
import type { AIProvider } from "@/lib/ai/provider";
import { systemPrompts } from "./prompts";

export async function runAgent<T>(provider: AIProvider, agentId: string, schema: z.ZodType<T>, context: unknown, task: string, signal?: AbortSignal) {
  return provider.generate({ agentId, schema, context, system: systemPrompts[agentId], prompt: task, signal });
}
