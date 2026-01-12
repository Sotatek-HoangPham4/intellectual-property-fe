"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useGetLatestRiskReportQuery,
  useGenerateRiskReportMutation,
} from "@/features/risk/infrastructure/api/riskApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RiskPage() {
  const params = useParams<{ id: string }>();
  const portfolioId = params?.id;

  const {
    data: latest,
    isLoading,
    error,
    refetch,
  } = useGetLatestRiskReportQuery(portfolioId, {
    skip: !portfolioId,
  } as any);

  const [generate, { isLoading: generating, error: errG }] =
    useGenerateRiskReportMutation();

  const errMsg =
    (error as any)?.data?.message ||
    (errG as any)?.data?.message ||
    (error as any)?.message ||
    (errG as any)?.message ||
    null;

  async function onGenerate() {
    if (!portfolioId) return;
    await generate(portfolioId).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Risk Report</h1>
          <p className="text-sm text-muted-foreground">
            Concentration risk, volatility proxy, risk level classification.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/portfolio/${portfolioId}`}>Back</Link>
          </Button>
          <Button onClick={onGenerate} disabled={generating}>
            {generating ? "Generating..." : "Generate latest"}
          </Button>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Latest report</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : latest ? (
            <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[560px]">
              {JSON.stringify(latest, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-muted-foreground">
              No report yet. Click{" "}
              <span className="font-medium">Generate latest</span>.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/portfolio/${portfolioId}/scenarios`}>
            Scenario Analysis
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/portfolio/${portfolioId}/copilot`}>
            Explain with Copilot
          </Link>
        </Button>
      </div>
    </div>
  );
}
