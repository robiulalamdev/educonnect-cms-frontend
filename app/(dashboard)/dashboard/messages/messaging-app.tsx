"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getChatList, getMessages, sendMessage, markChatRead, getOrCreateDirectChat } from "@/lib/actions/messages";
import { joinChatRoom, leaveChatRoom, onNewMessage, onUserTyping, emitTyping } from "@/lib/socket";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface Chat {
  id: string;
  type: string;
  updated_at: string;
  participants: Array<{ user: { id: string; full_name: string; avatar?: { key: string } | null } }>;
  last_message?: { body: string; created_at: string; sender_id: string } | null;
}

interface Message {
  id: string;
  body: string;
  sender_id: string;
  status: string;
  created_at: string;
  sender: { id: string; full_name: string; avatar?: { key: string } | null };
  media?: Array<{ id: string; key: string; filename: string; mime_type: string }>;
  reply_to?: { id: string; body: string; sender_id: string } | null;
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

interface MessagingAppProps {
  currentUserId?: string;
}

export function MessagingApp({ currentUserId }: MessagingAppProps) {
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
    joinChatRoom(activeChat.id);

    getMessages(activeChat.id, 1, 50).then((res: any) => {
      if (res.success) setMessages(res.data);
      setLoadingMessages(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    markChatRead(activeChat.id);

    return () => { leaveChatRoom(activeChat.id); };
  }, [activeChat?.id]);

  // Listen for new messages
  useEffect(() => {
    const cleanup = onNewMessage((data: any) => {
      if (activeChat && data.chat_id === activeChat.id) {
        setMessages((prev) => [...prev, data]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        markChatRead(activeChat.id);
      }
      // Update chat list
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === data.chat_id
            ? { ...c, last_message: { body: data.body, created_at: data.created_at, sender_id: data.sender_id }, updated_at: data.created_at }
            : c
        );
        return updated.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      });
    });
    return cleanup;
  }, [activeChat?.id]);

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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;
    setSending(true);
    try {
      const res = (await sendMessage(activeChat.id, newMessage.trim())) as any;
      if (res.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  function handleTyping() {
    if (activeChat) {
      emitTyping(activeChat.id, "User");
    }
  }

  function getOtherParticipant(chat: Chat) {
    return chat.participants?.[0]?.user;
  }

  const filteredChats = chats.filter((chat) => {
    const other = getOtherParticipant(chat);
    return other?.full_name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8 bg-white dark:bg-gray-950 rounded-none overflow-hidden">
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
                        src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_96,h_96,c_fill/${other.avatar.key}`}
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
                        {other?.full_name || "Unknown"}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                        {chat.last_message ? timeAgo(chat.last_message.created_at) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {chat.last_message?.body || "Start a conversation"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className={`flex-1 flex flex-col ${activeChat ? "flex" : "hidden sm:flex"}`}>
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
              <Avatar className="size-10">
                {getOtherParticipant(activeChat)?.avatar ? (
                  <img
                    src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_80,h_80,c_fill/${getOtherParticipant(activeChat)?.avatar?.key}`}
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
                  {getOtherParticipant(activeChat)?.full_name}
                </p>
                {typingUsers[activeChat.id] ? (
                  <p className="text-xs text-blue-500 dark:text-blue-400">typing...</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-9 text-gray-400">
                  <Phone className="size-4.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 text-gray-400">
                  <Video className="size-4.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 text-gray-400">
                  <MoreVertical className="size-4.5" />
                </Button>
              </div>
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
                    {getOtherParticipant(activeChat)?.avatar ? (
                      <img
                        src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_128,h_128,c_fill/${getOtherParticipant(activeChat)?.avatar?.key}`}
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
                    {getOtherParticipant(activeChat)?.full_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Start a conversation
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isOwn = msg.sender_id === currentUserId;
                  const showAvatar = !isOwn && (i === 0 || messages[i - 1]?.sender_id !== msg.sender_id);
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                      {!isOwn && (
                        <Avatar className="size-8 mt-auto shrink-0">
                          {msg.sender.avatar ? (
                            <img
                              src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto/w_64,h_64,c_fill/${msg.sender.avatar.key}`}
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
                      <div className={`max-w-[70%] ${isOwn ? "order-1" : ""}`}>
                        {msg.reply_to && (
                          <div className="mb-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 border-l-2 border-blue-400">
                            {msg.reply_to.body?.slice(0, 50)}...
                          </div>
                        )}
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm ${
                            isOwn
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : ""}`}>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatTime(msg.created_at)}
                          </span>
                          {isOwn && (
                            <span className="text-blue-400">
                              {msg.status === "READ" ? <CheckCheck className="size-3" /> : <Check className="size-3" />}
                            </span>
                          )}
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
              <form onSubmit={handleSend} className="flex items-end gap-2">
                <Button type="button" variant="ghost" size="icon" className="size-9 text-gray-400 shrink-0">
                  <Paperclip className="size-4.5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-9 text-gray-400 shrink-0">
                  <ImageIcon className="size-4.5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                    className="pr-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
                    disabled={sending}
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-8 text-gray-400">
                    <Smile className="size-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="size-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </Button>
              </form>
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
      </div>
    </div>
  );
}
