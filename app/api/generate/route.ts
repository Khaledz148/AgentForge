import { briefSchema } from "@/lib/schemas/brief-schema";
import { createState } from "@/lib/orchestration/state";
import { createEventWriter } from "@/lib/orchestration/event-stream";
import { orchestrate } from "@/lib/agents/coordinator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = briefSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "موجز الفعالية غير صالح", details: parsed.error.flatten() }, { status: 400 });
  const state = createState(parsed.data);
  let streamClosed = false;
  const safeClose = (controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (streamClosed) return;
    streamClosed = true;
    try { controller.close(); } catch { /* The client already closed the stream. */ }
  };
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const emit = createEventWriter(controller, () => streamClosed);
      emit({ type: "run_started", runId: state.runId, timestamp: new Date().toISOString() });
      void orchestrate(state, emit, request.signal).finally(() => safeClose(controller));
    },
    cancel() {
      streamClosed = true;
    }
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
