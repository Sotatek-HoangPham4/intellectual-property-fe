"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useListSessionsQuery,
  useCreateSessionMutation,
  useArchiveSessionMutation,
  useListMessagesQuery,
  useSendMessageMutation,
  useLazyGetRunQuery,
} from "@/features/copilot/infrastructure/api/copilotApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function CopilotPage() {
  const params = useParams<{ id: string }>();
  const portfolioId = params?.id;

  const {
    data: sessions = [],
    isLoading: loadingS,
    refetch: refetchSessions,
  } = useListSessionsQuery();
  const [createSession, { isLoading: creating }] = useCreateSessionMutation();
  const [archiveSession, { isLoading: archiving }] =
    useArchiveSessionMutation();

  const [activeSessionId, setActiveSessionId] = React.useState<string>("");

  React.useEffect(() => {
    if (!activeSessionId && sessions?.[0]?.id)
      setActiveSessionId(sessions[0].id);
  }, [sessions, activeSessionId]);

  const {
    data: messages = [],
    isLoading: loadingM,
    refetch: refetchMessages,
  } = useListMessagesQuery(activeSessionId, { skip: !activeSessionId } as any);

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [triggerGetRun] = useLazyGetRunQuery();

  const [text, setText] = React.useState("");
  const [runStatus, setRunStatus] = React.useState<string>("");

  async function onNewSession() {
    if (!portfolioId) return;
    const s = await createSession({ portfolioId }).unwrap();
    setActiveSessionId((s as any).id);
    refetchSessions();
  }

  async function onArchive() {
    if (!activeSessionId) return;
    await archiveSession(activeSessionId).unwrap();
    setActiveSessionId("");
    refetchSessions();
  }

  async function onSend() {
    if (!activeSessionId || !text.trim()) return;

    setRunStatus("");
    const res = await sendMessage({
      sessionId: activeSessionId,
      body: { content: text.trim(), portfolioId },
    }).unwrap();

    setText("");
    refetchMessages();

    const runId = (res as any)?.runId;
    if (!runId) return;

    // poll run status
    for (let i = 0; i < 30; i++) {
      const run = await triggerGetRun(runId).unwrap();
      const status = (run as any)?.status ?? "unknown";
      setRunStatus(status);

      if (status === "succeeded" || status === "failed") break;
      await sleep(800);
    }

    refetchMessages();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">AI Investment Copilot</h1>
          <p className="text-sm text-muted-foreground">
            Analysis-only. No buy/sell recommendations. No price prediction.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/portfolio/${portfolioId}`}>Back</Link>
          </Button>
          <Button onClick={onNewSession} disabled={creating || !portfolioId}>
            {creating ? "Creating..." : "New session"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            Sessions{" "}
            {portfolioId ? (
              <Badge variant="secondary">Portfolio {portfolioId}</Badge>
            ) : null}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refetchSessions()}
              disabled={loadingS}
            >
              Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={onArchive}
              disabled={!activeSessionId || archiving}
            >
              Archive
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid md:grid-cols-[320px_1fr] gap-4">
          {/* Left: sessions */}
          <div className="rounded-md border">
            <ScrollArea className="h-[520px]">
              <div className="p-2 space-y-2">
                {loadingS ? (
                  <div className="text-sm text-muted-foreground p-2">
                    Loading sessions...
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2">
                    No sessions. Click{" "}
                    <span className="font-medium">New session</span>.
                  </div>
                ) : (
                  sessions.map((s: any) => {
                    const active = s.id === activeSessionId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveSessionId(s.id)}
                        className={[
                          "w-full text-left rounded-md border p-3 transition-colors",
                          active ? "bg-muted" : "hover:bg-muted/50",
                        ].join(" ")}
                      >
                        <div className="font-medium truncate">
                          {s.title ?? `Session ${s.id.slice(0, 6)}`}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {s.id}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right: chat */}
          <div className="rounded-md border flex flex-col">
            <div className="p-3 flex items-center justify-between">
              <div className="text-sm font-medium">Chat</div>
              {runStatus ? (
                <Badge variant="secondary">run: {runStatus}</Badge>
              ) : null}
            </div>
            <Separator />

            <ScrollArea className="h-[420px]">
              <div className="p-4 space-y-3">
                {loadingM ? (
                  <div className="text-sm text-muted-foreground">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Start by asking: “Danh mục của tôi rủi ro tập trung ở đâu?”
                    hoặc “Scenario -20% ảnh hưởng thế nào?”
                  </div>
                ) : (
                  messages.map((m: any) => (
                    <div
                      key={m.id}
                      className={
                        m.role === "user"
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >
                      <div
                        className={[
                          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted",
                        ].join(" ")}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <Separator />

            <div className="p-3 flex gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about risk, allocation, scenario impacts…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSend();
                }}
                disabled={!activeSessionId}
              />
              <Button
                onClick={onSend}
                disabled={!activeSessionId || sending || !text.trim()}
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>

            <div className="px-3 pb-3 text-xs text-muted-foreground">
              Guardrails: no buy/sell recommendations • no price prediction •
              explain risk in plain language.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
