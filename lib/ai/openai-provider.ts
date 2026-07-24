import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { AIProvider, GenerateRequest } from "./provider";
import { ProviderError } from "./provider";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generate<T>(request: GenerateRequest<T>): Promise<T> {
    const run = async (repair?: string) => {
      const completion = await this.client.beta.chat.completions.parse({
        model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
        response_format: zodResponseFormat(request.schema, `${request.agentId}_output`),
        messages: [{ role: "system", content: request.system }, { role: "user", content: `${request.prompt}\nContext:\n${JSON.stringify(request.context)}${repair ? `\nRepair this validation error: ${repair}` : ""}` }]
      }, { signal: request.signal });
      const message = completion.choices[0]?.message;
      if (!message?.parsed) throw new Error(message?.refusal || "لم يُرجع النموذج مخرجات منظّمة");
      return message.parsed;
    };
    try {
      const first = await run(); const parsed = request.schema.safeParse(first);
      if (parsed.success) return parsed.data;
      return request.schema.parse(await run(parsed.error.message));
    } catch (error) { throw new ProviderError("تعذر على OpenAI إرجاع استجابة منظّمة صالحة. تحقق من رصيد API وحدود الاستخدام ثم أعد المحاولة.", this.name, error); }
  }

  async generateImage(prompt: string, signal?: AbortSignal): Promise<string> {
    try {
      const result = await this.client.images.generate({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
        prompt: [
          "Create a client-grade photorealistic architectural visualization of a physically buildable exhibition booth for a premium business event in Saudi Arabia.",
          `Design brief: ${prompt}`,
          "Apply the AgentForge visual system with restraint: midnight navy #070B17 and deep navy #10182B as the architectural base, violet #6C63FF as the primary accent, mint #23D5AB and sky blue #38BDF8 as limited wayfinding and digital-interface highlights.",
          "Show realistic commercial materials, credible fabrication joints, accessible circulation, practical screen mounting, believable lighting fixtures, cable management, and accurate human scale.",
          "Use a natural eye-level 28–35 mm architectural photography perspective, balanced daylight and venue lighting, subtle material variation, and a polished presentation suitable for an agency proposal.",
          "The result must look commissioned and buildable, not like generic AI concept art: avoid fantasy architecture, excessive neon, floating elements, impossible geometry, plastic-looking surfaces, duplicated people, distorted bodies, surreal reflections, over-sharpening, and oversaturated colors.",
          "Include only a few naturally posed visitors with unobstructed faces and hands. Do not render any readable words, fake logos, watermarks, labels, or gibberish signage; branding and typography will be added in the proposal layout.",
        ].join(" "),
        size: "1536x1024",
        quality: "high",
      }, { signal });
      const image = result.data?.[0]?.b64_json;
      if (!image) throw new Error("لم تُرجع خدمة الصور ملفًا صالحًا.");
      return `data:image/png;base64,${image}`;
    } catch (error) {
      throw new ProviderError("تعذر على OpenAI إنشاء التصور ثلاثي الأبعاد. تحقق من صلاحية نموذج الصور في حساب API.", this.name, error);
    }
  }
}
