import { z } from "zod";

const optionalText = z.string().trim().max(300).optional().default("");

export const briefSchema = z.object({
  brief: z.string().trim().min(20, "يرجى إدخال موجز أكثر تفصيلًا").max(5000),
  client: optionalText,
  event: optionalText,
  industry: optionalText,
  audience: optionalText,
  location: optionalText,
  duration: optionalText,
  space: optionalText,
  venue: optionalText,
  eventType: optionalText,
  budget: z.coerce.number().positive().max(100_000_000).optional(),
  budgetIncludesVat: z.boolean().optional().default(true),
  objective: optionalText
});

export type BriefInput = z.infer<typeof briefSchema>;
