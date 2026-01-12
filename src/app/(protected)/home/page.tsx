"use client";

import * as React from "react";
import Link from "next/link";
import {
  useGetPortfoliosQuery,
  useCreatePortfolioMutation,
} from "@/features/portfolio/infrastructure/api/portfolioApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const {
    data: portfolios = [],
    isLoading,
    error,
    refetch,
  } = useGetPortfoliosQuery();
  const [createPortfolio, { isLoading: creating }] =
    useCreatePortfolioMutation();

  console.log(portfolios);

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [baseCurrency, setBaseCurrency] = React.useState("USD");
  const errMsg =
    (error as any)?.data?.message || (error as any)?.message || null;

  async function onCreate() {
    if (!name.trim()) return;
    await createPortfolio({
      name: name.trim(),
      baseCurrency: baseCurrency.trim(),
    }).unwrap();
    setOpen(false);
    setName("");
    setBaseCurrency("USD");
    refetch();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Your Portfolios</h1>
          <p className="text-sm text-muted-foreground">
            Create a portfolio, import holdings, then view risk, scenarios, and
            Copilot explanations.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/onboarding">Onboarding</Link>
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create portfolio</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Create a new portfolio</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Long-term Crypto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base currency</Label>
                  <Input
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value)}
                    placeholder="USD"
                  />
                </div>
                {errMsg ? (
                  <p className="text-sm text-red-600">{errMsg}</p>
                ) : null}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onCreate} disabled={creating || !name.trim()}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="text-lg font-medium">No portfolio yet</div>
            <div className="text-sm text-muted-foreground">
              Start by creating a portfolio, then import holdings from CSV or
              add manually.
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setOpen(true)}>Create portfolio</Button>
              <Button asChild variant="secondary">
                <Link href="/onboarding">Go onboarding</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {portfolios.map((p) => (
            <Card key={p.id} className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="truncate">{p.name}</span>
                  <Badge variant="secondary">
                    {(p.baseCurrency || "").toUpperCase()}
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  ID: <span className="font-mono">{p.id}</span>
                </p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Button asChild>
                  <Link href={`/portfolio/${p.id}`}>Open</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/portfolio/${p.id}/copilot`}>Copilot</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
