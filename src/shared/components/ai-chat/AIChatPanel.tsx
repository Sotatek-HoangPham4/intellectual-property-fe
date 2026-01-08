"use client";

import { X, Maximize2, Minimize2, Send, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import { useAIChatContext } from "./AIChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";

export default function AIChatPanel() {
  const {
    open,
    setOpen,
    large,
    setLarge,
    messages,
    input,
    setInput,
    sendMessage,
    containerRef,
    size,
    startResize,
  } = useAIChatContext();

  if (!open) return null;

  return (
    <div
      style={{
        width: large ? 720 : size.width,
        height: large ? "90vh" : size.height,
      }}
      //   style={{
      //     width: large ? 540 : 340,
      //     height: large ? "80vh" : size.height,
      //   }}
      className="
        fixed bottom-4 right-4 z-999
        bg-white shadow-xl rounded-xl
        flex flex-col overflow-hidden
      "
    >
      {/* ================= Header ================= */}
      <div className="h-12 px-3 pr-2 flex items-center justify-between border-b bg-foreground text-white">
        <p className="font-medium flex items-center gap-2">
          <SparklesIcon size={18} />
          AI Assistant
        </p>

        <div className="flex gap-1 items-center">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 "
            onClick={() => setLarge((v) => !v)}
          >
            {large ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="w-8 h-8 "
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* ================= Messages ================= */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} {...m} />
        ))}
      </div>

      {/* ================= Input ================= */}
      <div className="w-full p-2 border-t flex gap-2">
        <Input
          className="w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this document..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>
          <Send size={16} />
        </Button>
      </div>

      {/* ================= Resize Handle ================= */}
      {!large && (
        <div
          onMouseDown={startResize}
          className="
            absolute top-2 left-2
            w-4 h-4 cursor-pointer
            opacity-40 hover:opacity-100
          "
        >
          <div className="w-full h-full border-l-2 border-t-2 border-background" />
        </div>
      )}
    </div>
  );
}
