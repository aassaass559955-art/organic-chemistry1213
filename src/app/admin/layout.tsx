import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.role === "USER") {
    return <>{children}</>;
  }
  return <AdminShell name={session.name} role={session.role}>{children}</AdminShell>;
}
