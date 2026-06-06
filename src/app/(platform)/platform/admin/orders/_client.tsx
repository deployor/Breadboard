"use client";

import Image from "next/image";
import { useState } from "react";
import { updateOrderStatus } from "@/actions/shop";

type AdminOrderItem = {
  name: string;
  imageUrl: string;
  quantity: number;
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "being_fulfilled", label: "Being fulfilled" },
  { value: "sent", label: "Sent" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderRow({
  orderId,
  currentStatus,
  currentTracking,
  userEmail,
  totalCost,
  items,
  createdAt,
}: {
  orderId: number;
  currentStatus: string;
  currentTracking: string | null;
  userEmail: string;
  totalCost: number;
  items: AdminOrderItem[];
  createdAt: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(currentTracking ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(
        orderId,
        status as "pending" | "being_fulfilled" | "sent" | "cancelled",
        tracking || undefined,
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-black bg-white shadow-[4px_4px_0_#000]">
      <div className="grid gap-3 border-b border-black bg-[#f4f4f4] px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-lg font-black text-black">Order #{orderId}</p>
          <p className="text-sm text-black/60">{userEmail}</p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-black text-black">{totalCost} credits</p>
          <p className="text-black/50">{createdAt}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[72px_1fr] gap-3 rounded-[10px] border border-black/15 p-3"
            >
              <div className="relative h-[72px] w-[72px] rounded-[8px] border border-black bg-[#f4f4f4]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="72px"
                  className="object-contain p-2"
                />
              </div>
              <div>
                <p className="font-black text-black">{item.name}</p>
                <p className="text-sm text-black/55">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-black/50">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-[10px] border border-black bg-white px-3 py-2 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-black/50">Tracking</span>
            <input
              type="text"
              value={tracking}
              onChange={(event) => setTracking(event.target.value)}
              placeholder="Tracking link"
              className="rounded-[10px] border border-black bg-white px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full rounded-full border border-black bg-[#BD0F32] px-4 py-3 text-sm font-black text-white transition hover:bg-black disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
