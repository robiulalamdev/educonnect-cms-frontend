"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Trash2, Bot, User } from "lucide-react";
import { retrievePassage, NO_ANSWER_RESPONSE } from "@/lib/assistant/retrieval";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
};

const STORAGE_KEY = "educonnect-assistant-history";
const MAX_HISTORY = 60;

let modelPromise: Promise<any> | null = null;

async function getPipeline() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const { env, pipeline } = await import("@huggingface/transformers");
      env.allowRemoteModels = false;
      env.localModelPath = "/models/";
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = false;
      }
      return pipeline("question-answering", "qa-assistant", {
        dtype: "q8",
        device: "wasm",
      });
    })();
  }
  return modelPromise;
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingModel, setLoadingModel] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const ensureModel = useCallback(async () => {
    if (modelReady) return;
    setLoadingModel(true);
    setModelError(null);
    try {
      await getPipeline();
      setModelReady(true);
    } catch (err) {
      console.error("Model load failed:", err);
      setModelError(
        "Could not load the AI model on this device. Please try a modern browser."
      );
    } finally {
      setLoadingModel(false);
    }
  }, [modelReady]);

  const toggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next) {
      ensureModel();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, ensureModel]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || thinking) return;

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: q, ts: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setThinking(true);

      try {
        const passages = retrievePassage(q, 3);
        if (passages.length === 0) {
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", content: NO_ANSWER_RESPONSE, ts: Date.now() },
          ]);
          return;
        }

        const context = passages.map((p) => p.content).join("\n\n");
        const pipe = await getPipeline();
        const result: any = await pipe(q, context);

        const answer =
          result && result.answer && result.score > 0.05
            ? result.answer
            : NO_ANSWER_RESPONSE;

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: answer, ts: Date.now() },
        ]);
      } catch (err) {
        console.error("QA failed:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong while answering. Please try again.",
            ts: Date.now(),
          },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [thinking]
  );

  const suggestions = [
    "How do I create an account?",
    "What is a batch?",
    "How does attendance work?",
    "How do I make a payment?",
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
                  {loadingModel ? "Loading AI model (first time only)…" : modelError ? "Offline" : "Online — answers about the platform"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="size-4" />
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
                  Ask me anything about EduConnect
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  The model loads once on first open, then stays ready.
                </p>
                <div className="mt-4 grid gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      disabled={thinking || loadingModel}
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
                  {m.content}
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
            {modelError && (
              <p className="mb-2 text-[11px] text-red-500">{modelError}</p>
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
                placeholder="Ask about EduConnect…"
                disabled={loadingModel || thinking}
                className="h-10 flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3.5 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:border-[#0066FF] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loadingModel || thinking}
                className="flex size-10 items-center justify-center rounded-xl bg-[#0066FF] text-white shadow-md shadow-blue-500/20 hover:bg-[#0052CC] transition-colors disabled:opacity-50"
                aria-label="Send"
              >
                {loadingModel ? <Loader2 className="size-4.5 animate-spin" /> : <Send className="size-4.5" />}
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
