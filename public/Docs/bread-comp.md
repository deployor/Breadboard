# Breadboard Basics

# Complete Component Guide for the REXQualis Breadboard Kit

![image.png](https://cdn.hackclub.com/019d1703-fa25-78e5-8d80-ceb5073210c7/image.png)

## Hello! This tutorial is designed to help you become familiar with every component included in [this breadboard kit](https://www.amazon.com/REXQualis-Electronics-tie-Points-Breadboard-Potentiometer/dp/B073ZC68QG) before you begin building circuits.

By the end of this guide, you should be able to:

- Visually recognize each component
- Understand what each component does
- Know when and why each component is commonly used
- Avoid the most frequent beginner mistakes

---

## 1. Breadboard (830 Tie-Points)

![breadboard](https://cdn.hackclub.com/019d1703-fca5-7990-9be5-2d2d1a957f20/image.png)

### What It Is

A breadboard is a reusable prototyping tool that allows electronic circuits to be assembled without soldering. It is the central platform on which most beginner circuits are built.

### How It Works

Inside the breadboard, metal clips connect groups of holes together:

- The central rows are connected horizontally in groups.
- The long side rails are connected vertically and are typically used for power (positive voltage and ground).

Because of this internal structure, components placed into the same connected row share an electrical connection.

### Common Mistake

A frequent error is placing both legs of a component into the same horizontal row. When this happens, there is no voltage difference across the component, and it will not function as intended.

---

## 2. Breadboard Power Supply Module

![images.jpg](https://cdn.hackclub.com/019d1703-ff19-7e34-9b16-1c397545f7da/image.png)

### What It Is

This is a compact, regulated power supply module that plugs directly into the breadboard’s power rails. It provides a stable voltage source for your circuits.

### What It Provides

- A regulated 5-volt output
- A regulated 3.3-volt output
- A shared ground (GND) reference
- An on/off power switch

### Power Inputs

The module can be powered in two ways:

- Via USB (using the included USB cable)
- Via a 9-volt DC barrel jack (adapter not included)

### Critical Rule

You must never connect a power rail (such as 5V) directly to ground. Doing so creates a short circuit, which can damage the power supply, the breadboard, or other components.

---

## 3. Jumper Wires

### What They Are

Jumper wires are flexible conductors used to make temporary electrical connections on a breadboard. Jumper wires allow you to connect components, rows, and power rails without soldering. They enable rapid changes and experimentation, which is essential during learning and prototyping.

### Types Included in This Kit

- Male-to-male jumper wires
- Male-to-female jumper wires
- Pre-cut solid solderless breadboard jumpers

![image.png](https://cdn.hackclub.com/019d1704-013f-7394-868c-9ace49189c85/image.png)

---

## 4. Resistors

### What They Do

Resistors limit the flow of electrical current and help control voltage levels within a circuit.

### Values Included

This kit includes a wide range of resistor values, including:

10Ω, 100Ω, 220Ω, 330Ω, 1kΩ, 2kΩ, 5kΩ, 10kΩ, 100kΩ, and 1MΩ.

### Why They Matter

Without resistors, components such as LEDs, transistors, and integrated circuits can easily be damaged by excessive current.

### Orientation

![resistors.png](https://cdn.hackclub.com/019d1704-0397-7187-9a1f-8c0a9e0e43e6/image.png)

Resistors are non-polarized components, meaning their orientation does not matter.

---

## 5. LEDs (Light Emitting Diodes)

### What They Do

LEDs convert electrical energy into light and are commonly used as visual indicators.

LEDs are polarized components:

- The longer leg is the anode (positive)
- The shorter leg is the cathode (negative)

![leds.png](https://cdn.hackclub.com/019d1704-05c0-7a18-829a-5ea2cd41cfe4/image.png)

### Why They Matter

LEDs provide immediate visual feedback and are often used to indicate power, signal states, or activity.

### Required Rule

An LED must always be used with a resistor in series. This resistor limits the current and prevents the LED from burning out.

---

## 6. Potentiometer (Precision Variable Resistor)

### What It Is

A resistor whose value changes as you turn the knob.

### Pins

- The two outer pins connect to the fixed ends of the resistive element.
- The center pin (called the wiper) outputs a variable voltage.

![potentiometer.png](https://cdn.hackclub.com/019d1704-0805-74a0-b24e-70933cf29393/image.png)

### Why It Matters

Potentiometers are commonly used for analog controls such as volume adjustment, brightness control, and speed regulation.

---

## 7. Push Buttons

### What They Do

Push buttons are momentary switches that connect or disconnect a circuit only while they are being pressed.
****

### Internal Behavior

When pressed, most push buttons internally connect two of their pins together.
****

### Common Use

Push buttons are often used for user input, reset functions, and manual triggers.
****

### Common Mistake

A common error is inserting the button rotated 90 degrees, which prevents the internal contacts from aligning correctly with the breadboard connections.

![push.png](https://cdn.hackclub.com/019d1704-0a3f-7c3e-adb4-79e28948a239/image.png)

---

## 8. Buzzer

The kit includes a buzzer used to generate sound output.

- An active buzzer produces sound when supplied with DC voltage.
- A passive buzzer requires an alternating signal to produce sound.

### Why It Matters

![fcda4291-0f39-452d-8f8f-73b734a69b31.__CR0,0,800,800_PT0_SX220_V1___.jpg](https://cdn.hackclub.com/019d1704-0c8e-755b-bed8-f4afa3a9b1d4/image.png)

Buzzers add auditory feedback to projects, such as alerts, confirmations, or warnings.

---

## 9. PN2222 NPN Transistor

### What It Is

The PN2222 is a bipolar junction transistor commonly used as an electronic switch or amplifier.

Here’s another video by Ben Eater!

[How a transistor works](https://www.youtube.com/watch?v=DXvAlwMAxiA)

![2c2a0d94-b61c-4572-8aa9-7ce34f12483a.__CR0,0,800,800_PT0_SX220_V1___.jpg](https://cdn.hackclub.com/019d1704-0ea6-7ea1-8cc7-8351b258f28e/image.png)

### Why It Matters

This transistor allows a small control signal to switch or control a much larger current. This makes it essential for driving motors, buzzers, relays, and other higher-power components.

### Common Mistake

Failing to use a resistor on the base pin can allow excessive current to flow, which may permanently damage the transistor.

---

## 10. 1N4007 Diode

### What It Does

The 1N4007 diode allows current to flow in only one direction.

Here’s a nice video on how they work by Ben Eater :D

[How semiconductors work](https://www.youtube.com/watch?v=33vbFFFn04k)  

### Orientation

The side marked with a stripe indicates the cathode.

### Why It Matters

![1N4007_Pinout.png](https://cdn.hackclub.com/019d1704-c114-7fd2-930e-f14227b99001/image.png)

This diode is commonly used for reverse-polarity protection and for suppressing voltage spikes generated by inductive loads such as motors and relays.

---

## 11. Electrolytic / Polarized Capacitors

### What They Do

Electrolytic capacitors store electrical energy and help smooth voltage fluctuations in a circuit.

They come in 100 UF and and 10 UF in the kit!

### Key Property

They are **polarized**. 

Therefore, reversing polarity can destroy the capacitor.

![Electrolytic-capacitor.jpg](https://cdn.hackclub.com/019d1704-c35d-7c94-b30a-8634fe5763d2/image.png)

---

## 12. Ceramic Capacitors

### What They Do

They also store electrical energy and smooth voltage fluctuations.

However, it is meant for small, fast-response capacitance. They come in 100 NF and 22 PF!

### Key Property

They are non-polarized. That means that direction does not matter!

![capacitor.png](https://cdn.hackclub.com/019d1704-c592-779a-b803-3b91e976ee8a/image.png)

---

## 13. 74HC595 Shift Register IC

### What It Is

The 74HC595 is an 8-bit serial-to-parallel shift register.  It is used to expand microcontroller outputs, allowing control of many devices (like LEDs) with few pins by converting serial data to parallel.

### Typical Use

It is commonly used to drive LED arrays, displays, and other multi-output devices.

![55af7f8d-62bb-4400-a170-a7f96bee2b53.__CR0,0,800,800_PT0_SX220_V1___.jpg](https://cdn.hackclub.com/019d1704-cb35-7af7-96c4-3a358f7d66a0/image.png)

---

## 14. 4N35 Optocoupler

### What It Is

The 4N35 is an optocoupler that uses light to transfer a signal between two electrically isolated circuits. 

### Why It Matters

Optocouplers improve safety and reduce electrical noise by preventing direct electrical connections between sensitive and high-power sections of a circuit.

![e5eabbf9-ec3f-438f-97e3-cdca4397f435.__CR0,0,800,800_PT0_SX220_V1___.jpg](https://cdn.hackclub.com/019d1704-cd58-7a2b-b6d3-9717bb9dd5c0/image.png)

![20241126180901786.png](https://cdn.hackclub.com/019d1704-cf6c-7859-abab-326415a9f3f7/image.png)

---