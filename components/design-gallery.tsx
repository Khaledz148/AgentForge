"use client";

import Image from "next/image";
import { Box, LoaderCircle, Sparkles } from "lucide-react";
import type { DesignPackage } from "@/lib/schemas/agent-schemas";
import type { MockupResult } from "@/lib/mockups";

export function DesignGallery({
  design,
  mockups,
  loading,
  error,
}: {
  design: DesignPackage;
  mockups: MockupResult[];
  loading: boolean;
  error?: string;
}) {
  return <section className="no-print mt-8" aria-labelledby="design-gallery-title">
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-xs font-semibold text-sky-300">04 · استديو التصورات</div>
        <h2 id="design-gallery-title" className="mt-2 font-display text-3xl font-bold">ثلاثة اتجاهات بصرية قابلة للمقارنة</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{design.designRationale}</p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/[.06] px-3 py-2 text-[11px] text-sky-200">
        {loading ? <LoaderCircle className="animate-spin" size={14} /> : <Sparkles size={14} />}
        {loading ? "يُنشئ وكيل التصميم التصورات تلقائيًا…" : "اكتملت التصورات التلقائية"}
      </div>
    </div>
    {error && <p role="alert" className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-3 text-xs text-amber-200">{error}</p>}
    <div className="grid gap-4 lg:grid-cols-3">
      {design.boards.map((board) => {
        const mockup = mockups.find((item) => item.ideaId === board.ideaId);
        return <article key={board.ideaId} className={`overflow-hidden rounded-3xl border ${board.ideaId === design.selectedIdeaId ? "border-emerald-400/30 bg-emerald-400/[.04]" : "border-white/[.08] bg-white/[.025]"}`}>
          <div className="relative aspect-[4/3] bg-[#0b1121]">
            {mockup?.imageUrl ? <Image src={mockup.imageUrl} alt={`تصور معماري واقعي: ${board.ideaName}`} fill className="object-cover" unoptimized={mockup.imageUrl.startsWith("data:")} /> : <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-slate-500">{loading ? <LoaderCircle size={28} className="animate-spin text-sky-300" /> : <Box size={28} className="text-violet-300" />}<span className="text-xs leading-5">{mockup?.error || (loading ? "يبني وكيل التصميم المشهد والخامات والإضاءة…" : "لم يتوفر التصور البصري.")}</span></div>}
            {board.ideaId === design.selectedIdeaId && <span className="absolute right-3 top-3 rounded-full bg-emerald-400 px-2.5 py-1 text-[10px] font-bold text-emerald-950">المسار الموصى به</span>}
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-[10px] text-violet-300"><Sparkles size={13} /> {board.cameraAngle}</div>
            <h3 className="mt-2 font-display text-xl font-bold">{board.ideaName}</h3>
            <p className="mt-2 text-xs leading-6 text-slate-400">{board.visualNarrative}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{board.materials.slice(0, 3).map((material) => <span key={material} className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-400">{material}</span>)}</div>
          </div>
        </article>;
      })}
    </div>
    <p className="mt-3 text-[11px] leading-5 text-slate-500">{design.imageGenerationDisclaimer}</p>
  </section>;
}
