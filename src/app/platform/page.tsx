import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight, HiHandRaised, HiPencilSquare } from "react-icons/hi2";
import { LoginButton } from "@/components/auth-buttons";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { auth } from "@/lib/auth";

function statusLabel(status: string) {
  if (status === "needs_changes") return "Needs changes";
  if (status === "paid_out") return "Paid out";
  return status.replace(/_/g, " ");
}

function canEdit(status: string) {
  return status === "draft" || status === "needs_changes";
}

const helpCards = [
  {
    title: "Plan the circuit",
    href: "/platform/get-started",
    image: "/assets/design.png",
  },
  {
    title: "Use the guides",
    href: "/platform/guides",
    image: "/assets/Build.png",
  },
  {
    title: "Check shipping rules",
    href: "/platform/requirements",
    image: "/assets/Recieve.png",
  },
];

export default async function PlatformPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <main className="max-w-3xl rounded-[16px] border border-black bg-white p-6 shadow-[4px_4px_0_#000]">
        <div className="flex items-center gap-3">
          <HiHandRaised className="size-7 text-[#BD0F32]" />
          <h1 className="text-3xl font-black text-black">Welcome</h1>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-black/60">
          Log in to see your projects and continue building.
        </p>
        <div className="mt-5">
          <LoginButton callbackURL="/platform" />
        </div>
      </main>
    );
  }

  const userProjects = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      reviewNote: projects.reviewNote,
    })
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.updatedAt))
    .limit(6);

  return (
    <main className="max-w-6xl space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1fr_390px]">
        <div className="rounded-[16px] border border-black bg-white p-6 shadow-[4px_4px_0_#000]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <HiHandRaised className="size-7 text-[#BD0F32]" />
                <h1 className="text-3xl font-black text-black">
                  Welcome, {session.user.name}
                </h1>
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
                Your projects are the main thing here. Open one, keep building,
                or start a new idea.
              </p>
            </div>
            <Link
              href="/platform/projects"
              className="shrink-0 rounded-xl bg-[#BD0F32] px-4 py-2.5 text-sm font-black text-white no-underline transition hover:bg-black"
            >
              New project
            </Link>
          </div>
        </div>

        <Link
          href="/platform/gallery"
          className="group relative min-h-44 overflow-hidden rounded-[16px] border border-black bg-black text-white shadow-[4px_4px_0_#BD0F32]"
        >
          <Image
            src="/assets/Build.png"
            alt="Breadboard build"
            fill
            sizes="390px"
            className="object-cover opacity-65 transition group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute right-4 bottom-4 left-4">
            <p className="text-xs font-black tracking-[0.18em] text-white/70 uppercase">
              Need ideas?
            </p>
            <p className="mt-1 text-2xl font-black">Browse the gallery</p>
          </div>
        </Link>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_330px]">
        <div className="rounded-[16px] border border-black bg-white p-3 shadow-[4px_4px_0_#000]">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-black">Your projects</h2>
              <span className="text-xs text-black/45">latest first</span>
            </div>
            <Link
              href="/platform/projects"
              className="text-sm font-black text-[#BD0F32] no-underline hover:text-black"
            >
              All projects
            </Link>
          </div>

          {userProjects.length > 0 ? (
            <div className="divide-y divide-black/10">
              {userProjects.map((project, index) => {
                const editable = canEdit(project.status);
                const image = helpCards[index % helpCards.length].image;

                return (
                  <div
                    key={project.id}
                    className="grid gap-3 px-3 py-4 md:grid-cols-[88px_1fr_auto] md:items-center"
                  >
                    <div className="relative hidden h-16 overflow-hidden rounded-[10px] border border-black bg-[#f4f4f4] md:block">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="88px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-xl font-black text-black">
                          {project.title}
                        </h3>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-black text-zinc-600 uppercase">
                          {statusLabel(project.status)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-black/55">
                        {project.reviewNote ||
                          project.description ||
                          "No description yet."}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {editable ? (
                        <Link
                          href={`/project-editor/${project.id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-black text-white no-underline transition hover:bg-[#BD0F32]"
                        >
                          <HiPencilSquare className="size-4" />
                          Editor
                        </Link>
                      ) : null}
                      <Link
                        href="/platform/projects"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-zinc-600 no-underline transition hover:bg-zinc-100 hover:text-black"
                      >
                        Details
                        <HiArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5">
              <h2 className="text-xl font-black text-black">No projects yet</h2>
              <p className="mt-1 text-sm text-black/55">
                Start one when you are ready.
              </p>
              <Link
                href="/platform/projects"
                className="mt-4 inline-flex rounded-xl bg-[#BD0F32] px-4 py-2.5 text-sm font-black text-white no-underline transition hover:bg-black"
              >
                Create project
              </Link>
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {helpCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group grid grid-cols-[92px_1fr] overflow-hidden rounded-[14px] border border-black bg-white text-black no-underline shadow-[3px_3px_0_#000] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#BD0F32]"
            >
              <div className="relative min-h-24 bg-[#f4f4f4]">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="92px"
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="flex items-center p-4">
                <p className="text-lg font-black leading-tight">{card.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
