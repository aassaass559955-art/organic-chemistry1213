import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import bcrypt from "bcryptjs";
import {
  users,
  researchers,
  categories,
  tags,
  articles,
  articleTags,
  topics,
  reactions,
  books,
  notifications,
  stats,
} from "./schema";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
  const existing = await db.select().from(articles).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded — skipping.");
    await pool.end();
    return;
  }

  console.log("Seeding database...");

  /* Admin user */
  const adminEmail = process.env.ADMIN_EMAIL || "admin@organic-chemistry.site";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hash = await bcrypt.hash(adminPassword, 10);
  await db.insert(users).values([
    { name: "مرتضى عوض", email: adminEmail, passwordHash: hash, role: "ADMIN" },
  ]);

  /* Researcher */
  await db.insert(researchers).values([
    {
      name: "مرتضى عوض",
      nameEn: "Murtada Awad",
      title: "باحث في الكيمياء العضوية",
      titleEn: "Organic Chemistry Researcher",
      bio: "باحث متخصص في الكيمياء العضوية والاصطناع العضوي، مهتم بتطوير طرق اصطناع خضراء ومستدامة للمركبات الحلقية غير المتجانسة ذات الفعالية الحيوية، ودراسة آليات التفاعلات العضوية باستخدام الأساليب الحسابية الحديثة. نشر العديد من البحوث والدراسات المحكّمة، ويشرف على هذه المنصة لنشر المعرفة الكيميائية باللغتين العربية والإنجليزية.",
      bioEn:
        "A researcher specialized in organic chemistry and organic synthesis, focused on developing green and sustainable synthetic methods for biologically active heterocyclic compounds, and studying reaction mechanisms using modern computational approaches. He has published several peer-reviewed papers and curates this platform to share chemical knowledge in Arabic and English.",
      university: "قسم الكيمياء — كلية العلوم",
      avatarUrl: "/images/researcher.png",
      email: "murtada@organic-chemistry.site",
      orcid: "0000-0002-1825-0097",
      achievements: [
        "نشر أكثر من 15 بحثاً علمياً محكّماً في الكيمياء العضوية",
        "تطوير طريقة اصطناع خضراء لمشتقات البنزيميدازول",
        "المشاركة في مؤتمرات علمية دولية في الكيمياء العضوية",
        "تأليف مرجع تعليمي مبسّط في أساسيات الكيمياء العضوية",
        "الإشراف على رسائل جامعية في الاصطناع العضوي",
      ],
      achievementsEn: [
        "Published 15+ peer-reviewed papers in organic chemistry",
        "Developed a green synthetic route to benzimidazole derivatives",
        "Presented at international organic chemistry conferences",
        "Authored an introductory organic chemistry reference",
        "Supervised graduate theses in organic synthesis",
      ],
    },
  ]);

  /* Categories */
  const cats = await db
    .insert(categories)
    .values([
      { nameAr: "الاصطناع العضوي", nameEn: "Organic Synthesis", slug: "organic-synthesis" },
      { nameAr: "الكيمياء الدوائية", nameEn: "Medicinal Chemistry", slug: "medicinal-chemistry" },
      { nameAr: "الحلقات غير المتجانسة", nameEn: "Heterocyclic Chemistry", slug: "heterocyclic" },
      { nameAr: "التحليل الطيفي", nameEn: "Spectroscopy", slug: "spectroscopy" },
      { nameAr: "الحفز العضوي", nameEn: "Organocatalysis", slug: "organocatalysis" },
      { nameAr: "كيمياء البوليمرات", nameEn: "Polymer Chemistry", slug: "polymers" },
    ])
    .returning();

  const catId = (slug: string): string | null => cats.find((c) => c.slug === slug)?.id ?? null;

  /* Tags */
  const tg = await db
    .insert(tags)
    .values([
      { nameAr: "رنين مغناطيسي نووي", nameEn: "NMR", slug: "nmr" },
      { nameAr: "أشعة تحت حمراء", nameEn: "IR", slug: "ir" },
      { nameAr: "أروماتية", nameEn: "Aromaticity", slug: "aromaticity" },
      { nameAr: "تفاعل ألدول", nameEn: "Aldol", slug: "aldol" },
      { nameAr: "كاشف غرينيارد", nameEn: "Grignard", slug: "grignard" },
      { nameAr: "ستيريوكيمياء", nameEn: "Stereochemistry", slug: "stereochemistry" },
      { nameAr: "كيمياء خضراء", nameEn: "Green Chemistry", slug: "green-chemistry" },
      { nameAr: "آليات التفاعل", nameEn: "Mechanisms", slug: "mechanisms" },
    ])
    .returning();

  /* Articles */
  const arts = await db
    .insert(articles)
    .values([
      {
        type: "RESEARCH",
        slug: "benzimidazole-derivatives-antibacterial",
        titleAr: "اصطناع مشتقات بنزيميدازول جديدة وتقييم فعاليتها المضادة للبكتيريا",
        titleEn: "Synthesis of Novel Benzimidazole Derivatives and Evaluation of Their Antibacterial Activity",
        abstractAr:
          "تتناول هذه الدراسة اصطناع سلسلة جديدة من مشتقات البنزيميدازول عبر تكثيف داي أمينات الفينيلين مع ألدهيدات أروماتية مختلفة في ظروف حفزية خضراء. شُخّصت المركبات الناتجة بتقنيات IR و 1H-NMR و 13C-NMR، وقُيّمت فعاليتها المضادة للبكتيريا الموجبة والسالبة لصبغة غرام، وأظهرت عدّة مركبات تثبيطاً معنوياً مقارنة بالمرجع القياسي.",
        abstractEn:
          "This study reports the synthesis of a novel series of benzimidazole derivatives via condensation of phenylenediamines with aromatic aldehydes under green catalytic conditions. The products were characterized by IR, 1H-NMR and 13C-NMR, and evaluated against Gram-positive and Gram-negative bacteria, showing significant inhibition compared with the standard.",
        contentAr:
          "المقدمة: تُعدّ الحلقات غير المتجانسة النتروجينية من أهم الوحدات البنيوية في الكيمياء الدوائية...\nالمنهجية: جرى تكثيف او-فينيلين داي أمين مع الألدهيدات الأروماتية بنسب مولية 1:1 في الإيثانول بوجود حمض الخليك كمحفز...\nالنتائج: تراوحت المردودات بين 72–91%، وأظهر المركب 4c أعلى فعالية ضد Staphylococcus aureus بمنطقة تثبيط 22 ملم...\nالخلاصة: تفتح هذه النتائج آفاقاً لتطوير مضادات بكتيرية جديدة مبنية على هيكل البنزيميدازول.",
        contentEn:
          "Introduction: Nitrogen heterocycles are among the most important scaffolds in medicinal chemistry...\nMethods: o-Phenylenediamine was condensed with aromatic aldehydes (1:1) in ethanol with acetic acid as catalyst...\nResults: Yields ranged 72–91%; compound 4c showed the highest activity against S. aureus (22 mm zone)...\nConclusion: These findings open avenues toward new benzimidazole-based antibacterials.",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        university: "جامعة بغداد — كلية العلوم",
        universityEn: "University of Baghdad — College of Science",
        year: 2024,
        keywords: ["بنزيميدازول", "مضاد بكتيري", "اصطناع عضوي", "حلقات غير متجانسة"],
        attachments: [
          { name: "benzimidazole-research.pdf", url: "/uploads/sample-research.pdf", size: 245760, mime: "application/pdf" },
        ],
        categoryId: catId("heterocyclic"),
        featured: true,
        views: 1840,
        downloads: 432,
      },
      {
        type: "RESEARCH",
        slug: "organocatalytic-aldol-small-molecules",
        titleAr: "تحفيز تفاعل ألدول التكثيفي باستخدام محفزات عضوية صغيرة الجزيء",
        titleEn: "Organocatalytic Aldol Condensation Using Small-Molecule Catalysts",
        abstractAr:
          "حقّقنا تفاعل ألدول تكثيفي غير متماثل باستخدام مشتقات البرولين كمحفزات عضوية، بنسب تماثلية فائقة وصلت إلى 94% ee. تناول البحث تأثير المذيب ودرجة الحرارة وبنية المحفز على الفعالية والانتقائية الفراغية، وقدّم نموذج آلية انتقال عبر حالة انتقالية من نوع زيمرمان–تراكسلر.",
        abstractEn:
          "An asymmetric aldol condensation was achieved using proline-derived organocatalysts with enantiomeric excess up to 94% ee. Solvent, temperature and catalyst-structure effects were investigated, and a Zimmerman–Traxler-type transition-state model was proposed.",
        contentAr:
          "يعتبر تفاعل ألدول من أهم تفاعلات تكوين روابط الكربون–كربون...\nاستخدم البرولين ومشتقاته كمحفزات بتراكيز 10–20 مول%...\nأعطى المحفز الحاوي على مجموعة هيدروكسيل طرفية أفضل النتائج...\nجرى تأكيد البنية الفراغية بالرنين النووي المغناطيسي والأشعة السينية.",
        contentEn:
          "The aldol reaction is a cornerstone of carbon–carbon bond formation...\nProline derivatives were screened at 10–20 mol% loading...\nA terminal hydroxyl-bearing catalyst gave the best results...\nAbsolute configuration was confirmed by NMR and X-ray analysis.",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        university: "جامعة الموصل — كلية العلوم",
        universityEn: "University of Mosul — College of Science",
        year: 2023,
        keywords: ["تفاعل ألدول", "حفز عضوي", "برولين", "انتقائية فراغية"],
        attachments: [
          { name: "aldol-organocatalysis.pdf", url: "/uploads/sample-research.pdf", size: 198540, mime: "application/pdf" },
        ],
        categoryId: catId("organocatalysis"),
        featured: true,
        views: 1245,
        downloads: 318,
      },
      {
        type: "RESEARCH",
        slug: "quinoline-heterocycles-spectroscopic",
        titleAr: "تخليق مركبات حلقية غير متجانسة مشتقة من الكينولين وتشخيصها الطيفي",
        titleEn: "Synthesis and Spectroscopic Characterization of Quinoline-Derived Heterocycles",
        abstractAr:
          "اصطُنعت مشتقات كينولين جديدة عبر تفاعل سكراوب المعدّل، ودُرست خصائصها الطيفية المرئية–الفوق بنفسجية وسلوكها الفلوري. أظهرت المركبات انزياحات باثوكرومية مع رافع الإلكترونات، ما يرشّحها للاستخدام كمتحسسات بصرية.",
        abstractEn:
          "Novel quinoline derivatives were synthesized via a modified Skraup reaction. Their UV–Vis and fluorescence behavior was studied; electron-donating substituents induced bathochromic shifts, suggesting potential as optical sensors.",
        contentAr:
          "الكينولين وحدة بنيوية حاضرة في العديد من الأدوية...\nاعتمد تفاعل سكراوب المعدل بظروف ألطف...\nسُجلت أطياف الامتصاص والانبعاث في مذيبات مختلفة القطبية...",
        contentEn:
          "Quinoline is a privileged scaffold in drug discovery...\nA milder modified Skraup protocol was employed...\nAbsorption and emission spectra were recorded in solvents of varying polarity...",
        authorName: "أحمد الجبوري",
        authorNameEn: "Ahmed Al-Jubouri",
        university: "جامعة البصرة — كلية العلوم",
        universityEn: "University of Basra — College of Science",
        year: 2023,
        keywords: ["كينولين", "فلورة", "تحليل طيفي"],
        attachments: [],
        categoryId: catId("heterocyclic"),
        views: 980,
        downloads: 205,
      },
      {
        type: "RESEARCH",
        slug: "green-oxidation-alcohols-h2o2",
        titleAr: "طريقة خضراء لأكسدة الكحولات إلى كربونيلات باستخدام بيروكسيد الهيدروجين",
        titleEn: "A Green Method for Oxidation of Alcohols to Carbonyls Using Hydrogen Peroxide",
        abstractAr:
          "طُوّرت منظومة أكسدة صديقة بالبيئة تعتمد H₂O₂ مع محفز فلزي رخيص لتحويل الكحولات الأولية والثانوية إلى ألدهيدات وكيتونات بمردود عالٍ دون نواتج جانبية سامة. قورنت الطريقة بأساليب الأكسدة التقليدية من حيث الأخضرارية والاقتصاد الذري.",
        abstractEn:
          "An environmentally benign oxidation system based on H₂O₂ and an inexpensive metal catalyst converts primary and secondary alcohols to aldehydes and ketones in high yield without toxic byproducts. Green metrics were compared with classical oxidants.",
        contentAr:
          "تُعد أكسدة الكحولات من أكثر التحولات استخداماً في الاصطناع العضوي...\nبلغ الاقتصاد الذري للطريقة 87% مقارنة بـ 45% لمؤكسدات الكروم...",
        contentEn:
          "Alcohol oxidation is among the most used transformations in synthesis...\nThe atom economy reached 87% vs 45% for chromium reagents...",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        university: "جامعة بغداد — كلية العلوم",
        universityEn: "University of Baghdad — College of Science",
        year: 2022,
        keywords: ["كيمياء خضراء", "أكسدة", "بيروكسيد الهيدروجين"],
        attachments: [
          { name: "green-oxidation.docx", url: "/uploads/sample-research.pdf", size: 156300, mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        ],
        categoryId: catId("organic-synthesis"),
        views: 1678,
        downloads: 390,
      },
      {
        type: "RESEARCH",
        slug: "chitosan-polymer-drug-delivery",
        titleAr: "تحضير بوليمرات حيوية مشتقة من الكيتوزان لأغراض تسليم الدواء",
        titleEn: "Preparation of Chitosan-Derived Biopolymers for Drug Delivery Applications",
        abstractAr:
          "حُضّرت مشتقات كيتوزان محسّنة الذوبانية عبر تفاعل شيف بيز مع ألدهيدات وظيفية ثم اختزالها، ودُرست قدرتها على تغليف دواء نموذجي وإطلاقه المتحكم به في وسطين مختلفي الحمضية. بينت النتائج كفاءة تغليف 78% وإطلاقاً مستداماً خلال 24 ساعة.",
        abstractEn:
          "Solubility-enhanced chitosan derivatives were prepared via Schiff-base formation with functional aldehydes followed by reduction. Encapsulation of a model drug reached 78% with sustained release over 24 h in two pH media.",
        contentAr:
          "الكيتوزان بوليمر حيوي متوافق حيوياً وقابل للتحلل...\nقيس الإطلاق الدوائي طيفياً عند الطول الموجي الأقصى للدواء...",
        contentEn:
          "Chitosan is a biocompatible, biodegradable biopolymer...\nDrug release was monitored spectrophotometrically at λmax...",
        authorName: "سارة الخالدي",
        authorNameEn: "Sara Al-Khalidi",
        university: "الجامعة المستنصرية — كلية العلوم",
        universityEn: "Al-Mustansiriyah University — College of Science",
        year: 2024,
        keywords: ["كيتوزان", "بوليمر حيوي", "تسليم دوائي"],
        attachments: [],
        categoryId: catId("polymers"),
        views: 845,
        downloads: 167,
      },
      {
        type: "STUDY",
        slug: "dft-benzene-tautomers-stability",
        titleAr: "دراسة نظرية باستخدام نظرية الكثافة الوظيفية DFT لثباتية متماكبات مشتقات البنزين",
        titleEn: "A DFT Theoretical Study on the Stability of Substituted Benzene Tautomers",
        abstractAr:
          "نُفّذت حسابات DFT بمستوى B3LYP/6-311++G(d,p) لدراسة الطاقات النسبية لمتماكبات مشتقات البنزين الهيدروكسية، وتحليل المدارات الحدودية HOMO/LUMO وخرائط الجهد الكهروستاتيكي لفهم إعادة التوزيع الإلكتروني وتأثير الروابط الهيدروجينية الداخلية في الثباتية.",
        abstractEn:
          "DFT calculations at B3LYP/6-311++G(d,p) were performed to evaluate relative tautomers' energies of hydroxy-substituted benzenes. Frontier orbitals and electrostatic potential maps were analyzed to rationalize intramolecular hydrogen-bond stabilization.",
        contentAr:
          "المتماكبة ظاهرة أساسية في الكيمياء العضوية تؤثر في الفعالية الحيوية...\nأظهرت المتماكبات الكيتونية ثباتية أعلى بمقدار 8–12 كيلوكالوري/مول...",
        contentEn:
          "Tautomerism strongly influences biological activity...\nKeto tautomers were 8–12 kcal/mol more stable...",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        university: "جامعة بغداد — كلية العلوم",
        universityEn: "University of Baghdad — College of Science",
        year: 2023,
        keywords: ["DFT", "متماكبة", "كيمياء حسابية", "HOMO/LUMO"],
        attachments: [],
        categoryId: catId("spectroscopy"),
        featured: true,
        views: 1120,
        downloads: 244,
      },
      {
        type: "STUDY",
        slug: "chalcone-uv-antioxidant-study",
        titleAr: "دراسة طيفية ومضادة للأكسدة لمركبات التشالكون المشتقة من الأسيتوفينون",
        titleEn: "Spectroscopic and Antioxidant Study of Acetophenone-Derived Chalcones",
        abstractAr:
          "دُرست الخصائص الطيفية (UV-Vis, FT-IR) لسلسلة تشالكونات محضّرة بتكثيف ألدول قاعدي، وقيس نشاطها الماسح للجذور الحرة بطريقة DPPH. ارتبط النشاط بوجود مجموعات هيدروكسيل متجاورة على الحلقة B.",
        abstractEn:
          "UV-Vis and FT-IR properties of base-catalyzed aldol-derived chalcones were studied, and DPPH radical-scavenging activity was measured. Activity correlated with vicinal hydroxyl groups on ring B.",
        contentAr:
          "التشالكونات واسطة اصطناعية مهمة ومركبات فعالة حيوياً...\nبلغت نسبة المسح للمركب Ch3 حوالي 82% عند تركيز 100 ميكروغرام/مل...",
        contentEn:
          "Chalcones are versatile synthetic intermediates and bioactive compounds...\nCompound Ch3 scavenged 82% of DPPH at 100 µg/mL...",
        authorName: "عمر الحمداني",
        authorNameEn: "Omar Al-Hamdani",
        university: "جامعة تكريت — كلية العلوم",
        universityEn: "Tikrit University — College of Science",
        year: 2022,
        keywords: ["تشالكون", "مضاد أكسدة", "DPPH"],
        attachments: [],
        categoryId: catId("medicinal-chemistry"),
        views: 720,
        downloads: 150,
      },
      {
        type: "STUDY",
        slug: "solvent-effects-kinetics-esterification",
        titleAr: "دراسة حركية لتأثير المذيبات على سرعة تفاعل الاسترة الحمضية",
        titleEn: "Kinetic Study of Solvent Effects on Acid-Catalyzed Esterification Rates",
        abstractAr:
          "تتبّعت الدراسة حركية استرة حمض الخليك مع الإيثانول بوجود H₂SO₄ في مذيبات مختلفة القطبية، وحُسبت ثوابت السرعة وطاقات التنشيط بطريقة أرهينيوس. ازدادت السرعة في المذيبات قليلة القطبية اتساقاً مع استقرار حالة الانتقال.",
        abstractEn:
          "The kinetics of acetic acid esterification with ethanol over H₂SO₄ were followed in solvents of varying polarity. Rate constants and Arrhenius activation energies were computed; rates increased in low-polarity media consistent with transition-state stabilization.",
        contentAr:
          "الاسترة تفاعل انعكاسي كلاسيكي في الكيمياء العضوية...\nتراوحت طاقة التنشيط بين 45–58 كيلوجول/مول حسب المذيب...",
        contentEn:
          "Esterification is a classical reversible organic reaction...\nActivation energies ranged 45–58 kJ/mol depending on solvent...",
        authorName: "لينا الشمري",
        authorNameEn: "Lina Al-Shammari",
        university: "الجامعة التكنولوجية — قسم الكيمياء",
        universityEn: "University of Technology — Chemistry Dept.",
        year: 2021,
        keywords: ["حركية", "استرة", "طاقة تنشيط"],
        attachments: [],
        categoryId: catId("organic-synthesis"),
        views: 640,
        downloads: 121,
      },
      {
        type: "THESIS",
        slug: "phd-thesis-heterocyclic-synthesis",
        titleAr: "أطروحة دكتوراه: اصطناع وتشخيص مركبات حلقية غير متجانسة جديدة ذات فعالية حيوية متوقعة",
        titleEn: "PhD Thesis: Synthesis and Characterization of Novel Heterocyclic Compounds with Expected Biological Activity",
        abstractAr:
          "تناولت الأطروحة تصميم واصطناع أكثر من أربعين مركباً حلقياً غير متجانساً جديداً انطلاقاً من وحدات بناء بسيطة، مع توظيف تفاعلات إغلاق الحلقة المختلفة، وتقييم أولي للفعالية المضادة للميكروبات ومقارنة النتائج بالحسابات النظرية.",
        abstractEn:
          "The thesis covers the design and synthesis of over forty novel heterocycles from simple building blocks using diverse cyclization strategies, with preliminary antimicrobial evaluation supported by computational studies.",
        contentAr:
          "الفصل الأول: مراجعة أدبية شاملة...\nالفصل الثاني: المنهجية والأجهزة...\nالفصل الثالث: الاصطناع والتشخيص...\nالفصل الرابع: التقييم الحيوي والحسابات النظرية...",
        contentEn:
          "Chapter 1: Literature review...\nChapter 2: Methodology...\nChapter 3: Synthesis and characterization...\nChapter 4: Biological evaluation and computation...",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        university: "جامعة بغداد — كلية العلوم",
        universityEn: "University of Baghdad — College of Science",
        supervisor: "أ.د. عبدالرحمن السامرائي",
        year: 2021,
        keywords: ["أطروحة دكتوراه", "حلقات غير متجانسة", "فعالية حيوية"],
        attachments: [
          { name: "phd-thesis-full.pdf", url: "/uploads/sample-research.pdf", size: 3452160, mime: "application/pdf" },
          { name: "thesis-defense.pptx", url: "/uploads/sample-research.pdf", size: 1126400, mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
        ],
        categoryId: catId("heterocyclic"),
        featured: true,
        views: 2140,
        downloads: 512,
      },
      {
        type: "THESIS",
        slug: "msc-thesis-natural-products-extraction",
        titleAr: "رسالة ماجستير: استخلاص وتشخيص المركبات العضوية الفعالة من بعض النباتات الطبية",
        titleEn: "MSc Thesis: Extraction and Characterization of Bioactive Organic Compounds from Selected Medicinal Plants",
        abstractAr:
          "شملت الرسالة استخلاص المواد الفعالة من ثلاثة نباتات طبية محلية بمذيبات متدرجة القطبية، وفصل المكونات بالكروماتوغرافيا العمودية، وتشخيصها بالأطياف، وتقييم فعاليتها المضادة للأكسدة والميكروبات.",
        abstractEn:
          "Bioactive constituents of three local medicinal plants were extracted with solvents of graded polarity, separated by column chromatography, characterized spectroscopically, and screened for antioxidant and antimicrobial activity.",
        contentAr: "اعتمدت الرسالة تقنيات الاستخلاص بالتصفح والتقطير بالبخار...\nعزل مركب فلافونويدي نقي بوفرة 0.8% من المادة الجافة...",
        contentEn: "Maceration and steam distillation were employed...\nA pure flavonoid was isolated at 0.8% of dry weight...",
        authorName: "حسن العنازي",
        authorNameEn: "Hasan Al-Anazi",
        university: "جامعة الأنبار — كلية العلوم",
        universityEn: "University of Anbar — College of Science",
        supervisor: "أ.م.د. وفاء المشهداني",
        year: 2022,
        keywords: ["منتجات طبيعية", "استخلاص", "كروماتوغرافيا"],
        attachments: [
          { name: "msc-thesis.pdf", url: "/uploads/sample-research.pdf", size: 2846720, mime: "application/pdf" },
        ],
        categoryId: catId("medicinal-chemistry"),
        views: 1530,
        downloads: 478,
      },
      {
        type: "THESIS",
        slug: "msc-thesis-microwave-synthesis",
        titleAr: "رسالة ماجستير: توظيف تقنية المايكروويف في الاصطناع العضوي السريع",
        titleEn: "MSc Thesis: Microwave-Assisted Rapid Organic Synthesis",
        abstractAr:
          "درست الرسالة تأثير تشعيع المايكروويف في تسريع تفاعلات التكثيف وإغلاق الحلقة مقارنة بالتسخين التقليدي، إذ انخفضت أزمنة التفاعلات من ساعات إلى دقائق مع تحسّن المردود وتقليل استهلاك المذيبات.",
        abstractEn:
          "Microwave irradiation dramatically accelerated condensation and cyclization reactions versus conventional heating: reaction times dropped from hours to minutes with improved yields and reduced solvent consumption.",
        contentAr: "قورنت عشرون تفاعلاً نموذجياً بين الطريقتين...\nخُفض الزمن بمعدل 40 ضعفاً مع زيادة المردود 15%...",
        contentEn: "Twenty model reactions were compared...\nTimes shortened ~40-fold with 15% yield gains...",
        authorName: "زينب التميمي",
        authorNameEn: "Zainab Al-Tamimi",
        university: "جامعة بابل — كلية العلوم",
        universityEn: "University of Babylon — College of Science",
        supervisor: "أ.د. كاظم الحلي",
        year: 2023,
        keywords: ["مايكروويف", "اصطناع سريع", "كيمياء خضراء"],
        attachments: [],
        categoryId: catId("organic-synthesis"),
        views: 890,
        downloads: 234,
      },
      {
        type: "ARTICLE",
        slug: "intro-organic-chemistry-basics",
        titleAr: "مقدمة في الكيمياء العضوية: المفاهيم الأساسية التي يجب أن تعرفها",
        titleEn: "Introduction to Organic Chemistry: The Fundamental Concepts You Must Know",
        abstractAr:
          "مقال تعليمي شامل يشرح لماذا يُعد الكربون عنصراً فريداً، ويتناول التهجين، وأنواع الروابط، والمجاميع الوظيفية، مع أمثلة حياتية تربط الكيمياء العضوية بالأدوية والبلاستيك والغذاء.",
        abstractEn:
          "A comprehensive tutorial explaining why carbon is unique, covering hybridization, bond types, and functional groups, with real-life links to medicines, plastics, and food.",
        contentAr:
          "الكيمياء العضوية هي كيمياء مركبات الكربون...\nالتهجين: تندمج المدارات الذرية لتكوين مدارات متهجنة sp3 وsp2 وsp...\nالمجاميع الوظيفية: تحدد السلوك الكيميائي للجزيء، مثل الهيدروكسيل –OH والكربونيل C=O...\nالصيغ البنائية: تُرسم الروابط وفق قيمة التكافؤ...\nأمثلة: الإيثانول C₂H₅OH، حمض الخليك CH₃COOH.",
        contentEn:
          "Organic chemistry is the chemistry of carbon compounds...\nHybridization: atomic orbitals mix into sp3, sp2, and sp hybrids...\nFunctional groups define reactivity: –OH, C=O, COOH...\nStructural formulas follow valence rules...",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        year: 2024,
        keywords: ["أساسيات", "تهجين", "مجاميع وظيفية"],
        attachments: [],
        categoryId: catId("organic-synthesis"),
        views: 3240,
        downloads: 0,
      },
      {
        type: "ARTICLE",
        slug: "aromaticity-huckel-rule-explained",
        titleAr: "الأروماتية وقاعدة هوكل: متى يكون المركب أروماتياً؟",
        titleEn: "Aromaticity and Hückel's Rule: When Is a Compound Aromatic?",
        abstractAr:
          "شرح مبسّط لمعايير الأروماتية الأربعة: الحلقية، الاستوائية، النظام المتقارن المستمر، وقاعدة 4n+2 لإلكترونات π، مع أمثلة على البنزين والسيكلوأوكتاتيترايين والحلقات غير المتجانسة الأروماتية.",
        abstractEn:
          "A clear explanation of the four aromaticity criteria: cyclic, planar, fully conjugated, and 4n+2 π-electrons, with examples from benzene, cyclooctatetraene, and aromatic heterocycles.",
        contentAr:
          "تتميز المركبات الأروماتية بثباتية استثنائية ناتجة عن عدم تمركز الإلكترونات...\nقاعدة هوكل: يجب أن يكون عدد إلكترونات π مساوياً 4n+2 حيث n عدد صحيح...\nالبنزين: 6 إلكترونات π (n=1) → أروماتي.\nالسيكلوبيوتاديين: 4 إلكترونات → ضد أروماتي وغير مستقر.",
        contentEn:
          "Aromatic compounds exhibit exceptional stability from electron delocalization...\nHückel's rule: π-electrons must equal 4n+2...\nBenzene: 6 π (n=1) aromatic; cyclobutadiene: 4 π antiaromatic.",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        year: 2024,
        keywords: ["أروماتية", "قاعدة هوكل", "بنزين"],
        attachments: [],
        categoryId: catId("organic-synthesis"),
        views: 2780,
        downloads: 0,
      },
      {
        type: "ARTICLE",
        slug: "stereochemistry-optical-activity",
        titleAr: "الستيريوكيمياء والنشاط الضوئي: عالم الجزيئات المتطابقة اليد",
        titleEn: "Stereochemistry and Optical Activity: The World of Handed Molecules",
        abstractAr:
          "يتناول المقال مفاهيم التماثل اليدوي (Chirality) والمتماكبات الفراغية Enantiomers، وقاعدة R/S للتسمية، وأهمية الستيريوكيمياء في الصيدلة — حين يكون أحد المتماكبين دواءً والآخر سمّاً.",
        abstractEn:
          "Covers chirality, enantiomers, the R/S convention, and why stereochemistry matters in pharmacy — when one enantiomer is a medicine and its mirror image a poison.",
        contentAr:
          "الكربون غير المتماثل: ذرة كربون مرتبطة بأربع مجاميع مختلفة...\nالمتماكبات الفراغية تدير مستوى الضوء المستقطب باتجاهين متعاكسين...\nمثال دوائي مشهور: الثاليدومايد — متماكب مهدئ وآخر مُشوّه للأجنّة.",
        contentEn:
          "A stereogenic center bears four different groups...\nEnantiomers rotate plane-polarized light in opposite directions...\nThalidomide: one enantiomer sedative, the other teratogenic.",
        authorName: "مرتضى عوض",
        authorNameEn: "Murtada Awad",
        year: 2023,
        keywords: ["ستيريوكيمياء", "كيرالية", "متماكبات فراغية"],
        attachments: [],
        categoryId: catId("medicinal-chemistry"),
        views: 1950,
        downloads: 0,
      },
      {
        type: "ARTICLE",
        slug: "nmr-spectroscopy-beginners-guide",
        titleAr: "دليل المبتدئين في الرنين المغناطيسي النووي: قراءة الأطياف خطوة بخطوة",
        titleEn: "A Beginner's Guide to NMR: Reading Spectra Step by Step",
        abstractAr:
          "شرح عملي لمبادئ 1H-NMR: الإزاحة الكيميائية، التكامل، والتشظي (ن+1)، مع جدول المدارج النموذجية وأمثلة محلولة لتحديد بنى مركبات عضوية بسيطة.",
        abstractEn:
          "A practical 1H-NMR primer: chemical shift, integration, and (n+1) splitting, with typical shift tables and worked examples for elucidating simple organic structures.",
        contentAr:
          "المبدأ: تتعرض الأنوية ذات السبين لمجال مغناطيسي...\nالإزاحة الكيميائية δ تقاس بالـ ppm نسبة إلى TMS...\nقاعدة التشظي: n+1 حيث n عدد البروتونات المجاورة...",
        contentEn:
          "Principle: spin-active nuclei in a magnetic field...\nChemical shift δ in ppm vs TMS...\nSplitting rule: n+1 neighboring protons.",
        authorName: "هيثم البدري",
        authorNameEn: "Haitham Al-Badri",
        year: 2023,
        keywords: ["NMR", "تحليل طيفي", "إزاحة كيميائية"],
        attachments: [],
        categoryId: catId("spectroscopy"),
        views: 2310,
        downloads: 0,
      },
      {
        type: "NEWS",
        slug: "nobel-chemistry-click-molecules",
        titleAr: "الكيمياء النقرية تفتح آفاقاً جديدة في اصطناع الأدوية",
        titleEn: "Click Chemistry Opens New Horizons in Drug Synthesis",
        abstractAr:
          "تقرير عن تنامي توظيف تفاعلات الكليك — وعلى رأسها الإضافة الحلقية الأزيد–ألكاين المحفزة بالنحاس — في بناء المكتبات الدوائية بسرعة وكفاءة عاليتين، وانعكاس ذلك على تسريع اكتشاف الأدوية.",
        abstractEn:
          "Click reactions — led by Cu-catalyzed azide–alkyne cycloaddition — are accelerating drug-library construction with speed and efficiency, transforming drug discovery pipelines.",
        contentAr: "تتسم تفاعلات الكليك بمردود شبه كامل وظروف معتدلة...\nتطبيقات في واسمات التصوير الحيوي والبوليمرات الوظيفية...",
        contentEn: "Click reactions are near-quantitative under mild conditions...\nApplications span bio-imaging tags and functional polymers...",
        authorName: "فريق التحرير",
        authorNameEn: "Editorial Team",
        year: 2025,
        keywords: ["كيمياء نقرية", "اكتشاف أدوية", "CuAAC"],
        attachments: [],
        categoryId: catId("organic-synthesis"),
        views: 1120,
        downloads: 0,
      },
      {
        type: "NEWS",
        slug: "photoredox-catalysis-breakthrough",
        titleAr: "الحفز الضوئي الأكسدي-الاختزالي: ثورة في بناء الروابط الكيميائية",
        titleEn: "Photoredox Catalysis: A Revolution in Chemical Bond Construction",
        abstractAr:
          "يستعرض الخبر أحدث تطورات الحفز الضوئي بالأشعة المرئية التي تمكّن من توليد جذور حرة متحكم بها لبناء روابط C–C وC–N بظروف غاية في الاعتدال، ودورها المتصاعد في الصناعة الدوائية.",
        abstractEn:
          "Visible-light photoredox catalysis generates controlled radicals for C–C and C–N bond formation under remarkably mild conditions, increasingly adopted by the pharmaceutical industry.",
        contentAr: "تعمل المحفزات الإيريدية والعضوية بأطوال موجية زرقاء...\nتفاعلات الاقتران المتقاطع الضوئية تختصر خطوات الاصطناع...",
        contentEn: "Iridium and organic photocatalysts operate under blue light...\nPhotoredox cross-couplings shorten synthetic routes...",
        authorName: "فريق التحرير",
        authorNameEn: "Editorial Team",
        year: 2025,
        keywords: ["حفز ضوئي", "جذور حرة", "اصطناع"],
        attachments: [],
        categoryId: catId("organocatalysis"),
        views: 940,
        downloads: 0,
      },
      {
        type: "NEWS",
        slug: "ai-retrosynthesis-tools-2025",
        titleAr: "أدوات الذكاء الاصطناعي للاصطناع الرجعي تدخل المختبرات الجامعية",
        titleEn: "AI Retrosynthesis Tools Enter University Laboratories",
        abstractAr:
          "انتشار برمجيات التخطيط الاصطناعي الرجعي المدعومة بالتعلم العميق في المختبرات الأكاديمية يسرّع تصميم مسارات اصطناع المركبات المستهدفة ويقلل التجارب الفاشلة.",
        abstractEn:
          "Deep-learning retrosynthesis planners are spreading through academic labs, accelerating target-route design and reducing failed experiments.",
        contentAr: "تقترح الأنظمة مسارات من 5–15 خطوة خلال ثوانٍ...\nيبقى التحقق المخبري حاسماً لاعتماد أي مسار مقترح...",
        contentEn: "Systems propose 5–15-step routes in seconds...\nExperimental validation remains essential...",
        authorName: "فريق التحرير",
        authorNameEn: "Editorial Team",
        year: 2024,
        keywords: ["ذكاء اصطناعي", "اصطناع رجعي", "كيمياء حوسبية"],
        attachments: [],
        categoryId: catId("organic-synthesis"),
        views: 1340,
        downloads: 0,
      },
    ])
    .returning();

  /* ArticleTags */
  const tagId = (slug: string) => tg.find((t) => t.slug === slug)?.id;
  const link = (articleSlug: string, slugs: string[]) => {
    const a = arts.find((x) => x.slug === articleSlug);
    if (!a) return [] as { articleId: string; tagId: string }[];
    return slugs
      .map((s) => tagId(s))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ articleId: a.id, tagId: id }));
  };
  await db.insert(articleTags).values([
    ...link("benzimidazole-derivatives-antibacterial", ["nmr", "ir"]),
    ...link("organocatalytic-aldol-small-molecules", ["aldol", "stereochemistry"]),
    ...link("quinoline-heterocycles-spectroscopic", ["nmr", "ir"]),
    ...link("green-oxidation-alcohols-h2o2", ["green-chemistry"]),
    ...link("dft-benzene-tautomers-stability", ["aromaticity"]),
    ...link("aromaticity-huckel-rule-explained", ["aromaticity"]),
    ...link("stereochemistry-optical-activity", ["stereochemistry"]),
    ...link("nmr-spectroscopy-beginners-guide", ["nmr"]),
    ...link("msc-thesis-microwave-synthesis", ["green-chemistry"]),
    ...link("photoredox-catalysis-breakthrough", ["mechanisms"]),
  ]);

  /* Topics (explanations + structures) */
  await db.insert(topics).values([
    {
      kind: "EXPLANATION",
      slug: "hybridization-explained",
      titleAr: "التهجين في ذرة الكربون: sp3 وsp2 وsp",
      titleEn: "Carbon Hybridization: sp3, sp2 and sp",
      summaryAr: "كيف تندمج المدارات الذرية لتفسير الأشكال الهندسية للجزيئات العضوية؟",
      summaryEn: "How atomic orbitals mix to explain molecular geometries.",
      contentAr:
        "التهجين هو دمج المدارات الذرية لتكوين مدارات هجينة جديدة متكافئة الطاقة.\n\nالتهجين sp3: يندمج مدار s مع ثلاثة مدارات p لينتج أربعة مدارات sp3 بترتيب رباعي الأوجه وزاوية 109.5° — مثال: الميثان CH₄.\n\nالتهجين sp2: مدار s + مداران p → ثلاثة مدارات sp2 مستوية بزاوية 120° مع بقاء مدار p نقي لتكوين رابطة π — مثال: الإيثين C₂H₄.\n\nالتهجين sp: مدار s + مدار p → مداران خطيان بزاوية 180° — مثال: الإيثاين C₂H₂.\n\nتحديد التهجين من الصيغة: عدّ مجموعات الإلكترونات حول الذرة؛ 4 = sp3، 3 = sp2، 2 = sp.",
      contentEn:
        "Hybridization mixes atomic orbitals into equivalent hybrid orbitals.\n\nsp3: s + 3p → four tetrahedral orbitals (109.5°) — methane.\nsp2: s + 2p → trigonal planar (120°) plus a pure p for π bonding — ethene.\nsp: s + p → linear (180°) — ethyne.\n\nCount electron groups: 4 = sp3, 3 = sp2, 2 = sp.",
      category: "basics",
    },
    {
      kind: "EXPLANATION",
      slug: "sn1-sn2-mechanisms",
      titleAr: "آليتا الاستبدال النوكليوفيلي SN1 وSN2",
      titleEn: "Nucleophilic Substitution Mechanisms: SN1 vs SN2",
      summaryAr: "الفرق الجوهري بين الآليتين والعوامل المحددة لمسار التفاعل.",
      summaryEn: "The key differences and the factors that choose the pathway.",
      contentAr:
        "آلية SN2: تحدث بخطوة واحدة؛ يهاجم النوكليوفيل من الخلف بالتزامن مع مغادرة المجموعة المغادرة، فينعكس الترتيب الفراغي (انقلاب والدن). رتبة التفاعل ثانية. يفضّلها الهالوألكان الأولي والنوكليوفيلات القوية والمذيبات اللامائية اللامائية البروتية الضعيفة القطبية (مثل DMSO وأسيتون).\n\nآلية SN1: تحدث بخطوتين عبر كاتيون كربوني وسيط؛ رتبة التفاعل أولى. يفضّلها الهالوألكان الثالث والمذيبات البروتية القطبية، ويحدث تشكّل راسيمي جزئي بسبب استواء الوسيط.\n\nالعوامل الحاسمة: بنية الركيزة، قوة النوكليوفيل، جودة المجموعة المغادرة، وقطبية المذيب.",
      contentEn:
        "SN2: one concerted step with backside attack and Walden inversion; second-order kinetics; favored by primary substrates, strong nucleophiles, and polar aprotic solvents.\n\nSN1: two steps via a planar carbocation; first-order; favored by tertiary substrates and polar protic solvents; partial racemization.\n\nDeciding factors: substrate structure, nucleophile strength, leaving-group ability, solvent polarity.",
      category: "mechanisms",
    },
    {
      kind: "EXPLANATION",
      slug: "elimination-e1-e2",
      titleAr: "تفاعلات الحذف E1 وE2: متى يحدث الحذف بدل الاستبدال؟",
      titleEn: "Elimination Reactions E1 and E2: Substitution's Rivals",
      summaryAr: "قاعدة زايتسيف والعوامل الموجهة للحذف.",
      summaryEn: "Zaitsev's rule and elimination-directing factors.",
      contentAr:
        "في E2 تُنتزع بروتون β بالتزامن مع مغادرة المجموعة المغادرة في خطوة واحدة متطلبة وضعية anti-periplanar، ويتبع الناتج قاعدة زايتسيف: الألكين الأكثر استبدالاً هو الغالب.\n\nE1 تشارك SN1 نفس الوسيط الكاتيوني، وتزداد أهميتها مع القواعد الضعيفة والحرارة.\n\nعموماً: القواعد القوية الكبيرة الحجم والحرارة العالية تدفع نحو الحذف، بينما النوكليوفيلات القوية الصغيرة تدفع نحو الاستبدال.",
      contentEn:
        "E2: concerted β-proton abstraction with anti-periplanar geometry; Zaitsev's rule favors the more substituted alkene.\nE1 shares SN1's carbocation intermediate and grows with weak bases and heat.\nBulky strong bases and high temperature favor elimination; small strong nucleophiles favor substitution.",
      category: "mechanisms",
    },
    {
      kind: "EXPLANATION",
      slug: "electrophilic-aromatic-substitution",
      titleAr: "الاستبدال الإلكتروفيلي الأروماتي: بوابة تعديل البنزين",
      titleEn: "Electrophilic Aromatic Substitution: Functionalizing Benzene",
      summaryAr: "كيف تُدخل المجاميع الوظيفية إلى الحلقة الأروماتية؟",
      summaryEn: "Introducing functional groups onto aromatic rings.",
      contentAr:
        "يهاجم الإلكتروفيل النظام π الغني للحلقة الأروماتية مكوّناً كاتيون أرينيوم (σ-complex) غير أروماتي، ثم تُفقد بروتون لاستعادة الأروماتية.\n\nأمثلة: النترة (HNO₃/H₂SO₄)، الهلجنة (Cl₂/FeCl₃)، ألكلة فريدل–كرافت (RCl/AlCl₃)، والأسلة (RCOCl/AlCl₃).\n\nتوجيه المستبدلات: المجاميع الرافعة للإلكترونات موجهة أورثو/بارا ومنشطة، والساحبة موجهة ميتا ومثبطة (ما عدا الهالوجينات موجهة أورثو/بارا رغم تثبيطها).",
      contentEn:
        "An electrophile attacks the π-rich ring forming a non-aromatic arenium ion, then deprotonation restores aromaticity.\n\nExamples: nitration, halogenation, Friedel–Crafts alkylation/acylation.\nDonors are ortho/para directors and activators; withdrawers are meta directors and deactivators (halogens excepted).",
      category: "reactions",
    },
    {
      kind: "STRUCTURE",
      slug: "benzene-structure",
      titleAr: "البنزين C₆H₆",
      titleEn: "Benzene C₆H₆",
      summaryAr: "الحلقة الأروماتية الأشهر: البنية، الرنين، والخصائص.",
      summaryEn: "The iconic aromatic ring: structure, resonance, properties.",
      contentAr:
        "الصيغة الجزيئية: C₆H₆ — حلقة سداسية مستوية من ذرات كربون متهجنة sp2.\n\nالرنين: توصف البنية ببنيتي كيكوليه متناوبتين، لكن الواقع سحابة π موزعة بالتساوي فوق الحلقة وتحتها، فتتساوى أطوال الروابط الست (139 بيكومتر) بين الرابطتين المفردة والثنائية.\n\nإلكترونات π: 6 إلكترونات تحقق قاعدة هوكل 4n+2 (n=1).\n\nالخصائص: سائل عديم اللون، درجة غليانه 80.1°C، يخضع لتفاعلات الاستبدال بدل الإضافة حفاظاً على أروماتيته.",
      contentEn:
        "Molecular formula C₆H₆ — a planar hexagon of sp2 carbons.\nResonance: two Kekulé structures represent a delocalized π cloud; all bonds equal (139 pm).\n6 π-electrons satisfy Hückel 4n+2 (n=1).\nColorless liquid, bp 80.1°C; undergoes substitution rather than addition.",
      category: "structures",
    },
    {
      kind: "STRUCTURE",
      slug: "methane-structure",
      titleAr: "الميثان CH₄",
      titleEn: "Methane CH₄",
      summaryAr: "أبسط الهيدروكربونات وأنموذج التهجين sp3 المثالي.",
      summaryEn: "The simplest hydrocarbon; the perfect sp3 model.",
      contentAr:
        "الصيغة: CH₄ — ذرة كربون مركزية متهجنة sp3 مرتبطة بأربع ذرات هيدروجين.\n\nالشكل: رباعي الأوجه منتظم بزاوية 109.5° وطول رابطة 109 بيكومتر.\n\nالخصائص: غاز عديم اللون والرائحة، غير قطبي، المكوّن الرئيس للغاز الطبيعي، ويتفاعل بالهلجنة الجذرية مع الضوء.",
      contentEn:
        "CH₄ — a central sp3 carbon bonded to four hydrogens.\nRegular tetrahedron, 109.5° angles, 109 pm bonds.\nColorless, nonpolar natural-gas component; undergoes radical halogenation.",
      category: "structures",
    },
    {
      kind: "STRUCTURE",
      slug: "ethanol-structure",
      titleAr: "الإيثانول C₂H₅OH",
      titleEn: "Ethanol C₂H₅OH",
      summaryAr: "أشهر الكحولات: مجموعة الهيدروكسيل وتأثيرها.",
      summaryEn: "The famous alcohol: the hydroxyl group and its effects.",
      contentAr:
        "الصيغة: CH₃CH₂OH — سلسلة كربونية إيثيلية تنتهي بمجموعة هيدروكسيل.\n\nالتهجين: كلتا ذرتي الكربون sp3، والأكسجين sp3 مع زوجي إلكترونات حرة وزاوية قريبة من 104.5° حوله.\n\nالروابط الهيدروجينية: تفسر قابلية الذوبان الكاملة في الماء ودرجة الغليان المرتفعة نسبياً (78.4°C).\n\nالتفاعلات: أكسدة إلى أسيتالدهيد ثم حمض الخليك، استرة مع الأحماض، وجفاف إلى إيثين.",
      contentEn:
        "CH₃CH₂OH — an ethyl chain ending in a hydroxyl group.\nBoth carbons are sp3; oxygen is sp3 with ~104.5° angle.\nHydrogen bonding explains full water miscibility and bp 78.4°C.\nReactions: oxidation to acetaldehyde/acetic acid, esterification, dehydration to ethene.",
      category: "structures",
    },
  ]);

  /* Reactions */
  await db.insert(reactions).values([
    {
      type: "NAMED",
      nameAr: "ألكلة فريدل–كرافت",
      nameEn: "Friedel–Crafts Alkylation",
      equation: "C₆H₆ + R-Cl —(AlCl₃)→ C₆H₅-R + HCl",
      descriptionAr: "إدخال مجموعة ألكيل إلى الحلقة الأروماتية باستخدام هاليد ألكيل ومحفز حمض لويس، من أهم تفاعلات بناء الروابط C–C في الكيمياء الأروماتية.",
      descriptionEn: "Introduces an alkyl group onto an aromatic ring using an alkyl halide and a Lewis acid — a cornerstone C–C bond-forming reaction.",
      mechanismAr: "يتفاعل AlCl₃ مع هاليد الألكيل مولداً كاتيون كربوني إلكتروفيلي، يهاجم الحلقة الأروماتية مكوّناً كاتيون أرينيوم، ثم تُفقد بروتون لتستعاد الأروماتية.",
      mechanismEn: "AlCl₃ generates an electrophilic carbocation from the alkyl halide; the ring attacks to form an arenium ion, then deprotonation restores aromaticity.",
      reagents: "R-Cl, AlCl₃",
      conditions: "وسط جاف، درجة حرارة الغرفة إلى 80°C",
    },
    {
      type: "NAMED",
      nameAr: "تكثيف الألدول",
      nameEn: "Aldol Condensation",
      equation: "2 CH₃CHO —(OH⁻)→ CH₃CH(OH)CH₂CHO —(−H₂O)→ CH₃CH=CHCHO",
      descriptionAr: "اتحاد جزيئي كربونيل إلى β-هيدروكسي كربونيل، وغالباً ما يتبعه جفاف إلى α,β-كربونيل غير مشبع؛ ركيزة أساسية في بناء الهياكل الكربونية.",
      descriptionEn: "Two carbonyls unite into a β-hydroxy carbonyl, often dehydrating to an α,β-unsaturated carbonyl — fundamental to carbon skeleton construction.",
      mechanismAr: "ينتزع القاعدة بروتون α مكوّناً إينولاتاً يهاجم كربون الكربونيل في جزيء آخر، ثم يُبروتن ألكوكسيد الناتج؛ وعند التسخين يحدث حذف E1cb للماء.",
      mechanismEn: "Base forms an enolate that attacks a second carbonyl; alkoxide protonation gives the aldol, and heat drives E1cb dehydration.",
      reagents: "NaOH (dil.) أو قاعدة ضعيفة",
      conditions: "حار للتكثيف الكامل، بارد للإيقاف عند الألدول",
    },
    {
      type: "NAMED",
      nameAr: "تفاعل ديلز–ألدر",
      nameEn: "Diels–Alder Reaction",
      equation: "Diene + Dienophile → Cyclohexene ([4+2] cycloaddition)",
      descriptionAr: "إضافة حلقية [4+2] بين دايين متقارن وداينوفيل لتكوين حلقة سيكلوهكسين في خطوة واحدة متزامنة، مع تحكم فراغي رائع.",
      descriptionEn: "A [4+2] cycloaddition between a conjugated diene and a dienophile yielding cyclohexene in one concerted step with superb stereocontrol.",
      mechanismAr: "آلية متزامنة محيطية بتداخل HOMO الدايين مع LUMO الداينوفيل؛ المجاميع الساحبة على الداينوفيل تسرّع التفاعل.",
      mechanismEn: "A concerted pericyclic overlap of diene HOMO with dienophile LUMO; electron-withdrawing groups on the dienophile accelerate it.",
      reagents: "دايين + ألكين/ألكين مفعّل",
      conditions: "حرارة معتدلة، أحياناً محفز لويس",
    },
    {
      type: "NAMED",
      nameAr: "كاشف غرينيارد",
      nameEn: "Grignard Reaction",
      equation: "R-MgX + R'₂C=O → R'₂(R)C-OH (بعد الحلمهة)",
      descriptionAr: "إضافة أورغانومغنيسيوم إلى الكربونيلات لبناء كحولات أولية وثانوية وثالثية مع تكوين رابطة كربون–كربون جديدة.",
      descriptionEn: "Organomagnesium addition to carbonyls builds primary, secondary, or tertiary alcohols while forming a new C–C bond.",
      mechanismAr: "يهاجم كربون غرينيارد النوكليوفيلي كربون الكربونيل الإلكتروفيلي مكوّناً ألكوكسيد مغنيزيوم يُحلمه إلى الكحول.",
      mechanismEn: "The nucleophilic Grignard carbon attacks the electrophilic carbonyl carbon; the magnesium alkoxide is then hydrolyzed.",
      reagents: "R-MgX في إيثير جاف، ثم H₃O⁺",
      conditions: "إيثير لا مائي، حماية من الرطوبة",
    },
    {
      type: "NAMED",
      nameAr: "تفاعل فيتيغ",
      nameEn: "Wittig Reaction",
      equation: "Ph₃P=CHR + R'₂C=O → R'₂C=CHR + Ph₃P=O",
      descriptionAr: "تحويل الكربونيلات إلى ألكينات بموضع محدد تماماً للرابطة الثنائية باستخدام إيليدات الفوسفور — أداة أساسية في الاصطناع.",
      descriptionEn: "Converts carbonyls to alkenes with exact double-bond placement using phosphorus ylides — a synthetic essential.",
      mechanismAr: "يهاجم الإيليد كربون الكربونيل مكوّناً بيتين/أوكسافوسفيتان رباعي الحلقة ينهار إلى الألكين وأكسيد ثلاثي فينيل الفوسفين.",
      mechanismEn: "The ylide attacks the carbonyl forming a betaine/oxaphosphetane that collapses to alkene and triphenylphosphine oxide.",
      reagents: "إيليد فيتيغ (Ph₃P=CHR)",
      conditions: "مذيب إيثيري، أولي إلى ثانوي الهاليدات للتحضير",
    },
    {
      type: "MECHANISM",
      nameAr: "إضافة ماركونيكوف للألكينات",
      nameEn: "Markovnikov Addition to Alkenes",
      equation: "CH₃CH=CH₂ + HBr → CH₃CHBrCH₃",
      descriptionAr: "إضافة الهاليدات الهيدروجينية إلى الألكينات غير المنتظمة بحيث يضاف الهيدروجين إلى الكربون الأغنى هيدروجينياً عبر الكاتيون الأثبت.",
      descriptionEn: "HX adds to unsymmetrical alkenes placing H on the hydrogen-rich carbon via the more stable carbocation.",
      mechanismAr: "يبروتن الكربون الطرفي مكوّناً كاتيوناً كربونياً ثانوياً (أكثر ثباتاً) ثم يهاجمه أيون البروميد.",
      mechanismEn: "Terminal-carbon protonation gives the more stable secondary carbocation, which bromide then captures.",
      reagents: "HBr, HCl, H₂SO₄/H₂O",
      conditions: "وسط حمضي؛ مضاد ماركونيكوف مع بيروكسيدات",
    },
    {
      type: "MECHANISM",
      nameAr: "هلجنة جذرية للألكانات",
      nameEn: "Radical Halogenation of Alkanes",
      equation: "CH₄ + Cl₂ —(hν)→ CH₃Cl + HCl",
      descriptionAr: "استبدال هيدروجين الألكان بهالوجين عبر آلية جذرية سلسلية بثلاث مراحل: بادئة وانتشار ونهاية.",
      descriptionEn: "Replaces alkane C–H with halogen via a radical chain mechanism: initiation, propagation, termination.",
      mechanismAr: "ينشق Cl₂ ضوئياً إلى جذور كلور تنتزع هيدروجيناً مكوّنة جذر ميثيل يلتقط Cl₂ مجدداً ويكرر السلسلة.",
      mechanismEn: "Cl₂ photolyzes to chlorine radicals that abstract H, generating a methyl radical that propagates the chain.",
      reagents: "Cl₂ أو Br₂، ضوء UV",
      conditions: "ضوء أو حرارة لبدء السلسلة",
    },
    {
      type: "NAMED",
      nameAr: "إضافة مايكل",
      nameEn: "Michael Addition",
      equation: "Enolate + α,β-unsaturated carbonyl → 1,5-dicarbonyl",
      descriptionAr: "إضافة مقترنة 1,4 لنوكليوفيل كربوني إلى نظام α,β-غير مشبع، تُنتج مركبات ثنائية الكربونيل 1,5 المهمة اصطناعياً.",
      descriptionEn: "Conjugate 1,4-addition of a carbon nucleophile to an α,β-unsaturated system, yielding synthetically valuable 1,5-dicarbonyls.",
      mechanismAr: "يهاجم الإينولات كربون β في المستقبل المقترن مكوّناً إينولاتاً جديداً يُبروتن عند كربون α.",
      mechanismEn: "The enolate attacks the β-carbon of the conjugated acceptor; the new enolate protonates at α.",
      reagents: "مانح مايكل (إينولات) + مستقبل مايكل",
      conditions: "قاعدة محفزة، درجة حرارة الغرفة",
    },
    {
      type: "SYNTHESIS",
      nameAr: "استرة فيشر",
      nameEn: "Fischer Esterification",
      equation: "CH₃COOH + C₂H₅OH ⇌(H⁺) CH₃COOC₂H₅ + H₂O",
      descriptionAr: "تحويل الأحماض الكاربوكسيلية إلى إسترات بوجود حمض معدني محفز وكحول، تفاعل انعكاسي يُقاد بإزالة الماء أو إفراط الكحول.",
      descriptionEn: "Converts carboxylic acids to esters with mineral-acid catalysis; the equilibrium is driven by water removal or alcohol excess.",
      mechanismAr: "بروتنة الكربونيل، هجوم نوكليوفيلي للكحول، انتقال بروتون، مغادرة الماء، ثم نزع البروتون.",
      mechanismEn: "Carbonyl protonation, alcohol attack, proton transfer, water loss, deprotonation.",
      reagents: "H₂SO₄ مركز أو HCl جاف",
      conditions: "جقلية مع إزالة الماء (ديين–ستارك)",
    },
    {
      type: "SYNTHESIS",
      nameAr: "اختزال الكربونيلات بالهيدريدات",
      nameEn: "Hydride Reduction of Carbonyls",
      equation: "R₂C=O —(NaBH₄)→ R₂CHOH",
      descriptionAr: "اختزال الألدهيدات والكيتونات إلى كحولات بـ NaBH₄ (معتدل) أو LiAlH₄ (قوي يختزل الإسترات والأحماض أيضاً).",
      descriptionEn: "Reduces aldehydes and ketones to alcohols using NaBH₄ (mild) or LiAlH₄ (stronger — also esters and acids).",
      mechanismAr: "انتقال أيون الهيدريد نوكليوفيلياً إلى كربون الكربونيل ثم معالجة بروتية للألكوكسيد.",
      mechanismEn: "Nucleophilic hydride transfer to the carbonyl carbon followed by a protic workup.",
      reagents: "NaBH₄ في MeOH أو LiAlH₄ في الإيثير",
      conditions: "LiAlH₄ يتطلب جفافاً تاماً",
    },
  ]);

  /* Books */
  await db.insert(books).values([
    {
      titleAr: "أساسيات الكيمياء العضوية",
      titleEn: "Fundamentals of Organic Chemistry",
      author: "مرتضى عوض",
      year: 2023,
      descriptionAr: "مدخل عربي مبسّط يغطي التهجين والمجاميع الوظيفية والتسمية والستيريوكيمياء مع تدريبات محلولة.",
      descriptionEn: "An accessible Arabic introduction covering hybridization, functional groups, nomenclature and stereochemistry with solved exercises.",
      coverColor: "#00B894",
      fileUrl: "/uploads/sample-research.pdf",
      fileSize: 2846720,
      pages: 412,
      downloads: 856,
    },
    {
      titleAr: "آليات التفاعلات العضوية المصوّرة",
      titleEn: "Illustrated Organic Reaction Mechanisms",
      author: "مرتضى عوض",
      year: 2022,
      descriptionAr: "أكثر من 120 آلية مرسومة سهمياً خطوة بخطوة من الاستبدال والحذف إلى التفاعلات المحيطية.",
      descriptionEn: "Over 120 arrow-pushing mechanisms from substitution and elimination to pericyclic reactions.",
      coverColor: "#0984E3",
      fileUrl: "/uploads/sample-research.pdf",
      fileSize: 5218304,
      pages: 368,
      downloads: 1204,
    },
    {
      titleAr: "التحليل الطيفي للمركبات العضوية",
      titleEn: "Spectroscopic Analysis of Organic Compounds",
      author: "هيثم البدري",
      year: 2021,
      descriptionAr: "مرجع عملي في حل أطياف IR وNMR وMS مع أكثر من 60 مسألة طيفية محلولة بالكامل.",
      descriptionEn: "A practical reference for solving IR, NMR and MS spectra with 60+ fully worked problems.",
      coverColor: "#6C5CE7",
      fileUrl: "/uploads/sample-research.pdf",
      fileSize: 4194304,
      pages: 296,
      downloads: 743,
    },
    {
      titleAr: "كيمياء الحلقات غير المتجانسة",
      titleEn: "Heterocyclic Chemistry",
      author: "عبدالرحمن السامرائي",
      year: 2020,
      descriptionAr: "دراسة منهجية للحلقات النتروجينية والأكسجينية والكبريتية: التحضير والخصائص والتطبيقات الدوائية.",
      descriptionEn: "A systematic study of N, O and S heterocycles: preparation, properties and pharmaceutical applications.",
      coverColor: "#E17055",
      fileUrl: "/uploads/sample-research.pdf",
      fileSize: 6291456,
      pages: 524,
      downloads: 689,
    },
    {
      titleAr: "الاصطناع العضوي المتقدم: استراتيجيات وخطط",
      titleEn: "Advanced Organic Synthesis: Strategies and Design",
      author: "فوجيتا",
      year: 2019,
      descriptionAr: "منهج متقدم في التحليل الاصطناعي الرجعي وحماية المجاميع الوظيفية والاصطناع غير المتماثل.",
      descriptionEn: "An advanced treatment of retrosynthetic analysis, protecting groups and asymmetric synthesis.",
      coverColor: "#00CEC9",
      fileUrl: "/uploads/sample-research.pdf",
      fileSize: 7340032,
      pages: 648,
      downloads: 512,
    },
    {
      titleAr: "الكيمياء العضوية الخضراء",
      titleEn: "Green Organic Chemistry",
      author: "سارة الخالدي",
      year: 2024,
      descriptionAr: "مبادئ الكيمياء الخضراء الاثنا عشر وتطبيقاتها في المختبر: مذيبات بديلة، حفز، وطاقة نظيفة.",
      descriptionEn: "The twelve green chemistry principles applied in the lab: alternative solvents, catalysis and clean energy.",
      coverColor: "#55EFC4",
      fileUrl: "/uploads/sample-research.pdf",
      fileSize: 3145728,
      pages: 278,
      downloads: 398,
    },
  ]);

  /* Notifications */
  await db.insert(notifications).values([
    {
      titleAr: "بحث جديد منشور",
      titleEn: "New Research Published",
      bodyAr: "نُشر بحث 'اصطناع مشتقات بنزيميدازول جديدة' — اطلع عليه الآن في قسم الأبحاث.",
      bodyEn: "The paper 'Synthesis of Novel Benzimidazole Derivatives' is now available in the research section.",
    },
    {
      titleAr: "مرحباً بكم في منصة الكيمياء العضوية",
      titleEn: "Welcome to the Organic Chemistry Platform",
      bodyAr: "منصة الباحث مرتضى عوض لنشر البحوث والدراسات والمقالات العلمية باللغتين العربية والإنجليزية.",
      bodyEn: "Researcher Murtada Awad's platform for publishing research, studies and scientific articles in Arabic and English.",
    },
  ]);

  /* Stats */
  await db.insert(stats).values([
    { key: "visitors", value: 12847 },
  ]);

  console.log("Seed completed.");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
