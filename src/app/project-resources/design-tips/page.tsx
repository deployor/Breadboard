import { DocsFrame, PageHero, ProseCard } from "@/components/docs-frame";

export default function DesignTipsPage() {
  return (
    <DocsFrame>
      <section>
        <PageHero title="Design Tips">
          <p className="mt-2 text-base text-black/80">
            Helpful tips to make your designs better.
          </p>
        </PageHero>

        <ProseCard>
          <p>
            <em>
              Original by <a href="https://github.com/qcoral/">@alexren</a> at{" "}
              <a href="https://hwdocs.hackclub.com">hwdocs.hackclub.com</a>
            </em>
          </p>

          <h2>General Tips</h2>

          <ul>
            <li>
              <p>
                Round the corners on your PCBs! Not only do they make your PCBs
                look better, they also help you avoid getting cut by them! See
                example:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Rounded corners</th>
                    <th>Unrounded corners</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img
                        src="https://cdn.hackclub.com/019c6d97-18f2-72fa-b7ee-22e6db8c282e/image.png"
                        alt="Rounded corners"
                        style={{
                          maxHeight: "35vh",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    </td>
                    <td>
                      <img
                        src="https://cdn.hackclub.com/019c6d98-dc58-7ecf-b45a-8c166a1c9a0f/image.png"
                        alt="Unrounded corners"
                        style={{
                          maxHeight: "35vh",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
            <li>
              Instead of taking a screenshot of the default onshape blue or
              fusion360 gray, render your project in{" "}
              <a href="https://www.blender.org/">blender</a> instead!
            </li>
            <li>
              If you&apos;re stuck picking between a bunch of passives that are
              all functionally the same (i.e 30 different types of capacitors),
              start with the CAD and work backwards - it&apos;ll help you get an
              idea of which one would physically look the best, which narrows
              down your choices
            </li>
            <li>
              Use variables in Fusion! They allow you to calculate measurements
              as functions of other ones which saves you a lot of time on
              iteration
            </li>
          </ul>

          <hr />

          <h2>Designing for Real Life</h2>

          <p>
            There&apos;s a lot of stuff you need to watch out for when designing
            your project on the computer to make sure that you can actually
            build them in real life! Here are some of them:
          </p>

          <ul>
            <li>
              Add a ~0.2mm tolerances on any 3D printed part that makes contact
              with something else - this is to account for any inaccuracies in
              your printer, the filament, etc. Your parts WILL NOT fit
              otherwise.
            </li>
            <li>
              You can print out your PCBs on paper and see how large
              they&apos;ll be before actually ordering to get a good gauge for
              size.
            </li>
            <li>
              Frequently think about how your parts are actually going to be
              manufactured and whether or not it&apos;s realistic - intricate
              patterns may often not show up as well depending on your
              manufacturing method (3D printing, CNC milling, etc)
            </li>
          </ul>
        </ProseCard>
      </section>
    </DocsFrame>
  );
}
