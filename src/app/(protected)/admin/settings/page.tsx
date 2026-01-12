"use client";

import * as React from "react";
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from "@/features/admin/infrastructure/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsPage() {
  const { data, isLoading, error, refetch } = useGetAdminSettingsQuery();
  const [update, { isLoading: saving, error: errU }] =
    useUpdateAdminSettingsMutation();

  const [draft, setDraft] = React.useState<string>("{}");

  React.useEffect(() => {
    if (data) setDraft(JSON.stringify(data, null, 2));
  }, [data]);

  const errMsg =
    (error as any)?.data?.message ||
    (errU as any)?.data?.message ||
    (error as any)?.message ||
    (errU as any)?.message ||
    null;

  async function onSave() {
    const parsed = JSON.parse(draft);
    await update({ body: parsed }).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin – Settings</h1>
          <p className="text-sm text-muted-foreground">
            System settings (feature flags, limits, model config...).
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Edit JSON</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            // <Textarea
            //   value={draft}
            //   onChange={(e) => setDraft(e.target.value)}
            //   className="min-h-[420px] font-mono text-xs"
            // />
            <></>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            Tip: validate JSON before saving. Any invalid JSON will throw.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
