"use client";

import { useState } from "react";
import { togglePostLike, getPostLikes } from "@/lib/actions/comments";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialCount?: number;
  onLikeChange?: (liked: boolean, count: number) => void;
}

export function LikeButton({ postId, initialLiked = false, initialCount = 0, onLikeChange }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);
    try {
      const res = (await togglePostLike(postId)) as any;
      if (res.success) {
        setLiked(res.data.liked);
        setCount(res.data.likeCount);
        onLikeChange?.(res.data.liked, res.data.likeCount);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex-1 rounded-xl transition-colors ${
        liked ? "text-red-500 hover:text-red-600" : "text-gray-500 dark:text-gray-400 hover:text-red-500"
      }`}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1.5 size-4 animate-spin" />
      ) : (
        <Heart className={`mr-1.5 size-4 ${liked ? "fill-current" : ""}`} />
      )}
      {count > 0 ? count : ""} Like
    </Button>
  );
}
