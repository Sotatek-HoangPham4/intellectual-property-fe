import { Eye, EyeClosed, EyeOff, ReplyAll, Trash } from "lucide-react";
import { Button } from "../ui/button";
import IndicatorToolbar from "./IndicatorToolbar";
import { DOWN_COLOR, UP_COLOR } from "@/shared/contansts";

export default function ChartToolbar({
  emaValues,
  rsiValue,
  removeEma,
  toggleEmaVisibility,
  emaSeriesStates,
  setEmaSeriesStates,
  volumeData,
  currentCandle,
  timeframe,
  setTimeframe,
  showEMA,
  setShowVolume,
  setShowEMA,
  setShowRSI,
  toggleEMA,
  showRSI,
  toggleRSI,
  showVolume,
  toggleVolume,
  isReplayMode,
  isPlaying,
  startReplay,
  stopReplay,
  enableReplayMode,
  confirmReplayStart,
  currentIndex,
  startIndex,
}: any) {
  const currentVolume =
    currentCandle &&
    currentCandle.close !== undefined &&
    currentCandle.open !== undefined
      ? currentCandle.close - currentCandle.open
      : null;

  // Lấy trị tuyệt đối và format nếu currentVolume hợp lệ
  let volumeFormatted = "";
  let volumeColor = "";

  if (currentVolume !== null) {
    const absVolume = Math.abs(currentVolume);
    volumeFormatted =
      absVolume >= 1000 ? (absVolume / 1000).toFixed(2) : absVolume.toFixed(2);
    volumeColor = currentVolume >= 0 ? UP_COLOR : DOWN_COLOR;
  }

  console.log("emaValues :", emaValues);

  return (
    <div className="absolute top-12 ml-1 z-10">
      <div className="w-fit">
        <Button variant={"ghost"} className="border p-2 h-7 rounded">
          <img
            src="https://s3-symbol-logo.tradingview.com/metal/gold.svg"
            className="rounded-full"
            alt=""
          />
          <p className="text-[15px] font-normal text-white">
            Gold Spot / U.S. Dollar
          </p>
        </Button>
        <div className="w-fit group/item h-6 rounded hover:outline-1">
          <div className="text-xs flex items-center px-2 py-0.5">
            <span className={showVolume ? `opacity-100` : `opacity-50`}>
              Vol · Ticks
              {currentVolume !== null && (
                <span
                  style={{ color: volumeColor }}
                  className="font-semibold ml-2"
                >
                  {volumeFormatted}K
                </span>
              )}
            </span>
            <div className="ml-3 text-gray-300 text-xs invisible group-hover/item:visible flex items-center gap-2">
              {showVolume ? (
                <Eye
                  onClick={() => setShowVolume((p: boolean) => !p)}
                  strokeWidth={1.5}
                  size={18}
                />
              ) : (
                <EyeOff
                  onClick={() => setShowVolume((p: boolean) => !p)}
                  strokeWidth={1.5}
                  size={18}
                />
              )}
              <Trash strokeWidth={1.5} size={16} />
            </div>
          </div>
        </div>

        {emaSeriesStates.map((ema: any) => {
          const emaValue =
            emaValues.find((v: any) => v.period === ema.period)?.value ?? null;

          return (
            <div
              key={ema.period}
              className="w-fit group/item h-6 rounded hover:outline-1 text-gray-300"
            >
              <div className="text-xs flex items-center px-2 py-0.5">
                <span className={ema.show ? `opacity-100` : `opacity-50`}>
                  EMA {ema.period}
                  {emaValue !== null && (
                    <span
                      style={{ color: ema.color }}
                      className="font-semibold ml-2"
                    >
                      {emaValue.toFixed(3)}
                    </span>
                  )}
                </span>

                <div className="ml-3 text-gray-300 text-xs invisible group-hover/item:visible flex items-center gap-2">
                  {ema.show ? (
                    <Eye
                      onClick={() => toggleEmaVisibility(ema.period)}
                      strokeWidth={1.5}
                      size={18}
                    />
                  ) : (
                    <EyeOff
                      onClick={() => toggleEmaVisibility(ema.period)}
                      strokeWidth={1.5}
                      size={18}
                    />
                  )}
                  <Trash
                    strokeWidth={1.5}
                    size={16}
                    onClick={() => removeEma(ema.period)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="w-fit group/item h-6 rounded hover:outline-1">
          <div className="text-xs flex items-center px-2 py-0.5">
            <span className={showRSI ? `opacity-100` : `opacity-50`}>
              RSI 34
              {currentVolume !== null && (
                <span
                  style={{ color: "purple" }}
                  className="font-semibold ml-2"
                >
                  {rsiValue?.toFixed(2)}
                </span>
              )}
            </span>
            <div className="ml-3 text-gray-300 text-xs invisible group-hover/item:visible flex items-center gap-2">
              {showRSI ? (
                <Eye
                  onClick={() => setShowRSI((p: boolean) => !p)}
                  strokeWidth={1.5}
                  size={18}
                />
              ) : (
                <EyeOff
                  onClick={() => setShowRSI((p: boolean) => !p)}
                  strokeWidth={1.5}
                  size={18}
                />
              )}
              <Trash strokeWidth={1.5} size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
