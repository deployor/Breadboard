import type { Attributes } from "@flags-sdk/growthbook";
import type { Identify } from "flags";
import { dedupe } from "flags/next";
import { headers } from "next/headers";

export const identify = dedupe(async () => {
  const requestHeaders = await headers();
  const url = requestHeaders.get("x-url") ?? "";
  const host = requestHeaders.get("host") ?? "";
  const pathname = requestHeaders.get("x-pathname") ?? "";

  return {
    id: host || "anonymous",
    url,
    path: pathname,
    host,
  };
}) satisfies Identify<Attributes>;
