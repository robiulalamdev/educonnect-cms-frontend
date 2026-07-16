"use client";

import { useEffect, useState, useCallback } from "react";
import { getComments, createComment, deleteComment, getReplies, toggleCommentLike } from "@/lib/actions/comments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, MessageCircle, Trash2, ChevronDown, ChevronUp, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  author: { id: string; full_name: string; avatar?: { key: string } | null };
  _count: { likes: number; replies: number };
  replies?: Comment[];
  reply_count?: number;
  _liked?: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadComments = useCallback(async (p: number, append = false) => {
    try {
      const res = (await getComments(postId, p)) as any;
      if (res.success) {
        if (append) {
          setComments((prev) => [...prev, ...res.data]);
        } else {
          setComments(res.data);
        }
        setHasMore(p < res.meta.total_pages);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = (await createComment(postId, newComment.trim())) as any;
      if (res.success) {
        setComments((prev) => [{ ...res.data, replies: [], reply_count: 0 }, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  }

  return (
    <div className="space-y-4">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 h-10 rounded-xl bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10"
          disabled={submitting}
        />
        <Button
          type="submit"
          size="icon"
          className="size-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              depth={0}
            />
          ))}

          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600 dark:text-blue-400 rounded-xl"
              onClick={() => { setPage((p) => p + 1); loadComments(page + 1, true); }}
            >
              Load more comments
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  currentUserId,
  onDelete,
  depth,
}: {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  onDelete: (id: string) => void;
  depth: number;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment._count.likes);
  const isOwn = currentUserId === comment.author.id;

  async function loadReplies() {
    setLoadingReplies(true);
    try {
      const res = (await getReplies(comment.id)) as any;
      if (res.success) setReplies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReplies(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = (await createComment(postId, replyText.trim(), comment.id)) as any;
      if (res.success) {
        setReplies((prev) => [...prev, res.data]);
        setReplyText("");
        setShowReplies(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  }

  async function handleLike() {
    try {
      const res = (await toggleCommentLike(comment.id)) as any;
      if (res.success) {
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={depth > 0 ? "ml-8" : ""}>
      <div className="flex gap-3">
        <Avatar className="size-8 shrink-0">
          {comment.author.avatar ? (
            <img
              src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_64,h_64,c_fill/${comment.author.avatar.key}`}
              alt={comment.author.full_name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <AvatarFallback className="text-[10px] font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              {getInitials(comment.author.full_name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {comment.author.full_name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              {comment.content}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1 px-1">
            <button
              onClick={handleLike}
              className={`text-xs font-medium transition-colors ${
                liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`inline size-3 mr-0.5 ${liked ? "fill-current" : ""}`} />
              {likeCount > 0 && likeCount}
            </button>
            <button
              onClick={() => {
                setShowReplies(!showReplies);
                if (!showReplies && replies.length === 0) loadReplies();
              }}
              className="text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="inline size-3 mr-0.5" />
              Reply
              {comment.reply_count ? ` (${comment.reply_count})` : ""}
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(comment.created_at)}</span>
            {isOwn && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="inline size-3" />
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReplies && (
            <form onSubmit={handleReply} className="flex gap-2 mt-2">
              <Input
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 h-8 text-xs rounded-lg bg-white/50 dark:bg-white/5 border-gray-200/60 dark:border-white/10"
                disabled={submittingReply}
              />
              <Button
                type="submit"
                size="icon"
                className="size-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                disabled={submittingReply || !replyText.trim()}
              >
                {submittingReply ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
              </Button>
            </form>
          )}

          {/* Replies */}
          {showReplies && (
            <div className="mt-2 space-y-2">
              {loadingReplies ? (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="size-3 animate-spin" /> Loading replies...
                </div>
              ) : (
                replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    currentUserId={currentUserId}
                    onDelete={onDelete}
                    depth={depth + 1}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
