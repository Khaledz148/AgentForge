import { z } from "zod";

const text = z.string().min(1);
const strings = z.array(text);

export const requirementsSchema = z.object({
  projectName: text, client: text, event: text, objective: text, audience: text,
  location: text, duration: text, space: text, budget: z.number().nonnegative(),
  budgetIncludesVat: z.boolean(),
  requestedDeliverables: strings, constraints: strings, assumptions: strings,
  missingInformation: strings, successCriteria: strings
});

export const experienceSchema = z.object({
  conceptName: text, conceptTagline: text, conceptOverview: text, creativeRationale: text,
  ideas: z.array(z.object({ id: text, name: text, tagline: text, overview: text, visitorValue: text, deliveryFit: text, signatureMoment: text })).min(3).max(3),
  selectedIdeaId: text,
  visitorJourney: z.array(z.object({ step: text, title: text, description: text })),
  experienceZones: z.array(z.object({ name: text, purpose: text, features: strings })),
  interactiveExperiences: z.array(z.object({ name: text, description: text, technology: text })),
  engagementMechanics: strings, shareableMoments: strings, expectedImpact: strings
});

export const designSchema = z.object({
  selectedIdeaId: text,
  selectedIdeaName: text,
  designRationale: text,
  boards: z.array(z.object({
    ideaId: text,
    ideaName: text,
    title: text,
    visualNarrative: text,
    materials: strings,
    layoutNotes: strings,
    renderPrompt: text,
    cameraAngle: text,
  })).min(3).max(3),
  productionNotes: strings,
  imageGenerationDisclaimer: text,
});

export const architectSchema = z.object({
  solutionOverview: text, frontendRequirements: strings, backendRequirements: strings,
  aiRequirements: strings, hardwareRequirements: strings, integrations: strings,
  dataFlow: strings, staffingRequirements: strings, installationRequirements: strings,
  operationalRequirements: strings, dependencies: strings, technicalRisks: strings
});

export const budgetItemSchema = z.object({
  category: text, description: text, quantity: z.number().positive(), unitCost: z.number().nonnegative(),
  totalCost: z.number().nonnegative(), justification: text
});
export const budgetSchema = z.object({
  currency: z.literal("SAR"), totalBudget: z.number().positive(), budgetItems: z.array(budgetItemSchema),
  subtotal: z.number().nonnegative(), contingency: z.number().nonnegative(), estimatedTotal: z.number().nonnegative(),
  vatRate: z.number().min(0).max(1), vatAmount: z.number().nonnegative(), totalWithVat: z.number().nonnegative(), budgetIncludesVat: z.boolean(),
  remainingBudget: z.number(), timeline: z.array(z.object({ phase: text, duration: text, owner: text, activities: strings })),
  milestones: strings, requiredTeam: strings, costSavingOptions: strings, uncertaintyWarning: z.string().nullable()
});

export const reviewerSchema = z.object({
  decision: z.enum(["PASS", "REVISE"]), overallScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    "Requirement coverage": z.number().min(0).max(100), Creativity: z.number().min(0).max(100),
    Feasibility: z.number().min(0).max(100), "Budget accuracy": z.number().min(0).max(100),
    "Technical clarity": z.number().min(0).max(100), "Visitor value": z.number().min(0).max(100),
    "Client value": z.number().min(0).max(100), "Presentation quality": z.number().min(0).max(100)
  }), strengths: strings, issues: strings,
  contradictions: strings, budgetConcerns: strings, feasibilityConcerns: strings,
  missingItems: strings, revisionInstructions: z.array(z.object({ agentId: text, instruction: text }))
});

export const proposalSchema = z.object({
  title: text, subtitle: text, executiveSummary: text, challenge: text, proposedSolution: text,
  concept: z.object({ name: text, tagline: text, overview: text }),
  visitorJourney: z.array(z.object({ step: text, title: text, description: text })),
  experienceHighlights: z.array(z.object({ title: text, description: text })),
  technicalPlan: z.object({ overview: text, requirements: strings }),
  budgetSummary: z.object({ currency: z.literal("SAR"), total: z.number(), contingency: z.number(), vatAmount: z.number(), totalWithVat: z.number(), budgetIncludesVat: z.boolean(), remaining: z.number(), items: z.array(budgetItemSchema) }),
  implementationTimeline: z.array(z.object({ phase: text, duration: text, owner: text, activities: strings })),
  risksAndMitigations: z.array(z.object({ risk: text, mitigation: text })), successMetrics: strings,
  nextSteps: strings, closingStatement: text
});

export type Requirements = z.infer<typeof requirementsSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type DesignPackage = z.infer<typeof designSchema>;
export type Architecture = z.infer<typeof architectSchema>;
export type BudgetPlan = z.infer<typeof budgetSchema>;
export type Review = z.infer<typeof reviewerSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
