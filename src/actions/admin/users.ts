"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/guards";
import { db } from "@/lib/db/connection";
import { user, userBalances } from "@/lib/db/schema";
import { normalizeCredits } from "@/lib/utils";

export async function updateUserProfile(
  userId: string,
  data: {
    name: string;
    email: string;
    image: string;
    emailVerified: boolean;
    admin: boolean;
  },
) {
  await requireAdminSession();
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const image = data.image.trim();

  if (!name) throw new Error("Name is required");
  if (!email || !email.includes("@"))
    throw new Error("Valid email is required");

  await db
    .update(user)
    .set({
      name,
      email,
      image: image || null,
      emailVerified: data.emailVerified,
      admin: data.admin,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));

  revalidatePath("/platform/admin/users");
}

export async function addUserCredits(userId: string, amount: number) {
  await requireAdminSession();
  const credits = normalizeCredits(amount);
  if (credits <= 0) throw new Error("Amount must be greater than zero");

  await db
    .insert(userBalances)
    .values({ userId, balance: credits, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userBalances.userId,
      set: {
        balance: sql`${userBalances.balance} + ${credits}`,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/platform/admin/users");
}

export async function deductUserCredits(userId: string, amount: number) {
  await requireAdminSession();
  const credits = normalizeCredits(amount);
  if (credits <= 0) throw new Error("Amount must be greater than zero");

  await db
    .insert(userBalances)
    .values({ userId, balance: 0, updatedAt: new Date() })
    .onConflictDoNothing({ target: userBalances.userId });

  await db
    .update(userBalances)
    .set({
      balance: sql`greatest(${userBalances.balance} - ${credits}, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(userBalances.userId, userId));

  revalidatePath("/platform/admin/users");
}

export async function setUserCredits(userId: string, amount: number) {
  await requireAdminSession();
  const credits = normalizeCredits(amount);

  await db
    .insert(userBalances)
    .values({ userId, balance: credits, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userBalances.userId,
      set: { balance: credits, updatedAt: new Date() },
    });

  revalidatePath("/platform/admin/users");
}

export async function deleteUser(userId: string) {
  const session = await requireAdminSession();
  if (session.user.id === userId)
    throw new Error("You cannot delete your own account from admin");

  await db.delete(user).where(eq(user.id, userId));
  revalidatePath("/platform/admin/users");
  revalidatePath("/platform/admin/orders");
  revalidatePath("/platform/admin/fulfillment");
}
