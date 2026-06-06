import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { LoginButton } from "@/components/auth-buttons";
import { PageHero } from "@/components/platform-docs-frame";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ProjectsBoard } from "./_client";

export default async function ProjectsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return (
      <>
        <PageHero title="My Projects" />
        <div className="rounded-[12px] border border-black bg-[#f4f4f4] p-6 shadow-[4px_4px_0_#000]">
          <LoginButton callbackURL="/platform/projects" />
        </div>
      </>
    );
  }

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.updatedAt));

  return (
    <>
      <PageHero title="My Projects">
        <p className="mt-2 text-sm text-black/60">
          Make projects, open the WIP editor, then ship when ready.
        </p>
      </PageHero>
      <ProjectsBoard projects={userProjects} />
    </>
  );
}
