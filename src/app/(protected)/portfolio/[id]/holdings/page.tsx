"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useGetHoldingsQuery,
  useUpsertHoldingsMutation,
  useDeleteHoldingMutation,
} from "@/features/portfolio/infrastructure/api/portfolioApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function HoldingsPage() {
  const params = useParams<{ id: string }>();
  const portfolioId = params?.id;

  const {
    data: holdings = [],
    isLoading,
    error,
    refetch,
  } = useGetHoldingsQuery(portfolioId, {
    skip: !portfolioId,
  } as any);

  const [upsertHoldings, { isLoading: saving }] = useUpsertHoldingsMutation();
  const [deleteHolding, { isLoading: deleting }] = useDeleteHoldingMutation();

  const [open, setOpen] = React.useState(false);
  const [symbol, setSymbol] = React.useState("");
  const [quantity, setQuantity] = React.useState("0");
  const [avgPrice, setAvgPrice] = React.useState("");

  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  async function addHolding() {
    if (!portfolioId) return;
    const q = Number(quantity);
    const ap = avgPrice !== "" ? Number(avgPrice) : undefined;
    if (!symbol.trim() || !Number.isFinite(q)) return;

    const next = [
      ...holdings,
      {
        symbol: symbol.trim().toUpperCase(),
        quantity: q,
        avgPrice: Number.isFinite(ap as any) ? ap : undefined,
      },
    ];

    await upsertHoldings({ portfolioId, body: { holdings: next } }).unwrap();
    setOpen(false);
    setSymbol("");
    setQuantity("0");
    setAvgPrice("");
    refetch();
  }

  async function onDelete(holdingId?: string) {
    if (!portfolioId || !holdingId) return;
    await deleteHolding({ portfolioId, holdingId }).unwrap();
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Holdings</h1>
          <p className="text-sm text-muted-foreground">
            Manage positions for risk analysis.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/portfolio/${portfolioId}`}>Back</Link>
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add holding</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Add holding</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="BTC"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avg Price (optional)</Label>
                  <Input
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(e.target.value)}
                    placeholder="30000"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={addHolding}
                  disabled={saving || !symbol.trim()}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Your holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : holdings.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No holdings yet. Add one to begin.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Avg Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((h: any, idx: number) => (
                    <TableRow key={h.id ?? `${h.symbol}-${idx}`}>
                      <TableCell className="font-mono">{h.symbol}</TableCell>
                      <TableCell className="text-right">{h.quantity}</TableCell>
                      <TableCell className="text-right">
                        {h.avgPrice ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(h.id)}
                          disabled={deleting}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/portfolio/${portfolioId}/risk`}>Go to Risk</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/portfolio/${portfolioId}/scenarios`}>
            Go to Scenarios
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/portfolio/${portfolioId}/copilot`}>Ask Copilot</Link>
        </Button>
      </div>
    </div>
  );
}
