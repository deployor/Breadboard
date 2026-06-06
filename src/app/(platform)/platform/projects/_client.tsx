"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  FaArrowRight,
  FaBan,
  FaCircleCheck,
  FaClock,
  FaHammer,
  FaPaperPlane,
  FaPenToSquare,
  FaTriangleExclamation,
} from "react-icons/fa6";
import {
  createProject,
  shipProject,
  updateProjectBasics,
} from "@/actions/projects";
import { LoadingInline } from "@/components/shared/loading-card";
import { Modal } from "@/components/shared/modal";

type Project = {
  id: number;
  title: string;
  email: string;
  playableUrl: string;
  codeUrl: string;
  screenshotUrl: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
  birthday: string;
  firstName: string;
  lastName: string;
  hoursSpent: number;
  status: string;
  reviewNote: string;
};

const shipFields = [
  ["email", "Email"],
  ["playableUrl", "Playable URL"],
  ["codeUrl", "Code URL"],
  ["screenshotUrl", "Screenshot URL"],
  ["firstName", "First Name"],
  ["lastName", "Last Name"],
  ["birthday", "Birthday"],
  ["addressLine1", "Address line 1"],
  ["addressLine2", "Address line 2"],
  ["city", "City"],
  ["region", "State / Province"],
  ["country", "Country"],
  ["postalCode", "ZIP / Postal Code"],
] as const;

const statusStages = [
  {
    value: "shipped",
    label: "Shipped",
    icon: FaPaperPlane,
    helper: "Submitted",
  },
  {
    value: "reviewed",
    label: "Reviewed",
    icon: FaCircleCheck,
    helper: "Review passed",
  },
  {
    value: "paid_out",
    label: "Paid out",
    icon: FaClock,
    helper: "Credits sent",
  },
  {
    value: "fulfilled",
    label: "Fulfilled",
    icon: FaCircleCheck,
    helper: "Kit sent",
  },
] as const;

function statusCopy(status: string) {
  if (status === "draft")
    return "Draft: keep building. You can edit and open the editor.";
  if (status === "shipped") return "Shipped: waiting for admin review.";
  if (status === "needs_changes")
    return "Needs changes: review note below. Edit, fix, and ship again.";
  if (status === "reviewed") return "Reviewed: approved and waiting payout.";
  if (status === "paid_out") return "Paid out: currency has been awarded.";
  if (status === "fulfilled") return "Fulfilled: kit has been sent out.";
  if (status === "approved") return "Approved: legacy status.";
  if (status === "rejected")
    return "Rejected permanently: this project is closed.";
  return status;
}

function canEdit(status: string) {
  return status === "draft" || status === "needs_changes";
}

function canShip(status: string) {
  return status === "draft" || status === "needs_changes";
}

function getStatusMeta(status: string) {
  if (status === "rejected") {
    return {
      label: "Rejected",
      icon: FaBan,
      className: "border-red-700 bg-red-50 text-red-700",
    };
  }
  if (status === "fulfilled") {
    return {
      label: "Fulfilled",
      icon: FaCircleCheck,
      className: "border-green-800 bg-green-50 text-green-800",
    };
  }
  if (status === "paid_out") {
    return {
      label: "Paid out",
      icon: FaCircleCheck,
      className: "border-green-800 bg-green-50 text-green-800",
    };
  }
  if (status === "reviewed") {
    return {
      label: "Reviewed",
      icon: FaCircleCheck,
      className: "border-blue-800 bg-blue-50 text-blue-800",
    };
  }
  if (status === "shipped") {
    return {
      label: "In review",
      icon: FaClock,
      className: "border-blue-800 bg-blue-50 text-blue-800",
    };
  }
  if (status === "needs_changes") {
    return {
      label: "Needs changes",
      icon: FaTriangleExclamation,
      className: "border-yellow-800 bg-yellow-50 text-yellow-900",
    };
  }
  return {
    label: "Draft",
    icon: FaPenToSquare,
    className: "border-black bg-white text-black",
  };
}

export function ProjectsBoard({ projects }: { projects: Project[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [items, setItems] = useState(projects);

  const addProject = (project: Project) =>
    setItems((current) => [project, ...current]);
  const updateProject = (projectId: number, patch: Partial<Project>) =>
    setItems((current) =>
      current.map((project) =>
        project.id === projectId ? { ...project, ...patch } : project,
      ),
    );

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="rounded border border-black bg-[#BD0F32] px-6 py-4 text-sm font-black text-white shadow-[4px_4px_0_#000] transition hover:-translate-y-0.5 hover:bg-black"
      >
        New Project
      </button>
      {createOpen ? (
        <NewProjectModal
          onCreated={addProject}
          onClose={() => setCreateOpen(false)}
        />
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        {items.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onProjectChange={(patch) => updateProject(project.id, patch)}
          />
        ))}
        {items.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-black bg-white p-10 text-center shadow-[4px_4px_0_#000]">
            <p className="text-2xl font-black">No projects yet</p>
            <p className="mt-2 text-black/55">
              Create one with the button above. It will appear here.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function NewProjectModal({
  onCreated,
  onClose,
}: {
  onCreated: (project: Project) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="New project"
      title="What are you making?"
      tone="red"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black bg-white px-5 py-3 text-sm font-black shadow-[3px_3px_0_#000] hover:bg-black hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setMessage(null);
                try {
                  const id = await createProject(title, description);
                  onCreated({
                    id,
                    title: title.trim() || "Untitled project",
                    description: description.trim(),
                    email: "",
                    playableUrl: "",
                    codeUrl: "",
                    screenshotUrl: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    region: "",
                    country: "",
                    postalCode: "",
                    birthday: "",
                    firstName: "",
                    lastName: "",
                    hoursSpent: 0,
                    status: "draft",
                    reviewNote: "",
                  });
                  onClose();
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Failed");
                }
              })
            }
            className="rounded-full border border-black bg-[#BD0F32] px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#000] hover:bg-black disabled:opacity-50"
          >
            {pending ? <LoadingInline label="Creating" /> : "Create project"}
          </button>
        </div>
      }
    >
      <div className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
            Project title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            placeholder="Pocket synth, plant monitor, LED game..."
            className="rounded-[12px] border border-black bg-[#f4f4f4] px-4 py-4 text-xl font-black outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
            Short description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            placeholder="One or two sentences about the project."
            className="rounded-[12px] border border-black bg-[#f4f4f4] px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
          />
        </label>
        {message ? (
          <p className="text-sm font-bold text-[#BD0F32]">{message}</p>
        ) : null}
      </div>
    </Modal>
  );
}

function StatusFlow({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const MetaIcon = meta.icon;
  const currentIndex = statusStages.findIndex(
    (stage) => stage.value === status,
  );
  const showPipeline = currentIndex >= 0;

  return (
    <div className="mt-4 overflow-hidden rounded-[14px] border border-black bg-[#f4f4f4] shadow-[3px_3px_0_#000]">
      <div
        className={`flex items-start gap-3 border-b border-black p-4 ${meta.className}`}
      >
        <div className="grid size-10 shrink-0 place-items-center rounded-full border border-current bg-white/70">
          <MetaIcon className="text-lg" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] opacity-65">
            Current state
          </p>
          <p className="text-lg font-black leading-tight">{meta.label}</p>
          <p className="mt-1 text-sm font-semibold opacity-75">
            {statusCopy(status)}
          </p>
        </div>
      </div>

      {status === "rejected" ? (
        <div className="flex items-center gap-3 bg-red-50 p-4 text-red-700">
          <FaBan className="text-xl" />
          <p className="text-sm font-black uppercase tracking-[0.12em]">
            Permanently rejected
          </p>
        </div>
      ) : showPipeline ? (
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-2 p-3">
          {statusStages.map((stage, index) => {
            const Icon = stage.icon;
            const active = status === stage.value;
            const complete = currentIndex > index;
            return (
              <div key={stage.value} className="contents">
                <div
                  className={`rounded-[10px] border p-3 text-center ${
                    active
                      ? "border-black bg-[#BD0F32] text-white shadow-[3px_3px_0_#000]"
                      : complete
                        ? "border-black bg-black text-white"
                        : "border-black/20 bg-white text-black/40"
                  }`}
                >
                  <Icon className="mx-auto text-xl" />
                  <p className="mt-2 text-xs font-black uppercase leading-none">
                    {stage.label}
                  </p>
                  <p className="mt-1 text-[10px] font-bold opacity-70">
                    {stage.helper}
                  </p>
                </div>
                {index < statusStages.length - 1 ? (
                  <FaArrowRight
                    className={`self-center text-lg ${
                      complete ? "text-black" : "text-black/20"
                    }`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ProjectCard({
  project,
  onProjectChange,
}: {
  project: Project;
  onProjectChange: (patch: Partial<Project>) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const editable = canEdit(project.status);
  const shippable = canShip(project.status);

  return (
    <article className="rounded-[16px] border border-black bg-white p-5 shadow-[5px_5px_0_#000]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#BD0F32]">
            {project.status.replace(/_/g, " ")}
          </p>
          <h2 className="mt-1 text-3xl font-black text-black">
            {project.title}
          </h2>
        </div>
        <span className="rounded-full border border-black bg-[#f4f4f4] px-3 py-1 text-xs font-black">
          {project.hoursSpent}h tracked
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-black/60">
        {project.description || "No description yet."}
      </p>
      {project.reviewNote ? (
        <p className="mt-3 rounded border border-black bg-[#fffaf1] px-3 py-2 text-sm font-bold text-black">
          Review note: {project.reviewNote}
        </p>
      ) : null}

      <StatusFlow status={project.status} />

      <div className="mt-5 flex flex-wrap gap-2">
        {editable ? (
          <Link
            href={`/editor/${project.id}`}
            className="rounded-full border border-black bg-black px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#BD0F32] hover:bg-[#BD0F32]"
          >
            Open editor
          </Link>
        ) : null}
        {editable ? (
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="rounded-full border border-black bg-white px-4 py-2 text-sm font-black hover:bg-black hover:text-white"
          >
            Edit project
          </button>
        ) : null}
        {shippable ? (
          <button
            type="button"
            onClick={() => setShipOpen(true)}
            className="rounded-full border border-black bg-[#BD0F32] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0_#000] hover:bg-black"
          >
            {project.status === "needs_changes" ? "Reship" : "Ship"}
          </button>
        ) : null}
      </div>
      {editOpen ? (
        <EditProjectModal
          project={project}
          onSaved={onProjectChange}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
      {shipOpen ? (
        <ShipModal
          project={project}
          onShipped={onProjectChange}
          onClose={() => setShipOpen(false)}
        />
      ) : null}
    </article>
  );
}

function EditProjectModal({
  project,
  onSaved,
  onClose,
}: {
  project: Project;
  onSaved: (patch: Partial<Project>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Edit project"
      title="Project info"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black bg-white px-5 py-3 text-sm font-black shadow-[3px_3px_0_#000] hover:bg-black hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setMessage(null);
                try {
                  await updateProjectBasics(project.id, title, description);
                  onSaved({ title, description });
                  onClose();
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Failed");
                }
              })
            }
            className="rounded-full border border-black bg-[#BD0F32] px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#000] hover:bg-black disabled:opacity-50"
          >
            {pending ? <LoadingInline label="Saving" /> : "Save changes"}
          </button>
        </div>
      }
    >
      <div className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
            Project title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            className="rounded-[12px] border border-black bg-[#f4f4f4] px-4 py-4 text-xl font-black outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
            className="rounded-[12px] border border-black bg-[#f4f4f4] px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
          />
        </label>
        {message ? (
          <p className="text-sm font-bold text-[#BD0F32]">{message}</p>
        ) : null}
      </div>
    </Modal>
  );
}

function ShipModal({
  project,
  onShipped,
  onClose,
}: {
  project: Project;
  onShipped: (patch: Partial<Project>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(project);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const update = (key: keyof Project, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Ship project"
      title={project.title}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black bg-white px-5 py-3 text-sm font-black shadow-[3px_3px_0_#000] hover:bg-black hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setMessage(null);
                try {
                  await shipProject(project.id, form);
                  onShipped({ ...form, status: "shipped", reviewNote: "" });
                  onClose();
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Failed");
                }
              })
            }
            className="rounded-full border border-black bg-[#BD0F32] px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#000] hover:bg-black disabled:opacity-50"
          >
            {pending ? <LoadingInline label="Shipping" /> : "Submit for review"}
          </button>
        </div>
      }
    >
      <p className="mb-4 text-sm font-semibold text-black/60">
        Confirm unified fields before review.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shipFields.map(([key, label]) => (
          <label key={key} className="flex flex-col gap-1">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
              {label}
            </span>
            <input
              value={String(form[key])}
              onChange={(event) => update(key, event.target.value)}
              className="rounded-[10px] border border-black bg-[#f4f4f4] px-3 py-2 text-sm"
            />
          </label>
        ))}
        {message ? (
          <p className="md:col-span-2 xl:col-span-3 text-sm font-bold text-[#BD0F32]">
            {message}
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
