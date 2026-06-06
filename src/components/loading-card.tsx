import Image from "next/image";

export function LoadingCard() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Image
        src="/assets/loading.gif"
        alt="Loading"
        width={120}
        height={120}
        unoptimized
        className="h-30 w-30 object-contain"
      />
    </div>
  );
}

export function LoadingInline({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/assets/loading.gif"
        alt=""
        width={20}
        height={20}
        unoptimized
        className="size-5 object-contain"
      />
      <span>{label}</span>
    </span>
  );
}
