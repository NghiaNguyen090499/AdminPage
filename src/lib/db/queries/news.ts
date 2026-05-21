import { eq, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import type { NewNewsArticle } from "@/types/database";

export async function getAllNewsArticles() {
  return db.select().from(newsArticles).orderBy(asc(newsArticles.sortOrder));
}

export async function getNewsArticleById(id: string) {
  const results = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.id, id))
    .limit(1);
  return results[0] ?? null;
}

export async function getNewsArticleBySlug(slug: string) {
  const results = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.slug, slug))
    .limit(1);
  return results[0] ?? null;
}

export async function getPublishedNewsArticles() {
  return db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.isPublished, true))
    .orderBy(asc(newsArticles.sortOrder));
}

export async function createNewsArticle(data: NewNewsArticle) {
  const results = await db
    .insert(newsArticles)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return results[0];
}

export async function updateNewsArticle(
  id: string,
  data: Partial<NewNewsArticle>
) {
  const results = await db
    .update(newsArticles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(newsArticles.id, id))
    .returning();
  return results[0];
}

export async function deleteNewsArticle(id: string) {
  const results = await db
    .delete(newsArticles)
    .where(eq(newsArticles.id, id))
    .returning();
  return results[0];
}

export async function countNewsArticles() {
  const results = await db.select({ value: count() }).from(newsArticles);
  return results[0]?.value ?? 0;
}
