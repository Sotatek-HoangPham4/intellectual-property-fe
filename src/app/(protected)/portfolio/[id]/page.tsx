"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useGetPortfolioQuery,
  useGetDashboardQuery,
} from "@/features/portfolio/infrastructure/api/portfolioApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PortfolioDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: portfolio, error: errP } = useGetPortfolioQuery(id, {
    skip: !id,
  } as any);
  const { data: dashboard, error: errD } = useGetDashboardQuery(id, {
    skip: !id,
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
          <h1 className="text-2xl font-semibold">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Holdings • Risk • Scenarios • Copilot
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/home">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/portfolio/${id}/copilot`}>Ask Copilot</Link>
          </Button>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {portfolio?.name ?? "Portfolio"}{" "}
            <Badge variant="secondary">{id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/portfolio/${id}/holdings`}>Holdings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/portfolio/${id}/risk`}>Risk</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/portfolio/${id}/scenarios`}>Scenarios</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/portfolio/${id}/copilot`}>Copilot</Link>
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="raw">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[520px]">
                {JSON.stringify(dashboard, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fetched data</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Portfolio
                </div>
                <pre className="text-xs whitespace-pre-wrap max-h-80 overflow-auto">
                  {JSON.stringify(portfolio, null, 2)}
                </pre>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Dashboard
                </div>
                <pre className="text-xs whitespace-pre-wrap max-h-80 overflow-auto">
                  {JSON.stringify(dashboard, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
