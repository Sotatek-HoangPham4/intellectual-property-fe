"use client";

import * as React from "react";
import {
  useListAdminUsersQuery,
  useUpdateAdminUserMutation,
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

export default function AdminUsersPage() {
  const [q, setQ] = React.useState("");
  const { data, isLoading, error, refetch } = useListAdminUsersQuery({
    q,
    page: 1,
    limit: 50,
  });
  const [updateUser, { isLoading: updating }] = useUpdateAdminUserMutation();

  const items = data?.items ?? [];
  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  async function toggleActive(u: any) {
    await updateUser({ id: u.id, body: { isActive: !u.isActive } }).unwrap();
    refetch();
  }

  async function promoteAdmin(u: any) {
    await updateUser({
      id: u.id,
      body: { role: u.role === "admin" ? "user" : "admin" },
    }).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin – Users</h1>
          <p className="text-sm text-muted-foreground">
            Search, activate/deactivate, change role.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email/name..."
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
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
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
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((u: any) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-mono">{u.email}</TableCell>
                      <TableCell>{u.name ?? "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                        >
                          {u.role ?? "user"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.isActive ? "secondary" : "destructive"}
                        >
                          {u.isActive ? "active" : "disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => promoteAdmin(u)}
                          disabled={updating}
                        >
                          {u.role === "admin" ? "Demote" : "Promote"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(u)}
                          disabled={updating}
                        >
                          {u.isActive ? "Disable" : "Enable"}
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
