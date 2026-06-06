"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { reviewNotes } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin";
import { auth } from "@/lib/auth";

async function getAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  await requireAdminSession(session);
  if (!session) throw new Error("Not authenticated");
  return session;
}

export type ReviewNote = {
  id: number;
  projectId: number | null;
  targetUserId: string | null;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

function revalidate(projectId?: number) {
  revalidatePath("/platform/admin/review");
  if (projectId) revalidatePath(`/platform/admin/review/${projectId}`);
}

export async function addProjectNote(projectId: number, content: string) {
  const session = await getAdmin();
  await db.insert(reviewNotes).values({
    projectId,
    authorId: session.user.id,
    authorName: session.user.name,
    content: content.trim(),
  });
  revalidate(projectId);
}

export async function addUserNote(targetUserId: string, content: string) {
  const session = await getAdmin();
  await db.insert(reviewNotes).values({
    targetUserId,
    authorId: session.user.id,
    authorName: session.user.name,
    content: content.trim(),
  });
  revalidate();
}

export async function editNote(noteId: number, content: string) {
  const session = await getAdmin();
  const row = await db
    .select({ authorId: reviewNotes.authorId })
    .from(reviewNotes)
    .where(eq(reviewNotes.id, noteId))
    .limit(1);
  const note = row[0];
  if (!note) throw new Error("Note not found");
  if (note.authorId !== session.user.id)
    throw new Error("Can only edit your own notes");
  await db
    .update(reviewNotes)
    .set({ content: content.trim(), updatedAt: new Date() })
    .where(eq(reviewNotes.id, noteId));
  revalidate();
}

export async function deleteNote(noteId: number) {
  const session = await getAdmin();
  const row = await db
    .select({
      authorId: reviewNotes.authorId,
      projectId: reviewNotes.projectId,
    })
    .from(reviewNotes)
    .where(eq(reviewNotes.id, noteId))
    .limit(1);
  const note = row[0];
  if (!note) throw new Error("Note not found");
  if (note.authorId !== session.user.id)
    throw new Error("Can only delete your own notes");
  await db.delete(reviewNotes).where(eq(reviewNotes.id, noteId));
  revalidate(note.projectId ?? undefined);
}

export async function getProjectNotes(
  projectId: number,
): Promise<ReviewNote[]> {
  return db
    .select()
    .from(reviewNotes)
    .where(eq(reviewNotes.projectId, projectId))
    .orderBy(desc(reviewNotes.createdAt));
}

export async function getUserNotes(
  targetUserId: string,
): Promise<ReviewNote[]> {
  return db
    .select()
    .from(reviewNotes)
    .where(eq(reviewNotes.targetUserId, targetUserId))
    .orderBy(desc(reviewNotes.createdAt));
}
