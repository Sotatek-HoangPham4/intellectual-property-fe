"use client";

import * as React from "react";
import {
  useListAdminRiskReportsQuery,
  useRecomputeAdminRiskMutation,
} from "@/features/admin/infrastructure/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminRiskPage() {
  const [q, setQ] = React.useState("");
  const { data, isLoading, error, refetch } = useListAdminRiskReportsQuery({
    q,
    page: 1,
    limit: 50,
  });
  const [recompute, { isLoading: recomputing }] =
    useRecomputeAdminRiskMutation();

  const items = data?.items ?? [];
  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  async function onRecompute(portfolioId: string) {
    await recompute({ portfolioId }).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin – Risk</h1>
          <p className="text-sm text-muted-foreground">
            View generated risk reports across portfolios.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by portfolioId..."
            className="w-[320px]"
          />
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Risk Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-sm text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-sm text-muted-foreground"
                    >
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-mono text-xs">{r.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.createdAt ?? "-"}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.portfolioId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {r.riskLevel ?? "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRecompute(r.portfolioId)}
                          disabled={recomputing}
                        >
                          Recompute
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing {items.length} items {data?.total ? `of ${data.total}` : ""}
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
