"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Bucket = { label: string; users: number; documents: number };

const chartConfig = {
  users: { label: "Users", color: "var(--chart-1)" },
  documents: { label: "Documents", color: "var(--chart-2)" },
} satisfies ChartConfig;

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

export function OrganizationOverviewChart({
  title = "Activity (Users vs Documents)",
  description = "Last 6 months",
  data,
}: {
  title?: string;
  description?: string;
  data: Bucket[];
}) {
  const usersTotal = React.useMemo(() => sum(data.map((d) => d.users)), [data]);
  const docsTotal = React.useMemo(
    () => sum(data.map((d) => d.documents)),
    [data]
  );

  // demo trend text (tuỳ bạn thay bằng logic thật)
  const trendText = React.useMemo(() => {
    if (data.length < 2) return "Trend: N/A";
    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    const delta = last.documents - prev.documents;
    const sign = delta >= 0 ? "+" : "";
    return `Documents ${sign}${delta} vs last month`;
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
            <Bar dataKey="documents" fill="var(--color-documents)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {trendText} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total: {usersTotal} users • {docsTotal} documents
        </div>
      </CardFooter>
    </Card>
  );
}
