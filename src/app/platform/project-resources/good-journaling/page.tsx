import {
  DocsFrame,
  PageHero,
  ProseCard,
} from "@/components/platform-docs-frame";

export default function JournalingPage() {
  return (
    <DocsFrame>
      <section>
        <PageHero title="How to Journal">
          <p className="mt-2 text-base text-black/80">
            A guide to writing a great project journal.
          </p>
        </PageHero>

        <ProseCard>
          <h2>Why Journal?</h2>

          <p>
            When you finish a project, it&apos;s easy to forget how much work
            was put into it. There may be times where you spent five hours on a
            module that you decided to scrap anyway, or where you completely
            revamped your project. Iterations always exist in hardware projects!
            When you look back at the project a few years from now it&apos;ll be
            very difficult to remember anything about it.{" "}
            <strong>Your journal is where all of that lives!</strong>
          </p>

          <p>
            Additionally, without a journal, your steps are not documented.
            It&apos;s impossible for people to learn from a project merely from
            the final product. Your journal allows other people to understand
            your research, the effort put into the project, and all the steps
            taken to reach the final product.
          </p>

          <p>
            In this program, your journal is also how reviewers verify your
            work. They&apos;re reading it to understand what you built, confirm
            the hours you&apos;re claiming, and see that you actually understood
            the decisions you were making, not just that you followed a tutorial
            or copied a reference design.
          </p>

          <h2>Where Does It Live?</h2>

          <p>
            Your journal goes in a file called <code>JOURNAL.md</code> in the
            root of your GitHub repository. Every session of work gets its own
            entry, added to the bottom of the file. Not sure how to format it?
            Check out this{" "}
            <a href="https://www.markdownguide.org/basic-syntax/">
              Markdown formatting guide
            </a>
            .
          </p>

          <h2>How Do You Journal?</h2>

          <p>
            <strong>A good journal reads like a story.</strong> Not a dry log of
            actions, but a real account of your build: what you were trying to
            do, what happened, what went wrong, and how you got through it.
          </p>

          <p>
            Every entry covers one session of work. It should, in general,
            include:
          </p>

          <ul>
            <li>What you did</li>
            <li>Why you did what you did</li>
            <li>What issues you ran into</li>
          </ul>

          <h3>Explain your decisions, not just your actions!</h3>

          <p>
            The most important thing you can do in a journal entry is explain{" "}
            <em>why</em>, not just <em>what</em>.
          </p>

          <p>
            <strong>Bad:</strong> &ldquo;I added a buck converter.&rdquo;
          </p>

          <p>
            <strong>Good:</strong> &ldquo;It might be a bit wrong, but I&apos;ll
            figure that out in a bit, for now, we need to convert the 12/24V
            down to 3.3V for the MCU. It&apos;s a bit complicated to wire, but
            basically just steps down to 3V3, and then stabilizes and protects
            it using some capacitors and diodes, and then it needs some internal
            voltage too, which is what the FB pin is for. And just like that, we
            have a buck converter for the PSU! But I still kind of need to
            convert the 5V from the USB down to 3.3V for the MCU, so I might
            need to re-use the current buck converter if I can, or add another
            one... But anyways, after reaching out to some people, they suggest
            I use a different buck converter because of the bad switching
            frequency, and also convert to 5V instead of 3.3V and then use an
            LDO to get from a 5V rail to 3.3V. So after a bit of research,
            I&apos;m just going to use the TPS54331 chip. So after an absurdly
            long time, I got the buck converter wired for 12/24V to 5V.&rdquo;
          </p>

          <p>
            <em>
              Found in Kai&apos;s journal{" "}
              <a href="https://github.com/KaiPereira/Cheetah-MX4-Mini/blob/master/JOURNAL.md">
                here
              </a>
              ! I heavily encourage reading it, it&apos;s a nice read :D
            </em>
          </p>

          <p>
            Reasoning is very important! Anyone can describe what you did, but
            explaining why proves you understood it.
          </p>

          <h3>Screenshot everything!</h3>

          <p>
            Take screenshots of your work at every meaningful step,{" "}
            <strong>not just when it&apos;s done and clean.</strong> Show the
            messy intermediate states. Show it before and after you fix
            something. Kai&apos;s journal is a great example of this!
          </p>

          <h3>Describe your mistakes</h3>

          <p>
            Making mistakes is an integral part of any project. Real hardware
            work is full of things going wrong: footprints that were off, wiring
            that had to be redone, suggestions from reviewers that changed your
            approach entirely. These moments are some of the most valuable
            things to document, because they prove the work was real and
            they&apos;re often where the actual learning happened.
          </p>

          <p>A journal with no mistakes reads as a summary, not a journal.</p>
        </ProseCard>
      </section>
    </DocsFrame>
  );
}
