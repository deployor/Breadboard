import type { ReactNode } from "react";
import { PlatformSidebar } from "@/components/layout/platform-sidebar";
import { LoginButton } from "@/components/shared/auth-buttons";
import { pageGridClass } from "@/components/shared/styles";
import { getSession, isAdminSession } from "@/lib/auth/guards";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return (
      <div className={`${pageGridClass} min-h-screen`}>
        <main className="flex min-h-screen items-center justify-center p-8">
          <div className="max-w-md rounded-[16px] border border-black bg-white p-8 text-center shadow-[6px_6px_0_#000]">
            <h1 className="text-3xl font-black text-black">Sign in required</h1>
            <p className="mt-3 text-sm text-black/60">
              You need to sign in with Hack Club to access the platform.
            </p>
            <div className="mt-6 flex justify-center">
              <LoginButton callbackURL="/platform" />
            </div>
          </div>
        </main>
      </div>
    );
  }

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
