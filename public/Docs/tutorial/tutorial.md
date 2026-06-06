# Tamagotchi Breadboard Journal

## Session 1 | March 21 | ~45 min
### Getting Started: Why a Tamagotchi?

I want to build a polished breadboard prototype of my [Tamagotchi project](https://github.com/TaniWanKenobi/tamagotchi). It's a project I already care about, so it felt like a natural fit for making something real and interactive rather than just a basic LED circuit. The kit gives me enough components to actually replicate the core Tamagotchi experience: a display, input buttons, a buzzer, and some sensors for ambient awareness.

### ESP32 Schematic Symbol

First up: getting my ESP32 into KiCad. I couldn't find the exact schematic symbol for my specific board on [SnapMagic](https://www.snapmagic.com/) or [Ultra Librarian](https://www.ultralibrarian.com/), and Tinkercad doesn't support the components I need, so I had to make my own symbol from scratch using a reference image of the board pinout.

Then disaster struck. **I lost all my progress** after a KiCad crash and had to restart the symbol from scratch.

After the redo and referencing the pinout image again, I finally finished it:

![ESP32 Schematic Symbol](https://files.catbox.moe/ubk8uk.png)

**Time: ~45 min** (including the redo after the crash)

## Session 2 | March 21 | ~30 min
### Adding the OLED Display

I want to be able to *see* my pet, so the next step is wiring up an OLED. I found my specific display via reverse image search: a [1.29" 128x64 I2C OLED](https://www.displaymodule.com/products/1-29-inch-oled-graphic-display-128x64-with-i2c).

I checked the [datasheet](https://cdn.shopify.com/s/files/1/0264/7629/files/DM-OLED13-663_Datasheet.pdf?v=1659336402) to figure out pull-up resistors. The datasheet doesn't specify internal pull-ups, which means I need **external pull-up resistors** on the I2C lines (SDA and SCL).

My available resistor values were 220 ohm, 1k, and 10k. The recommended value for I2C pull-ups is typically around 4.7k, so 1k is the closest I have and will work fine.

> I later confirmed via [this post](https://lonelybinary.com/en-us/blogs/tutorial/internal-pull-up-and-pull-down) that the ESP32's internal pull-ups are around 45k, which is way too high for I2C. Such high resistance limits current too much for reliable signaling, so external pull-ups are definitely the right call here.

Per the [ESP32 Arduino pin definitions](https://github.com/espressif/arduino-esp32/blob/master/variants/esp32/pins_arduino.h), the default I2C pins are:
- **SDA: GPIO 21**
- **SCL: GPIO 22**

![OLED Schematic Symbol](https://files.catbox.moe/z837ly.png)

![OLED + ESP32 Wiring](https://files.catbox.moe/h4g1ne.png)

**Time: ~30 min**

## Session 3 | March 21 | ~5 min
### Adding Buttons

Tamagotchis have buttons, so I need those. I went with an **active-low** layout, which is the most common approach:

- One side of each button connects to **GND**
- The other side connects to a **GPIO pin** with the ESP32's internal pull-up enabled
- This means the pin reads **HIGH** at rest and **LOW** when pressed

<details>
<summary>Why active-low?</summary>

Active-low means the button is "active" (pressed) when the signal is LOW (0V / GND). The internal pull-up resistor holds the pin HIGH when idle. This is clean and simple, no extra resistors needed, just the button and ground.

</details>

![Schematic with Buttons](https://files.catbox.moe/w7xrp7.png)

**Time: ~5 min**

## Session 4 | March 21 | ~5 min
### Adding a Buzzer

Tamagotchis make sounds, and I have a buzzer available. I added one from a [similar LCSC listing](https://www.lcsc.com/product-detail/C49246964.html). Wiring is simple: one pin to a GPIO output, the other to GND. The GPIO will drive it with a square-wave signal to produce tones.

![Schematic with Buzzer](https://cdn.hackclub.com/019d1200-29a7-73d7-949d-e60543907f88/image.png)

**Time: ~5 min**

## Session 5 | March 21 | ~20 min
### 3D Assembly in Onshape

I wanted a visual of how all these components actually fit on the breadboard before physically placing things. I found an 830-hole breadboard model on GrabCAD, imported it into Onshape, then did the same for the other components and assembled everything together.

This was useful for two reasons: it helped me see whether component spacing would be an issue, and it surfaced the interesting question of whether an ESP32 even *fits* on a standard breadboard. After testing, a bent wire bridges the ESP32 across the gap perfectly and still makes contact on both rails.

![Breadboard 3D Assembly](https://cdn.hackclub.com/019d120e-ac13-7434-9f3d-9bf0570ce533/image.png)

**Time: ~20 min**

## Session 6 | March 21 | ~1 hr
### Adding the Photosensitive Resistor Module

I thought it'd be a fun mechanic if the Tamagotchi gets tired or sleepy when it's dark, and the photosensitive resistor module is perfect for this. Finding usable documentation took surprisingly long. I finally found the wiring info [here](https://docs.cirkitdesigner.com/component/c5b63eb7-ba5b-4e50-92dd-def6c9780d9f/photosensitive-sensor-module-digital-light-intensity-detection).

**The wiring itself was simple. The KiCad symbol was not.**

I ran into a really frustrating bug: the parent symbol was named `photomod`, but the sub-symbols were named `TFT_MSP1803_0_1` and `TFT_MSP1803_1_1`. **In KiCad, sub-symbols must match the parent name exactly**, which I had to discover through trial and error. This caused errors that nuked my schematic progress again.

My workaround: instead of creating a new schematic from scratch (which kept breaking), I imported a working schematic as a base and built from there.

![Photosensor Schematic Symbol](https://cdn.hackclub.com/019d1233-c8d9-7eaa-94d8-2bdbafd1a1f6/image.png)

![Schematic with Photosensor](https://cdn.hackclub.com/019d124c-fdbc-7e55-a302-f74ae2b33329/image.png)

**Time: ~1 hr** 

**Total time so far: ~2h 45min**
