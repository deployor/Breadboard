"use client";

import Image from "next/image";
import { useState } from "react";
import type { PlatformProject } from "@/types";

type Project = PlatformProject;

const previewSizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw";

function shouldOptimizeProjectImage(src: string) {
  if (src.startsWith("/")) return true;

  try {
    const { hostname, protocol } = new URL(src);
    return (
      protocol === "https:" &&
      (hostname === "cdn.hackclub.com" || hostname === "assets.hackclub.com")
    );
  } catch {
    return false;
  }
}

export function ProjectPreview({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const showExample = !project.screenshotUrl || failed;

  const kitImage =
    project.kitType === "esp32" ? "/assets/esp32.png" : "/assets/arduino.png";

  if (showExample) {
    return (
      <div className="relative h-full bg-[#f4f4f4]">
        <Image
          src={kitImage}
          alt={`${project.kitType === "esp32" ? "ESP32" : "Arduino"} kit preview`}
          fill
          sizes={previewSizes}
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <Image
      src={project.screenshotUrl}
      alt={`${project.title || "Project"} screenshot`}
      fill
      sizes={previewSizes}
      unoptimized={!shouldOptimizeProjectImage(project.screenshotUrl)}
      onError={() => setFailed(true)}
      className="object-cover transition duration-300 group-hover:scale-[1.03]"
    />
  );
}
