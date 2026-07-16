"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { viewStory, getStoryViewers } from "@/lib/actions/stories";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Heart, Send, Eye, Pause, Play } from "lucide-react";

interface StoryGroup {
  user: { id: string; full_name: string; avatar?: { key: string } | null };
  stories: Array<{
    id: string;
    content: string | null;
    media_type: string | null;
    bg_color: string | null;
    expires_at: string;
    created_at: string;
    media?: { key: string; mime_type: string } | null;
    is_viewed: boolean;
  }>;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getMediaUrl(key: string) {
  return `https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_1080/${key}`;
}

function getVideoUrl(key: string) {
  return `https://res.cloudinary.com/dmlu7hni7/video/upload/${key}`;
}

interface StoryViewerProps {
  groups: StoryGroup[];
  initialGroupIndex: number;
  initialStoryIndex: number;
  currentUserId?: string;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
}

export function StoryViewer({
  groups,
  initialGroupIndex,
  initialStoryIndex,
  currentUserId,
  onClose,
  onStoryViewed,
}: StoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [viewers, setViewers] = useState<any[]>([]);
  const [showViewers, setShowViewers] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds

  const currentGroup = groups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];

  // Auto-advance story
  useEffect(() => {
    if (!currentStory || paused) return;

    setProgress(0);
    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        goNext();
      }
    }, 50);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [groupIndex, storyIndex, paused]);

  // Mark as viewed
  useEffect(() => {
    if (currentStory && !currentStory.is_viewed) {
      viewStory(currentStory.id);
      onStoryViewed(currentStory.id);
    }
  }, [currentStory?.id]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [groupIndex, storyIndex]);

  const goNext = useCallback(() => {
    if (!currentGroup) return;
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((prev) => prev + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  }, [groupIndex, storyIndex, groups.length, currentGroup]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
    } else if (groupIndex > 0) {
      setGroupIndex((prev) => prev - 1);
      const prevGroup = groups[groupIndex - 1];
      setStoryIndex(prevGroup ? prevGroup.stories.length - 1 : 0);
    }
  }, [groupIndex, storyIndex, groups]);

  async function loadViewers() {
    if (!currentStory || currentGroup.user.id !== currentUserId) return;
    const res = (await getStoryViewers(currentStory.id)) as any;
    if (res.success) setViewers(res.data);
    setShowViewers(true);
  }

  if (!currentStory || !currentGroup) return null;

  const isOwnStory = currentGroup.user.id === currentUserId;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="size-5" />
      </button>

      {/* Navigation arrows */}
      {groupIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {groupIndex < groups.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="size-5" />
        </button>
      )}

      {/* Story content */}
      <div className="relative w-full max-w-md h-[85vh] max-h-[700px] rounded-2xl overflow-hidden bg-gray-900">
        {/* Progress bars */}
        <div className="absolute top-2 left-2 right-2 z-30 flex gap-1">
          {currentGroup.stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{
                  width:
                    i < storyIndex ? "100%" :
                    i === storyIndex ? `${progress}%` :
                    "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center gap-2">
          <Avatar className="size-8">
            {currentGroup.user.avatar ? (
              <img
                src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_64,h_64,c_fill/${currentGroup.user.avatar.key}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <AvatarFallback className="text-[10px] font-medium bg-white/20 text-white">
                {getInitials(currentGroup.user.full_name)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-semibold text-white">{currentGroup.user.full_name}</span>
          <span className="text-xs text-white/60">
            {new Date(currentStory.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <div className="flex-1" />
          {isOwnStory && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-white/70 hover:text-white"
              onClick={loadViewers}
            >
              <Eye className="size-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-white/70 hover:text-white"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
          </Button>
        </div>

        {/* Media or text content */}
        {currentStory.media_type === "IMAGE" && currentStory.media ? (
          <img
            src={getMediaUrl(currentStory.media.key)}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : currentStory.media_type === "VIDEO" && currentStory.media ? (
          <video
            src={getVideoUrl(currentStory.media.key)}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop={false}
            playsInline
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center p-8"
            style={{ backgroundColor: currentStory.bg_color || "#1e40af" }}
          >
            <p className="text-white text-xl font-medium text-center leading-relaxed">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none" />

        {/* Touch zones for navigation */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/3 h-full" onClick={goPrev} />
          <div className="w-1/3 h-full" onClick={() => setPaused(!paused)} />
          <div className="w-1/3 h-full" onClick={goNext} />
        </div>
      </div>

      {/* Viewers panel */}
      {showViewers && isOwnStory && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[50vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Viewers ({viewers.length})
            </h3>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setShowViewers(false)}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {viewers.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No viewers yet
              </p>
            ) : (
              viewers.map((v: any) => (
                <div key={v.user.id} className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {v.user.avatar ? (
                      <img
                        src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_80,h_80,c_fill/${v.user.avatar.key}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                        {getInitials(v.user.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{v.user.full_name}</p>
                    <p className="text-xs text-gray-400">{new Date(v.viewed_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
