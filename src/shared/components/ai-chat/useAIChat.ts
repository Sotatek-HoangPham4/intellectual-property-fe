import { useState, useRef, useEffect } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function useAIChat() {
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const [size, setSize] = useState({
    width: 340,
    height: 520,
  });

  const resizingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ===================== Chat ===================== */

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "user", content: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Đây là câu trả lời từ AI 🤖" },
      ]);
    }, 500);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  // auto scroll xuống cuối
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  /* ===================== Resize ===================== */

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;

      setSize((prev) => {
        const nextWidth = prev.width - e.movementX;
        const nextHeight = prev.height - e.movementY;

        return {
          width: Math.min(Math.max(nextWidth, 340), 900),
          height: Math.min(Math.max(nextHeight, 280), window.innerHeight - 72),
        };
      });
    };

    const stopResize = () => {
      resizingRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  return {
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
  };
}
