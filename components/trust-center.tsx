import { CheckCircle2, Eye, ShieldCheck, UserRoundCheck } from "lucide-react";

const controls = [
  {
    icon: ShieldCheck,
    title: "مخرجات موثوقة",
    text: "تُفحص مخرجات كل وكيل تلقائيًا، وتُراجع حسابات الميزانية قبل اعتمادها.",
  },
  {
    icon: Eye,
    title: "مسار عمل واضح",
    text: "يمكنك معرفة ما استلمه كل وكيل وما أضافه إلى المشروع في كل مرحلة.",
  },
  {
    icon: UserRoundCheck,
    title: "القرار النهائي لك",
    text: "المقترح نقطة انطلاق احترافية، وتبقى الموافقة النهائية بيد فريقك.",
  },
  {
    icon: CheckCircle2,
    title: "مراجعة ذاتية منضبطة",
    text: "يحدد المراجع جوانب القصور ويعيدها إلى الوكيل المختص لدورة تحسين واحدة.",
  },
];

export function TrustCenter() {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-4">
        <div className="text-xs font-semibold text-sky-300">ضمان الجودة</div>
        <h2 className="mt-1 font-display text-lg font-bold">
          كل قرار واضح وقابل للمراجعة
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {controls.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Icon size={15} className="text-emerald-300" />
              {title}
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
