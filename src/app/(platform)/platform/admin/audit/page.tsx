import { desc } from "drizzle-orm";
import { LoginButton } from "@/components/shared/auth-buttons";
import { AuditTable } from "@/components/platform/audit-table";
import { AccessCard } from "@/components/ui/access-card";
import { getSession, isAdminSession } from "@/lib/auth/guards";
import { db } from "@/lib/db/db";
import { auditLogs } from "@/lib/db/schema";

export default async function AdminAuditPage() {
  const session = await getSession();
  if (!session) {
    return (
      <AccessCard
        eyebrow="Audit"
        title="Audit log"
        message="Log in to inspect platform activity."
      >
        <LoginButton callbackURL="/platform/admin/audit" />
      </AccessCard>
    );
  }
  if (!(await isAdminSession(session))) {
    return (
      <AccessCard
        eyebrow="Audit"
        title="Audit log"
        message="Admin access is required."
      />
    );
  }

  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(500);

  return (
    <main className="max-w-6xl">
      <AuditTable
        entries={rows.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
