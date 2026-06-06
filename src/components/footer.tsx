import { linkUnderlineClass } from "./styles";

export function Footer() {
  return (
    <footer className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#BD0F32] text-white after:absolute after:right-0 after:bottom-[-24px] after:left-0 after:h-6 after:bg-[#BD0F32] after:pointer-events-none after:content-['']">
      <div className="mx-auto max-w-[1440px] px-8 py-12 text-center md:py-16">
        <div className="flex flex-col gap-6">
          <p className="text-base font-semibold leading-relaxed md:text-lg">
            Build with ❤️ by teenagers, for teenagers at{" "}
            <a
              href="https://hackclub.com"
              className="underline decoration-white/80"
            >
              Hack Club
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">
            <a href="https://hackclub.com" className={linkUnderlineClass}>
              Hack Club
            </a>
            <span>|</span>
            <a href="https://hackclub.com/slack" className={linkUnderlineClass}>
              Slack
            </a>
            <span>|</span>
            <a
              href="https://www.youtube.com/@HackClubHQ"
              className={linkUnderlineClass}
            >
              YouTube
            </a>
            <span>|</span>
            <a
              href="https://www.instagram.com/starthackclub/"
              className={linkUnderlineClass}
            >
              Instagram
            </a>
          </div>

          <p className="mx-auto max-w-4xl text-sm leading-relaxed text-white/90 md:text-base">
            Hack Club is a 501(c)(3) nonprofit and network of 60k+ technical
            high schoolers. We believe you learn best by building so we're
            creating community and providing grants so you can make awesome
            projects. In the past few years, we've partnered with GitHub to run
            Summer of Making, hosted the world's longest hackathon on land, and
            ran Canada's largest high school hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}
