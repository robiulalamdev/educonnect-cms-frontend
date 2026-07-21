"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Building2, Map, Home, Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDivisions, getDistricts, getAreas } from "@/lib/data/locations";

interface LocationPickerProps {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  addressLine?: string;
  onCountryChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onAreaChange?: (value: string) => void;
  onAddressLineChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

// ── Reusable searchable dropdown ────────────────────────────────
function FieldSelect({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  icon: any;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  const displayValue = open ? query : value || "";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectCls = cn(
    "flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm cursor-pointer transition-colors",
    "focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/20",
    disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900",
    open && "border-[#0066FF] ring-2 ring-[#0066FF]/20"
  );

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
        <Icon className="size-3.5" /> {label}
      </Label>
      <div ref={ref} className="relative">
        <div role="combobox" aria-expanded={open} onClick={() => !disabled && setOpen(!open)} className={selectCls}>
          <span className={cn("truncate", !value && "text-gray-400")}>{value || placeholder}</span>
          <ChevronDown className={cn("size-4 shrink-0 text-gray-400 transition-transform", open && "rotate-180")} />
        </div>
        {open && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex items-center border-b border-gray-100 dark:border-gray-800 px-3">
              <Search className="size-4 shrink-0 text-gray-400" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="h-10 w-full bg-transparent px-2 text-sm outline-none placeholder:text-gray-400" />
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-400">No results</div>
              ) : (
                filtered.map((option) => (
                  <div
                    key={option}
                    onClick={() => { onChange(option); setQuery(""); setOpen(false); }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      option === value && "bg-[#0066FF]/10 text-[#0066FF] font-medium"
                    )}
                  >
                    <span className="flex-1 truncate">{option}</span>
                    {option === value && <Check className="size-4 shrink-0 text-[#0066FF]" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main LocationPicker ────────────────────────────────────────

export function LocationPicker({
  country = "",
  state = "",
  city = "",
  area = "",
  addressLine = "",
  onCountryChange,
  onStateChange,
  onCityChange,
  onAreaChange,
  onAddressLineChange,
  disabled = false,
  className,
}: LocationPickerProps) {
  // Always set country to Bangladesh if not set (or even if set, we enforce it for BD-only)
  useEffect(() => {
    if (country !== "Bangladesh") {
      onCountryChange?.("Bangladesh");
    }
  }, [country, onCountryChange]);

  const divisions = getDivisions();
  const districts = getDistricts(state);
  const areas = getAreas(state, city);

  const handleStateChange = (value: string) => {
    onStateChange?.(value);
    onCityChange?.("");
    onAreaChange?.("");
  };

  const handleCityChange = (value: string) => {
    onCityChange?.(value);
    onAreaChange?.("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Row 1: Division + District + Area (3 columns) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FieldSelect 
          label="Division" 
          icon={MapPin} 
          value={state} 
          options={divisions} 
          onChange={handleStateChange} 
          placeholder="Select division..." 
          disabled={disabled} 
        />
        <FieldSelect 
          label="District" 
          icon={Building2} 
          value={city} 
          options={districts} 
          onChange={handleCityChange} 
          placeholder={state ? "Select district..." : "Select division first"} 
          disabled={disabled || !state} 
        />
        <FieldSelect 
          label="Area / Upazila" 
          icon={Map} 
          value={area} 
          options={areas} 
          onChange={(v) => onAreaChange?.(v)} 
          placeholder={city ? "Select area..." : "Select district first"} 
          disabled={disabled || !city} 
        />
      </div>

      {/* Row 2: Address Line */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
          <Home className="size-3.5" /> Address Line <span className="text-gray-400 font-normal">(optional)</span>
        </Label>
        <Input 
          value={addressLine} 
          onChange={(e) => onAddressLineChange?.(e.target.value)} 
          placeholder="Street address, building, etc." 
          disabled={disabled} 
          className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20" 
        />
      </div>
    </div>
  );
}
