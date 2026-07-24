import type { BriefInput } from "@/lib/schemas/brief-schema";

export type BriefIntel = {
  detected: Array<{ label: string; value: string; confidence: "high" | "medium" }>;
  missing: string[];
  warnings: string[];
  normalized: BriefInput;
};

const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
const toLatinDigits = (value: string) =>
  value.replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)));

const knownCities = [
  ["الرياض", "الرياض"],
  ["Riyadh", "الرياض"],
  ["جدة", "جدة"],
  ["Jeddah", "جدة"],
  ["الدمام", "الدمام"],
  ["الخبر", "الخبر"],
  ["مكة", "مكة المكرمة"],
  ["المدينة", "المدينة المنورة"],
  ["العلا", "العلا"],
] as const;

const durationWords: Record<string, number> = {
  يوم: 1,
  يومين: 2,
  يومان: 2,
  ثلاثة: 3,
  ثلاث: 3,
  أربعة: 4,
  اربع: 4,
  خمسة: 5,
  ستة: 6,
  سبعة: 7,
};

function detectBudget(text: string) {
  const match = text.match(/(?:ميزانية|budget)?\s*([\d,٫]+)\s*(?:ر\.?\s?س|ريال(?:\s+سعودي)?|sar)/i);
  if (!match) return undefined;
  const amount = Number(toLatinDigits(match[1]).replace(/[,.٫]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

function detectDuration(text: string) {
  const numeric = text.match(/([\d٠-٩]+)\s*(?:أيام|يوم|days?)/i);
  if (numeric) return `${toLatinDigits(numeric[1])} أيام`;
  const word = Object.entries(durationWords).find(([word]) => text.includes(`${word} أيام`) || text.includes(`${word} يوم`));
  return word ? `${word[1]} أيام` : "";
}

function detectSpace(text: string) {
  const match = text.match(/([\d٠-٩]+)\s*[×x]\s*([\d٠-٩]+)\s*(?:م|متر|أمتار)/i);
  return match ? `${toLatinDigits(match[1])} × ${toLatinDigits(match[2])} أمتار` : "";
}

export function parseBrief(input: BriefInput): BriefIntel {
  const text = toLatinDigits(input.brief);
  const location = input.location || knownCities.find(([term]) => text.toLowerCase().includes(term.toLowerCase()))?.[1] || "";
  const budget = input.budget || detectBudget(text);
  const duration = input.duration || detectDuration(text);
  const space = input.space || detectSpace(text);
  const eventType = input.eventType || (["معرض", "جناح", "سيتي سكيب"].some((term) => text.includes(term)) ? "معرض / جناح" : ["مؤتمر", "منتدى"].some((term) => text.includes(term)) ? "مؤتمر" : "");
  const normalized = { ...input, location, budget, duration, space, eventType };
  const detected = [
    budget && { label: "الميزانية", value: `${budget.toLocaleString("ar-SA")} ر.س`, confidence: "high" as const },
    location && { label: "الموقع", value: location, confidence: "high" as const },
    duration && { label: "المدة", value: duration, confidence: "medium" as const },
    space && { label: "المساحة", value: space, confidence: "high" as const },
    eventType && { label: "نوع الفعالية", value: eventType, confidence: "medium" as const },
  ].filter(Boolean) as BriefIntel["detected"];
  const missing = [
    !normalized.audience && "الجمهور المستهدف",
    !normalized.objective && "الهدف الرئيسي",
    !normalized.budget && "الميزانية",
    !normalized.space && "المساحة المتاحة",
    !normalized.duration && "مدة التفعيل",
  ].filter(Boolean) as string[];
  const warnings = [
    normalized.budget && normalized.budgetIncludesVat ? "سيُعامل السقف المالي على أنه شامل ضريبة القيمة المضافة 15% حيث تنطبق." : "سيُعرض التقدير قبل ضريبة القيمة المضافة ثم تُحسب منفصلة حيث تنطبق.",
    /(?:رقم الهوية|هوية|بطاقة|iban|آيبان|حساب بنكي)/i.test(text) ? "تم رصد إشارة إلى بيانات حساسة؛ لن تُستخدم في التجربة أو التخصيص." : "",
  ].filter(Boolean);
  return { detected, missing, warnings, normalized };
}
