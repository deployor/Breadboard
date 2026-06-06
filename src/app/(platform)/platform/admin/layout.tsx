import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession, isAdminSession } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/");
  if (!(await isAdminSession(session))) redirect("/platform");

  return <>{children}</>;
}
