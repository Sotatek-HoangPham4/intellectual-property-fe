import clsx from "clsx";

export default function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
        role === "user"
          ? "ml-auto bg-foreground text-background"
          : "mr-auto bg-muted w-fit"
      )}
    >
      {content}
    </div>
  );
}
