import { DocsFrame, PageHero, ProseCard } from "@/components/docs-frame";

export default function ReadmePage() {
  return (
    <DocsFrame>
      <section>
        <PageHero title="Readme" />
        <ProseCard>
          <p>
            This was just the basic landing page for now, as discussed{" "}
            <a href="https://hackclub.slack.com/archives/C0ALD8SCMGD/p1773450311718909?thread_ts=1773450046.304719&cid=C0ALD8SCMGD">
              here
            </a>
            .
          </p>
          <p>Planned changes:</p>
          <ul>
            <li>
              After the initial submission, there will be a shop. Rewards will
              be time and quality based, similar to Blueprint's build submission
              system. Since build submissions carry a risk of fraudulent time
              additions that intial submissions don't (initial review isn't
              time-based), I'll ask Sam and use{" "}
              <a href="https://github.com/hackclub/lookout">Lookout</a> to
              verify them.
            </li>
            <li>
              As Dev said, I don't think a full login flow is necessary.
              Submissions will just use Fillout.
            </li>
          </ul>
          <p>
            The 3D model on the front page is a placeholder. It will be replaced
            with an optimized real submission that isn't just a bare breadboard.
          </p>
          <p>
            Please DM{" "}
            <a href="https://hackclub.enterprise.slack.com/team/U08R4Q9H8EB">
              @Tanuki
            </a>{" "}
            or email{" "}
            <a href="mailto:tanishqgoyal590@gmail.com">
              tanishqgoyal590@gmail.com
            </a>{" "}
            if anything is unclear or if anything can be improved!{" "}
            <strong>Enjoy the website :D</strong>
          </p>
        </ProseCard>
      </section>
    </DocsFrame>
  );
}
