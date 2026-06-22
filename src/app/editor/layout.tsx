import "@/app/editor/velxio-styles/App.css";
import "@/app/editor/velxio-styles/index.css";
import { LaunchGate } from "@/components/shared/launch-gate";
import { launched } from "@/flags";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await launched())) return <LaunchGate />;

  return (
    <div className="editor-root fixed inset-0 z-50 flex flex-col bg-[#1e1e1e]">
      {children}
    </div>
  );
}
