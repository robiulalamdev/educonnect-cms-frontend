"use client";

import { useEffect, useState, useCallback } from "react";
import { getStoriesFeed } from "@/lib/actions/stories";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { StoryViewer } from "./story-viewer";

interface StoryGroup {
  user: { id: string; full_name: string; avatar?: { key: string } | null };
  stories: Array<{
    id: string; content: string | null; media_type: string | null; bg_color: string | null;
    expires_at: string; created_at: string; media?: { key: string; mime_type: string } | null; is_viewed: boolean;
  }>;
  has_unviewed: boolean;
}

function getInitials(name: string) { return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2); }

interface StoryBubblesProps {
  currentUserId?: string;
  onCreateStory?: () => void;
}

export function StoryBubbles({ currentUserId, onCreateStory }: StoryBubblesProps) {
  const [groups, setGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerGroupIndex, setViewerGroupIndex] = useState(0);
  const [viewerStoryIndex, setViewerStoryIndex] = useState(0);

  const loadStories = useCallback(async () => {
    try {
      const res = (await getStoriesFeed()) as any;
      if (res.success) setGroups(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadStories(); }, [loadStories]);

  function openViewer(groupIdx: number, storyIdx: number) {
    setViewerGroupIndex(groupIdx);
    setViewerStoryIndex(storyIdx);
    setViewerOpen(true);
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 animate-pulse">
            <div className="size-[72px] rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Your story / Add button */}
        <button onClick={onCreateStory} className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative">
            <div className="size-[72px] rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-[#0066FF] hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
              <Plus className="size-6 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[72px] truncate">Your story</span>
        </button>

        {/* Other users' stories */}
        {groups.map((group, groupIdx) => (
          <button key={group.user.id} className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => openViewer(groupIdx, 0)}>
            <div className={`rounded-full p-[3px] ${group.has_unviewed ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" : "bg-gray-200 dark:bg-gray-700"}`}>
              <Avatar className="size-[66px] ring-[3px] ring-white dark:ring-[#16161D]">
                {group.user.avatar ? (
                  <img src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_132,h_132,c_fill/${group.user.avatar.key}`} alt={group.user.full_name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <AvatarFallback className="text-xs font-bold bg-white dark:bg-[#16161D] text-gray-600 dark:text-gray-300">{getInitials(group.user.full_name)}</AvatarFallback>
                )}
              </Avatar>
            </div>
            <span className="text-[11px] text-gray-600 dark:text-gray-400 max-w-[72px] truncate">
              {group.user.id === currentUserId ? "You" : group.user.full_name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {viewerOpen && groups.length > 0 && (
        <StoryViewer groups={groups} initialGroupIndex={viewerGroupIndex} initialStoryIndex={viewerStoryIndex}
          currentUserId={currentUserId} onClose={() => setViewerOpen(false)}
          onStoryViewed={(storyId) => {
            setGroups((prev) => prev.map((g) => ({
              ...g,
              stories: g.stories.map((s) => s.id === storyId ? { ...s, is_viewed: true } : s),
              has_unviewed: g.stories.some((s) => s.id !== storyId && !s.is_viewed),
            })));
          }}
        />
      )}
    </>
  );
}
