export type KnowledgeEntry = {
  keywords: string[];
  ar: string;
  en: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["تهجين", "hybridization", "sp3", "sp2", "sp", "هجين"],
    ar: "التهجين هو دمج المدارات الذرية لتكوين مدارات هجينة متكافئة. في الكربون: sp3 (رباعي الأوجه، 109.5°، كالميثان)، sp2 (مستوٍ مثلثي، 120°، مع مدار p لرابطة π كما في الإيثين)، sp (خطي، 180°، كالإيثاين). القاعدة العملية: عدّ مجموعات الإلكترونات حول الذرة — 4 تعني sp3، 3 تعني sp2، 2 تعني sp. يمكنك قراءة المزيد في صفحة شرح المواضيع «التهجين في ذرة الكربون».",
    en: "Hybridization mixes atomic orbitals into equivalent hybrids. In carbon: sp3 (tetrahedral, 109.5°, e.g. methane), sp2 (trigonal planar, 120°, with a p orbital for π bonding as in ethene), sp (linear, 180°, e.g. ethyne). Rule of thumb: count electron groups — 4 = sp3, 3 = sp2, 2 = sp. See the topic “Carbon Hybridization” for more.",
  },
  {
    keywords: ["أروماتية", "aromatic", "هوكل", "huckel", "hückel", "بنزين", "benzene"],
    ar: "المركب الأروماتي يحقق أربعة شروط: حلقي، مستوٍ، نظام متقارن مستمر (مدار p على كل ذرة في الحلقة)، وعدد إلكترونات π يساوي 4n+2 (قاعدة هوكل؛ n = 0,1,2...). البنزين (6 إلكترونات π) أروماتي؛ السيكلوبيوتاديين (4) ضد أروماتي. الأروماتية تمنح ثباتية استثنائية وتدفع البنزين لتفضيل الاستبدال على الإضافة. جرّب نموذج البنزين ثلاثي الأبعاد في صفحة «التراكيب الكيميائية».",
    en: "An aromatic compound is cyclic, planar, fully conjugated, and has 4n+2 π-electrons (Hückel's rule). Benzene (6 π) is aromatic; cyclobutadiene (4 π) is antiaromatic. Aromaticity grants exceptional stability, so benzene prefers substitution over addition. Try the interactive benzene model in “Chemical Structures”.",
  },
  {
    keywords: ["sn1", "sn2", "استبدال", "substitution", "نوكليوفيلي", "nucleophilic"],
    ar: "الفرق الجوهري: SN2 خطوة واحدة متزامنة (هجوم خلفي + انقلاب والدن، رتبة ثانية) يفضلها الركيزة الأولية والنوكليوفيل القوي والمذيب اللامائي القطبي. SN1 خطوتان عبر كاتيون كربوني (رتبة أولى، تشكّل راسيمي) يفضلها الركيزة الثالثية والمذيب البروتي. العوامل الحاسمة: بنية الركيزة ← قوة النوكليوفيل ← جودة المجموعة المغادرة ← المذيب. تفصيل أكثر في صفحة شرح المواضيع.",
    en: "Key difference: SN2 is one concerted step (backside attack, Walden inversion, second-order) favored by primary substrates, strong nucleophiles, polar aprotic solvents. SN1 is two steps through a carbocation (first-order, racemization) favored by tertiary substrates and protic solvents. Deciding factors: substrate → nucleophile → leaving group → solvent.",
  },
  {
    keywords: ["e1", "e2", "حذف", "elimination", "زايتسيف", "zaitsev"],
    ar: "تفاعلات الحذف تنافس الاستبدال. E2: خطوة واحدة بوضعية anti-periplanar، قاعدة قوية، والناتج الغالب هو الألكين الأكثر استبدالاً (زايتسيف). E1: عبر كاتيون كربوني مشترك مع SN1. القاعدة العامة: قاعدة قوية كبيرة + حرارة عالية ⇒ حذف؛ نوكليوفيل قوي صغير ⇒ استبدال.",
    en: "Elimination competes with substitution. E2: one-step anti-periplanar, strong base, Zaitsev product (most substituted alkene). E1 shares SN1's carbocation. Bulky strong base + heat ⇒ elimination; small strong nucleophile ⇒ substitution.",
  },
  {
    keywords: ["ألدول", "aldol", "تكثيف", "condensation"],
    ar: "تكثيف الألدول يوحّد جزيئي كربونيل إلى β-هيدروكسي كربونيل عبر إينولات، وغالباً يتبعه جفاف إلى α,β-كربونيل غير مشبع. الظروف: قاعدة مخففة (NaOH) وبرودة للألدول، حرارة للتكثيف الكامل. اطلع على بحثنا «تحفيز تفاعل ألدول التكثيفي باستخدام محفزات عضوية» في قسم الأبحاث.",
    en: "Aldol condensation unites two carbonyls into a β-hydroxy carbonyl via an enolate, often followed by dehydration to an α,β-unsaturated carbonyl. Cold dilute NaOH for the aldol; heat for full condensation. See our paper on organocatalytic aldol in the Research section.",
  },
  {
    keywords: ["غرينيارد", "grignard", "مغنيسيوم", "مغنيزيوم"],
    ar: "كاشف غرينيارد R-MgX يُحضّر من هاليد ألكيل والمغنيسيوم في إيثير جاف. يتصرف ككربانيون فيهاجم الكربونيلات مكوّناً كحولات: فورمالدهيد ⇒ أولي، ألدهيد ⇒ ثانوي، كيتون ⇒ ثالثي. يجب إبعاد الماء والمجاميع الحمضية لأنها تدمّر الكاشف. المعادلة العامة والظروف موثقة في صفحة «التفاعلات العضوية».",
    en: "Grignard reagent R-MgX is prepared from an alkyl halide and Mg in dry ether. It behaves as a carbanion attacking carbonyls: formaldehyde ⇒ 1°, aldehyde ⇒ 2°, ketone ⇒ 3° alcohols. Moisture and acidic protons destroy it. Full equation and conditions are documented under “Organic Reactions”.",
  },
  {
    keywords: ["ديلز", "diels", "الدر", "alder", "دايين", "diene"],
    ar: "تفاعل ديلز–ألدر إضافة حلقية [4+2] متزامنة بين دايين متقارن (بترتيب s-cis) وداينوفيل، ينتج حلقة سيكلوهكسين. يتسارع بمجاميع ساحبة للإلكترونات على الداينوفيل، ويحفظ الترتيب الفراغي، ويتبع قاعدة إندو. من أقوى أدوات بناء الحلقات في الاصطناع العضوي.",
    en: "Diels–Alder is a concerted [4+2] cycloaddition between an s-cis diene and a dienophile giving cyclohexene. EWGs on the dienophile accelerate it; stereochemistry is preserved; the endo rule applies. One of the most powerful ring-forming tools in synthesis.",
  },
  {
    keywords: ["فيتيغ", "wittig", "إيليد", "ylide"],
    ar: "تفاعل فيتيغ يحوّل الألدهيدات والكيتونات إلى ألكينات بموضع محدد للرابطة الثنائية باستخدام إيليد فوسفوري (Ph₃P=CHR) عبر وسيط أوكسافوسفيتان رباعي. الإيليدات غير المستقرة تعطي Z-ألكينات غالباً، بينما المستقرة (هورنر–وادزورث–إيمونز) تعطي E.",
    en: "The Wittig reaction converts aldehydes/ketones to alkenes at a defined position using a phosphorus ylide through a four-membered oxaphosphetane. Unstabilized ylides favor Z-alkenes; stabilized (Horner–Wadsworth–Emmons) favor E.",
  },
  {
    keywords: ["nmr", "رنين", "طيف", "إزاحة كيميائية", "chemical shift"],
    ar: "في ¹H-NMR تُقرأ ثلاث معلومات: الإزاحة الكيميائية δ (البيئة الإلكترونية: أليفاتي 0.9–1.5، بجوار C=O حول 2–2.5، أروماتي 6.5–8، ألدهيد 9–10 ppm)، التكامل (عدد البروتونات)، والتشظي n+1 (عدد الجيران). ابدأ بعدّ الإشارات ← التكامل ← التشظي ← الإزاحة. مرجع عملي كامل في «المكتبة العلمية».",
    en: "¹H-NMR gives three data types: chemical shift δ (electronic environment: aliphatic 0.9–1.5, α to C=O ~2–2.5, aromatic 6.5–8, aldehyde 9–10 ppm), integration (proton count), and n+1 splitting (neighbors). Count signals → integrate → split → shift. A full practical reference is in the Library.",
  },
  {
    keywords: ["ir", "تحت حمراء", "infrared", "أشعة"],
    ar: "طيف IR يكشف المجاميع الوظيفية عبر اهتزازات الروابط: O–H حر 3600سم⁻¹ عريض، C=O قوي عند ~1715، C=C عند ~1650، C–H أليفاتي قرب 2900–3000. تواجد C=O مع O–H عريض يشير إلى حمض كاربوكسيلي. لا يكشف IR البنية كاملة — يُستكمل بـ NMR.",
    en: "IR reveals functional groups via bond vibrations: free broad O–H ~3600 cm⁻¹, strong C=O ~1715, C=C ~1650, aliphatic C–H ~2900–3000. C=O plus broad O–H indicates a carboxylic acid. IR doesn't give the full structure — complement with NMR.",
  },
  {
    keywords: ["استرة", "esterification", "فيشر", "fischer", "إستر", "ester"],
    ar: "استرة فيشر: حمض كاربوكسيلي + كحول ⇌ إستر + ماء بمحفز حمضي. لأنها انعكاسية تُقاد بإزالة الماء (ديين–ستارك) أو إفراط الكحول. الآلية: بروتنة الكربونيل ← هجوم الكحول ← انتقال بروتون ← مغادرة الماء. دراسة حركية كاملة عنها في قسم «الدراسات».",
    en: "Fischer esterification: carboxylic acid + alcohol ⇌ ester + water with acid catalysis. Drive the equilibrium by removing water (Dean–Stark) or excess alcohol. Mechanism: carbonyl protonation → alcohol attack → proton transfer → water leaves. A full kinetic study is in the Studies section.",
  },
  {
    keywords: ["ماركونيكوف", "markovnikov", "إضافة", "addition", "ألكين", "alkene"],
    ar: "قاعدة ماركونيكوف: عند إضافة HX لألكين غير منتظم يضاف H إلى الكربون الأغنى هيدروجينياً لأن التفاعل يمر بالكاتيون الأثبت (ثالثي > ثانوي > أولي). مع HBr وبيروكسيدات تعكس الجذور الحرة الاتجاه (مضاد ماركونيكوف) لتعطي البروميد الأقل استبدالاً.",
    en: "Markovnikov's rule: HX adds to an unsymmetrical alkene placing H on the hydrogen-rich carbon, via the most stable carbocation (3° > 2° > 1°). With HBr/peroxides, radicals reverse the selectivity (anti-Markovnikov).",
  },
  {
    keywords: ["فريدل", "كرافت", "friedel", "crafts", "ألكلة", "أسلة"],
    ar: "ألكلة فريدل–كرافت تدخل مجموعة ألكيل إلى حلقة أروماتية بـ R-Cl/AlCl₃ عبر كاتيون كربوني (تحذير: إعادة ترتيب ومتعدد الألكلة ممكن). الأسلة بـ RCOCl/AlCl₃ تعطي كيتوناً أروماتياً بلا إعادة ترتيب ولا أسلة متعددة — لذا تُفضل الأسلة ثم الاختزال للحصول على ألكيل نقي. الحلقات المثبطة لا تتفاعل.",
    en: "Friedel–Crafts alkylation (R-Cl/AlCl₃) alkylates aromatic rings via carbocations (beware rearrangements and polyalkylation). Acylation (RCOCl/AlCl₃) gives aryl ketones cleanly — so acylate then reduce for pure alkylarenes. Deactivated rings do not react.",
  },
  {
    keywords: ["ستيريو", "stereochem", "كيرال", "chiral", "متماكب", "enantiomer", "نشاط ضوئي"],
    ar: "المركب الكيرالي غير قابل للتراكب على صورته المرآتية (غالباً كربون بأربع مجاميع مختلفة). المتماكبان الفراغيان يتطابقان في الخواص الفيزيائية ويختلفان في تدوير الضوء المستقطب والتفاعل مع الأنظمة الكيرالية (الإنزيمات!). تُسمى المراكز بقاعدة CIP (R/S). مقال مفصل في قسم «المقالات التعليمية».",
    en: "A chiral compound is non-superimposable on its mirror image (often a carbon with four different groups). Enantiomers share physical properties but rotate plane-polarized light oppositely and interact differently with chiral systems (enzymes!). Centers are labeled R/S by CIP rules. Full article under “Educational Articles”.",
  },
  {
    keywords: ["مراجع", "reference", "كتاب", "book", "كتب", "مصدر"],
    ar: "أقترح عليك: «أساسيات الكيمياء العضوية» و«آليات التفاعلات العضوية المصوّرة» للمرتضى عوض في مكتبتنا، إضافة إلى مراجع عالمية كلاسيكية: Clayden Organic Chemistry للمفاهيم والآليات، وMcMurry للمبتدئين، وMarch's Advanced للتعمق البحثي. تصفح «المكتبة العلمية» للتحميل والمعاينة.",
    en: "Suggested references: “Fundamentals of Organic Chemistry” and “Illustrated Organic Reaction Mechanisms” by Murtada Awad in our Library, plus classics: Clayden's Organic Chemistry for mechanisms, McMurry for beginners, March's Advanced for depth. Browse the Scientific Library to preview and download.",
  },
  {
    keywords: ["tautomer", "متماكب دستوري", "تاوتومر", "كيتو", "اينول", "enol", "keto"],
    ar: "المتماكبة (Tautomerism) انتقال بروتون بين موضعين مع تحول روابط، أشهرها كيتو ⇌ إينول. الصيغة الكيتونية هي الغالبة عادةً، وتزداد نسبة الإينول مع استقرار الرابطة الثنائية (الاقتران، الأروماتية كما في الفينول) أو الروابط الهيدروجينية الداخلية كما في β-ثنائي الكربونيلات. لدينا دراسة DFT منشورة حول ثباتية المتماكبات في قسم «الدراسات».",
    en: "Tautomerism is proton migration with bond reorganization, classically keto ⇌ enol. The keto form usually dominates; enol content grows with conjugation, aromaticity (phenol) or intramolecular H-bonding (β-dicarbonyls). See our published DFT study on tautomer stability under “Studies”.",
  },
  {
    keywords: ["ديلز", "محيطي", "pericyclic", "مدار", "orbital", "homo", "lumo"],
    ar: "التفاعلات المحيطية (cycloadditions, electrocyclic, sigmatropic) تحدث بآلية متزامنة عبر حالة انتقالية حلقية، ويحكمها تناظر المدارات الحدودية (قواعد وودوارد–هوفمان): HOMO أحد الشريكين مع LUMO الآخر. إضافات [4+2] مسموحة حرارياً، بينما [2+2] تتطلب ضوءاً.",
    en: "Pericyclic reactions (cycloadditions, electrocyclic, sigmatropic) proceed concertedly through cyclic transition states governed by frontier-orbital symmetry (Woodward–Hoffmann rules): HOMO/LUMO pairing. [4+2] additions are thermally allowed; [2+2] require light.",
  },
];

export const fallbackAnswer = {
  ar: "سؤال ممتاز! لا أملك إجابة جاهزة دقيقة حول هذا الموضوع حالياً، لكن يمكنك: (1) البحث في «قاعدة بيانات التفاعلات»، (2) تصفح «شرح المواضيع الكيميائية»، (3) مراجعة المقالات والمكتبة العلمية، أو (4) إعادة صياغة السؤال بمصطلحات مثل: التهجين، الأروماتية، SN1/SN2، الألدول، غرينيارد، NMR، IR.",
  en: "Great question! I don't have a precise answer on that topic yet. You can: (1) search the Reactions Database, (2) browse Chemistry Topics, (3) check the articles and library, or (4) rephrase using terms like: hybridization, aromaticity, SN1/SN2, aldol, Grignard, NMR, IR.",
};
