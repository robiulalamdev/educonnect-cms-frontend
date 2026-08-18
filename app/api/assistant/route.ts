import env from "@/config/env";
import { KNOWLEDGE_BASE } from "@/lib/assistant/knowledge";

export const runtime = "nodejs";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const knowledgePrompt = KNOWLEDGE_BASE.map(
  (p) => `### ${p.title}\n${p.content}`
).join("\n\n");

const SYSTEM_PROMPT = `You are EduConnect Assistant, the friendly AI helper for EduConnect — a coaching and education management platform for Bangladesh.

Use the platform knowledge below to answer questions about EduConnect accurately. If a question is not about EduConnect, answer it helpfully in a friendly, concise way — you are free to chat.

Answer naturally, be warm and conversational, and keep responses short (a few sentences) unless the user asks for detail.

FORMATTING RULES:
- Write everything as PLAIN TEXT. Do NOT use any Markdown formatting: no **bold**, no *italics*, no # headers, no backticks, no bullet lists with - or *. Use plain sentences and line breaks instead.
- If you mention a website, write the plain URL directly (e.g. https://robiulalamdev.vercel.app) so it stays clickable. Never wrap URLs in [text](url).

PLATFORM KNOWLEDGE:
${knowledgePrompt}`;

export async function POST(req: Request) {
  if (!env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: "Assistant is not configured. Please set OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (messages.length === 0) {
    return Response.json({ error: "No messages provided" }, { status: 400 });
  }

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json(
      { error: `OpenRouter error (${res.status}): ${err}` },
      { status: res.status }
    );
  }

  const reader = res.body?.getReader();
  if (!reader) {
    return Response.json({ error: "No response body" }, { status: 500 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                /* ignore malformed chunk */
              }
            }
          }
        }
      } catch {
        /* connection closed */
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}