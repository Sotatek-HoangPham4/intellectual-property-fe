"use client";

import Link from "next/link";
import { useGetAdminOverviewQuery } from "@/features/admin/infrastructure/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: any;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value ?? "-"}</div>
        {hint ? (
          <div className="text-xs text-muted-foreground mt-1">{hint}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useGetAdminOverviewQuery();
  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin Overview</h1>
          <p className="text-sm text-muted-foreground">
            System-wide metrics & quick actions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/users">Users</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/portfolios">Portfolios</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/copilot">Copilot</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/risk">Risk</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={data?.totalUsers} />
          <StatCard title="Total Portfolios" value={data?.totalPortfolios} />
          <StatCard
            title="Total Copilot Sessions"
            value={data?.totalSessions}
          />
          <StatCard title="Total Risk Reports" value={data?.totalRiskReports} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raw payload</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[520px]">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
