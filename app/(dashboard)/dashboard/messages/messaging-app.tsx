"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getChatList, getMessages, sendMessage, sendMessageWithMedia, markChatRead, getOrCreateDirectChat } from "@/lib/actions/messages";
import { getMyServices } from "@/lib/actions/services";
import { joinChatRoom, leaveChatRoom, onNewMessage, onMessageRead, onUserTyping, emitTyping, onPresenceUpdate, onPresenceSnapshot, onMentionNotification } from "@/lib/socket";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Loader2,
  MessageSquare,
  X,
  FileText,
  GraduationCap,
  Quote,
  Plus,
  Users,
  ChevronDown,
  Crown,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";
import { useUser } from "@/lib/contexts/user-context";
import { toast } from "sonner";

interface Chat {
  id: string;
  type: string;
  name?: string | null;
  avatar?: { key: string } | null;
  updated_at: string;
  unread_count?: number;
  participants: Array<{ user: { id: string; full_name: string; username?: string | null; avatar?: { key: string } | null }; is_admin?: boolean }>;
  last_message?: {
    body: string;
    created_at: string;
    sender_id: string;
    sender?: { full_name: string };
    media?: Array<{ mime_type: string; filename: string }>;
  } | null;
}

interface Message {
  id: string;
  body: string;
  sender_id: string;
  status: string;
  created_at: string;
  sender: { id: string; full_name: string; avatar?: { key: string } | null };
  media?: Array<{ id: string; key: string; filename: string; mime_type: string; type?: string }>;
  reply_to?: { id: string; body: string; sender_id: string } | null;
  context_service_id?: string | null;
  mentions?: Array<{ mentioned_user: { id: string; username: string | null; full_name: string } }>;
}

// Keep in sync with backend CLD_MAX_SIZE[MESSAGE_MEDIA] and the multipart
// "maxCount: 3" rule — validated here so the user gets instant toast feedback.
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

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

function renderBody(body: string, mentions?: Message["mentions"]) {
  if (!body) return null;
  const parts = body.split(/(@[\w.]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const username = part.slice(1).toLowerCase();
      const m = mentions?.find(
        (x) => x.mentioned_user.username?.toLowerCase() === username,
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

interface MessagingAppProps {
  currentUserId?: string;
}

export function MessagingApp({ currentUserId: currentUserIdProp }: MessagingAppProps) {
  const user = useUser();
  const currentUserId = user?.id ?? currentUserIdProp;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [contextService, setContextService] = useState<{ id: string; title: string } | null>(null);
  const [services, setServices] = useState<Array<{ id: string; title: string }>>([]);
  const [serviceTitles, setServiceTitles] = useState<Record<string, string>>({});
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [chatFilter, setChatFilter] = useState<"ALL" | "DIRECT" | "BATCH_GROUP">("ALL");
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat list
  const loadChats = useCallback(async () => {
    try {
      const res = (await getChatList()) as any;
      if (res.success) setChats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load messages when chat is selected
  useEffect(() => {
    if (!activeChat) return;
    setLoadingMessages(true);
    setNewMessage("");
    setAttachments([]);
    setReplyTo(null);
    setContextService(null);
    setShowServicePicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    joinChatRoom(activeChat.id);

    getMessages(activeChat.id, 1, 50).then((res: any) => {
      if (res.success) setMessages(res.data);
      setLoadingMessages(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    markChatRead(activeChat.id);

    // Clear the unread badge for the opened chat
    setChats((prev) =>
      prev.map((c) => (c.id === activeChat.id ? { ...c, unread_count: 0 } : c)),
    );

    return () => { leaveChatRoom(activeChat.id); };
  }, [activeChat?.id]);

  // Listen for new messages
  useEffect(() => {
    const cleanup = onNewMessage((data: any) => {
      if (!data || !data.id) return;
      const isOwn = data.sender_id === currentUserId;

      // Update chat list
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === data.chat_id
            ? {
                ...c,
                last_message: {
                  body: data.body,
                  created_at: data.created_at,
                  sender_id: data.sender_id,
                  sender: data.sender,
                  media: data.media,
                },
                updated_at: data.created_at,
                unread_count:
                  isOwn || (activeChat && activeChat.id === data.chat_id)
                    ? 0
                    : (c.unread_count ?? 0) + 1,
              }
            : c
        );
        return updated.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      });

      if (activeChat && data.chat_id === activeChat.id) {
        setMessages((prev) => {
          // Already rendered (own optimistic echo already replaced, or duplicate broadcast)
          if (prev.some((m) => m.id === data.id)) return prev;

          // Own message: replace the oldest pending optimistic bubble with the confirmed one
          if (isOwn) {
            const tempIdx = prev.findIndex(
              (m) => m.sender_id === currentUserId && m.status === "SENDING",
            );
            if (tempIdx !== -1) {
              const next = [...prev];
              next[tempIdx] = data;
              return next;
            }
            return prev;
          }

          return [...prev, data];
        });
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        markChatRead(activeChat.id);
      }
    });
    return cleanup;
  }, [activeChat?.id, currentUserId]);

  // Listen for read receipts — flip our own messages to the "seen" state
  useEffect(() => {
    const cleanup = onMessageRead((data: any) => {
      if (!data || !activeChat || data.chat_id !== activeChat.id) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_id === currentUserId && m.status !== "READ"
            ? { ...m, status: "READ" }
            : m
        )
      );
    });
    return cleanup;
  }, [activeChat?.id, currentUserId]);

  // Listen for typing
  useEffect(() => {
    const cleanup = onUserTyping((data: any) => {
      if (data.chatId === activeChat?.id) {
        setTypingUsers((prev) => ({ ...prev, [data.chatId]: data.name }));
        setTimeout(() => {
          setTypingUsers((prev) => {
            const next = { ...prev };
            delete next[data.chatId];
            return next;
          });
        }, 3000);
      }
    });
    return cleanup;
  }, [activeChat?.id]);

  // Live presence — mark members online/offline as socket events arrive
  useEffect(() => {
    const cleanup = onPresenceUpdate(({ userId, online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });
    });
    return cleanup;
  }, []);

  // Presence snapshot for the members of the currently open chat
  useEffect(() => {
    if (!activeChat) return;
    const cleanup = onPresenceSnapshot((data) => {
      if (data.chatId !== activeChat.id) return;
      const online = new Set<string>();
      for (const [uid, status] of Object.entries(data.members)) {
        if (status.online) online.add(uid);
      }
      setOnlineUserIds(online);
    });
    return cleanup;
  }, [activeChat?.id]);

  // Mention notifications — someone @mentioned me in a chat
  useEffect(() => {
    const cleanup = onMentionNotification((data: any) => {
      if (!data || !data.chatId) return;
      loadChats();
      toast(`${data.mentioned_by_name ?? "Someone"} mentioned you in a chat`);
    });
    return cleanup;
  }, [loadChats]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !activeChat || !currentUserId) return;

    const body = newMessage.trim() || " ";
    const reply = replyTo;
    const service = contextService;
    const files = attachments;

    // Optimistic bubble — render instantly, then confirm against the server
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic: Message = {
      id: tempId,
      body,
      sender_id: currentUserId,
      status: "SENDING",
      created_at: new Date().toISOString(),
      sender: {
        id: currentUserId,
        full_name: user?.full_name ?? "You",
        avatar: user?.avatar ?? null,
      },
      reply_to: reply
        ? { id: reply.id, body: reply.body ?? "", sender_id: reply.sender_id }
        : undefined,
      context_service_id: service?.id ?? null,
    };

    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    setMentionQuery(null);
    setReplyTo(null);
    setContextService(null);
    setShowServicePicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSending(true);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      const payload = {
        body,
        reply_to_id: reply?.id,
        context_service_id: service?.id,
      };
      const res: any = files.length > 0
        ? await sendMessageWithMedia(activeChat.id, payload, files)
        : await sendMessage(activeChat.id, payload);

      if (res.success && res.data) {
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === tempId);
          if (idx === -1) return prev; // already replaced via socket echo
          const next = [...prev];
          next[idx] = { ...res.data, status: res.data.status || "SENT" };
          return next;
        });
        if (files.length > 0) setAttachments([]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        // Roll back the optimistic bubble and restore the draft so nothing is lost
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
  }

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

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function loadServices() {
    const res = (await getMyServices(1, 50)) as any;
    if (res.success && Array.isArray(res.data)) {
      setServices(res.data.map((s: any) => ({ id: s.id, title: s.title })));
    }
  }

  function pickService(s: { id: string; title: string }) {
    setContextService(s);
    setServiceTitles((prev) => ({ ...prev, [s.id]: s.title }));
    setShowServicePicker(false);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function handleTyping() {
    if (activeChat) {
      emitTyping(activeChat.id, "User");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNewMessage(value);
    handleTyping();
    const caret = e.target.selectionStart ?? value.length;
    const lastToken = value.slice(0, caret).split(/\s/).pop() ?? "";
    if (lastToken.startsWith("@")) {
      setMentionQuery(lastToken.slice(1));
    } else {
      setMentionQuery(null);
    }
  }

  function insertMention(username: string, fullName: string) {
    if (mentionQuery === null) return;
    const pos = inputRef.current?.selectionStart ?? newMessage.length;
    const beforeCaret = newMessage.slice(0, pos);
    const atIndex = beforeCaret.lastIndexOf("@");
    const insertion = atIndex >= 0 ? beforeCaret.slice(0, atIndex) + `@${username} ` : newMessage + `@${username} `;
    setNewMessage(insertion + newMessage.slice(atIndex >= 0 ? pos : 0));
    setMentionQuery(null);
    setTimeout(() => {
      inputRef.current?.focus();
      const newPos = (atIndex >= 0 ? atIndex : newMessage.length) + username.length + 2;
      inputRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  }

  const mentionCandidates = mentionQuery !== null
    ? (activeChat?.participants ?? [])
        .filter((p) => p.user.id !== currentUserId)
        .filter((p) =>
          !mentionQuery ||
          p.user.full_name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
          (p.user.username ?? "").toLowerCase().includes(mentionQuery.toLowerCase())
        )
    : [];

  function getOtherParticipant(chat: Chat) {
    return (
      chat.participants?.find((p) => p.user.id !== currentUserId)?.user ??
      chat.participants?.[0]?.user
    );
  }

  const filteredChats = chats.filter((chat) => {
    if (chatFilter !== "ALL" && chat.type !== chatFilter) return false;
    const other = getOtherParticipant(chat);
    return other?.full_name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={`flex ${isFullscreen ? "fixed inset-0 z-[100] h-screen" : "h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8"} bg-white dark:bg-gray-950 rounded-none overflow-hidden`}>
      {/* Chat List Sidebar */}
      <div className={`w-full sm:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col ${activeChat ? "hidden sm:flex" : "flex"}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
            />
          </div>
          <div className="flex items-center gap-1 mt-3">
            {(["ALL", "DIRECT", "BATCH_GROUP"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setChatFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  chatFilter === f
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {f === "ALL" ? "All" : f === "DIRECT" ? "Direct" : "Groups"}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <MessageSquare className="size-10 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No conversations yet
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const other = getOtherParticipant(chat);
              const isActive = activeChat?.id === chat.id;
              const last = chat.last_message;
              const isGroup = chat.type === "BATCH_GROUP";
              const lastIsMine = last?.sender_id === currentUserId;
              const lastMedia = last?.media?.[0];
              const lastPreview = lastMedia
                ? lastMedia.mime_type.startsWith("image/")
                  ? "Photo"
                  : lastMedia.filename
                : (last?.body || null);
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    isActive ? "bg-blue-50 dark:bg-blue-950/30" : ""
                  }`}
                >
                  <Avatar className="size-12 shrink-0">
                    {other?.avatar ? (
                      <img
                        src={getCloudinaryUrl(other.avatar.key, { w: 96, h: 96 })}
                        alt={other.full_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <AvatarFallback className="text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {getInitials(other?.full_name || "U")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {isGroup ? chat.name || "Group Chat" : other?.full_name || "Unknown"}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
                        {last ? timeAgo(last.created_at) : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 min-w-0">
                        {lastIsMine && (
                          <span className="text-blue-400 shrink-0 flex items-center">
                            {lastPreview ? <CheckCheck className="size-3" /> : null}
                          </span>
                        )}
                        {isGroup && last && !lastIsMine && (
                          <span className="font-semibold text-gray-700 dark:text-gray-300 shrink-0">
                            {last.sender?.full_name || "Someone"}:{" "}
                          </span>
                        )}
                        {lastMedia ? (
                          <span className="flex items-center gap-1 min-w-0">
                            <FileText className="size-3 shrink-0 text-gray-400" />
                            <span className="truncate">{lastPreview}</span>
                          </span>
                        ) : (
                          <span className="truncate">{lastPreview || "Start a conversation"}</span>
                        )}
                      </p>
                      {!!chat.unread_count && (
                        <span className="ml-2 min-w-5 h-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                          {chat.unread_count > 99 ? "99+" : chat.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className={`flex-1 flex flex-col relative ${activeChat ? "flex" : "hidden sm:flex"}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 sm:hidden"
                onClick={() => setActiveChat(null)}
              >
                <ArrowLeft className="size-5" />
              </Button>
              {activeChat.type === "BATCH_GROUP" ? (
                <button
                  type="button"
                  onClick={() => setShowChatInfo(true)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <Avatar className="size-10 shrink-0">
                    {activeChat.avatar?.key ? (
                      <img
                        src={getCloudinaryUrl(activeChat.avatar.key, { w: 80, h: 80 })}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        <Users className="size-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                      {activeChat.name || "Group Chat"}
                      <ChevronDown className="size-3.5 text-gray-400 shrink-0" />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activeChat.participants?.length ?? 0} members
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="size-10 shrink-0">
                    {getOtherParticipant(activeChat)?.avatar ? (
                      <img
                        src={getCloudinaryUrl(getOtherParticipant(activeChat)?.avatar?.key!, { w: 80, h: 80 })}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {getInitials(getOtherParticipant(activeChat)?.full_name || "U")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {getOtherParticipant(activeChat)?.full_name || "Unknown"}
                    </p>
                    {typingUsers[activeChat.id] ? (
                      <p className="text-xs text-blue-500 dark:text-blue-400">typing...</p>
                    ) : onlineUserIds.has(getOtherParticipant(activeChat)?.id ?? "") ? (
                      <p className="text-xs text-emerald-500">Online now</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
                    )}
                  </div>
                </div>
              )}
              {activeChat.type === "BATCH_GROUP" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-gray-400"
                  onClick={() => setShowChatInfo(true)}
                >
                  <MoreVertical className="size-4.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-9 text-gray-400"
                onClick={() => setIsFullscreen((v) => !v)}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen chat"}
              >
                {isFullscreen ? <Minimize2 className="size-4.5" /> : <Maximize2 className="size-4.5" />}
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-6 text-blue-600 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Avatar className="size-16 mb-4">
                    {activeChat.type === "BATCH_GROUP" ? (
                      <AvatarFallback className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        <Users className="size-7" />
                      </AvatarFallback>
                    ) : getOtherParticipant(activeChat)?.avatar ? (
                      <img
                        src={getCloudinaryUrl(getOtherParticipant(activeChat)?.avatar?.key!, { w: 128, h: 128 })}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-lg font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {getInitials(getOtherParticipant(activeChat)?.full_name || "U")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activeChat.type === "BATCH_GROUP"
                      ? activeChat.name || "Group Chat"
                      : getOtherParticipant(activeChat)?.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activeChat.type === "BATCH_GROUP" ? "Say hello to the group" : "Start a conversation"}
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isOwn = msg.sender_id === currentUserId;
                  const showAvatar = !isOwn && (i === 0 || messages[i - 1]?.sender_id !== msg.sender_id);
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
                      <div className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                      {!isOwn && (
                        <Avatar className="size-8 mt-auto shrink-0">
                          {msg.sender.avatar ? (
                            <img
                              src={getCloudinaryUrl(msg.sender.avatar.key, { w: 64, h: 64 })}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <AvatarFallback className="text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                              {getInitials(msg.sender.full_name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      )}
                      <div className={`max-w-[70%] ${isOwn ? "order-1" : ""} group relative`}>
                        {msg.reply_to && (
                          <div className="mb-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 border-l-2 border-blue-400 truncate max-w-full">
                            <Quote className="size-3 inline mr-1" />
                            {msg.reply_to.body?.slice(0, 60)}...
                          </div>
                        )}
                        {msg.media && msg.media.length > 0 && (
                          <div className={`flex flex-wrap gap-1.5 mb-1.5 ${isOwn ? "justify-end" : ""}`}>
                            {msg.media.map((m) =>
                              m.mime_type?.startsWith("image/") ? (
                                <a
                                  key={m.id}
                                  href={getCloudinaryUrl(m.key, { w: 960 })}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={getCloudinaryUrl(m.key, { w: 240 })}
                                    alt={m.filename}
                                    className="rounded-xl max-w-[200px] max-h-[200px] object-cover"
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
                                    isOwn
                                      ? "bg-blue-700/60 text-white"
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
                        {msg.context_service_id && serviceTitles[msg.context_service_id] && (
                          <div className={`flex items-center gap-1 mb-1 text-[10px] font-medium ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                            <GraduationCap className="size-3 shrink-0" />
                            <span className="truncate">Discussing: {serviceTitles[msg.context_service_id]}</span>
                          </div>
                        )}
                        {msg.body && msg.body.trim() !== "" ? (
                          <div
                            className={`px-3 py-2 rounded-2xl text-sm ${
                              isOwn
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{renderBody(msg.body, msg.mentions)}</p>
                          </div>
                        ) : null}
                        <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : ""}`}>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatTime(msg.created_at)}
                          </span>
                          {isOwn && (
                            <span className="text-blue-400 flex items-center">
                              {msg.status === "SENDING" ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : msg.status === "READ" ? (
                                <CheckCheck className="size-3" />
                              ) : (
                                <Check className="size-3" />
                              )}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setReplyTo(msg)}
                          className={`absolute top-0 ${isOwn ? "right-full mr-1.5" : "left-full ml-1.5"} opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-500`}
                          title="Reply"
                        >
                          <Quote className="size-4" />
                        </button>
                      </div>
                    </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {typingUsers[activeChat.id] && (
              <div className="px-4 py-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  {typingUsers[activeChat.id]} is typing...
                </p>
              </div>
            )}

            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              {/* Reply banner */}
              {replyTo && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <Quote className="size-4 text-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Replying to {replyTo.sender.full_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{replyTo.body?.slice(0, 80) || (replyTo.media?.length ? "Attachment" : "")}</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="size-7 text-gray-400" onClick={() => setReplyTo(null)}>
                    <X className="size-4" />
                  </Button>
                </div>
              )}

              {/* Service context chip */}
              {contextService && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                  <GraduationCap className="size-4 text-indigo-500 shrink-0" />
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 flex-1 truncate">Discussing: {contextService.title}</p>
                  <Button type="button" variant="ghost" size="icon" className="size-7 text-gray-400" onClick={() => setContextService(null)}>
                    <X className="size-4" />
                  </Button>
                </div>
              )}

              {/* Attachment previews */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
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
                        onClick={() => removeAttachment(idx)}
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

              <form onSubmit={handleSend} className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  accept="image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                />
                <Button type="button" variant="ghost" size="icon" className="size-9 text-gray-400 shrink-0" onClick={() => fileInputRef.current?.click()} title="Attach file (max 3)">
                  <Paperclip className="size-4.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-9 text-gray-400 shrink-0" onClick={() => fileInputRef.current?.click()} title="Attach image">
                  <ImageIcon className="size-4.5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    className="pr-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-gray-400">
                    <Smile className="size-4" />
                  </Button>
                  {mentionQuery !== null && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden z-50">
                      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        Mention someone
                      </p>
                      <div className="max-h-48 overflow-y-auto">
                        {mentionCandidates.length === 0 ? (
                          <p className="px-3 py-3 text-xs text-gray-400">No members found</p>
                        ) : (
                          mentionCandidates.map((p) => (
                            <button
                              key={p.user.id}
                              type="button"
                              onClick={() => insertMention(p.user.username ?? p.user.full_name, p.user.full_name)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 text-left"
                            >
                              <Avatar className="size-7 shrink-0">
                                {p.user.avatar ? (
                                  <img
                                    src={getCloudinaryUrl(p.user.avatar.key, { w: 56, h: 56 })}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <AvatarFallback className="text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                    {getInitials(p.user.full_name)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="min-w-0">
                                <span className="block text-gray-900 dark:text-white truncate">{p.user.full_name}</span>
                                {p.user.username && (
                                  <span className="block text-xs text-gray-400">@{p.user.username}</span>
                                )}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-gray-400 shrink-0"
                  title="Select service to discuss"
                  onClick={() => {
                    if (services.length === 0) loadServices();
                    setShowServicePicker((v) => !v);
                  }}
                >
                  <GraduationCap className="size-4.5" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="size-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                  disabled={!newMessage.trim() && attachments.length === 0}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </form>

              {/* Service picker */}
              {showServicePicker && (
                <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                  <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    Select a service to discuss
                  </p>
                  {services.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-gray-400">No services found.</p>
                  ) : (
                    services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickService(s)}
                        className={`w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2 ${
                          contextService?.id === s.id ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <GraduationCap className="size-4 shrink-0 text-gray-400" />
                        <span className="truncate">{s.title}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MessageSquare className="size-16 text-gray-200 dark:text-gray-700" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Your messages
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select a conversation to start chatting
            </p>
          </div>
        )}

        {/* Chat Info Panel (group members + admin + presence) */}
        {activeChat && showChatInfo && (
          <>
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-30"
              onClick={() => setShowChatInfo(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Chat Info</h3>
                <Button variant="ghost" size="icon" className="size-8 text-gray-400" onClick={() => setShowChatInfo(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-gray-200 dark:border-gray-800">
                <Avatar className="size-16 mb-3">
                  {activeChat.avatar?.key ? (
                    <img
                      src={getCloudinaryUrl(activeChat.avatar.key, { w: 128, h: 128 })}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      <Users className="size-7" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-sm font-bold text-gray-900 dark:text-white text-center px-4">
                  {activeChat.name || "Group Chat"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activeChat.participants?.length ?? 0} members
                </p>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {activeChat.participants?.length ?? 0} Members
                </p>
                {activeChat.participants?.map((p) => {
                  const isMe = p.user.id === currentUserId;
                  const isOnline = onlineUserIds.has(p.user.id);
                  return (
                    <div key={p.user.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="relative shrink-0">
                        <Avatar className="size-10">
                          {p.user.avatar ? (
                            <img
                              src={getCloudinaryUrl(p.user.avatar.key, { w: 80, h: 80 })}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                              {getInitials(p.user.full_name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-gray-900 ${
                            isOnline ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                          {p.user.full_name}
                          {isMe && <span className="text-[10px] text-gray-400 font-normal">(You)</span>}
                        </p>
                        <p className={`text-xs ${isOnline ? "text-emerald-500" : "text-gray-400"}`}>
                          {isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                      {p.is_admin && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-semibold shrink-0">
                          <ShieldCheck className="size-3" /> Admin
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
