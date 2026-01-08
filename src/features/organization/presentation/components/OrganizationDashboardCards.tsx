"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { OrgMember } from "@/features/organization/infrastructure/api/organizationApi";

type DocumentStats = {
  total: number;
  draft: number;
  inReview: number;
  approved: number;
  signed: number;
  rejected: number;
  expired: number;
};

function StatCard({
  title,
  value,
  subtitle,
  loading,
  right,
}: {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  loading?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <>
            <Skeleton className="h-7 w-[40%]" />
            <Skeleton className="h-4 w-[70%]" />
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="text-2xl font-semibold leading-none">{value}</div>
              {right}
            </div>
            {subtitle ? (
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return clampPct((numerator / denominator) * 100);
}

function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

function daysAgo(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - t;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function OrganizationDashboardCards({
  members,
  membersLoading,
  documentStats,
  documentStatsLoading,
}: {
  members?: OrgMember[];
  membersLoading?: boolean;

  // Khi có API docs stats thì truyền vào
  documentStats?: DocumentStats;
  documentStatsLoading?: boolean;
}) {
  const memberCount = members?.length ?? 0;

  const roleBreakdown = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const m of members ?? []) {
      const roleName = m.role?.name ?? "unknown";
      map.set(roleName, (map.get(roleName) ?? 0) + 1);
    }
    // sort desc
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [members]);

  const newMembers7d = React.useMemo(() => {
    if (!members?.length) return 0;
    return members.filter((m) => {
      if (!m.joinedAt) return false;
      return daysAgo(m.joinedAt) <= 7;
    }).length;
  }, [members]);

  const docs = documentStats;
  const docsTotal = docs?.total ?? 0;
  const signedRate = docs ? pct(docs.signed, docs.total) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Members"
          loading={membersLoading}
          value={memberCount}
          subtitle={
            memberCount
              ? `${newMembers7d} joined in last 7 days`
              : "No members data"
          }
          right={
            !membersLoading && memberCount ? (
              <div className="text-xs text-muted-foreground">
                {roleBreakdown[0]?.[0]
                  ? `Top role: ${roleBreakdown[0][0]}`
                  : ""}
              </div>
            ) : null
          }
        />

        <StatCard
          title="Roles"
          loading={membersLoading}
          value={roleBreakdown.length}
          subtitle={
            roleBreakdown.length
              ? roleBreakdown
                  .slice(0, 3)
                  .map(([name, n]) => `${name}: ${n}`)
                  .join(" • ")
              : "No role data"
          }
        />

        <StatCard
          title="Documents total"
          loading={documentStatsLoading}
          value={docs ? docsTotal : "—"}
          subtitle={
            docs
              ? `${docs.draft} draft • ${docs.inReview} in review • ${docs.approved} approved`
              : "Connect document stats API"
          }
        />

        <StatCard
          title="Signed rate"
          loading={documentStatsLoading}
          value={docs ? formatPct(signedRate) : "—"}
          subtitle={
            docs
              ? `${docs.signed} signed / ${docs.total} total`
              : "No document stats yet"
          }
          right={
            docs ? (
              <div className="w-[120px]">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-foreground"
                    style={{ width: `${signedRate}%` }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {formatPct(signedRate)}
                </div>
              </div>
            ) : null
          }
        />
      </div>

      {/* Optional: detail strip */}
      {docs ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              <div>
                <div className="text-xs text-muted-foreground">Draft</div>
                <div className="font-semibold">{docs.draft}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">In review</div>
                <div className="font-semibold">{docs.inReview}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Approved</div>
                <div className="font-semibold">{docs.approved}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Signed</div>
                <div className="font-semibold">{docs.signed}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Rejected</div>
                <div className="font-semibold">{docs.rejected}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Expired</div>
                <div className="font-semibold">{docs.expired}</div>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              Idea bổ sung: “Overdue approvals”, “Signed last 7 days”, “Average
              time to sign”.
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
