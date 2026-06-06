import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
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
    <main className="min-h-screen bg-[#fefffe] bg-[linear-gradient(to_right,rgba(25,26,35,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(25,26,35,0.14)_1px,transparent_1px)] bg-[length:32px_32px] p-8">
      <Link
        href="/platform/projects"
        className="inline-block rounded border border-black bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#000] hover:bg-black hover:text-white"
      >
        Back to projects
      </Link>
      <section className="mx-auto mt-16 max-w-4xl rounded-[18px] border border-black bg-[#f4f4f4] p-10 text-center shadow-[7px_7px_0_#000]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#BD0F32]">
          WIP editor
        </p>
        <h1 className="mt-3 text-6xl font-black text-black">{project.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-black/65">
          This will become the schematic/code/layout editor. It will autosave
          progress and track time spent here. For now, project info and shipping
          live in My Projects.
        </p>
      </section>
    </main>
  );
}
