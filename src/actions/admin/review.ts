"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { CREDITS_PER_HOUR } from "@/lib/constants";
import { db } from "@/lib/db/connection";
import { projects, userBalances } from "@/lib/db/schema";

async function getProject(projectId: number) {
  const row = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  const project = row[0];
  if (!project) throw new Error("Project not found");
  return project;
}

async function creditUser(userId: string, amount: number) {
  const existing = await db
    .select()
    .from(userBalances)
    .where(eq(userBalances.userId, userId))
    .limit(1);
  if (existing[0]) {
    await db
      .update(userBalances)
      .set({ balance: existing[0].balance + amount, updatedAt: new Date() })
      .where(eq(userBalances.id, existing[0].id));
  } else {
    await db.insert(userBalances).values({ userId, balance: amount });
  }
}

function revalidateReview(projectId?: number) {
  revalidatePath("/platform/admin/review");
  if (projectId) revalidatePath(`/platform/admin/review/${projectId}`);
  revalidatePath("/platform/projects");
}

export async function markReviewed(
  projectId: number,
  overrideHours: number,
  justification: string,
) {
  await requireAdminSession();
  const project = await getProject(projectId);
  if (project.status !== "shipped")
    throw new Error("Only shipped projects can be reviewed");
  const hours = Math.max(
    0,
    Math.floor(Number(overrideHours || project.hoursSpent) || 0),
  );

  await db
    .update(projects)
    .set({
      status: "reviewed",
      overrideHoursSpent: hours,
      overrideHoursSpentJustification: justification.trim(),
      reviewNote: "",
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));
  revalidateReview(projectId);
}

export async function approveProject(
  projectId: number,
  approvedHours: number,
  justification: string,
  userComment: string,
) {
  await requireAdminSession();
  const project = await getProject(projectId);
  if (project.status !== "shipped")
    throw new Error("Only shipped projects can be approved");
  const hours = Math.max(0, Math.floor(Number(approvedHours) || 0));
  const credits = hours * CREDITS_PER_HOUR;
  await creditUser(project.userId, credits);

  await db
    .update(projects)
    .set({
      status: "paid_out",
      overrideHoursSpent: hours,
      overrideHoursSpentJustification: justification.trim(),
      reviewNote: userComment.trim(),
      creditedAmount: credits,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));
  revalidateReview(projectId);
}

export async function payOutProject(projectId: number) {
  await requireAdminSession();
  const project = await getProject(projectId);
  if (project.status !== "reviewed")
    throw new Error("Only reviewed projects can be paid out");
  const hours = Math.max(
    0,
    Math.floor(Number(project.overrideHoursSpent ?? project.hoursSpent) || 0),
  );
  await creditUser(project.userId, hours * CREDITS_PER_HOUR);

  await db
    .update(projects)
    .set({
      status: "paid_out",
      creditedAmount: hours * CREDITS_PER_HOUR,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));
  revalidateReview(projectId);
}

export async function fulfillProject(projectId: number) {
  await requireAdminSession();
  const project = await getProject(projectId);
  if (project.status !== "paid_out")
    throw new Error("Only paid out projects can be fulfilled");

  await db
    .update(projects)
    .set({ status: "fulfilled", updatedAt: new Date() })
    .where(eq(projects.id, projectId));
  revalidateReview(projectId);
}

export async function requestChanges(projectId: number, note: string) {
  await requireAdminSession();
  await db
    .update(projects)
    .set({
      status: "needs_changes",
      reviewNote: note.trim(),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));
  revalidateReview(projectId);
}

export async function rejectProject(projectId: number, note: string) {
  await requireAdminSession();
  await db
    .update(projects)
    .set({ status: "rejected", reviewNote: note.trim(), updatedAt: new Date() })
    .where(eq(projects.id, projectId));
  revalidateReview(projectId);
}
