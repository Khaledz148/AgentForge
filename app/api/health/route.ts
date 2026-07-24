import { getProviderStatus } from "@/lib/ai";
export const dynamic = "force-dynamic";
export function GET() { return Response.json({ status: "ok", ...getProviderStatus(), timestamp: new Date().toISOString() }); }
