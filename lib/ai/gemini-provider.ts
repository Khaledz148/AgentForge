import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, GenerateRequest } from "./provider";
import { ProviderError } from "./provider";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini" as const;
  private client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

  async generate<T>(request: GenerateRequest<T>): Promise<T> {
    const model = this.client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash", systemInstruction: request.system, generationConfig: { responseMimeType: "application/json" } });
    const run = async (repair?: string) => JSON.parse((await model.generateContent(`${request.prompt}\nContext:\n${JSON.stringify(request.context)}${repair ? `\nRepair validation error: ${repair}` : ""}`)).response.text());
    try {
      const first = await run(); const parsed = request.schema.safeParse(first);
      if (parsed.success) return parsed.data;
      return request.schema.parse(await run(parsed.error.message));
    } catch (error) { throw new ProviderError("Gemini could not return a valid structured response.", this.name, error); }
  }
}
