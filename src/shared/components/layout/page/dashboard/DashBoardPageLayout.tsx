import { Button } from "@/components/ui/button";
import { ChartLineInteractive } from "@/shared/components/charts/chart-line-interactive";

import React from "react";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

function KpiButton({
  title,
  value,
  trendPercent,
  hint,
  onClick,
}: {
  title: string;
  value: React.ReactNode;
  trendPercent?: number;
  hint?: string;
  onClick?: () => void;
}) {
  const up = (trendPercent ?? 0) >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn("h-auto w-full flex-col items-start gap-2 py-3")}
    >
      <p className="text-muted-foreground">{title}</p>

      <div className="w-full flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-3xl font-semibold leading-none">{value}</div>
          {hint ? (
            <div className="text-xs text-muted-foreground">{hint}</div>
          ) : null}
        </div>

        {typeof trendPercent === "number" ? (
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              up ? "text-green-600" : "text-red-600"
            )}
          >
            <Icon className="h-4 w-4" />
            {up ? "+" : ""}
            {trendPercent}%
          </div>
        ) : null}
      </div>
    </Button>
  );
}

// usage
export function StatsGrid2() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <KpiButton title="Documents" value={238} trendPercent={23} hint="Total" />
      <KpiButton title="Draft" value={41} trendPercent={-8} hint="Pending" />
      <KpiButton title="Signed" value={12} trendPercent={4} />
      <KpiButton title="Members" value={9} />
      <KpiButton title="Storage" value="1.2 GB" trendPercent={11} />
    </div>
  );
}

const DashBoardPageLayout = () => {
  return (
    <div className="p-6">
      <div className="w-full min-h-screen bg-background rounded-lg border p-4 space-y-4">
        <StatsGrid2 />

        <div className="w-full p-4 rounded-lg border space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">Storage's Space</p>
            <p className="text-muted-foreground font-medium">
              Using <span className="text-foreground font-bold">100 GB</span> of
              112 GB
            </p>
          </div>
          <div className="w-full h-8 rounded-lg bg-muted flex gap-1">
            <div className="bg-blue-600 w-2/5 rounded-l-lg"></div>
            <div className="bg-yellow-400 w-1/5"></div>
            <div className="bg-red-500 w-1/3"></div>
          </div>

          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-600"></div>
              <p className="font-medium text-muted-foreground">
                Regular files (60 GB)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-yellow-400"></div>
              <p className="font-medium text-muted-foreground">
                Replay (24 GB)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-500"></div>
              <p className="font-medium text-muted-foreground">
                Shared files (16 GB)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-muted"></div>
              <p className="font-medium text-muted-foreground">
                Unused space (12 GB)
              </p>
            </div>
          </div>

          <p className="text-muted-foreground">
            When your team runs out of space, account will stop syncing and you
            won't be able to add any new files.
          </p>
        </div>

        <div className="">
          <ChartLineInteractive />
        </div>
      </div>
    </div>
  );
};

export default DashBoardPageLayout;
