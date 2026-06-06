import { DocsFrame, PageHero, ProseCard } from "@/components/docs-frame";

export default function ExampleSubmissionPage() {
  return (
    <DocsFrame>
      <section>
        <PageHero title="Example submission">
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-black/80">
            This submission is still in development, is currently in progress,
            and is not the final submission.
          </p>
        </PageHero>

        <ProseCard>
          <h1>Tamagotchi Breadboard Journal</h1>

          <h2>Session 1 | March 21 | ~45 min</h2>
          <h3>Getting Started: Why a Tamagotchi?</h3>

          <p>
            I want to build a polished breadboard prototype of my
            <a href="https://github.com/TaniWanKenobi/tamagotchi">
              Tamagotchi project
            </a>
            . It's a project I already care about, so it felt like a natural fit
            for making something real and interactive rather than just a basic
            LED circuit. The kit gives me enough components to actually
            replicate the core Tamagotchi experience: a display, input buttons,
            a buzzer, and some sensors for ambient awareness.
          </p>

          <h3>ESP32 Schematic Symbol</h3>

          <p>
            First up: getting my ESP32 into KiCad. I couldn't find the exact
            schematic symbol for my specific board on{" "}
            <a href="https://www.snapmagic.com/">SnapMagic</a> or
            <a href="https://www.ultralibrarian.com/">Ultra Librarian</a>, and
            Tinkercad doesn't support the components I need, so I had to make my
            own symbol from scratch using a reference image of the board pinout.
          </p>

          <p>
            Then disaster struck. <strong>I lost all my progress</strong> after
            a KiCad crash and had to restart the symbol from scratch.
          </p>

          <p>
            After the redo and referencing the pinout image again, I finally
            finished it:
          </p>

          <p>
            <img
              src="https://files.catbox.moe/ubk8uk.png"
              alt="ESP32 Schematic Symbol"
            />
          </p>

          <p>
            <strong>Time: ~45 min</strong> (including the redo after the crash)
          </p>

          <h2>Session 2 | March 21 | ~30 min</h2>
          <h3>Adding the OLED Display</h3>

          <p>
            I want to be able to <em>see</em> my pet, so the next step is wiring
            up an OLED. I found my specific display via reverse image search: a
            <a href="https://www.displaymodule.com/products/1-29-inch-oled-graphic-display-128x64-with-i2c">
              1.29&quot; 128x64 I2C OLED
            </a>
            .
          </p>

          <p>
            I checked the
            <a href="https://cdn.shopify.com/s/files/1/0264/7629/files/DM-OLED13-663_Datasheet.pdf?v=1659336402">
              datasheet
            </a>
            to figure out pull-up resistors. The datasheet doesn't specify
            internal pull-ups, which means I need
            <strong>external pull-up resistors</strong> on the I2C lines (SDA
            and SCL).
          </p>

          <p>
            My available resistor values were 220 ohm, 1k, and 10k. The
            recommended value for I2C pull-ups is typically around 4.7k, so 1k
            is the closest I have and will work fine.
          </p>

          <blockquote>
            I later confirmed via
            <a href="https://lonelybinary.com/en-us/blogs/tutorial/internal-pull-up-and-pull-down">
              this post
            </a>
            that the ESP32's internal pull-ups are around 45k, which is way too
            high for I2C. Such high resistance limits current too much for
            reliable signaling, so external pull-ups are definitely the right
            call here.
          </blockquote>

          <p>
            Per the
            <a href="https://github.com/espressif/arduino-esp32/blob/master/variants/esp32/pins_arduino.h">
              ESP32 Arduino pin definitions
            </a>
            , the default I2C pins are:
          </p>
          <ul>
            <li>
              <strong>SDA: GPIO 21</strong>
            </li>
            <li>
              <strong>SCL: GPIO 22</strong>
            </li>
          </ul>

          <p>
            <img
              src="https://files.catbox.moe/z837ly.png"
              alt="OLED Schematic Symbol"
            />
          </p>
          <p>
            <img
              src="https://files.catbox.moe/h4g1ne.png"
              alt="OLED + ESP32 Wiring"
            />
          </p>

          <p>
            <strong>Time: ~30 min</strong>
          </p>

          <h2>Session 3 | March 21 | ~5 min</h2>
          <h3>Adding Buttons</h3>

          <p>
            Tamagotchis have buttons, so I need those. I went with an{" "}
            <strong>active-low</strong> layout, which is the most common
            approach:
          </p>
          <ul>
            <li>
              One side of each button connects to <strong>GND</strong>
            </li>
            <li>
              The other side connects to a <strong>GPIO pin</strong> with the
              ESP32's internal pull-up enabled
            </li>
            <li>
              This means the pin reads <strong>HIGH</strong> at rest and{" "}
              <strong>LOW</strong> when pressed
            </li>
          </ul>

          <details>
            <summary>Why active-low?</summary>
            <p>
              Active-low means the button is "active" (pressed) when the signal
              is LOW (0V / GND). The internal pull-up resistor holds the pin
              HIGH when idle. This is clean and simple, no extra resistors
              needed, just the button and ground.
            </p>
          </details>

          <p>
            <img
              src="https://files.catbox.moe/w7xrp7.png"
              alt="Schematic with Buttons"
            />
          </p>
          <p>
            <strong>Time: ~5 min</strong>
          </p>

          <h2>Session 4 | March 21 | ~5 min</h2>
          <h3>Adding a Buzzer</h3>

          <p>
            Tamagotchis make sounds, and I have a buzzer available. I added one
            from a
            <a href="https://www.lcsc.com/product-detail/C49246964.html">
              similar LCSC listing
            </a>
            . Wiring is simple: one pin to a GPIO output, the other to GND. The
            GPIO will drive it with a square-wave signal to produce tones.
          </p>

          <p>
            <img
              src="https://cdn.hackclub.com/019d1200-29a7-73d7-949d-e60543907f88/image.png"
              alt="Schematic with Buzzer"
            />
          </p>
          <p>
            <strong>Time: ~5 min</strong>
          </p>

          <h2>Session 5 | March 21 | ~20 min</h2>
          <h3>3D Assembly in Onshape</h3>

          <p>
            I wanted a visual of how all these components actually fit on the
            breadboard before physically placing things. I found an 830-hole
            breadboard model on GrabCAD, imported it into Onshape, then did the
            same for the other components and assembled everything together.
          </p>

          <p>
            This was useful for two reasons: it helped me see whether component
            spacing would be an issue, and it surfaced the interesting question
            of whether an ESP32 even <em>fits</em> on a standard breadboard.
            After testing, a bent wire bridges the ESP32 across the gap
            perfectly and still makes contact on both rails.
          </p>

          <p>
            <img
              src="https://cdn.hackclub.com/019d120e-ac13-7434-9f3d-9bf0570ce533/image.png"
              alt="Breadboard 3D Assembly"
            />
          </p>
          <p>
            <strong>Time: ~20 min</strong>
          </p>

          <h2>Session 6 | March 21 | ~1 hr</h2>
          <h3>Adding the Photosensitive Resistor Module</h3>

          <p>
            I thought it'd be a fun mechanic if the Tamagotchi gets tired or
            sleepy when it's dark, and the photosensitive resistor module is
            perfect for this. Finding usable documentation took surprisingly
            long. I finally found the wiring info
            <a href="https://docs.cirkitdesigner.com/component/c5b63eb7-ba5b-4e50-92dd-def6c9780d9f/photosensitive-sensor-module-digital-light-intensity-detection">
              here
            </a>
            .
          </p>

          <p>
            <strong>
              The wiring itself was simple. The KiCad symbol was not.
            </strong>
          </p>

          <p>
            I ran into a really frustrating bug: the parent symbol was named{" "}
            <code>photomod</code>, but the sub-symbols were named{" "}
            <code>TFT_MSP1803_0_1</code> and <code>TFT_MSP1803_1_1</code>.
            <strong>
              In KiCad, sub-symbols must match the parent name exactly
            </strong>
            , which I had to discover through trial and error. This caused
            errors that nuked my schematic progress again.
          </p>

          <p>
            My workaround: instead of creating a new schematic from scratch
            (which kept breaking), I imported a working schematic as a base and
            built from there.
          </p>

          <p>
            <img
              src="https://cdn.hackclub.com/019d1233-c8d9-7eaa-94d8-2bdbafd1a1f6/image.png"
              alt="Photosensor Schematic Symbol"
            />
          </p>
          <p>
            <img
              src="https://cdn.hackclub.com/019d124c-fdbc-7e55-a302-f74ae2b33329/image.png"
              alt="Schematic with Photosensor"
            />
          </p>

          <p>
            <strong>Time: ~1 hr</strong>
          </p>
          <p>
            <strong>Total time so far: ~2h 45min</strong>
          </p>
        </ProseCard>
      </section>
    </DocsFrame>
  );
}
