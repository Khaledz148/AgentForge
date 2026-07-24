import type { AIProvider, GenerateRequest } from "./provider";
import type {
  Architecture,
  BudgetPlan,
  DesignPackage,
  Experience,
  Proposal,
  Requirements,
  Review,
} from "@/lib/schemas/agent-schemas";
import type { BriefInput } from "@/lib/schemas/brief-schema";

type DemoContext = {
  brief: BriefInput;
  requirements?: Requirements;
  experience?: Experience;
  architecture?: Architecture;
  budget?: BudgetPlan;
  review?: Review;
  revision?: boolean;
};
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class DemoProvider implements AIProvider {
  readonly name = "demo" as const;
  async generate<T>(request: GenerateRequest<T>): Promise<T> {
    const scale = Number(process.env.DEMO_DELAY_SCALE ?? 1);
    if (request.signal?.aborted)
      throw new DOMException("تم إلغاء التشغيل", "AbortError");
    await wait(Math.max(120, 280 * scale));
    if (request.signal?.aborted)
      throw new DOMException("تم إلغاء التشغيل", "AbortError");
    const c = request.context as DemoContext;
    const value = this.output(request.agentId, c);
    return request.schema.parse(value);
  }

  private output(agentId: string, c: DemoContext): unknown {
    const b = c.brief;
    const budget = b.budget ?? 120000;
    const client = b.client || "بنك سعودي";
    const event = b.event || "سيتي سكيب الرياض";
    if (agentId === "requirements")
      return {
        projectName: `تجربة المستقبل المالي لـ${client}`,
        client,
        event,
        objective:
          b.objective ||
          "تعزيز الثقة المالية وتشجيع عادات الادخار العملية من خلال تجربة رقمية لا تُنسى.",
        audience: b.audience || "المهنيون الشباب من 22 إلى 35 عامًا",
        location: b.location || "الرياض، المملكة العربية السعودية",
        duration: b.duration || "أربعة أيام",
        space: b.space || "6 × 6 أمتار",
        budget,
        budgetIncludesVat: b.budgetIncludesVat,
        requestedDeliverables: [
          "الفكرة الإبداعية الرئيسية",
          "رحلة الزائر",
          "التجارب التفاعلية",
          "الخطة التقنية",
          "توزيع الميزانية",
          "الجدول الزمني للتسليم",
          "خطة قياس النجاح",
        ],
        constraints: [
          `ألا تتجاوز التكلفة ${budget.toLocaleString("ar-SA")} ر.س`,
          "مساحة محدودة مع مسارات حركة ميسرة",
          "تفاعلات سريعة وسهلة التكرار",
          "عدم جمع أي بيانات مالية حساسة",
        ],
        assumptions: [
          "يمكن توفير الكهرباء والاتصال بالإنترنت في الموقع",
          "المحتوى مطلوب باللغتين العربية والإنجليزية",
          "سيزوّد العميل الفريق بدليل الهوية البصرية",
          "الميزانية لا تشمل إيجار مساحة الجناح",
        ],
        missingInformation: [
          "متطلبات الاعتماد النهائية للهوية",
          "مواصفات الكهرباء والاتصال التي يوفرها الموقع",
          "سياسة الاحتفاظ بالبيانات المطلوبة",
        ],
        successCriteria: [
          "إكمال 65% من الزوار لرحلة الهدف على الأقل",
          "متوسط مدة تفاعل يتراوح بين 4 و6 دقائق",
          "اختيار 40% من الزوار استلام خطتهم الشخصية على الأقل",
          "تحقيق رضا إيجابي بنسبة 80% أو أكثر",
        ],
      } satisfies Requirements;
    if (agentId === "experience")
      return {
        conceptName: "مستقبلك في الصورة",
        conceptTagline: "شاهد هدفك، وابدأ خطوتك القادمة.",
        conceptOverview:
          "رحلة رقمية موجّهة تحوّل الطموح المالي إلى خطة شخصية قابلة للمشاركة خلال أقل من خمس دقائق.",
        creativeRationale:
          "يبحث المهنيون الشباب عن قيمة مباشرة تمس أهدافهم. لذلك تنقل التجربة الثقافة المالية من محتوى تعليمي تقليدي إلى رحلة بصرية تقرّبهم من هدف يهمهم فعلًا.",
        ideas: [
          { id: "future-path", name: "مستقبلك في الصورة", tagline: "شاهد هدفك، وابدأ خطوتك القادمة.", overview: "رحلة رقمية شخصية تجعل الادخار مرئيًا وممكنًا.", visitorValue: "خطة هدف بسيطة قابلة للمشاركة.", deliveryFit: "ملائم لمساحة صغيرة وتفاعل سريع.", signatureMoment: "إضاءة مسار الهدف على الجدار المشترك." },
          { id: "financial-garden", name: "حديقة الادخار", tagline: "كل خطوة صغيرة تنمّي هدفًا أكبر.", overview: "تجربة هادئة تحول عادات الادخار إلى نمو بصري.", visitorValue: "توجيه عملي بعيد عن اللغة المالية المعقدة.", deliveryFit: "ملائم للقاءات القصيرة والاستشارات.", signatureMoment: "شجرة تفاعلية تنمو مع مشاركات الزوار." },
          { id: "challenge-studio", name: "استديو التحدي المالي", tagline: "تعلّمها، جرّبها، وارتقِ بنتيجتك.", overview: "تحديات قصيرة ترفع الوعي المالي في جو تنافسي خفيف.", visitorValue: "تعلم سريع مع نتيجة فورية.", deliveryFit: "قابل للتشغيل في أوقات الذروة.", signatureMoment: "حلقة إنجاز مضيئة ونتيجة مباشرة." },
        ],
        selectedIdeaId: "future-path",
        visitorJourney: [
          {
            step: "01",
            title: "اختر هدفك",
            description:
              "يدعو المضيف الزائر إلى اختيار هدف مثل امتلاك منزل أو السفر أو التعليم أو تأسيس صندوق للطوارئ.",
          },
          {
            step: "02",
            title: "ابنِ مسارك",
            description:
              "تجمع أسئلة قصيرة على الشاشة مدة الهدف وتفضيلات الادخار دون طلب بيانات مالية حساسة.",
          },
          {
            step: "03",
            title: "أضئ الطريق",
            description:
              "تتحول اختيارات الزائر إلى مسار ضوئي على الشاشة المشتركة، فتجعل التقدم تجربة مرئية وجماعية.",
          },
          {
            step: "04",
            title: "خذ خطوتك التالية",
            description:
              "يستلم الزائر بطاقة هدف شخصية باللغتين عبر رمز QR، ثم يلتقط صورة تذكارية تحمل هويته وهدفه.",
          },
        ],
        experienceZones: [
          {
            name: "بوابة الأهداف",
            purpose: "جذب الزوار وتعريفهم بالتجربة",
            features: ["رسائل متحركة حول الأهداف", "نقطة استقبال يديرها المضيف"],
          },
          {
            name: "صانع المسار",
            purpose: "تقديم تجربة شخصية لكل زائر",
            features: ["محطتا شاشة لمس", "أسئلة قصيرة باللغتين"],
          },
          {
            name: "جدار المستقبل",
            purpose: "إظهار أثر مشاركة الزوار",
            features: ["عرض بصري على شاشة LED", "تجميع الأهداف دون بيانات شخصية"],
          },
          {
            name: "استوديو الخطوة القادمة",
            purpose: "تقديم تذكار رقمي وفرصة تواصل اختيارية",
            features: ["بطاقة هدف عبر QR", "إضاءة تصوير بهوية العلامة"],
          },
        ],
        interactiveExperiences: [
          {
            name: "صانع مسار الهدف",
            description:
              "ثلاثة أسئلة بسيطة تنشئ خطة أولية بمحطات واضحة وفق محتوى تعليمي معتمد.",
            technology: "تطبيق ويب متجاوب على شاشات لمس تجارية",
          },
          {
            name: "جدار المستقبل المشترك",
            description:
              "تضيف كل رحلة مكتملة مسارًا ضوئيًا إلى عرض حي يحفظ خصوصية الزوار.",
            technology: "شاشة LED تديرها لوحة تحكم محلية عبر المتصفح",
          },
          {
            name: "بطاقة الهدف الشخصية",
            description:
              "يحصل الزائر على ملخص قابل للمشاركة باللغتين يتضمن ثلاث خطوات عملية.",
            technology: "قالب رقمي يُنشأ تلقائيًا ويُسلّم عبر رمز QR",
          },
        ],
        engagementMechanics: [
          "إنجاز تدريجي عبر ثلاث خطوات",
          "عداد جماعي يحفظ خصوصية المشاركين",
          "تحدٍ يومي مرتبط بهدف مالي",
          "بطاقة رقمية اختيارية عبر QR",
        ],
        shareableMoments: [
          "صورة تذكارية يظهر فيها هدف الزائر",
          "لحظة الكشف عن المسار المتحرك",
          "بطاقة هدف شخصية باللغتين",
        ],
        expectedImpact: [
          "يجعل الثقافة المالية شخصية وقابلة للتطبيق",
          "يصنع نقطة جذب مرئية داخل المعرض",
          "يوفر تفاعلًا قابلًا للقياس دون جمع بيانات حساسة",
        ],
      } satisfies Experience;
    if (agentId === "designer") {
      const experience = c.experience!;
      return {
        selectedIdeaId: experience.selectedIdeaId,
        selectedIdeaName: experience.conceptName,
        designRationale: "توازن المسارات الثلاثة بين الجاذبية البصرية وسهولة التشغيل ضمن مساحة 6 × 6 أمتار؛ رُشّح المسار الأول لأنه يقدّم قيمة شخصية واضحة ولقطة رقمية قابلة للمشاركة.",
        boards: experience.ideas.map((idea) => ({
          ideaId: idea.id, ideaName: idea.name, title: `تصور ${idea.name}`, visualNarrative: idea.overview, materials: idea.id === "financial-garden" ? ["خشب طبيعي", "حجر رملي", "أخضر داكن"] : ["أسطح كحلية", "إضاءة LED", "تفاصيل هندسية"], layoutNotes: ["مسار حركة مفتوح من جهتين", "محطتا تفاعل", "منطقة عرض رئيسية"], renderPrompt: `تصور ثلاثي الأبعاد واقعي لجناح فعاليات سعودي باسم ${idea.name} ضمن مساحة 6 × 6 أمتار، ${idea.overview}، تصميم مفتوح من جهتين، إضاءة احترافية، شاشات لمس، دون شعارات أو نصوص مقروءة.`, cameraAngle: "منظور مرتفع بزاوية ثلاثة أرباع",
        })),
        productionNotes: ["التصور مرجعي وليس مخططًا هندسيًا.", "تؤكد الأبعاد النهائية بعد معاينة الموقع."],
        imageGenerationDisclaimer: "التصورات مولّدة لأغراض استكشاف التصميم فقط، ويجب اعتماد المخططات والمواد النهائية مع فريق الإنتاج والموقع.",
      } satisfies DesignPackage;
    }
    if (agentId === "architect")
      return {
        solutionOverview:
          "منظومة ويب تعمل محليًا لتشغيل محطتي لمس وشاشة عرض وأجهزة فريق التشغيل من وحدة تحكم صغيرة في الموقع، مع مزامنة سحابية اختيارية.",
        frontendRequirements: [
          "واجهة متجاوبة باللغتين تدعم RTL وLTR",
          "مسار موجّه من ثلاثة أسئلة",
          "شاشة جذب وإعادة ضبط تلقائية عند الخمول",
          "تباين واضح وأهداف لمس ميسرة",
          "لوحة تحكم للعرض البصري",
        ],
        backendRequirements: [
          "واجهة محلية لإدارة الجلسات",
          "مولد خطط قائم على قواعد معتمدة",
          "تجميع مجهول لبيانات التفاعل",
          "تصدير التحليلات بصيغة CSV",
          "فحص للحالة وأدوات تحكم للمشغل",
        ],
        aiRequirements: [
          "تخصيص لغوي اختياري ضمن محتوى معتمد",
          "قوالب بديلة ثابتة عند تعذر الاتصال",
          "منع تقديم نصائح مالية مفتوحة",
          "عدم إرسال بيانات شخصية حساسة إلى النموذج",
        ],
        hardwareRequirements: [
          "شاشتا لمس تجاريتان مقاس 43 بوصة",
          "شاشة LED واحدة مقاس 65 بوصة",
          "وحدة تحكم محلية صغيرة",
          "موجّه شبكة مُدار",
          "جهازان لوحيان لفريق التشغيل",
          "وحدة طاقة احتياطية وحماية للكابلات",
        ],
        integrations: [
          "ربط اختياري مع نظام إدارة علاقات العملاء بعد الموافقة",
          "تسليم النتيجة عبر البريد الإلكتروني أو QR",
          "لوحة تحليلات مجهولة البيانات",
        ],
        dataFlow: [
          "يختار الزائر هدفه وتفضيلاته",
          "تتحقق الواجهة المحلية من المدخلات",
          "ينشئ محرك القواعد محتوى المحطات",
          "يستقبل الجدار فئة الهدف دون هوية الزائر",
          "يمسح الزائر رمز QR وتُطلب الموافقة الاختيارية بصورة مستقلة",
          "تُصدّر المؤشرات المجمعة في نهاية كل يوم",
        ],
        staffingRequirements: [
          "مشغل تقني واحد عند الافتتاح وأوقات الذروة",
          "سفيران للعلامة التجارية",
          "مطور متاح للدعم عن بُعد",
        ],
        installationRequirements: [
          "اختبار تشغيلي مكثف لمدة يومين خارج الموقع",
          "يوم واحد للتركيب في الموقع",
          "معاينة الكهرباء والشبكة",
          "تثبيت آمن وإخفاء الكابلات",
          "اختبار المحتوى وخطة الاستمرارية قبل الافتتاح",
        ],
        operationalRequirements: [
          "قائمة فحص يومية عند بدء التشغيل",
          "وضع دون اتصال لجميع التفاعلات الأساسية",
          "مسح الجلسة تلقائيًا بعد الخمول",
          "تصدير مشفر للمؤشرات كل ليلة",
          "كابلات وجهاز إدخال احتياطيان في الموقع",
        ],
        dependencies: [
          "محتوى معتمد باللغتين",
          "المخططات النهائية للجناح",
          "تأكيد الكهرباء من إدارة الموقع",
          "حزمة أصول الهوية البصرية",
          "نصوص الخصوصية والموافقة",
        ],
        technicalRisks: [
          "عدم استقرار الاتصال في الموقع",
          "اختلال معايرة شاشات اللمس",
          "تراكم طوابير الانتظار وقت الذروة",
          "تأخر اعتماد المحتوى",
        ],
      } satisfies Architecture;
    if (agentId === "budget") {
      const rows: Array<[string, string, number, number, string]> = [
        [
          "التصميم الإبداعي",
          "تطوير الفكرة وتصميم تجربة المستخدم والمحتوى باللغتين",
          1,
          11500,
          "يضمن رحلة متماسكة بهوية العلامة ومحتوى جاهزًا للإنتاج.",
        ],
        [
          "تطوير البرمجيات",
          "تجربة اللمس والعرض البصري ولوحة التحكم ووضع عدم الاتصال",
          1,
          24000,
          "ينشئ منظومة تفاعلية قابلة لإعادة الاستخدام مع أدوات التحليل.",
        ],
        [
          "الأجهزة",
          "استئجار شاشات اللمس ووحدة التحكم والموجّه والملحقات",
          1,
          17500,
          "يدعم تفاعلًا موثوقًا وتشغيلًا محليًا مستقرًا.",
        ],
        [
          "التصنيع",
          "المناطق والكاونترات والتشطيبات البصرية وإخفاء الكابلات",
          1,
          22000,
          "ينشئ البيئة المكانية ضمن مساحة 6 × 6 أمتار.",
        ],
        [
          "التجهيزات السمعية والبصرية",
          "استئجار شاشة 65 بوصة ونظام صوت وإضاءة تصوير",
          1,
          9000,
          "يدعم العرض الموجّه للجمهور ولحظة التصوير القابلة للمشاركة.",
        ],
        [
          "التركيب",
          "التركيب التقني والربط والفك بعد الفعالية",
          1,
          7000,
          "يغطي الإعداد الآمن والتشغيل التجريبي وإزالة التجهيزات.",
        ],
        [
          "فريق التشغيل",
          "سفيران للعلامة ودعم تقني على مدى أربعة أيام",
          1,
          9000,
          "يحافظ على انسيابية الزوار واستمرارية التشغيل.",
        ],
        [
          "الخدمات اللوجستية",
          "النقل المحلي والمناولة والمواد الاستهلاكية",
          1,
          4500,
          "يغطي نقل الأجهزة والاحتياجات الأساسية في الموقع.",
        ],
        [
          "الاختبار",
          "ضمان الجودة ومراجعة المحتوى وتجربة المنظومة كاملة",
          1,
          3500,
          "يقلل مخاطر يوم الافتتاح عبر اختبار التجربة من البداية إلى النهاية.",
        ],
      ];
      const items = rows.map(
        ([category, description, quantity, unitCost, justification]) => ({
          category,
          description,
          quantity,
          unitCost,
          totalCost: quantity * unitCost,
          justification,
        }),
      );
      return {
        currency: "SAR",
        totalBudget: budget,
        budgetItems: items,
        subtotal: 108000,
        contingency: 9000,
        estimatedTotal: 117000,
        vatRate: 0.15,
        vatAmount: 17550,
        totalWithVat: 134550,
        budgetIncludesVat: b.budgetIncludesVat,
        remainingBudget: budget - 117000,
        timeline: [
          {
            phase: "الاكتشاف والمواءمة",
            duration: "الأسبوع الأول",
            owner: "قائد الاستراتيجية",
            activities: [
              "اعتماد المتطلبات",
              "مراجعة الموقع والهوية",
              "الاتفاق على مؤشرات النجاح",
            ],
          },
          {
            phase: "التصميم",
            duration: "الأسبوعان 2 و3",
            owner: "قائد الإبداع وتجربة المستخدم",
            activities: [
              "تصميم التجربة",
              "النموذج الأولي للواجهة",
              "المواصفات التقنية",
            ],
          },
          {
            phase: "التنفيذ",
            duration: "الأسبوعان 4 و5",
            owner: "القائد التقني",
            activities: [
              "تطوير البرمجيات",
              "التصنيع",
              "إنتاج المحتوى",
            ],
          },
          {
            phase: "الربط والاختبار",
            duration: "الأسبوع السادس",
            owner: "قائد التسليم",
            activities: [
              "ربط الأجهزة",
              "مراجعة المحتوى باللغتين",
              "اختبارات التحمل وعدم الاتصال",
            ],
          },
          {
            phase: "الإطلاق",
            duration: "أسبوع الفعالية",
            owner: "مدير الموقع",
            activities: [
              "التركيب",
              "تدريب الفريق",
              "التشغيل المباشر",
              "التقرير اليومي",
            ],
          },
        ],
        milestones: [
          "اعتماد المتطلبات",
          "اعتماد النموذج الأولي",
          "إغلاق المحتوى",
          "اختبار القبول قبل الشحن",
          "تسليم الموقع",
        ],
        requiredTeam: [
          "قائد استراتيجية",
          "مصمم إبداع وتجربة مستخدم",
          "مطور شامل",
          "فني سمعيات وبصريات",
          "مشرف تصنيع",
          "مدير موقع",
          "سفيران للعلامة التجارية",
        ],
        costSavingOptions: [
          "دمج إضاءة التصوير ضمن إضاءة الجناح",
          "استخدام أجهزة لوحية يملكها العميل للتحكم",
          "إعادة استخدام هياكل العرض المعيارية في فعاليات لاحقة",
        ],
        uncertaintyWarning:
          "هذا تقدير تخطيطي يفترض توافر معدات الإيجار وخدمات الموقع؛ يجب التحقق منه بعروض أسعار قبل التعاقد.",
      } satisfies BudgetPlan;
    }
    if (agentId === "reviewer")
      return {
        decision: c.revision ? "PASS" : "REVISE",
        overallScore: c.revision ? 92 : 84,
        scoreBreakdown: {
          "Requirement coverage": 94,
          Creativity: 92,
          Feasibility: c.revision ? 91 : 82,
          "Budget accuracy": 95,
          "Technical clarity": c.revision ? 90 : 80,
          "Visitor value": 93,
          "Client value": 91,
          "Presentation quality": 90,
        },
        strengths: [
          "ارتباط قوي بين الثقافة المالية والهدف الشخصي للزائر",
          "رحلة واضحة وقابلة للقياس",
          "الميزانية ضمن السقف المحدد وتشمل احتياطيًا",
          "التشغيل المحلي يقلل الاعتماد على اتصال الموقع",
        ],
        issues: c.revision
          ? []
          : [
              "يحتاج دور الذكاء الاصطناعي إلى ضوابط سلامة أوضح",
              "إدارة الطوابير وقت الذروة غير محددة بما يكفي",
            ],
        contradictions: [],
        budgetConcerns: [],
        feasibilityConcerns: c.revision
          ? []
          : [
              "قد يُفهم التخصيص الاختياري على أنه نصيحة مالية ما لم يُحصر ضمن محتوى معتمد",
            ],
        missingItems: c.revision
          ? []
          : ["مسار سريع وبديل يدوي واضحان لأوقات الذروة"],
        revisionInstructions: c.revision
          ? []
          : [
              {
                agentId: "architect",
                instruction:
                  "اجعل التخصيص قائمًا على قوالب معتمدة، وأضف ضوابط تمنع تقديم نصائح مالية، وحدد مسارًا سريعًا يعمل يدويًا ودون اتصال.",
              },
              {
                agentId: "experience",
                instruction:
                  "أضف رحلة مختصرة مدتها دقيقتان لأوقات الذروة، مع بديل يديره المضيف.",
              },
            ],
      } satisfies Review;
    if (agentId === "proposal") {
      const req = c.requirements!;
      const exp = c.experience!;
      const arch = c.architecture!;
      const plan = c.budget!;
      return {
        title: `${exp.conceptName} — ${client} في ${event}`,
        subtitle: exp.conceptTagline,
        executiveSummary: `يستطيع ${client} تحويل الثقافة المالية إلى تجربة شخصية وحيوية للمهنيين الشباب. يقود مفهوم «${exp.conceptName}» كل زائر من طموحه إلى خطوة عملية، ثم يعرض رحلته بصريًا على جدار رقمي مشترك. صُممت التجربة لمساحة ${req.space}، وتعمل بثبات دون اتصال دائم بالإنترنت، وتبلغ تكلفتها التقديرية ${plan.estimatedTotal.toLocaleString("ar-SA")} ر.س شاملة الاحتياطي.`,
        challenge:
          "غالبًا ما يبدو التثقيف المالي عامًا وبعيدًا عن احتياجات الفرد، بينما يتوقع زائر الفعالية قيمة فورية وسببًا واضحًا للمشاركة. لذلك يجب أن تكون التجربة سريعة ومفيدة ومرئية وموثوقة ضمن مساحة محدودة.",
        proposedSolution: exp.conceptOverview,
        concept: {
          name: exp.conceptName,
          tagline: exp.conceptTagline,
          overview: exp.creativeRationale,
        },
        visitorJourney: exp.visitorJourney,
        experienceHighlights: exp.interactiveExperiences.map((x) => ({
          title: x.name,
          description: `${x.description} ${x.technology}.`,
        })),
        technicalPlan: {
          overview: arch.solutionOverview,
          requirements: [
            ...arch.frontendRequirements.slice(0, 3),
            ...arch.operationalRequirements.slice(0, 3),
          ],
        },
        budgetSummary: {
          currency: "SAR",
          total: plan.estimatedTotal,
          contingency: plan.contingency,
          vatAmount: plan.vatAmount,
          totalWithVat: plan.totalWithVat,
          budgetIncludesVat: plan.budgetIncludesVat,
          remaining: plan.remainingBudget,
          items: plan.budgetItems,
        },
        implementationTimeline: plan.timeline,
        risksAndMitigations: [
          {
            risk: "عدم استقرار الاتصال في الموقع",
            mitigation:
              "تشغيل جميع التفاعلات الأساسية والعرض البصري محليًا، وقصر المزامنة على الخدمات الاختيارية.",
          },
          {
            risk: "ازدحام الطوابير وقت الذروة",
            mitigation:
              "استخدام محطتين ومسار مختصر مدته دقيقتان، مع بطاقات أهداف يديرها المضيف كبديل يدوي.",
          },
          {
            risk: "الالتباس بين التثقيف والنصيحة المالية",
            mitigation:
              "استخدام قوالب تعليمية معتمدة وتنبيهات واضحة، ومنع أي توصيات شخصية بالمنتجات المالية.",
          },
          {
            risk: "تأخر اعتماد المحتوى",
            mitigation:
              "اعتماد القوالب القابلة لإعادة الاستخدام مبكرًا وتحديد موعد رسمي لإغلاق المحتوى.",
          },
        ],
        successMetrics: req.successCriteria,
        nextSteps: [
          "تأكيد خدمات الموقع والمساحة النهائية",
          "اعتماد الفكرة ونهج المحتوى باللغتين",
          "مراجعة الخصوصية ومسار الموافقة على التواصل",
          "طلب عروض أسعار الإنتاج واعتماد جدول التسليم",
        ],
        closingStatement:
          "يمنح «مستقبلك في الصورة» كل زائر ما هو أبقى من الهدية الترويجية: خطوة أولى واضحة نحو هدف يعني له الكثير.",
      } satisfies Proposal;
    }
    throw new Error(`وكيل تجريبي غير معروف: ${agentId}`);
  }
}
