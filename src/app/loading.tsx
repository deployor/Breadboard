import Image from "next/image";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#FEFFFE]">
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
