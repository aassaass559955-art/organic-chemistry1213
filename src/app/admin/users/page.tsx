"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, UserCog, Users } from "lucide-react";
import { useT } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/cards";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "USER";
  createdAt: string;
};

const roleColors: Record<string, string> = {
  ADMIN: "border-primary/40 text-primary",
  EDITOR: "border-secondary/40 text-secondary",
  USER: "border-line text-muted",
};

export default function AdminUsersPage() {
  const { t, lang } = useT();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => (await fetch("/api/users")).json(),
  });

  const changeRole = async (id: string, role: string) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
        <Users className="h-5 w-5 text-accent" />
        {t("adminUsers")} ({data?.length ?? 0})
      </h2>
      {!data?.length ? (
        <EmptyState message={t("noResults")} />
      ) : (
        <div className="glass overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="px-5 py-4 text-start font-medium">{t("commentName")}</th>
                  <th className="px-5 py-4 text-start font-medium">{t("contactEmail")}</th>
                  <th className="px-5 py-4 text-start font-medium">{t("adminRole")}</th>
                  <th className="px-5 py-4 text-start font-medium">{t("publishedAt")}</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <tr key={u.id} className="border-b border-line/50 last:border-0 hover:bg-surface/60">
                    <td className="px-5 py-3.5 font-medium">
                      <span className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-secondary" />
                        {u.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted" dir="ltr">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`chip border text-[10px] ${roleColors[u.role]}`}>
                        <ShieldCheck className="h-3 w-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(u.createdAt, lang)}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="field w-auto cursor-pointer !py-1.5 text-xs"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
