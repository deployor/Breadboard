"use client";

import { useEffect, useState } from "react";
import { Clock, PanelRightClose, PanelRightOpen } from "lucide-react";
import { setActivityStatusListener } from "@/lib/editor/activityTracker";

const JOURNAL_MIN_SECONDS = 10 * 60;

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function EditorActivityIndicator({ projectId }: { projectId: number }) {
  const [status, setStatus] = useState<"active" | "idle" | "blocked">("idle");
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [liveUnjournaledSeconds, setLiveUnjournaledSeconds] = useState(0);
  const [reason, setReason] = useState("");
  const [needsJournal, setNeedsJournal] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const draftKey = `breadboard:journal-draft:${projectId}`;

  useEffect(() => {
    setActivityStatusListener((s) => {
      setStatus(s.status);
      setLiveSeconds(s.activeSeconds);
      setLiveUnjournaledSeconds(s.unjournaledSeconds ?? s.activeSeconds);
      setReason(s.reason ?? (s.needsJournal ? "Journal due" : ""));
      setNeedsJournal(Boolean(s.needsJournal));
    });
  }, []);

  useEffect(() => {
    if (status !== "active") return;
    const timer = window.setInterval(() => {
      setLiveSeconds((value) => value + 1);
      setLiveUnjournaledSeconds((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    setContent(window.localStorage.getItem(draftKey) ?? "");
  }, [draftKey]);

  useEffect(() => {
    window.localStorage.setItem(draftKey, content);
  }, [content, draftKey]);

  async function submitJournal() {
    setSaving(true);
    const response = await fetch(`/api/editor/projects/${projectId}/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.error ?? "Failed to save journal");
      return;
    }
    setContent("");
    window.localStorage.removeItem(draftKey);
    setOpen(false);
    setNeedsJournal(false);
    setLiveUnjournaledSeconds(0);
    setReason("");
    setStatus("idle");
  }

  if (open) {
    const canSubmit =
      liveUnjournaledSeconds >= JOURNAL_MIN_SECONDS &&
      content.trim().length >= 10;

    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex items-center gap-1 rounded bg-[#2a2a2a] px-2 py-1 text-xs font-semibold text-[#ddd] hover:bg-[#3a3a3a] hover:text-white"
        >
          <PanelRightClose className="size-3" />
          Journal open
        </button>
        <aside className="fixed top-10 right-0 z-50 flex h-[calc(100vh-2.5rem)] w-[360px] flex-col border-l border-[#333] bg-[#181818] shadow-[-8px_0_24px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between border-b border-[#333] px-4 py-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#777]">
                Journal draft
              </p>
              <h2 className="text-lg font-black text-white">
                What did you do?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded bg-[#2a2a2a] p-2 text-[#aaa] hover:bg-[#333] hover:text-white"
              aria-label="Collapse journal"
            >
              <PanelRightClose className="size-4" />
            </button>
          </div>

          <div className="flex-1 p-4">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Today I added an LED that flickers when the button is pressed. I wired it to pin 8, tested the resistor value, and fixed the code so it blinks reliably."
              className="h-full min-h-80 w-full resize-none rounded-xl border border-[#333] bg-[#101010] px-3 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-[#666] focus:border-[#BD0F32]"
            />
          </div>

          <div className="space-y-3 border-t border-[#333] p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#888]">
              <span>Draft saved automatically</span>
              <span>{fmt(liveUnjournaledSeconds)} tracked</span>
            </div>
            {liveUnjournaledSeconds < JOURNAL_MIN_SECONDS ? (
              <p className="rounded-lg border border-yellow-900/40 bg-yellow-950/40 px-3 py-2 text-xs font-semibold text-yellow-200">
                You can keep drafting now. Submit unlocks after 10 minutes of
                tracked work.
              </p>
            ) : null}
            <button
              type="button"
              disabled={saving || !canSubmit}
              onClick={submitJournal}
              className="w-full rounded-xl bg-[#BD0F32] px-4 py-3 text-sm font-black text-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Submitting"
                : liveUnjournaledSeconds < JOURNAL_MIN_SECONDS
                  ? "Submit unlocks at 10m"
                  : "Submit journal"}
            </button>
          </div>
        </aside>
      </>
    );
  }

  if (status === "blocked") {
    return (
      <span className="flex items-center gap-1 rounded bg-red-950 px-2 py-1 text-xs font-semibold text-red-200">
        <Clock className="size-3" />
        {reason || "Time tracking blocked"}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="underline"
        >
          Journal
        </button>
      </span>
    );
  }

  if (needsJournal) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 rounded bg-yellow-950 px-2 py-1 text-xs font-semibold text-yellow-200"
      >
        <Clock className="size-3" />
        Journal due
      </button>
    );
  }

  if (status === "idle" || liveSeconds < 10) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded bg-[#2a2a2a] px-2 py-1 text-xs font-semibold text-[#ddd] hover:bg-[#3a3a3a] hover:text-white"
      >
        <PanelRightOpen className="mr-1 inline size-3" />
        Journal
      </button>
    );
  }
  const canJournal = liveUnjournaledSeconds >= JOURNAL_MIN_SECONDS;

  return (
    <span className="flex items-center gap-2 text-xs text-green-400/70">
      <span className="flex items-center gap-1">
        <span className="inline-block size-1.5 rounded-full bg-green-400 animate-pulse" />
        <Clock className="size-3" />
        {fmt(liveSeconds)}
      </span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded bg-[#2a2a2a] px-2 py-1 font-semibold text-[#ddd] hover:bg-[#3a3a3a] hover:text-white"
        title={
          canJournal
            ? undefined
            : "You can draft now. Submit unlocks after 10 minutes."
        }
      >
        <PanelRightOpen className="mr-1 inline size-3" />
        Journal
      </button>
    </span>
  );
}
