import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/guards";
import { db } from "@/lib/db/connection";
import { projects } from "@/lib/db/schema";

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/platform/projects");
  const { id } = await params;
  const projectId = Number(id);
  const rows = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id)),
    )
    .limit(1);
  const project = rows[0];
  if (!project) notFound();
  if (project.status !== "draft" && project.status !== "needs_changes") {
    redirect("/platform/projects");
  }

  return (
    <div className="min-h-screen bg-[#fefffe] bg-[linear-gradient(to_right,rgba(25,26,35,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(25,26,35,0.14)_1px,transparent_1px)] bg-[length:32px_32px]">
      <header className="sticky top-0 z-30 flex h-12 items-center border-b border-black/15 bg-white/90 px-4 backdrop-blur-sm">
        <Link
          href="/platform/projects"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-black/50 no-underline transition-colors hover:text-[#BD0F32]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
            <path
              d="M7 2L3 6l4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to projects
        </Link>
        <span className="ml-3 text-xs font-bold text-black/25">/</span>
        <span className="ml-3 truncate text-xs font-black text-black">
          {project.title}
        </span>
      </header>

      <main className="flex min-h-[calc(100vh-48px)] items-center justify-center p-8">
        <section className="mx-auto max-w-4xl rounded-[18px] border border-black bg-[#f4f4f4] p-10 text-center shadow-[7px_7px_0_#000]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#BD0F32]">
            WIP editor
          </p>
          <h1 className="mt-3 text-6xl font-black text-black">
            {project.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-black/65">
            This will become the schematic/code/layout editor. It will autosave
            progress and track time spent here. For now, project info and
            shipping live in My Projects.
          </p>
        </section>
      </main>
    </div>
  );
}
