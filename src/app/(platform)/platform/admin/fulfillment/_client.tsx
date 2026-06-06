"use client";

import Image from "next/image";
import { useState } from "react";
import { updateOrderStatus } from "@/actions/shop";

type FulfillmentItem = {
  id: number;
  name: string;
  imageUrl: string;
  quantity: number;
};

export function FulfillmentCard({
  order,
  items,
}: {
  order: {
    id: number;
    status: "pending" | "being_fulfilled" | "sent" | "cancelled";
    totalCost: number;
    userEmail: string;
    shippingName: string;
    shippingLine1: string;
    shippingLine2: string;
    shippingCity: string;
    shippingRegion: string;
    shippingPostalCode: string;
    shippingCountry: string;
  };
  items: FulfillmentItem[];
}) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const accepted = order.status === "being_fulfilled";
  const allChecked = items.every((item) => checked[item.id]);

  const setStatus = async (
    status: "pending" | "being_fulfilled" | "sent" | "cancelled",
    trackingInfo?: string,
  ) => {
    setSaving(true);
    try {
      await updateOrderStatus(order.id, status, trackingInfo);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    if (!tracking.trim()) {
      alert("Paste a tracking link first.");
      return;
    }
    await setStatus("sent", tracking.trim());
  };

  return (
    <div className="overflow-hidden rounded-[18px] border border-black bg-white shadow-[6px_6px_0_#000]">
      <div className="grid gap-4 border-b border-black bg-[#f4f4f4] p-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#BD0F32]">
            Order #{order.id}
          </p>
          <h2 className="mt-2 text-4xl font-black text-black">
            {accepted ? order.shippingName || order.userEmail : "Packing list"}
          </h2>
          <p className="mt-1 text-sm text-black/60">
            {accepted
              ? order.userEmail
              : "Accept the order to view the address."}
          </p>
        </div>
        <div className="rounded-[12px] border border-black bg-white px-5 py-4 lg:text-right">
          <p className="text-sm font-bold text-black/55">Total</p>
          <p className="text-3xl font-black text-black">{order.totalCost}c</p>
          <p className="mt-1 text-sm font-black text-[#BD0F32]">
            {order.status.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <label
              key={item.id}
              className="grid cursor-pointer gap-4 rounded-[14px] border border-black bg-white p-4 transition hover:bg-[#f4f4f4] sm:grid-cols-[96px_1fr_120px_auto] sm:items-center"
            >
              <div className="relative h-24 w-24 rounded-[12px] border border-black bg-[#f4f4f4]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
              <div>
                <p className="text-2xl font-black text-black">{item.name}</p>
                <p className="mt-1 text-sm font-semibold text-black/55">
                  Pack this item
                </p>
              </div>
              <div className="rounded-[12px] border border-black bg-[#BD0F32] px-4 py-3 text-center text-white">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">
                  Qty
                </p>
                <p className="text-5xl font-black leading-none">
                  {item.quantity}
                </p>
              </div>
              <input
                type="checkbox"
                disabled={!accepted}
                checked={checked[item.id] ?? false}
                onChange={(event) =>
                  setChecked({ ...checked, [item.id]: event.target.checked })
                }
                className="size-8 accent-[#BD0F32] disabled:opacity-30"
              />
            </label>
          ))}
        </div>

        <div className="space-y-4">
          {accepted ? (
            <div className="rounded-[14px] border border-black bg-[#f4f4f4] p-5">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-black/45">
                Ship to
              </p>
              <div className="mt-3 space-y-1 text-sm font-semibold text-black">
                <p>{order.shippingName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 ? <p>{order.shippingLine2}</p> : null}
                <p>
                  {order.shippingCity}, {order.shippingRegion}{" "}
                  {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>
          ) : null}

          <div className="rounded-[14px] border border-black bg-white p-5">
            {order.status === "pending" ? (
              <button
                type="button"
                onClick={() => setStatus("being_fulfilled")}
                disabled={saving}
                className="w-full rounded-full border border-black bg-[#BD0F32] px-5 py-3 text-sm font-black text-white transition hover:bg-black disabled:opacity-50"
              >
                {saving ? "Accepting..." : "Accept order"}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  disabled={saving}
                  className="w-full rounded-full border border-black px-5 py-3 text-sm font-black transition hover:bg-black hover:text-white disabled:opacity-50"
                >
                  Undo accept
                </button>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-black/50">
                    Tracking link
                  </span>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(event) => setTracking(event.target.value)}
                    className="rounded-[10px] border border-black bg-white px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={finish}
                  disabled={saving || !allChecked}
                  className="w-full rounded-full border border-black bg-[#BD0F32] px-5 py-3 text-sm font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Fulfilled"}
                </button>
                {!allChecked ? (
                  <p className="text-xs font-semibold text-black/50">
                    Tick every item before fulfilling.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
