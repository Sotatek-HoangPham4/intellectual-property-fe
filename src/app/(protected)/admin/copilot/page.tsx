"use client";

import * as React from "react";
import {
  useListAdminCopilotSessionsQuery,
  useArchiveAdminCopilotSessionMutation,
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

export default function AdminCopilotPage() {
  const [q, setQ] = React.useState("");
  const { data, isLoading, error, refetch } = useListAdminCopilotSessionsQuery({
    q,
    page: 1,
    limit: 50,
  });
  const [archive, { isLoading: archiving }] =
    useArchiveAdminCopilotSessionMutation();

  const items = data?.items ?? [];
  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  async function onArchive(id: string) {
    await archive({ id }).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin – Copilot</h1>
          <p className="text-sm text-muted-foreground">
            Monitor sessions, archive abusive/stale runs.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search userId/portfolioId/title..."
            className="w-[340px]"
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
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-sm text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-sm text-muted-foreground"
                    >
                      No sessions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="font-medium truncate max-w-[260px]">
                          {s.title ?? "Untitled"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {s.id}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {s.userId ?? "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {s.portfolioId ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.archivedAt ? "secondary" : "default"}>
                          {s.archivedAt ? "archived" : "active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onArchive(s.id)}
                          disabled={archiving}
                        >
                          Archive
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
