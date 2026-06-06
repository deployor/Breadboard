import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { FAQCards } from "@/components/marketing/faq-cards";
import { Hero } from "@/components/marketing/hero";
import { ScrollIndicator } from "@/components/marketing/scroll-indicator";
import { Steps } from "@/components/marketing/steps";
import { badgeLinkClass, pageGridClass } from "@/components/shared/styles";

export default function Home() {
  return (
    <>
      <Header />
      <div className={`${pageGridClass} relative min-h-screen`}>
        <a
          href="https://hackclub.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`${badgeLinkClass} fixed top-20 left-2 z-999 hidden w-28 xl:block 2xl:w-32`}
        >
          <Image
            src="https://assets.hackclub.com/banners/2026.svg"
            alt="Hack Club 2026"
            width={128}
            height={256}
            className="block w-full border-0"
          />
        </a>
        <Hero />
        <Steps />
        <FAQCards />
        <ScrollIndicator />
      </div>
      <Footer />
    </>
  );
}
