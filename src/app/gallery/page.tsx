import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { pageGridClass } from "@/components/shared/styles";
import { PageHero } from "@/components/ui/card";
import { Steps } from "@/components/marketing/steps";

export default function GalleryPage() {
  return (
    <div className={`${pageGridClass} min-h-screen`}>
      <Header isSticky />
      <main className="min-h-screen px-6 pt-24 pb-16 md:pt-28 md:px-8">
        <PageHero title="Gallery">
          <p className="mt-2 text-base text-black/80">
            Browse build stages and project inspiration.
          </p>
        </PageHero>
        <div className="rounded-[12px] border-[1.1px] border-black bg-[#f4f4f4] p-8 shadow-[4px_4px_0_#000]">
          <p className="text-base text-black/50 italic">
            None submitted yet. Page in progress.
          </p>
        </div>
        <Steps />
      </main>
      <Footer />
    </div>
  );
}
