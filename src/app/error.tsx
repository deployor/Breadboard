"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md rounded-[16px] border border-black bg-white p-8 text-center shadow-[6px_6px_0_#000]">
        <h1 className="text-4xl font-black text-black">Something went wrong</h1>
        <p className="mt-3 text-sm text-black/60">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full rounded-xl bg-[#BD0F32] px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#000] hover:-translate-y-0.5 hover:bg-black"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full rounded-xl border border-black bg-white px-6 py-3 text-sm font-black text-black shadow-[3px_3px_0_#000] hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
