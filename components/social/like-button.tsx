"use client";

import { useState } from "react";
import { togglePostLike } from "@/lib/actions/comments";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export function LikeButton({ postId, initialLiked = false, initialCount = 0 }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    setLoading(true);
    try {
      const res = (await togglePostLike(postId)) as any;
      if (res.success) { setLiked(res.data.liked); setCount(res.data.likeCount); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`rounded-full px-3 h-9 text-[13px] font-medium transition-all ${
        liked ? "text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/50" : "text-[#6B7280] hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/50"
      }`}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Heart className={`size-4 mr-1.5 ${liked ? "fill-current" : ""}`} />}
      {count > 0 ? count : ""} Like
    </Button>
  );
}
