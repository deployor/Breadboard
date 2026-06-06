import { DocsFrame, PageHero } from "@/components/docs-frame";
import { Steps } from "@/components/steps";

export default function GalleryPage() {
  return (
    <DocsFrame sidebar={false}>
      <PageHero title="Gallery">
        <p className="mt-2 text-base text-black/80">
          Browse build stages and project inspiration.
        </p>
      </PageHero>
      <section className="rounded-[12px] border-[1.1px] border-black bg-[#f4f4f4] p-8 shadow-[4px_4px_0_#000]">
        <p className="text-base text-black/50 italic">
          None submitted yet. Page in progress.
        </p>
      </section>
      <Steps />
    </DocsFrame>
  );
}
