"use client";

import { useEffect, useState } from "react";

export function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 6) setHidden(true);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-[0.2rem] transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
    >
      <span className="block size-4 animate-[chevron-cascade_1.4s_ease-in-out_infinite] border-r-2 border-b-2 border-[#191a23] opacity-0" />
      <span className="block size-4 animate-[chevron-cascade_1.4s_ease-in-out_infinite] border-r-2 border-b-2 border-[#191a23] opacity-0 [animation-delay:0.18s]" />
      <span className="block size-4 animate-[chevron-cascade_1.4s_ease-in-out_infinite] border-r-2 border-b-2 border-[#191a23] opacity-0 [animation-delay:0.36s]" />
    </div>
  );
}
