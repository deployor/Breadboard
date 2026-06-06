import Link from "next/link";

export function ShopTabs({ active }: { active: "shop" | "orders" }) {
  const tabs = [
    { href: "/platform/shop", label: "Shop", value: "shop" },
    { href: "/platform/shop/orders", label: "Orders", value: "orders" },
  ] as const;

  return (
    <div className="inline-flex rounded-full border border-black bg-white p-1 shadow-[3px_3px_0_#000]">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={tab.href}
          prefetch
          aria-current={active === tab.value ? "page" : undefined}
          className={`rounded-full px-5 py-2 text-sm font-black transition ${
            active === tab.value
              ? "bg-[#BD0F32] text-white"
              : "text-black hover:bg-black hover:text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
