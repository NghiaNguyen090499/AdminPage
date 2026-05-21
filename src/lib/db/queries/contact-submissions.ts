import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import type { NewContactSubmission } from "@/types/database";

export async function getAllContactSubmissions() {
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt), asc(contactSubmissions.name));
}

export async function getContactSubmissionById(id: string) {
  const results = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);
  return results[0] ?? null;
}

export async function createContactSubmission(data: NewContactSubmission) {
  const results = await db
    .insert(contactSubmissions)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return results[0];
}

export async function updateContactSubmission(
  id: string,
  data: Partial<NewContactSubmission>
) {
  const results = await db
    .update(contactSubmissions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id))
    .returning();
  return results[0];
}

export async function countContactSubmissions() {
  const results = await db.select({ value: count() }).from(contactSubmissions);
  return results[0]?.value ?? 0;
}
