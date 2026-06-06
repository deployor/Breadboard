"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SidebarLink = {
  label: string;
  href: string;
  note?: string;
};

type SidebarGroup = {
  title: string;
  links: SidebarLink[];
};

const groups: SidebarGroup[] = [
  {
    title: "Start",
    links: [
      { label: "Get started", href: "/get-started", note: "first stop" },
      { label: "Readme", href: "/readme" },
      { label: "FAQ", href: "/faq" },
      { label: "Requirements", href: "/requirements" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Breadboard basics", href: "/guides" },
      { label: "LED workshop", href: "/workshop", note: "hands-on" },
      { label: "Example submission", href: "/guides/example-submission" },
      { label: "Firmware guide", href: "/guides/firmware" },
    ],
  },
  {
    title: "Project help",
    links: [
      {
        label: "What counts as shipped",
        href: "/project-resources/what-is-a-shipped-project",
      },
      { label: "Good journaling", href: "/project-resources/good-journaling" },
      { label: "Design tips", href: "/project-resources/design-tips" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname === `/platform${href}`;
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-[92px] left-3 z-46 rounded-full border border-[#191a23] bg-[#fefffe] px-4 py-2 text-[13px] text-[#191a23] shadow-[0_3px_0_#191a23] transition hover:-translate-y-0.5 active:translate-y-0 md:hidden"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="docs-sidebar"
      >
        {open ? "Close" : "Contents"}
      </button>

      <aside
        id="docs-sidebar"
        className={`fixed top-20 bottom-0 left-0 z-45 w-[248px] overflow-y-auto border-r border-[#191a23]/20 bg-[#fefffe]/95 px-4 pt-5 pb-5 backdrop-blur transition-transform duration-200 md:top-24 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-[105%]"}`}
      >
        <div className="mb-5 border-b border-[#191a23]/15 pb-4">
          <p className="text-[12px] leading-none tracking-[0.16em] text-[#BD0F32] uppercase">
            Course map
          </p>
          <p className="mt-2 max-w-[18ch] text-[13px] leading-snug text-[#191a23]/65">
            Pick up where you left off. No mystery meat menus.
          </p>
        </div>

        <nav aria-label="Documentation sections" className="space-y-5">
          {groups.map((group) => (
            <section key={group.title} aria-labelledby={`${group.title}-nav`}>
              <h2
                id={`${group.title}-nav`}
                className="mb-2 text-[12px] text-[#191a23]/45"
              >
                {group.title}
              </h2>
              <div className="space-y-1">
                {group.links.map((link) => {
                  const active = isActive(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`group relative block rounded-[10px] border px-3 py-2.5 text-[14px] leading-tight no-underline transition active:translate-y-px ${
                        active
                          ? "border-[#BD0F32] bg-[#BD0F32] text-white shadow-[0_8px_18px_rgba(189,15,50,0.18)]"
                          : "border-transparent text-[#191a23] hover:border-[#191a23]/15 hover:bg-[#191a23]/[0.035]"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>{link.label}</span>
                        {link.note ? (
                          <span
                            className={`mt-0.5 rounded-full border px-1.5 py-0.5 text-[10px] leading-none ${
                              active
                                ? "border-white/45 text-white/85"
                                : "border-[#191a23]/15 text-[#191a23]/45 group-hover:text-[#191a23]/65"
                            }`}
                          >
                            {link.note}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className="mt-6 border-t border-[#191a23]/15 pt-4 text-[12px] leading-snug text-[#191a23]/55">
          <p className="max-w-[20ch]">
            Tip: build first, polish later. A messy working circuit beats a tidy
            plan.
          </p>
        </div>
      </aside>
    </>
  );
}
