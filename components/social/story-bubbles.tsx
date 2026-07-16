"use client";

import { useEffect, useState, useCallback } from "react";
import { getStoriesFeed } from "@/lib/actions/stories";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { StoryViewer } from "./story-viewer";

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
  has_unviewed: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface StoryBubblesProps {
  currentUserId?: string;
}

export function StoryBubbles({ currentUserId }: StoryBubblesProps) {
  const [groups, setGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerGroupIndex, setViewerGroupIndex] = useState(0);

  const loadStories = useCallback(async () => {
    try {
      const res = (await getStoriesFeed()) as any;
      if (res.success) setGroups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  function openViewer(groupIdx: number, storyIdx: number) {
    setViewerGroupIndex(groupIdx);
    setViewerIndex(storyIdx);
    setViewerOpen(true);
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0 animate-pulse">
            <div className="size-16 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Your story / Create story */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative">
            <Avatar className="size-16 ring-2 ring-gray-200 dark:ring-gray-700">
              <AvatarFallback className="text-sm font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Plus className="size-5" />
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[64px] truncate">
            Your story
          </span>
        </div>

        {/* Other users' stories */}
        {groups.map((group, groupIdx) => (
          <button
            key={group.user.id}
            className="flex flex-col items-center gap-1 shrink-0"
            onClick={() => openViewer(groupIdx, 0)}
          >
            <div className={`rounded-full p-0.5 ${
              group.has_unviewed
                ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}>
              <Avatar className="size-14 ring-2 ring-white dark:ring-gray-900">
                {group.user.avatar ? (
                  <img
                    src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_112,h_112,c_fill/${group.user.avatar.key}`}
                    alt={group.user.full_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <AvatarFallback className="text-xs font-medium bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                    {getInitials(group.user.full_name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 max-w-[64px] truncate">
              {group.user.id === currentUserId ? "Your story" : group.user.full_name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {viewerOpen && groups.length > 0 && (
        <StoryViewer
          groups={groups}
          initialGroupIndex={viewerGroupIndex}
          initialStoryIndex={viewerIndex}
          currentUserId={currentUserId}
          onClose={() => setViewerOpen(false)}
          onStoryViewed={(storyId) => {
            setGroups((prev) =>
              prev.map((g) => ({
                ...g,
                stories: g.stories.map((s) =>
                  s.id === storyId ? { ...s, is_viewed: true } : s
                ),
                has_unviewed: g.stories.some((s) => s.id !== storyId && !s.is_viewed),
              }))
            );
          }}
        />
      )}
    </>
  );
}
