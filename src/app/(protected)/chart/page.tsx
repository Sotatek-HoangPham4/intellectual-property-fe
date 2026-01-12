// "use client";

// import { convertCandleData } from "@/core/application/chart/convertCandleData";
// import { convertTimeframe } from "@/core/application/chart/convertTimeframe";
// import CandlestickChart from "@/core/presentation/components/charts/CandlestickChart";
// import TopTool from "@/core/presentation/components/tools/TopTool";
// import { useReplay } from "@/core/presentation/hooks/useReplay";
// import data from "@/shared/mocks/data.json";
// import {
//   IChartApi,
//   ISeriesMarkersPluginApi,
//   UTCTimestamp,
// } from "lightweight-charts";
// import { useRef, useState } from "react";
// export default function Home() {
//   const [timeframe, setTimeframe] = useState<"5m" | "15m" | "1h" | "1d">("5m");
//   const convertedData = convertTimeframe(data.values, timeframe);
//   const candleData = convertCandleData(convertedData);
//   const candleSeriesRef = useRef<any>(null);
//   const chartRef = useRef<IChartApi | null>(null);
//   const lineSeriesRef = useRef<any>(null);
//   const markersApiRef = useRef<ISeriesMarkersPluginApi<UTCTimestamp> | null>(
//     null
//   );

//   const {
//     isReplayMode,
//     isPlaying,
//     enableReplayMode,
//     setStartIndex,
//     confirmReplayStart,
//     startReplay,
//     stopReplay,
//     currentIndex,
//     startIndex,
//   } = useReplay({
//     candleData,
//     candleSeriesRef,
//     chartRef,
//     lineSeriesRef,
//     markersApiRef,
//   });

//   return (
//     <main className="w-full max-h-screen bg-[#2E2E2E] space-y-1">
//       <TopTool
//         timeframe={timeframe}
//         setTimeframe={setTimeframe}
//         isReplayMode={isReplayMode}
//         isPlaying={isPlaying}
//         enableReplayMode={enableReplayMode}
//         confirmReplayStart={confirmReplayStart}
//         startReplay={startReplay}
//         stopReplay={stopReplay}
//         currentIndex={currentIndex}
//         startIndex={startIndex}
//       />
//       <div className="w-full h-[calc(100vh-44px)] flex gap-1">
//         <div className="min-w-12 rounded-tr  bg-[#0F0F0F]"></div>
//         <div className="w-full flex flex-col gap-1">
//           <CandlestickChart
//             timeframe={timeframe}
//             candleData={candleData}
//             isReplayMode={isReplayMode}
//             candleSeriesRef={candleSeriesRef}
//             chartRef={chartRef}
//             lineSeriesRef={lineSeriesRef}
//             markersApiRef={markersApiRef}
//             setStartIndex={setStartIndex}
//           />
//           <div className="h-10 w-full bg-[#0F0F0F] rounded-t"></div>
//         </div>
//         {/* <div className="min-w-96 h-auto bg-[#0F0F0F] rounded-tl"></div> */}
//       </div>
//     </main>
//   );
// }

"use client";

import * as React from "react";
import Link from "next/link";
import {
  useGetPortfoliosQuery,
  useGetDashboardQuery,
} from "@/features/portfolio/infrastructure/api/portfolioApi";
import { useGetLatestRiskReportQuery } from "@/features/risk/infrastructure/api/riskApi";
// import { useComputeScenarioMutation } from "@/features/scenario/infrastructure/api/scenarioApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChartPage() {
  const { data: portfolios = [] } = useGetPortfoliosQuery();
  const [selectedId, setSelectedId] = React.useState("");

  React.useEffect(() => {
    if (!selectedId && portfolios?.[0]?.id) setSelectedId(portfolios[0].id);
  }, [portfolios, selectedId]);

  const { data: dashboard } = useGetDashboardQuery(selectedId, {
    skip: !selectedId,
  } as any);
  const { data: risk } = useGetLatestRiskReportQuery(selectedId, {
    skip: !selectedId,
  } as any);

  // const [
  //   computeScenario,
  //   { data: scenario, isLoading: computing, error: errS },
  // ] = useComputeScenarioMutation();

  // const errMsg = (errS as any)?.data?.message || (errS as any)?.message || null;

  // async function runShock(shockPercent: number) {
  //   if (!selectedId) return;
  //   await computeScenario({
  //     portfolioId: selectedId,
  //     body: { shockPercent },
  //   }).unwrap();
  // }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Charts</h1>
          <p className="text-sm text-muted-foreground">
            Allocation / risk / scenario outputs (chart-ready).
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select portfolio</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3 md:items-center">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full md:w-[420px]">
              <SelectValue placeholder="Choose portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.baseCurrency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              onClick={() => runShock(-10)}
              disabled={!selectedId || computing}
            >
              -10%
            </Button>
            <Button
              variant="outline"
              onClick={() => runShock(-20)}
              disabled={!selectedId || computing}
            >
              -20%
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* {errMsg ? <p className="text-sm text-red-600">{errMsg}</p> : null} */}

      <Tabs defaultValue="allocation">
        <TabsList>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="scenario">Scenario</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Allocation (from dashboard)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-4 text-sm text-muted-foreground">
                Chart placeholder — bind your chart component to the JSON below.
              </div>
              <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[520px]">
                {JSON.stringify(dashboard, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk snapshot (latest)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-4 text-sm text-muted-foreground">
                Risk chart placeholder.
              </div>
              <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[520px]">
                {JSON.stringify(risk, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenario" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario output</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-4 text-sm text-muted-foreground">
                Scenario chart placeholder.
              </div>
              {/* <pre className="text-xs whitespace-pre-wrap rounded-md border p-4 overflow-auto max-h-[520px]">
                {JSON.stringify(scenario, null, 2)}
              </pre> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
