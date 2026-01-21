import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { PlusCircle, ReplyAll, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const timeframes = {
  "5m": "5 minutes",
  "15m": "15 minutes",
  "30m": "30 minutes",
  "1h": "1 hour",
  "1d": "1 day",
};

const TopTool = ({
  timeframe,
  setTimeframe,
  isReplayMode,
  isPlaying,
  enableReplayMode,
  confirmReplayStart,
  startReplay,
  stopReplay,
  currentIndex,
  startIndex,
}: {
  timeframe: string;
  setTimeframe: Dispatch<SetStateAction<"5m" | "15m" | "1h" | "1d">>;
  isReplayMode: boolean;
  isPlaying: boolean;
  enableReplayMode: () => void;
  confirmReplayStart: () => void;
  startReplay: (resume?: boolean) => void;
  stopReplay: () => void;
  currentIndex: number;
  startIndex: number;
}) => {
  console.log("timeframe", timeframe);
  return (
    <div className="h-10 w-full bg-[#0F0F0F] flex items-center p-1 gap-2">
      <Button size={"icon"} className="h-8 w-10" variant={"ghost"}>
        <div className="h-7 w-7 rounded-full bg-blue-500 text-white flex items-center justify-center">
          H
        </div>
      </Button>
      <Button
        size={"sm"}
        className="h-8 justify-between rounded"
        variant={"secondary"}
      >
        <div className="min-w-24  flex items-center gap-2 justify-start">
          <Search />
          <p className="">XAUUSD</p>
        </div>
        <PlusCircle />
      </Button>
      <Select
        value={timeframe}
        onValueChange={(val) => setTimeframe(val as any)}
      >
        <SelectTrigger className="p-2.5 bg-white">
          {/* Trigger chỉ hiển thị short key */}
          {timeframe}
        </SelectTrigger>

        <SelectContent align="start" className="min-w-40">
          {Object.entries(timeframes).map(([short, full]) => (
            <SelectItem key={short} value={short}>
              {full}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 items-center">
        {!isReplayMode && !isPlaying && (
          <Button
            className="h-8"
            variant={"outline"}
            onClick={enableReplayMode}
          >
            <ReplyAll /> Replay
          </Button>
        )}
        {isReplayMode && (
          <Button
            className="h-8"
            variant={"outline"}
            onClick={confirmReplayStart}
          >
            Confirm Position
          </Button>
        )}
        {!isPlaying && !isReplayMode ? (
          <>
            <Button
              className="h-8"
              variant={"outline"}
              onClick={() => startReplay(false)}
            >
              Play
            </Button>
            {currentIndex > startIndex && (
              <Button
                className="h-8"
                variant={"outline"}
                onClick={() => startReplay(true)}
              >
                ⏯ Continue
              </Button>
            )}
          </>
        ) : (
          isPlaying && (
            <Button className="h-8" variant={"outline"} onClick={stopReplay}>
              ❚❚ Pause
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default TopTool;
