"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Atom, Globe2, GraduationCap, HeartHandshake, Target, Telescope, Users } from "lucide-react";
import { useT } from "@/lib/store";
import { PageHeader, SectionHeading } from "@/components/cards";
import { MoleculeBackground } from "@/components/three/molecule-scene";

export function AboutClient() {
  const { t, lang } = useT();

  const values = [
    {
      icon: Target,
      title: lang === "ar" ? "الدقة العلمية" : "Scientific Rigor",
      desc: lang === "ar" ? "محتوى محكّم وموثّق بالمصادر والمعادلات والآليات." : "Peer-reviewed content documented with sources, equations and mechanisms.",
    },
    {
      icon: Globe2,
      title: lang === "ar" ? "ثنائية اللغة" : "Bilingualism",
      desc: lang === "ar" ? "المعرفة بالعربية والإنجليزية لخدمة الباحثين حول العالم." : "Knowledge in Arabic and English serving researchers worldwide.",
    },
    {
      icon: HeartHandshake,
      title: lang === "ar" ? "الوصول المفتوح" : "Open Access",
      desc: lang === "ar" ? "تحميل حر للبحوث والكتب والمواد التعليمية." : "Free downloads of research, books and educational materials.",
    },
    {
      icon: Atom,
      title: lang === "ar" ? "التعلم التفاعلي" : "Interactive Learning",
      desc: lang === "ar" ? "نماذج جزيئية ثلاثية الأبعاد ومساعد ذكي يشرح ويوضح." : "Interactive 3D molecular models and a smart assistant that explains.",
    },
  ];

  return (
    <>
      <PageHeader titleKey="aboutTitle" icon="users" subKey="taglineShort" />

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 opacity-40">
          <MoleculeBackground mini />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="glass rounded-3xl p-7"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <Telescope className="h-6 w-6 text-white" />
              </span>
              <h3 className="mb-3 text-xl font-bold text-primary">{t("aboutVision")}</h3>
              <p className="text-sm leading-loose text-muted">
                {lang === "ar"
                  ? "أن نكون المرجع العربي الأول في الكيمياء العضوية، وجسراً يربط المحتوى العلمي العربي بالإنجليزي، ومنصة انطلاق للباحثين والطلاب نحو التميز البحثي."
                  : "To be the leading Arabic reference in organic chemistry — a bridge between Arabic and English scientific content and a launchpad for researchers and students."}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="glass rounded-3xl p-7"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent">
                <GraduationCap className="h-6 w-6 text-white" />
              </span>
              <h3 className="mb-3 text-xl font-bold text-secondary">{t("aboutMission")}</h3>
              <p className="text-sm leading-loose text-muted">
                {lang === "ar"
                  ? "نشر البحوث والدراسات والأطاريح والمقالات التعليمية في الكيمياء العضوية بأسلوب علمي رصين ومتاح، وتوفير أدوات تفاعلية حديثة — نماذج ثلاثية الأبعاد، قاعدة تفاعلات موثقة، ومساعد ذكي — لتعميق الفهم وتسهيل الوصول إلى المعرفة."
                  : "Publishing research, studies, theses and educational articles in organic chemistry with rigorous yet accessible style, and providing modern interactive tools — 3D models, a documented reaction database, and a smart assistant — to deepen understanding and democratize knowledge."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading title={t("aboutValues")} icon={HeartHandshake} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass card-hover rounded-3xl p-6 text-center"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface">
                <v.icon className="h-6 w-6 text-primary" />
              </span>
              <h4 className="font-bold">{v.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-5 text-muted">{lang === "ar" ? "المنصة بإشراف" : "Curated by"}</p>
          <Link href="/researcher" className="btn-primary">
            <Users className="h-5 w-5" />
            {t("researcherName")}
          </Link>
        </div>
      </section>
    </>
  );
}
