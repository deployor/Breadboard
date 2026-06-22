import Link from "next/link";
import { pageGridClass } from "@/components/shared/styles";

export function LaunchGate() {
  return (
    <div className={`${pageGridClass} min-h-screen`}>
      <main className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-lg rounded-[18px] border border-black bg-white p-10 text-center shadow-[8px_8px_0_#000]">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#BD0F32]">
            404
          </p>
          <h1 className="mt-4 text-6xl font-black text-black">Big WIP</h1>
          <p className="mt-4 text-base leading-relaxed text-black/65">
            Breadboard platform access is not launched yet. This part of the
            site is still being wired up.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#BD0F32] hover:-translate-y-0.5 hover:bg-[#BD0F32]"
          >
            Go home
          </Link>
        </div>
      </main>
    </div>
  );
}
