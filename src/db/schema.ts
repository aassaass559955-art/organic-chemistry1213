import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

/* ---------------------------------- Enums ---------------------------------- */

export const articleTypeEnum = pgEnum("article_type", [
  "RESEARCH",
  "STUDY",
  "THESIS",
  "ARTICLE",
  "NEWS",
]);

export const roleEnum = pgEnum("user_role", ["ADMIN", "EDITOR", "USER"]);

export const topicKindEnum = pgEnum("topic_kind", ["EXPLANATION", "STRUCTURE"]);

export const reactionTypeEnum = pgEnum("reaction_type", [
  "NAMED",
  "MECHANISM",
  "SYNTHESIS",
  "GENERAL",
]);

/* ---------------------------------- Types ---------------------------------- */

export type Attachment = {
  name: string;
  url: string;
  size: number;
  mime: string;
  uploadedAt?: string;
};

/* ---------------------------------- Users ---------------------------------- */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* -------------------------------- Researchers ------------------------------- */

export const researchers = pgTable("researchers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull().default(""),
  title: text("title").notNull().default(""),
  titleEn: text("title_en").notNull().default(""),
  bio: text("bio").notNull().default(""),
  bioEn: text("bio_en").notNull().default(""),
  university: text("university").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  email: text("email").notNull().default(""),
  orcid: text("orcid").notNull().default(""),
  achievements: jsonb("achievements").$type<string[]>().notNull().default([]),
  achievementsEn: jsonb("achievements_en")
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* -------------------------------- Categories -------------------------------- */

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull().default(""),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ----------------------------------- Tags ----------------------------------- */

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull().default(""),
  slug: text("slug").notNull().unique(),
});

/* --------------------------------- Articles --------------------------------- */

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: articleTypeEnum("type").notNull().default("ARTICLE"),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  abstractAr: text("abstract_ar").notNull().default(""),
  abstractEn: text("abstract_en").notNull().default(""),
  contentAr: text("content_ar").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  authorName: text("author_name").notNull().default(""),
  authorNameEn: text("author_name_en").notNull().default(""),
  university: text("university").notNull().default(""),
  universityEn: text("university_en").notNull().default(""),
  supervisor: text("supervisor").notNull().default(""),
  year: integer("year").notNull().default(2024),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  coverUrl: text("cover_url").notNull().default(""),
  attachments: jsonb("attachments")
    .$type<Attachment[]>()
    .notNull()
    .default([]),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const articleTags = pgTable(
  "article_tags",
  {
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]
);

/* --------------------------- Chemical topics (شرح) --------------------------- */

export const topics = pgTable("chemical_topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  kind: topicKindEnum("kind").notNull().default("EXPLANATION"),
  slug: text("slug").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  summaryAr: text("summary_ar").notNull().default(""),
  summaryEn: text("summary_en").notNull().default(""),
  contentAr: text("content_ar").notNull().default(""),
  contentEn: text("content_en").notNull().default(""),
  category: text("category").notNull().default("general"),
  attachments: jsonb("attachments")
    .$type<Attachment[]>()
    .notNull()
    .default([]),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* --------------------------------- Reactions -------------------------------- */

export const reactions = pgTable("reactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: reactionTypeEnum("type").notNull().default("NAMED"),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull().default(""),
  equation: text("equation").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  mechanismAr: text("mechanism_ar").notNull().default(""),
  mechanismEn: text("mechanism_en").notNull().default(""),
  reagents: text("reagents").notNull().default(""),
  conditions: text("conditions").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------ Library (books) ------------------------------ */

export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  author: text("author").notNull().default(""),
  year: integer("year").notNull().default(2020),
  descriptionAr: text("description_ar").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  coverColor: text("cover_color").notNull().default("#00B894"),
  fileUrl: text("file_url").notNull().default(""),
  fileSize: integer("file_size").notNull().default(0),
  pages: integer("pages").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* --------------------------------- Comments --------------------------------- */

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  body: text("body").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* --------------------------------- Downloads -------------------------------- */

export const downloads = pgTable("downloads", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id, {
    onDelete: "cascade",
  }),
  bookId: uuid("book_id").references(() => books.id, { onDelete: "cascade" }),
  file: text("file").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------- Notifications ------------------------------- */

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull().default(""),
  bodyAr: text("body_ar").notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ----------------------------------- Stats ---------------------------------- */

export const stats = pgTable("stats", {
  key: text("key").primaryKey(),
  value: integer("value").notNull().default(0),
});
