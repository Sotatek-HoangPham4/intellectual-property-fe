"use client";

import * as React from "react";
import Link from "next/link";
import {
  useGetPortfoliosQuery,
  useGetDashboardQuery,
} from "@/features/portfolio/infrastructure/api/portfolioApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const {
    data: portfolios = [],
    isLoading: loadingP,
    error: errP,
  } = useGetPortfoliosQuery();
  const [selectedId, setSelectedId] = React.useState<string>("");

  React.useEffect(() => {
    if (!selectedId && portfolios?.[0]?.id) setSelectedId(portfolios[0].id);
  }, [portfolios, selectedId]);

  const {
    data: dash,
    isLoading: loadingD,
    error: errD,
  } = useGetDashboardQuery(selectedId, {
    skip: !selectedId,
  } as any);

  const errMsg =
    (errP as any)?.data?.message ||
    (errD as any)?.data?.message ||
    (errP as any)?.message ||
    (errD as any)?.message ||
    null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of allocation and risk signals.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/home">Portfolios</Link>
          </Button>
          <Button asChild disabled={!selectedId}>
            <Link href={selectedId ? `/portfolio/${selectedId}/copilot` : "#"}>
              Ask Copilot
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select portfolio</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3 md:items-center">
          {loadingP ? (
            <Skeleton className="h-10 w-80" />
          ) : portfolios.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No portfolio found.{" "}
              <Link className="underline" href="/onboarding">
                Create one
              </Link>
              .
            </div>
          ) : (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full md:w-[420px]">
                <SelectValue placeholder="Choose portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.baseCurrency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex gap-2">
            <Button asChild variant="outline" disabled={!selectedId}>
              <Link href={selectedId ? `/portfolio/${selectedId}` : "#"}>
                Details
              </Link>
            </Button>
            <Button asChild variant="outline" disabled={!selectedId}>
              <Link href={selectedId ? `/portfolio/${selectedId}/risk` : "#"}>
                Risk
              </Link>
            </Button>
            <Button asChild variant="outline" disabled={!selectedId}>
              <Link
                href={selectedId ? `/portfolio/${selectedId}/scenarios` : "#"}
              >
                Scenarios
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Overview data</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingD ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : dash ? (
            <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[520px]">
              {JSON.stringify(dash, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-muted-foreground">
              No dashboard data.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
