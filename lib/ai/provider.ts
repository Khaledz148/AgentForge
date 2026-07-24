import type { z } from "zod";

export interface GenerateRequest<T> {
  agentId: string;
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  context: unknown;
  signal?: AbortSignal;
}

export interface AIProvider {
  readonly name: "demo" | "openai" | "gemini";
  generate<T>(request: GenerateRequest<T>): Promise<T>;
  generateImage?(prompt: string, signal?: AbortSignal): Promise<string>;
}

export class ProviderError extends Error {
  constructor(message: string, readonly provider: string, readonly cause?: unknown) {
    super(message); this.name = "ProviderError";
  }
}
