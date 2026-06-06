"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@/lib/auth";

type ShipInput = {
  email: string;
  playableUrl: string;
  codeUrl: string;
  screenshotUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  birthday: string;
  firstName: string;
  lastName: string;
};

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Log in required");
  return session;
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function createProject(title: string, description: string) {
  const session = await requireSession();
  if (!clean(title)) throw new Error("Project title is required");
  const [project] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      title: clean(title) || "Untitled project",
      description: clean(description),
      email: session.user.email ?? "",
    })
    .returning({ id: projects.id });
  revalidatePath("/platform/projects");
  return project.id;
}

export async function updateProjectBasics(
  projectId: number,
  title: string,
  description: string,
) {
  const session = await requireSession();
  const existing = await db
    .select({ status: projects.status })
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    )
    .limit(1);
  if (
    !existing[0] ||
    !["draft", "needs_changes"].includes(existing[0].status)
  ) {
    throw new Error("This project is locked and cannot be edited.");
  }
  await db
    .update(projects)
    .set({
      title: clean(title) || "Untitled project",
      description: clean(description),
      updatedAt: new Date(),
    })
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    );
  revalidatePath("/platform/projects");
}

export async function shipProject(projectId: number, data: ShipInput) {
  const session = await requireSession();
  const existing = await db
    .select({ status: projects.status })
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    )
    .limit(1);
  if (
    !existing[0] ||
    !["draft", "needs_changes"].includes(existing[0].status)
  ) {
    throw new Error("This project cannot be shipped from its current status.");
  }
  const normalized = {
    email: clean(data.email),
    playableUrl: clean(data.playableUrl),
    codeUrl: clean(data.codeUrl),
    screenshotUrl: clean(data.screenshotUrl),
    addressLine1: clean(data.addressLine1),
    addressLine2: clean(data.addressLine2),
    city: clean(data.city),
    region: clean(data.region),
    country: clean(data.country),
    postalCode: clean(data.postalCode),
    birthday: clean(data.birthday),
    firstName: clean(data.firstName),
    lastName: clean(data.lastName),
  };
  const missing = [
    ["Email", normalized.email],
    ["Playable URL", normalized.playableUrl],
    ["Code URL", normalized.codeUrl],
    ["Screenshot", normalized.screenshotUrl],
    ["Address line 1", normalized.addressLine1],
    ["City", normalized.city],
    ["State / Province", normalized.region],
    ["Country", normalized.country],
    ["ZIP / Postal Code", normalized.postalCode],
    ["Birthday", normalized.birthday],
    ["First name", normalized.firstName],
    ["Last name", normalized.lastName],
  ].filter(([, value]) => !value);
  if (missing.length > 0) {
    throw new Error(
      `Missing fields: ${missing.map(([label]) => label).join(", ")}`,
    );
  }

  await db
    .update(projects)
    .set({
      ...normalized,
      status: "shipped",
      shippedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    );
  revalidatePath("/platform/projects");
  revalidatePath("/platform/admin/review");
}
