import { headers } from "next/headers";
import type { ReactNode } from "react";
import { PlatformSidebar } from "@/components/platform-sidebar";
import { pageGridClass } from "@/components/styles";
import { isAdminSession } from "@/lib/admin";
import { auth } from "@/lib/auth";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = await isAdminSession(session);

  return (
    <div className={`${pageGridClass} min-h-screen`}>
      <PlatformSidebar
        isAdmin={isAdmin}
        user={
          session
            ? { name: session.user.name, email: session.user.email }
            : null
        }
      />

      <main className="min-h-screen py-10 pr-10 pl-[320px]">
        <div className="mx-auto max-w-[1320px]">{children}</div>
      </main>
    </div>
  );
}
