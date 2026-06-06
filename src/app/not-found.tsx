import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { pageGridClass } from "@/components/shared/styles";

export default function NotFoundPage() {
  return (
    <div className={`${pageGridClass} min-h-screen`}>
      <Header isSticky />
      <main className="flex min-h-[80vh] items-center justify-center p-8">
        <div className="max-w-md rounded-[16px] border border-black bg-white p-10 text-center shadow-[6px_6px_0_#000]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#BD0F32]">
            404
          </p>
          <h1 className="mt-3 text-5xl font-black text-black">
            Page not found
          </h1>
          <p className="mt-3 text-sm text-black/60">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#BD0F32] hover:-translate-y-0.5 hover:bg-[#BD0F32]"
          >
            Go home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
