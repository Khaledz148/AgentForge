import type { AgentEvent } from "@/lib/agents/types";

export function createEventWriter(controller: ReadableStreamDefaultController<Uint8Array>, isClosed: () => boolean) {
  const encoder = new TextEncoder();
  return (event: AgentEvent) => {
    if (isClosed()) return;
    try {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
    } catch {
      // The browser may cancel the stream between the closed check and enqueue.
    }
  };
}
