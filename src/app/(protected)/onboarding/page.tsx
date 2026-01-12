"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useCreatePortfolioMutation,
  useUpsertHoldingsMutation,
} from "@/features/portfolio/infrastructure/api/portfolioApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type HoldingDraft = {
  symbol: string;
  quantity: number;
  avgPrice?: number;
};

function parseCsv(text: string): HoldingDraft[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((s) => s.trim().toLowerCase());
  const idxSymbol = headers.indexOf("symbol");
  const idxQty = headers.indexOf("quantity");
  const idxAvg = headers.indexOf("avgprice");

  const out: HoldingDraft[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((s) => s.trim());
    const symbol = idxSymbol >= 0 ? cols[idxSymbol] : cols[0];
    const quantity = Number(idxQty >= 0 ? cols[idxQty] : cols[1]);
    const avgRaw = idxAvg >= 0 ? cols[idxAvg] : cols[2];
    const avgPrice =
      avgRaw !== undefined && avgRaw !== "" ? Number(avgRaw) : undefined;

    if (!symbol || !Number.isFinite(quantity)) continue;
    out.push({
      symbol: symbol.toUpperCase(),
      quantity,
      avgPrice: Number.isFinite(avgPrice as any) ? avgPrice : undefined,
    });
  }
  return out;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<"create" | "import">("create");

  const [createPortfolio, { isLoading: creating, error: createErr }] =
    useCreatePortfolioMutation();
  const [upsertHoldings, { isLoading: importing, error: importErr }] =
    useUpsertHoldingsMutation();

  const [portfolioId, setPortfolioId] = React.useState<string | null>(null);
  const [portfolioName, setPortfolioName] = React.useState<string>("");

  const [name, setName] = React.useState("");
  const [baseCurrency, setBaseCurrency] = React.useState("USD");

  const [csvText, setCsvText] = React.useState("");
  const [draft, setDraft] = React.useState<HoldingDraft[]>([]);

  const errMsg =
    (createErr as any)?.data?.message ||
    (importErr as any)?.data?.message ||
    (createErr as any)?.message ||
    (importErr as any)?.message ||
    null;

  async function onCreate() {
    const res = await createPortfolio({
      name: name.trim(),
      baseCurrency: baseCurrency.trim(),
    }).unwrap();
    const p = res as any;
    setPortfolioId(p.id);
    setPortfolioName(p.name ?? name.trim());
    setStep("import");
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setCsvText(text);
      setDraft(parseCsv(text));
    };
    reader.readAsText(file);
  }

  async function onImport() {
    if (!portfolioId) return;
    // send as { holdings } (safe)
    await upsertHoldings({ portfolioId, body: { holdings: draft } }).unwrap();
    router.push(`/portfolio/${portfolioId}`);
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Onboarding</h1>
        <p className="text-sm text-muted-foreground">
          Create your first portfolio and import holdings via CSV. Risk-first,
          analysis-only.
        </p>
      </div>

      <Tabs value={step} onValueChange={(v) => setStep(v as any)}>
        <TabsList>
          <TabsTrigger value="create">1) Create portfolio</TabsTrigger>
          <TabsTrigger value="import" disabled={!portfolioId}>
            2) Import holdings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Crypto Portfolio"
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
              </div>

              {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

              <div className="flex gap-2">
                <Button onClick={onCreate} disabled={creating || !name.trim()}>
                  {creating ? "Creating..." : "Create & continue"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/home")}>
                  Back to home
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Import holdings{" "}
                {portfolioName ? (
                  <Badge variant="secondary">{portfolioName}</Badge>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload CSV</Label>
                <Input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Columns:{" "}
                  <span className="font-mono">symbol,quantity,avgPrice</span>{" "}
                  (avgPrice optional).
                </p>
              </div>

              {draft.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Avg Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {draft.slice(0, 20).map((r, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono">
                            {r.symbol}
                          </TableCell>
                          <TableCell className="text-right">
                            {r.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {r.avgPrice ?? "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {draft.length > 20 ? (
                    <div className="p-3 text-xs text-muted-foreground">
                      Showing first 20 rows out of {draft.length}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No rows parsed yet.
                </div>
              )}

              {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null}

              <div className="flex gap-2">
                <Button
                  onClick={onImport}
                  disabled={!portfolioId || draft.length === 0 || importing}
                >
                  {importing ? "Importing..." : "Import & finish"}
                </Button>
                <Button variant="outline" onClick={() => setStep("create")}>
                  Back
                </Button>
              </div>

              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">CSV preview</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-md border p-3 max-h-64 overflow-auto">
                  {csvText}
                </pre>
              </details>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
