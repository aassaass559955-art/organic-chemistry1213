import { db } from "@/db";
import {
  articles,
  books,
  categories,
  comments,
  reactions,
  researchers,
  stats,
  tags,
  topics,
} from "@/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type {
  ArticleDTO,
  BookDTO,
  CategoryDTO,
  PublicStats,
  ReactionDTO,
  ResearcherDTO,
  TagDTO,
  TopicDTO,
} from "@/lib/types";

type ArticleRow = typeof articles.$inferSelect;

export function serializeArticle(a: ArticleRow): ArticleDTO {
  return {
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function listArticles(opts: {
  type?: string;
  q?: string;
  category?: string;
  author?: string;
  year?: string;
  university?: string;
  featured?: boolean;
  tag?: string;
  all?: boolean;
  limit?: number;
}): Promise<ArticleDTO[]> {
  const conds = [];
  if (!opts.all) conds.push(eq(articles.published, true));
  if (opts.type) conds.push(eq(articles.type, opts.type as never));
  if (opts.q) {
    const pattern = `%${opts.q}%`;
    conds.push(
      or(
        ilike(articles.titleAr, pattern),
        ilike(articles.titleEn, pattern),
        ilike(articles.abstractAr, pattern),
        ilike(articles.abstractEn, pattern)
      )
    );
  }
  if (opts.category) conds.push(eq(articles.categoryId, opts.category));
  if (opts.author) conds.push(eq(articles.authorName, opts.author));
  if (opts.university) conds.push(eq(articles.university, opts.university));
  if (opts.year) conds.push(eq(articles.year, parseInt(opts.year, 10)));
  if (opts.featured) conds.push(eq(articles.featured, true));

  let query = db
    .select()
    .from(articles)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(articles.createdAt))
    .$dynamic();

  if (opts.limit) query = query.limit(opts.limit);
  const rows = await query;
  return rows.map(serializeArticle);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getArticle(id: string): Promise<ArticleDTO | null> {
  const where = UUID_RE.test(id)
    ? or(eq(articles.id, id), eq(articles.slug, id))
    : eq(articles.slug, id);
  const rows = await db
    .select()
    .from(articles)
    .where(where)
    .limit(1);
  if (!rows.length) return null;
  await db
    .update(articles)
    .set({ views: sql`${articles.views} + 1` })
    .where(eq(articles.id, rows[0].id));
  return serializeArticle(rows[0]);
}

export async function getFilters(): Promise<{
  authors: string[];
  years: number[];
  universities: string[];
}> {
  const authorRows = await db
    .selectDistinct({ author: articles.authorName })
    .from(articles)
    .where(eq(articles.published, true));
  const yearRows = await db
    .selectDistinct({ year: articles.year })
    .from(articles)
    .where(eq(articles.published, true));
  const uniRows = await db
    .selectDistinct({ uni: articles.university })
    .from(articles)
    .where(eq(articles.published, true));
  return {
    authors: authorRows.map((r) => r.author).filter(Boolean).sort(),
    years: yearRows.map((r) => r.year).sort((a, b) => b - a),
    universities: uniRows.map((r) => r.uni).filter(Boolean).sort(),
  };
}

export async function listCategories(): Promise<CategoryDTO[]> {
  const rows = await db.select().from(categories);
  return rows.map((c) => ({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn, slug: c.slug }));
}

export async function listTags(): Promise<TagDTO[]> {
  const rows = await db.select().from(tags);
  return rows.map((t) => ({ id: t.id, nameAr: t.nameAr, nameEn: t.nameEn, slug: t.slug }));
}

export async function listBooks(): Promise<BookDTO[]> {
  const rows = await db.select().from(books).orderBy(desc(books.createdAt));
  return rows.map((b) => ({
    id: b.id,
    titleAr: b.titleAr,
    titleEn: b.titleEn,
    author: b.author,
    year: b.year,
    descriptionAr: b.descriptionAr,
    descriptionEn: b.descriptionEn,
    coverColor: b.coverColor,
    fileUrl: b.fileUrl,
    fileSize: b.fileSize,
    pages: b.pages,
    downloads: b.downloads,
  }));
}

export async function listReactions(): Promise<ReactionDTO[]> {
  const rows = await db.select().from(reactions).orderBy(desc(reactions.createdAt));
  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    nameAr: r.nameAr,
    nameEn: r.nameEn,
    equation: r.equation,
    descriptionAr: r.descriptionAr,
    descriptionEn: r.descriptionEn,
    mechanismAr: r.mechanismAr,
    mechanismEn: r.mechanismEn,
    reagents: r.reagents,
    conditions: r.conditions,
  }));
}

export async function listTopics(kind?: string): Promise<TopicDTO[]> {
  const conds = kind ? [eq(topics.kind, kind as never)] : [];
  const rows = await db
    .select()
    .from(topics)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(topics.createdAt);
  return rows.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }));
}

export async function getTopic(slug: string): Promise<TopicDTO | null> {
  const where = UUID_RE.test(slug)
    ? or(eq(topics.slug, slug), eq(topics.id, slug))
    : eq(topics.slug, slug);
  const rows = await db
    .select()
    .from(topics)
    .where(where)
    .limit(1);
  if (!rows.length) return null;
  await db
    .update(topics)
    .set({ views: sql`${topics.views} + 1` })
    .where(eq(topics.id, rows[0].id));
  return { ...rows[0], createdAt: rows[0].createdAt.toISOString() };
}

export async function getResearcher(): Promise<ResearcherDTO | null> {
  const rows = await db.select().from(researchers).limit(1);
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    nameEn: r.nameEn,
    title: r.title,
    titleEn: r.titleEn,
    bio: r.bio,
    bioEn: r.bioEn,
    university: r.university,
    avatarUrl: r.avatarUrl,
    email: r.email,
    orcid: r.orcid,
    achievements: r.achievements,
    achievementsEn: r.achievementsEn,
  };
}

export async function getPublicStats(): Promise<PublicStats> {
  const countOf = async (type: string) => {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(articles)
      .where(and(eq(articles.type, type as never), eq(articles.published, true)));
    return rows[0]?.n ?? 0;
  };
  const dlRows = await db.select({ n: sql<number>`coalesce(sum(${articles.downloads}),0)::int` }).from(articles);
  const bookDl = await db.select({ n: sql<number>`coalesce(sum(${books.downloads}),0)::int` }).from(books);
  const visitorRows = await db.select().from(stats).where(eq(stats.key, "visitors")).limit(1);
  const topicCount = await db.select({ n: sql<number>`count(*)::int` }).from(topics);
  const reactionCount = await db.select({ n: sql<number>`count(*)::int` }).from(reactions);
  const bookCount = await db.select({ n: sql<number>`count(*)::int` }).from(books);

  return {
    researches: await countOf("RESEARCH"),
    studies: await countOf("STUDY"),
    theses: await countOf("THESIS"),
    articles: await countOf("ARTICLE"),
    news: await countOf("NEWS"),
    visitors: visitorRows[0]?.value ?? 0,
    downloads: (dlRows[0]?.n ?? 0) + (bookDl[0]?.n ?? 0),
    topics: topicCount[0]?.n ?? 0,
    reactions: reactionCount[0]?.n ?? 0,
    books: bookCount[0]?.n ?? 0,
  };
}

export async function approvedComments(articleId: string) {
  return db
    .select()
    .from(comments)
    .where(and(eq(comments.articleId, articleId), eq(comments.approved, true)))
    .orderBy(desc(comments.createdAt));
}
