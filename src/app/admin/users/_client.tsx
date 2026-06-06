"use client";

import Image from "next/image";
import { useState } from "react";
import {
  addUserCredits,
  deductUserCredits,
  deleteUser,
  setUserCredits,
  updateUserProfile,
} from "./actions";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  balance: number;
  orderCount: number;
  pendingOrderCount: number;
  accountProviders: string[];
  activeSessionCount: number;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-black/45">
        {label}
      </span>
      {children}
    </div>
  );
}

export function AdminUserCard({
  user,
  currentUserId,
}: {
  user: AdminUser;
  currentUserId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [amount, setAmount] = useState(1);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    image: user.image ?? "",
    emailVerified: user.emailVerified,
  });

  const run = async (action: () => Promise<void>) => {
    setSaving(true);
    try {
      await action();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = () =>
    run(async () => {
      await updateUserProfile(user.id, form);
      setEditing(false);
    });

  const remove = () =>
    run(async () => {
      if (user.id === currentUserId) {
        throw new Error("You cannot delete your own account from admin");
      }
      if (
        !confirm(
          `Delete ${user.email}? This removes sessions, balances, cart, and orders.`,
        )
      ) {
        return;
      }
      await deleteUser(user.id);
    });

  return (
    <article className="overflow-hidden rounded-[18px] border-[1.5px] border-black bg-white shadow-[5px_5px_0_#000]">
      <div className="grid gap-4 border-b border-black bg-[#fffaf1] p-5 lg:grid-cols-[64px_1fr_auto] lg:items-center">
        <div className="relative size-16 overflow-hidden rounded-full border border-black bg-[#f4f4f4]">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-xl font-black text-[#BD0F32]">
              {user.name.slice(0, 1).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xl font-black text-black">
              {user.name}
            </h3>
            <span className="rounded-full border border-black bg-white px-3 py-1 text-xs font-black text-black">
              {user.balance} credits
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black ${
                user.emailVerified
                  ? "border-green-700 bg-green-50 text-green-800"
                  : "border-yellow-700 bg-yellow-50 text-yellow-800"
              }`}
            >
              {user.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>
          <p className="truncate text-sm text-black/60">{user.email}</p>
          <p className="mt-1 text-xs text-black/40">ID: {user.id}</p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-full border border-black px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
          >
            {expanded ? "Hide profile" : "View profile"}
          </button>
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="rounded-full border border-black px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
          >
            {editing ? "Cancel edit" : "Edit"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={saving || user.id === currentUserId}
            className="rounded-full border border-red-700 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {editing ? (
            <div className="grid gap-3 rounded-[14px] border border-black bg-[#f8f8f8] p-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="rounded-[10px] border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="rounded-[10px] border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Image URL">
                  <input
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      setForm({ ...form, image: event.target.value })
                    }
                    className="rounded-[10px] border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold text-black">
                <input
                  type="checkbox"
                  checked={form.emailVerified}
                  onChange={(event) =>
                    setForm({ ...form, emailVerified: event.target.checked })
                  }
                  className="size-4 accent-[#BD0F32]"
                />
                Email verified
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="rounded-full border border-black bg-[#BD0F32] px-4 py-2 text-sm font-black text-white transition hover:bg-black disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </div>
          ) : null}

          {expanded ? (
            <dl className="grid gap-3 rounded-[14px] border border-black/15 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-black text-black">Orders</dt>
                <dd className="text-black/60">
                  {user.orderCount} total, {user.pendingOrderCount} pending
                </dd>
              </div>
              <div>
                <dt className="font-black text-black">Active sessions</dt>
                <dd className="text-black/60">{user.activeSessionCount}</dd>
              </div>
              <div>
                <dt className="font-black text-black">Providers</dt>
                <dd className="text-black/60">
                  {user.accountProviders.join(", ") || "None"}
                </dd>
              </div>
              <div>
                <dt className="font-black text-black">Created</dt>
                <dd className="text-black/60">{user.createdAt}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-black text-black">Updated</dt>
                <dd className="text-black/60">{user.updatedAt}</dd>
              </div>
            </dl>
          ) : null}
        </div>

        <div className="rounded-[14px] border border-black bg-[#f4f4f4] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#BD0F32]">
            Currency tools
          </p>
          <p className="mt-1 text-3xl font-black text-black">{user.balance}</p>
          <p className="text-sm text-black/55">current credits</p>

          <Field label="Amount">
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-3 rounded-[10px] border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-[#BD0F32]/20"
            />
          </Field>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => run(() => addUserCredits(user.id, amount))}
              disabled={saving}
              className="rounded-full border border-black bg-green-50 px-3 py-2 text-sm font-black text-green-800 transition hover:bg-green-700 hover:text-white disabled:opacity-50"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => run(() => deductUserCredits(user.id, amount))}
              disabled={saving}
              className="rounded-full border border-black bg-yellow-50 px-3 py-2 text-sm font-black text-yellow-800 transition hover:bg-yellow-600 hover:text-white disabled:opacity-50"
            >
              Deduct
            </button>
            <button
              type="button"
              onClick={() => run(() => setUserCredits(user.id, amount))}
              disabled={saving}
              className="rounded-full border border-black bg-[#BD0F32] px-3 py-2 text-sm font-black text-white transition hover:bg-black disabled:opacity-50"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
