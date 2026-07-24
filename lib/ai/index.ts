import type { AIProvider } from "./provider";
import { DemoProvider } from "./demo-provider";
import { GeminiProvider } from "./gemini-provider";
import { OpenAIProvider } from "./openai-provider";

export function getProvider(): AIProvider {
  if (process.env.DEMO_MODE === "true" || !process.env.AI_PROVIDER || process.env.AI_PROVIDER === "demo") return new DemoProvider();
  if (process.env.AI_PROVIDER === "openai") {
    if (!process.env.OPENAI_API_KEY) throw new Error("مفتاح OPENAI_API_KEY غير مُعدّ");
    return new OpenAIProvider();
  }
  if (process.env.AI_PROVIDER === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw new Error("مفتاح GEMINI_API_KEY غير مُعدّ");
    return new GeminiProvider();
  }
  throw new Error(`مزود ذكاء اصطناعي غير مدعوم: ${process.env.AI_PROVIDER}`);
}

export function getProviderStatus() {
  const demo = process.env.DEMO_MODE === "true" || !process.env.AI_PROVIDER || process.env.AI_PROVIDER === "demo";
  const provider = demo ? "demo" : process.env.AI_PROVIDER || "demo";
  const configured = demo || (provider === "openai" ? Boolean(process.env.OPENAI_API_KEY) : Boolean(process.env.GEMINI_API_KEY));
  return { provider, configured, demo };
}
