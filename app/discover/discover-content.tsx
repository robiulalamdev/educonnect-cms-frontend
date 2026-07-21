"use client";

import { useState, useEffect, useCallback } from "react";
import { searchServices, searchPosts } from "@/lib/actions/discover";
import { LocationPicker } from "@/components/location/location-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2, BookOpen, User } from "lucide-react";
import Link from "next/link";

export function DiscoverContent() {
  const [tab, setTab] = useState<"services" | "students">("services");
  
  // Filters
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  
  // Results
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        state,
        city,
        area,
        ...(q ? { search: q, q } : {}),
      };

      if (tab === "services") {
        const res = await searchServices({ ...params, limit: 12 });
        if (res.success) setResults(res.data);
      } else {
        const res = await searchPosts({ ...params, type: "SEEKING", limit: 12 });
        if (res.success) setResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab, q, state, city, area]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchResults]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 lg:py-12">
      
      {/* Header Segments */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Discover
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Find the perfect coaching center or connect with students in Bangladesh.
          </p>
        </div>
        
        <div className="flex p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
          <button
            onClick={() => setTab("services")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === "services" 
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Find Coaching
          </button>
          <button
            onClick={() => setTab("students")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === "students" 
                ? "bg-[#0066FF] text-white shadow-md shadow-blue-500/20" 
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Find Students
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-[320px] shrink-0">
          <div className="glass-card-solid p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <MapPin className="size-5 text-[#0066FF]" /> Location Filter
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input 
                  placeholder="Keyword search..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-11 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700" 
                />
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-6">
                <LocationPicker
                  state={state}
                  city={city}
                  area={area}
                  onStateChange={(v) => { setState(v); setCity(""); setArea(""); }}
                  onCityChange={(v) => { setCity(v); setArea(""); }}
                  onAreaChange={setArea}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-11 rounded-xl mt-4 border-gray-200 text-gray-600 hover:text-[#0066FF] hover:bg-blue-50"
                onClick={() => { setState(""); setCity(""); setArea(""); setQ(""); }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Grid */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="flex py-20 justify-center">
              <Loader2 className="size-8 animate-spin text-[#0066FF]" />
            </div>
          ) : results.length === 0 ? (
            <div className="glass-card-solid p-16 text-center">
              <div className="size-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                <Search className="size-8 text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No results found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your location tags or keywords to find more matches.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {results.map((item) => (
                tab === "services" ? (
                  <ServiceCard key={item.id} service={item} />
                ) : (
                  <StudentRequestCard key={item.id} post={item} />
                )
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Components

function ServiceCard({ service }: { service: any }) {
  return (
    <div className="glass-card-solid hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-5 flex flex-col border border-gray-200/60 dark:border-gray-800">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-green-50 text-green-600">
          {service.format}
        </span>
        <span className="text-xs font-bold text-gray-500">{service.mode}</span>
      </div>
      
      <h3 className="text-[17px] font-bold text-gray-900 dark:text-white line-clamp-2">
        {service.title}
      </h3>
      
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
        <MapPin className="size-4 shrink-0 text-[#0066FF]" />
        <span className="truncate flex-1">
          {service.area ? `${service.area}, ` : ""}{service.city}
        </span>
      </div>
      
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {service.teacher?.avatar ? (
            <img src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_40,h_40,c_fill/${service.teacher.avatar.key}`} alt="" className="size-6 rounded-full object-cover" />
          ) : (
             <div className="size-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">T</div>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
            {service.teacher?.full_name}
          </span>
        </div>
        <Link href={`/${service.slug}`} className="text-sm font-bold text-[#0066FF] hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}

function StudentRequestCard({ post }: { post: any }) {
  return (
    <div className="glass-card-solid hover:-translate-y-1 hover:shadow-xl transition-all duration-300 p-5 flex flex-col border border-gray-200/60 dark:border-gray-800">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-600">
          SEEKING
        </span>
        {post.preferred_mode && (
          <span className="text-xs font-bold text-gray-500">{post.preferred_mode}</span>
        )}
      </div>
      
      <h3 className="text-[17px] font-bold text-gray-900 dark:text-white line-clamp-2">
        {post.title || "Student looking for teacher"}
      </h3>
      
      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
        <MapPin className="size-4 shrink-0 text-[#0066FF]" />
        <span className="truncate flex-1">
          {post.area ? `${post.area}, ` : ""}{post.city || post.state || "Virtual"}
        </span>
      </div>
      
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.author?.avatar ? (
             <img src={`https://res.cloudinary.com/dmlu7hni7/image/upload/f_auto,q_auto,w_40,h_40,c_fill/${post.author.avatar.key}`} alt="" className="size-6 rounded-full object-cover" />
          ) : (
             <div className="size-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-[10px] font-bold">S</div>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
            {post.author?.full_name}
          </span>
        </div>
        {post.budget_max && (
           <span className="text-sm font-bold text-gray-900 border border-gray-200 px-2.5 py-1 rounded-lg">
             ৳{post.budget_max}
           </span>
        )}
      </div>
    </div>
  );
}
