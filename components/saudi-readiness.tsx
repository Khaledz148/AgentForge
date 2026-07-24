import { Landmark, ShieldCheck, Stamp } from "lucide-react";

const items = [
  { icon: Landmark, title: "الميزانية والضريبة", text: "تحسب الخطة ضريبة القيمة المضافة 15% حيث تنطبق، وتوضح إن كان السقف شاملًا لها.", href: "https://zatca.gov.sa/ar/rulesregulations/vat/pages/about-vat.aspx" },
  { icon: ShieldCheck, title: "خصوصية الزوار", text: "تتجنب التجارب البيانات الحساسة وتفصل موافقة التواصل الاختيارية عن التفاعل الأساسي.", href: "https://dgp.sdaia.gov.sa/wps/portal/pdp/knowledgecenter/details/PDPL" },
  { icon: Stamp, title: "جاهزية الفعالية", text: "تُدرج التراخيص وخطط الموقع والمخاطر كعناصر تحقق قبل التعاقد أو الإنتاج.", href: "https://www.scega.gov.sa/ar/EServices/Pages/TradeFairsServicesDetails.aspx" },
];

export function SaudiReadiness() {
  return <section className="glass rounded-2xl p-5">
    <div className="mb-4"><div className="text-xs font-semibold text-emerald-300">سياق سعودي موثوق</div><h2 className="mt-1 font-display text-lg font-bold">يحوّل القواعد المحلية إلى عناصر تحقق</h2></div>
    <div className="grid gap-3 md:grid-cols-3">{items.map(({ icon: Icon, title, text, href }) => <a key={title} href={href} target="_blank" rel="noreferrer" className="rounded-xl border border-white/[.07] bg-white/[.025] p-3 transition hover:border-emerald-400/25 hover:bg-emerald-400/[.04]"><div className="flex items-center gap-2 text-sm font-semibold text-slate-200"><Icon size={15} className="text-emerald-300" />{title}</div><p className="mt-2 text-[11px] leading-5 text-slate-500">{text}</p></a>)}</div>
  </section>;
}
