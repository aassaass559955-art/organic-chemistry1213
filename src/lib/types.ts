export type AttachmentDTO = {
  name: string;
  url: string;
  size: number;
  mime: string;
  uploadedAt?: string;
};

export type ArticleDTO = {
  id: string;
  type: "RESEARCH" | "STUDY" | "THESIS" | "ARTICLE" | "NEWS";
  slug: string;
  titleAr: string;
  titleEn: string;
  abstractAr: string;
  abstractEn: string;
  contentAr: string;
  contentEn: string;
  authorName: string;
  authorNameEn: string;
  university: string;
  universityEn: string;
  supervisor: string;
  year: number;
  keywords: string[];
  coverUrl: string;
  attachments: AttachmentDTO[];
  categoryId: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryDTO = { id: string; nameAr: string; nameEn: string; slug: string };
export type TagDTO = { id: string; nameAr: string; nameEn: string; slug: string };

export type TopicDTO = {
  id: string;
  kind: "EXPLANATION" | "STRUCTURE";
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  category: string;
  attachments: AttachmentDTO[];
  views: number;
  createdAt: string;
};

export type ReactionDTO = {
  id: string;
  type: "NAMED" | "MECHANISM" | "SYNTHESIS" | "GENERAL";
  nameAr: string;
  nameEn: string;
  equation: string;
  descriptionAr: string;
  descriptionEn: string;
  mechanismAr: string;
  mechanismEn: string;
  reagents: string;
  conditions: string;
};

export type BookDTO = {
  id: string;
  titleAr: string;
  titleEn: string;
  author: string;
  year: number;
  descriptionAr: string;
  descriptionEn: string;
  coverColor: string;
  fileUrl: string;
  fileSize: number;
  pages: number;
  downloads: number;
};

export type CommentDTO = {
  id: string;
  articleId: string;
  name: string;
  email: string;
  body: string;
  approved: boolean;
  createdAt: string;
};

export type NotificationDTO = {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
};

export type ResearcherDTO = {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  bio: string;
  bioEn: string;
  university: string;
  avatarUrl: string;
  email: string;
  orcid: string;
  achievements: string[];
  achievementsEn: string[];
};

export type PublicStats = {
  researches: number;
  studies: number;
  theses: number;
  articles: number;
  news: number;
  visitors: number;
  downloads: number;
  topics: number;
  reactions: number;
  books: number;
};
