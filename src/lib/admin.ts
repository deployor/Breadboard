import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import type { Session } from "@/lib/auth";

export async function isAdminSession(session: Session | null | undefined) {
  if (!session?.user.id) return false;

  const rows = await db
    .select({ admin: user.admin })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return rows[0]?.admin === true;
}

export async function requireAdminSession(session: Session | null | undefined) {
  if (!(await isAdminSession(session)) || !session) {
    throw new Error("Admin access required");
  }
  return session;
}
