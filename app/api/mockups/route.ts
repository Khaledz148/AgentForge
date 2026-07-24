import { z } from "zod";
import { getProvider } from "@/lib/ai";
import type { MockupResult } from "@/lib/mockups";

const requestSchema = z.object({ boards: z.array(z.object({ ideaId: z.string(), renderPrompt: z.string().min(20) })).length(3) });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "بيانات التصورات غير صالحة." }, { status: 400 });
  const provider = getProvider();
  if (!provider.generateImage) return Response.json({ error: "توليد الصور متاح حاليًا مع مزود OpenAI فقط. يمكنك تشغيل الوضع التجريبي لمشاهدة التصورات النموذجية." }, { status: 501 });
  const results = await Promise.allSettled(
    parsed.data.boards.map(async (board) => ({
      ideaId: board.ideaId,
      imageUrl: await provider.generateImage!(board.renderPrompt, request.signal),
    })),
  );
  const mockups: MockupResult[] = results.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : {
          ideaId: parsed.data.boards[index].ideaId,
          error: "تعذر إنشاء هذا التصور. تحقق من رصيد OpenAI وصلاحية نموذج الصور.",
        },
  );
  if (mockups.every((mockup) => !mockup.imageUrl)) {
    return Response.json(
      { mockups, error: "تعذر إنشاء التصورات الآن. تحقق من رصيد OpenAI وصلاحية نموذج الصور." },
      { status: 502 },
    );
  }
  return Response.json({ mockups });
}
