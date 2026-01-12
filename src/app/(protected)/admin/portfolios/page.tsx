"use client";

import * as React from "react";
import {
  useListAdminPortfoliosQuery,
  useDeleteAdminPortfolioMutation,
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

export default function AdminPortfoliosPage() {
  const [q, setQ] = React.useState("");
  const { data, isLoading, error, refetch } = useListAdminPortfoliosQuery({
    q,
    page: 1,
    limit: 50,
  });
  const [del, { isLoading: deleting }] = useDeleteAdminPortfolioMutation();

  const items = data?.items ?? [];
  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  async function onDelete(id: string) {
    await del({ id }).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin – Portfolios</h1>
          <p className="text-sm text-muted-foreground">
            System portfolios across users.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name/owner..."
            className="w-[280px]"
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
          <CardTitle>Portfolios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Base</TableHead>
                  <TableHead>Owner</TableHead>
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
                      No portfolios found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {p.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {(p.baseCurrency ?? "").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {p.ownerId ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(p.id)}
                          disabled={deleting}
                        >
                          Delete
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
