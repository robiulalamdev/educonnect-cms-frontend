"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getBatchDetails, getChatMessages, sendChatMessage, sendChatMessageWithMedia } from "@/lib/actions/classroom";
import { useUser } from "@/lib/contexts/user-context";
import { joinChatRoom, leaveChatRoom, onNewMessage, onPresenceUpdate, onPresenceSnapshot } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageSquare, Paperclip, X, FileText, Plus, Check, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { getCloudinaryUrl } from "@/lib/utils";

const MAX_MESSAGE_ATTACHMENTS = 3;
const MAX_MESSAGE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_MESSAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isMessageFileValid(file: File): string | null {
  if (!ACCEPTED_MESSAGE_MIME.includes(file.type)) {
    const ext = file.name.split(".").pop()?.toUpperCase() ?? file.type;
    return `"${file.name}" has unsupported type (${ext}). Allowed: JPG, PNG, WEBP, PDF, DOC, DOCX.`;
  }
  if (file.size > MAX_MESSAGE_FILE_SIZE) {
    return `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max allowed is 10MB.`;
  }
  return null;
}

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function renderBody(body: string, mentions?: any[]) {
  if (!body) return null;
  const parts = body.split(/(@[\w.]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const username = part.slice(1).toLowerCase();
      const m = mentions?.find(
        (x: any) => x.mentioned_user?.username?.toLowerCase() === username,
      );
      if (m) {
        return (
          <span
            key={i}
            className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded px-1 cursor-pointer hover:underline"
            title={`${m.mentioned_user.full_name} (@${m.mentioned_user.username})`}
          >
            {part}
          </span>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [msgPage, setMsgPage] = useState(1);
  const [msgTotalPages, setMsgTotalPages] = useState(1);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set());

  // Presence — how many members of this chat are online right now
  useEffect(() => {
    if (!chatId) return;
    const onUpdate = onPresenceUpdate(({ userId, online }) => {
      setOnlineMembers((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });
    });
    const onSnapshot = onPresenceSnapshot((data) => {
      if (data.chatId !== chatId) return;
      const online = new Set<string>();
      for (const [uid, status] of Object.entries(data.members)) {
        if (status.online) online.add(uid);
      }
      setOnlineMembers(online);
    });
    return () => { onUpdate(); onSnapshot(); };
  }, [chatId]);

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

  // 2. Fetch messages when chatId is available — realtime via socket,
  //    with 5s polling as a fallback for any missed messages.
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const res = await getChatMessages(chatId);
      if (res.success) {
        setMessages(res.data);
        setMsgTotalPages(res.meta?.total_pages ?? 1);
      }
      setLoading(false);
    };

    fetchMessages();

    // Realtime — join the chat room and listen for new messages
    joinChatRoom(chatId);
    const cleanupSocket = onNewMessage((data: any) => {
      if (!data || data.chat_id !== chatId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });

    // Fallback polling every 5 seconds
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      cleanupSocket();
      leaveChatRoom(chatId);
    };
  }, [chatId]);

  // Load older messages (page 2+) and prepend them, preserving scroll position
  async function loadOlderMessages() {
    if (!chatId || loadingOlder || msgPage >= msgTotalPages) return;
    setLoadingOlder(true);
    const container = scrollContainerRef.current;
    const prevHeight = container?.scrollHeight ?? 0;
    const nextPage = msgPage + 1;
    const res = await getChatMessages(chatId, nextPage);
    if (res.success) {
      const older = Array.isArray(res.data) ? res.data : [];
      setMessages((prev) => {
        const existing = new Set(prev.map((m) => m.id));
        return [...older.filter((m: any) => !existing.has(m.id)), ...prev];
      });
      setMsgTotalPages(res.meta?.total_pages ?? 1);
      setMsgPage(nextPage);
      requestAnimationFrame(() => {
        if (container) container.scrollTop = container.scrollHeight - prevHeight;
      });
    }
    setLoadingOlder(false);
  }

  // 3. Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !chatId) return;

    const body = newMessage.trim() || " ";
    const files = attachments;

    // Optimistic bubble — render instantly, then confirm against the server
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic = {
      id: tempId,
      body,
      sender_id: user?.id,
      status: "SENDING",
      created_at: new Date().toISOString(),
      sender: { id: user?.id, full_name: user?.full_name ?? "You", avatar: user?.avatar ?? null },
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSending(true);

    try {
      const res: any = files.length > 0
        ? await sendChatMessageWithMedia(chatId, body, files)
        : await sendChatMessage(chatId, body);

      if (res.success && res.data) {
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === tempId);
          if (idx === -1) return prev; // already refreshed by polling
          const next = [...prev];
          next[idx] = { ...res.data, status: res.data.status || "SENT" };
          return next;
        });
        if (files.length > 0) setAttachments([]);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        if (body.trim()) setNewMessage(body);
        if (files.length > 0) setAttachments(files);
        toast.error(res.message || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      if (body.trim()) setNewMessage(body);
      if (files.length > 0) setAttachments(files);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_MESSAGE_ATTACHMENTS - attachments.length;

    const accepted: File[] = [];
    for (const file of files) {
      if (accepted.length >= remaining) {
        toast.error(`You can attach up to ${MAX_MESSAGE_ATTACHMENTS} files`);
        break;
      }
      const err = isMessageFileValid(file);
      if (err) {
        toast.error(err);
        continue;
      }
      accepted.push(file);
    }

    setAttachments((prev) => [...prev, ...accepted].slice(0, MAX_MESSAGE_ATTACHMENTS));
    if (e.target) e.target.value = "";
  }

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
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {onlineMembers.size > 0 && (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {onlineMembers.size} {onlineMembers.size === 1 ? "member" : "members"} online
            </span>
          </div>
        )}
        {msgPage < msgTotalPages && (
          <div className="flex justify-center py-2">
            <button
              onClick={loadOlderMessages}
              disabled={loadingOlder}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 px-3.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {loadingOlder ? <Loader2 className="size-3.5 animate-spin" /> : <ChevronUp className="size-3.5" />}
              {loadingOlder ? "Loading..." : "Load earlier messages"}
            </button>
          </div>
        )}
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
                      {msg.media && msg.media.length > 0 && (
                        <div className={`flex flex-wrap gap-1.5 mb-1.5 ${isMe ? "justify-end" : ""}`}>
                          {msg.media.map((m: any) =>
                            m.mime_type?.startsWith("image/") ? (
                              <a key={m.id} href={getCloudinaryUrl(m.key, { w: 960 })} target="_blank" rel="noreferrer">
                                <img
                                  src={getCloudinaryUrl(m.key, { w: 200 })}
                                  alt={m.filename}
                                  className="rounded-xl max-w-[180px] max-h-[180px] object-cover"
                                  loading="lazy"
                                />
                              </a>
                            ) : (
                              <a
                                key={m.id}
                                href={getCloudinaryUrl(m.key)}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs max-w-[220px] ${
                                  isMe
                                    ? "bg-[#0066FF]/80 text-white"
                                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                }`}
                              >
                                <FileText className="size-4 shrink-0" />
                                <span className="truncate">{m.filename}</span>
                              </a>
                            ),
                          )}
                        </div>
                      )}
                      {msg.body && msg.body.trim() !== "" ? (
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap ${
                            isMe
                              ? "bg-[#0066FF] text-white rounded-br-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                          }`}
                        >
                          {renderBody(msg.body, msg.mentions)}
                        </div>
                      ) : null}
                      <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}
                        {isMe && (
                          <span className="inline-flex items-center align-middle ml-1">
                            {msg.status === "SENDING" ? (
                              <Loader2 className="size-2.5 animate-spin" />
                            ) : (
                              <Check className="size-2.5" />
                            )}
                          </span>
                        )}
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
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="relative">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt={file.name} className="size-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="size-16 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-0.5 p-1">
                  <FileText className="size-5 text-gray-500" />
                  <span className="text-[8px] text-gray-500 max-w-full truncate px-0.5">{file.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {attachments.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="size-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:text-blue-500 hover:border-blue-400 flex items-center justify-center transition-colors"
              title="Add file"
            >
              <Plus className="size-5" />
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 rounded-xl text-gray-400 shrink-0"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file (max 3)"
        >
          <Paperclip className="size-4.5" />
        </Button>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 text-sm outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() && attachments.length === 0}
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
