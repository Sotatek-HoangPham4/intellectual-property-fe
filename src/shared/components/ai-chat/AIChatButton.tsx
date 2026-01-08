import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIChatContext } from "./AIChatContext";

export default function AIChatButton() {
  const { setOpen } = useAIChatContext();

  return (
    <Button
      onClick={() => {
        setOpen(true);
        console.log("open chat");
      }}
      size={"icon"}
      className="fixed bottom-4 right-4 z-999 rounded-full shadow-lg"
    >
      <Sparkles />
    </Button>
  );
}
