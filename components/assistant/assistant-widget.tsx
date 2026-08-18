"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, Sparkles, Loader2, Bot, User, Plus } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
};

const ROUTE_LINKS: { phrases: string[]; href: string; label: string }[] = [
  { phrases: ["sign up", "signup", "register", "create account", "create an account"], href: "/register", label: "Sign Up" },
  { phrases: ["log in", "login", "sign in"], href: "/login", label: "Login" },
  { phrases: ["forgot password", "reset password"], href: "/forgot-password", label: "Reset Password" },
  { phrases: ["verify email"], href: "/verify-email", label: "Verify Email" },
  { phrases: ["feed", "social feed", "posts"], href: "/feed", label: "Feed" },
  { phrases: ["discover"], href: "/discover", label: "Discover" },
  { phrases: ["search"], href: "/search", label: "Search" },
  { phrases: ["batch", "batches"], href: "/dashboard/batches", label: "Batches" },
  { phrases: ["attendance"], href: "/dashboard/attendance", label: "Attendance" },
  { phrases: ["payment", "payments", "fee", "fees", "billing"], href: "/dashboard/payments", label: "Payments" },
  { phrases: ["assignment", "assignments", "task", "tasks", "homework"], href: "/dashboard/tasks", label: "Tasks" },
  { phrases: ["announcement", "announcements"], href: "/dashboard/announcements", label: "Announcements" },
  { phrases: ["message", "messages", "chat", "inbox"], href: "/dashboard/messages", label: "Messages" },
  { phrases: ["notification", "notifications"], href: "/dashboard/notifications", label: "Notifications" },
  { phrases: ["calendar", "schedule", "timetable"], href: "/dashboard/calendar", label: "Calendar" },
  { phrases: ["profile"], href: "/dashboard/profile", label: "Profile" },
  { phrases: ["settings"], href: "/dashboard/settings", label: "Settings" },
  { phrases: ["subscription", "package", "packages", "plan"], href: "/dashboard/subscription", label: "Subscription" },
  { phrases: ["review", "reviews", "rating", "ratings"], href: "/dashboard/reviews", label: "Reviews" },
  { phrases: ["enrollment", "enrollments"], href: "/dashboard/enrollments", label: "Enrollments" },
];

function renderContent(content: string): React.ReactNode[] {
  const matches: { start: number; end: number; href: string; label: string }[] = [];

  for (const route of ROUTE_LINKS) {
    for (const phrase of route.phrases) {
      const re = new RegExp(`\\b${phrase}\\b`, "gi");
      let m: RegExpExecArray | null;
      while ((m = re.exec(content)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length, href: route.href, label: m[0] });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const kept: typeof matches = [];
  for (const m of matches) {
    if (kept.length > 0 && m.start < kept[kept.length - 1].end) continue;
    kept.push(m);
  }

  if (kept.length === 0) return [content];

  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const m of kept) {
    if (m.start > last) nodes.push(content.slice(last, m.start));
    nodes.push(
      <Link
        key={`${m.start}-${m.end}`}
        href={m.href}
        className="font-medium text-[#0066FF] underline underline-offset-2 hover:text-[#0052CC]"
      >
        {m.label}
      </Link>
    );
    last = m.end;
  }
  if (last < content.length) nodes.push(content.slice(last));
  return nodes;
}

const STORAGE_KEY = "educonnect-assistant-history";
const MAX_HISTORY = 60;

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || thinking) return;

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: q, ts: Date.now() };
      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", ts: Date.now() };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setThinking(true);
      setError(null);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const history = messages
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...history, { role: "user", content: q }] }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let detail = `Request failed (${res.status})`;
          try {
            const j = await res.json();
            if (j.error) detail = j.error;
          } catch {
            /* ignore */
          }
          throw new Error(detail);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m))
          );
        }

        if (!acc.trim()) {
          throw new Error("The assistant returned an empty response. Please try again.");
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Assistant request failed:", err);
        setError(err?.message || "Something went wrong. Please try again.");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Please try again." }
              : m
          )
        );
      } finally {
        setThinking(false);
      }
    },
    [thinking, messages]
  );

  const suggestions = [
    "How do I create an account?",
    "What is a batch?",
    "How does attendance work?",
    "How do I make a payment?",
    "Tell me a fun fact",
  ];

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[90] flex h-[480px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0066FF] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <Bot className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">EduConnect Assistant</p>
                <p className="text-[11px] text-white/80 leading-tight">
                  {error ? "Something went wrong" : "Online — AI assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
                aria-label="New session"
                title="New session"
              >
                <Plus className="size-4.5" />
              </button>
              <button
                onClick={toggle}
                className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="size-4.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4">
            {messages.length === 0 && (
              <div className="text-center mt-4">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#0066FF]/10">
                  <Sparkles className="size-6 text-[#0066FF]" />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Ask me anything
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  I can help with EduConnect — and chat about anything else too.
                </p>
                <div className="mt-4 grid gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      disabled={thinking}
                      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-left text-xs text-gray-600 dark:text-gray-300 hover:border-[#0066FF]/50 hover:text-[#0066FF] transition-colors disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-[#0066FF] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#0066FF] text-white rounded-tr-sm"
                      : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                  }`}
                >
                  {m.role === "assistant"
                    ? renderContent(m.content || (thinking ? "…" : ""))
                    : m.content}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex items-start gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <Bot className="size-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-gray-400" />
                  <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:120ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
            {error && (
              <p className="mb-2 text-[11px] text-red-500">{error}</p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) ask(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                disabled={thinking}
                className="h-10 flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3.5 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:border-[#0066FF] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="flex size-10 items-center justify-center rounded-xl bg-[#0066FF] text-white shadow-md shadow-blue-500/20 hover:bg-[#0052CC] transition-colors disabled:opacity-50"
                aria-label="Send"
              >
                {thinking ? <Loader2 className="size-4.5 animate-spin" /> : <Send className="size-4.5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-4 sm:right-6 z-[90] flex size-14 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-xl shadow-blue-500/30 hover:bg-[#0052CC] transition-all hover:scale-105"
        aria-label="Open AI assistant"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}