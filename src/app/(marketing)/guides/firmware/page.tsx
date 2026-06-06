import { PageHero, ProseCard } from "@/components/shared/docs-frame";

export default function FirmwarePage() {
  return (
    <section>
      <PageHero title="Firmware Resources">
        <p className="mt-2 text-base text-black/80">
          Arduino Uno R3 &amp; ESP32
        </p>
      </PageHero>

      <ProseCard>
        <h2>Arduino IDE</h2>
        <p>The IDE is where you write and upload code. Both boards use it.</p>
        <ul>
          <li>
            <strong>Download Arduino IDE 2.x</strong>:{" "}
            <a href="https://www.arduino.cc/en/software">
              arduino.cc/en/software
            </a>
          </li>
          <li>
            <strong>Getting started guide</strong>:{" "}
            <a href="https://docs.arduino.cc/software/ide-v2/tutorials/getting-started/ide-v2-downloading-and-installing/">
              docs.arduino.cc/software/ide-v2
            </a>
          </li>
          <li>
            <strong>Language reference</strong> (every function, explained):{" "}
            <a href="https://www.arduino.cc/reference/en/">
              arduino.cc/reference/en
            </a>
          </li>
        </ul>

        <hr />

        <h2>Arduino Uno R3 Clone</h2>
        <p>
          Your kit has a clone board that works the same as the official Uno but
          uses a <strong>CH340 USB chip</strong>. You probably need to install
          the driver before your computer sees it.
        </p>

        <h3>Driver</h3>
        <ul>
          <li>
            <strong>CH340 driver (Windows + Mac)</strong>:{" "}
            <a href="https://sparks.gogo.co.nz/ch340.html">
              sparks.gogo.co.nz/ch340.html
            </a>
          </li>
        </ul>
        <p>
          After installing, unplug and replug your board. A port should appear
          under <strong>Tools &gt; Port</strong>.
        </p>

        <h3>Pinout and Specs</h3>
        <ul>
          <li>
            <strong>Official Uno R3 hardware page + pinout</strong>:{" "}
            <a href="https://docs.arduino.cc/hardware/uno-rev3/">
              docs.arduino.cc/hardware/uno-rev3
            </a>
          </li>
        </ul>

        <h3>Learning</h3>
        <ul>
          <li>
            <strong>Arduino built-in examples</strong> (File &gt; Examples in
            the IDE) are the best place to start
          </li>
          <li>
            <strong>Arduino tutorials</strong>:{" "}
            <a href="https://docs.arduino.cc/tutorials/">
              docs.arduino.cc/tutorials
            </a>
          </li>
          <li>
            <strong>Adafruit Learning System</strong> (beginner-friendly guides
            for basically every component):{" "}
            <a href="https://learn.adafruit.com/">learn.adafruit.com</a>
          </li>
        </ul>

        <hr />

        <h2>ESP32</h2>

        <h3>Setup</h3>
        <p>
          The ESP32 needs a board package installed before it shows up in the
          IDE. Follow this guide:
        </p>
        <ul>
          <li>
            <strong>Official install guide</strong>:{" "}
            <a href="https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html">
              docs.espressif.com/projects/arduino-esp32/en/latest/installing.html
            </a>
          </li>
        </ul>

        <p>
          Board manager URL to paste into <strong>File &gt; Preferences</strong>
          :
        </p>
        <pre>
          <code>
            https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
          </code>
        </pre>

        <h3>Pinout and Specs</h3>
        <ul>
          <li>
            <strong>GPIO reference</strong> (what each pin does, what&rsquo;s
            safe to use):{" "}
            <a href="https://randomnerdtutorials.com/esp32-pinout-reference-gpios/">
              randomnerdtutorials.com/esp32-pinout-reference-gpios
            </a>
          </li>
          <li>
            <strong>Official ESP32 datasheet</strong>:{" "}
            <a href="https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf">
              espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf
            </a>
          </li>
          <li>
            <strong>Pin definitions in the arduino-esp32 source</strong> (SDA,
            SCL, etc.):{" "}
            <a href="https://github.com/espressif/arduino-esp32/blob/master/variants/esp32/pins_arduino.h">
              github.com/espressif/arduino-esp32/.../pins_arduino.h
            </a>
          </li>
        </ul>

        <h3>Learning</h3>
        <ul>
          <li>
            <strong>Random Nerd Tutorials</strong> (best ESP32 resource on the
            internet):{" "}
            <a href="https://randomnerdtutorials.com/esp32/">
              randomnerdtutorials.com/esp32
            </a>
          </li>
          <li>
            <strong>Official arduino-esp32 API docs</strong>:{" "}
            <a href="https://docs.espressif.com/projects/arduino-esp32/en/latest/">
              docs.espressif.com/projects/arduino-esp32/en/latest
            </a>
          </li>
          <li>
            <strong>Last Minute Engineers</strong> (clear component-by-component
            guides):{" "}
            <a href="https://lastminuteengineers.com/">
              lastminuteengineers.com
            </a>
          </li>
        </ul>

        <hr />

        <h2>Libraries</h2>
        <p>
          Install any of these from <strong>Tools &gt; Manage Libraries</strong>{" "}
          in the IDE.
        </p>

        <table>
          <thead>
            <tr>
              <th>What you need</th>
              <th>Library name</th>
              <th>Docs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OLED display (SSD1306)</td>
              <td>
                <code>Adafruit SSD1306</code> +{" "}
                <code>Adafruit GFX Library</code>
              </td>
              <td>
                <a href="https://learn.adafruit.com/adafruit-gfx-graphics-library">
                  learn.adafruit.com/adafruit-gfx-graphics-library
                </a>
              </td>
            </tr>
            <tr>
              <td>Button debouncing</td>
              <td>
                <code>Bounce2</code>
              </td>
              <td>
                <a href="https://github.com/thomasfredericks/Bounce2">
                  github.com/thomasfredericks/Bounce2
                </a>
              </td>
            </tr>
            <tr>
              <td>Alternative display driver</td>
              <td>
                <code>U8g2</code>
              </td>
              <td>
                <a href="https://github.com/olikraus/u8g2/wiki">
                  github.com/olikraus/u8g2/wiki
                </a>
              </td>
            </tr>
            <tr>
              <td>JSON parsing</td>
              <td>
                <code>ArduinoJson</code>
              </td>
              <td>
                <a href="https://arduinojson.org/">arduinojson.org</a>
              </td>
            </tr>
          </tbody>
        </table>

        <hr />

        <h2>Troubleshooting</h2>

        <h3>Port not showing up (Uno clone)</h3>
        <p>
          Almost always a missing CH340 driver. Install it from the link above,
          unplug, replug.
        </p>

        <h3>Upload failing on ESP32</h3>
        <p>
          Hold the <strong>BOOT</strong> button on your board while the IDE
          shows &ldquo;Connecting.....&rdquo;. Release once the upload starts.
          Some boards need this to enter bootloader mode.
        </p>

        <h3>I2C device not found / OLED not working</h3>
        <p>Run this I2C scanner sketch to find your device&rsquo;s address:</p>
        <ul>
          <li>
            <a href="https://playground.arduino.cc/Main/I2cScanner/">
              playground.arduino.cc/Main/I2cScanner
            </a>
          </li>
        </ul>
        <p>
          Most OLEDs are at <code>0x3C</code>, some are at <code>0x3D</code>.
        </p>

        <h3>General help</h3>
        <ul>
          <li>
            <strong>Arduino Stack Exchange</strong>:{" "}
            <a href="https://arduino.stackexchange.com/">
              arduino.stackexchange.com
            </a>
          </li>
          <li>
            <strong>ESP32 forums</strong>:{" "}
            <a href="https://www.esp32.com/viewforum.php?f=19">
              esp32.com/viewforum.php?f=19
            </a>
          </li>
          <li>
            The <strong>#breadboard</strong> channel on Hack Club Slack
          </li>
        </ul>
      </ProseCard>
    </section>
  );
}
