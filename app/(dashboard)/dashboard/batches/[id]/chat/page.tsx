"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getBatchDetails, getChatMessages, sendChatMessage } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getCloudinaryUrl } from "@/lib/utils";

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function formatDay(date: string) {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export default function BatchChatTab() {
  const { id } = useParams<{ id: string }>();
  const user = useUser();

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Get the batch's group_chat ID
  useEffect(() => {
    getBatchDetails(id).then((res) => {
      if (res.success && res.data?.group_chat?.id) {
        setChatId(res.data.group_chat.id);
      } else {
        setLoading(false);
      }
    });
  }, [id]);

  // 2. Fetch messages when chatId is available
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const res = await getChatMessages(chatId);
      if (res.success) setMessages(res.data);
      setLoading(false);
    };

    fetchMessages();

    // Poll every 5 seconds for new messages
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [chatId]);

  // 3. Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    setSending(true);
    const res = await sendChatMessage(chatId, newMessage.trim());
    if (res.success) {
      setNewMessage("");
      // Immediately fetch new messages
      const msgRes = await getChatMessages(chatId);
      if (msgRes.success) setMessages(msgRes.data);
    } else {
      toast.error(res.message || "Failed to send message");
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="text-center py-16">
        <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="size-7 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No group chat available for this batch.</p>
        <p className="text-xs text-gray-400 mt-1">The chat is created automatically when a batch is first set up.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[450px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="size-6 text-[#0066FF]" />
            </div>
            <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg: any, i: number) => {
            const isMe = msg.sender_id === user?.id;
            const showDayDivider = i === 0 || !isSameDay(messages[i - 1]?.created_at, msg.created_at);
            return (
              <div key={msg.id}>
                {showDayDivider && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                    <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {formatDay(msg.created_at)}
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    {!isMe && (
                      msg.sender?.avatar?.key ? (
                        <img
                          src={getCloudinaryUrl(msg.sender.avatar.key, { w: 32, h: 32 })}
                          className="size-7 rounded-full object-cover shrink-0 mt-1"
                          alt=""
                        />
                      ) : (
                        <div className="size-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-[10px] font-bold shrink-0 mt-1">
                          {msg.sender?.full_name?.charAt(0) ?? "?"}
                        </div>
                      )
                    )}

                    {/* Bubble */}
                    <div>
                      {!isMe && (
                        <p className="text-[10px] font-semibold text-gray-400 mb-0.5 ml-1">
                          {msg.sender?.full_name}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap ${
                          isMe
                            ? "bg-[#0066FF] text-white rounded-br-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                        }`}
                      >
                        {msg.body}
                      </div>
                      <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 text-sm outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
          disabled={sending}
        />
        <Button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="size-11 p-0 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white shrink-0"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
