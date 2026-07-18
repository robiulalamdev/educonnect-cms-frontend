"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SearchableSelect } from "./searchable-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Globe, Building2, Map, Home, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, searchCountries, type Country } from "@/lib/data/countries";

interface LocationPickerProps {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  addressLine?: string;
  onCountryChange?: (value: string, countryCode?: string) => void;
  onStateChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onAreaChange?: (value: string) => void;
  onAddressLineChange?: (value: string) => void;
  disabled?: boolean;
  showAddressLine?: boolean;
  compact?: boolean;
  className?: string;
}

interface GeoSuggestion {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

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
  showAddressLine = true,
  compact = false,
  className,
}: LocationPickerProps) {
  const [countryCode, setCountryCode] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [areaQuery, setAreaQuery] = useState("");
  const [stateSuggestions, setStateSuggestions] = useState<GeoSuggestion[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<GeoSuggestion[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [stateFocused, setStateFocused] = useState(false);
  const [cityFocused, setCityFocused] = useState(false);
  const [areaFocused, setAreaFocused] = useState(false);

  const stateInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const areaInputRef = useRef<HTMLInputElement>(null);

  const hasGoogleMaps = !!(
    typeof window !== "undefined" &&
    (window as any).google?.maps?.places
  );

  // When country changes, reset state/city/area
  const handleCountryChange = useCallback(
    (value: string) => {
      const country = COUNTRIES.find((c) => c.name === value);
      setCountryCode(country?.code || "");
      onCountryChange?.(value, country?.code);
      onStateChange?.("");
      onCityChange?.("");
      onAreaChange?.("");
      setStateQuery("");
      setCityQuery("");
      setAreaQuery("");
    },
    [onCountryChange, onStateChange, onCityChange, onAreaChange]
  );

  // Google Places Autocomplete for states
  const fetchStateSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length < 2 || !countryCode || !hasGoogleMaps) return;
      setLoadingStates(true);
      try {
        const service = new (window as any).google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: query,
            types: ["(regions)"],
            componentRestrictions: { country: countryCode.toLowerCase() },
          },
          (predictions: GeoSuggestion[] | null) => {
            setStateSuggestions(predictions || []);
            setLoadingStates(false);
          }
        );
      } catch {
        setLoadingStates(false);
      }
    },
    [countryCode, hasGoogleMaps]
  );

  // Google Places Autocomplete for cities
  const fetchCitySuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length < 2 || !countryCode || !hasGoogleMaps) return;
      setLoadingCities(true);
      try {
        const service = new (window as any).google.maps.places.AutocompleteService();
        const params: any = {
          input: query,
          types: ["(cities)"],
          componentRestrictions: { country: countryCode.toLowerCase() },
        };
        service.getPlacePredictions(
          params,
          (predictions: GeoSuggestion[] | null) => {
            setCitySuggestions(predictions || []);
            setLoadingCities(false);
          }
        );
      } catch {
        setLoadingCities(false);
      }
    },
    [countryCode, hasGoogleMaps]
  );

  // Debounced state search
  useEffect(() => {
    const timer = setTimeout(() => fetchStateSuggestions(stateQuery), 300);
    return () => clearTimeout(timer);
  }, [stateQuery, fetchStateSuggestions]);

  // Debounced city search
  useEffect(() => {
    const timer = setTimeout(() => fetchCitySuggestions(cityQuery), 300);
    return () => clearTimeout(timer);
  }, [cityQuery, fetchCitySuggestions]);

  const countryOptions = COUNTRIES.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const stateOptions = hasGoogleMaps
    ? stateSuggestions.map((s) => ({
        label: s.structured_formatting?.main_text || s.description,
        value: s.structured_formatting?.main_text || s.description,
      }))
    : [];

  const cityOptions = hasGoogleMaps
    ? citySuggestions.map((s) => ({
        label: s.structured_formatting?.main_text || s.description,
        value: s.structured_formatting?.main_text || s.description,
      }))
    : [];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Country */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
          <Globe className="size-3.5" /> Country
        </Label>
        <SearchableSelect
          value={country}
          onValueChange={handleCountryChange}
          options={countryOptions}
          placeholder="Select country..."
          disabled={disabled}
        />
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
          <MapPin className="size-3.5" /> State / Province / Region
        </Label>
        {hasGoogleMaps ? (
          <div className="relative">
            <Input
              ref={stateInputRef}
              value={state || stateQuery}
              onChange={(e) => {
                setStateQuery(e.target.value);
                onStateChange?.("");
              }}
              onFocus={() => setStateFocused(true)}
              onBlur={() => setTimeout(() => setStateFocused(false), 200)}
              placeholder={country ? `Search state in ${country}...` : "Select country first"}
              disabled={disabled || !country}
              className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
            />
            {stateFocused && stateQuery && stateSuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl max-h-60 overflow-y-auto">
                {loadingStates && (
                  <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400">
                    <Loader2 className="size-4 animate-spin" /> Searching...
                  </div>
                )}
                {stateSuggestions.map((s, i) => (
                  <div
                    key={s.place_id || i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const val = s.structured_formatting?.main_text || s.description;
                      setStateQuery("");
                      onStateChange?.(val);
                      onCityChange?.("");
                      setCityQuery("");
                    }}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <MapPin className="size-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{s.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Input
            value={state}
            onChange={(e) => onStateChange?.(e.target.value)}
            placeholder={country ? "Enter state/province" : "Select country first"}
            disabled={disabled || !country}
            className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
          />
        )}
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
          <Building2 className="size-3.5" /> City / District
        </Label>
        {hasGoogleMaps ? (
          <div className="relative">
            <Input
              ref={cityInputRef}
              value={city || cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                onCityChange?.("");
              }}
              onFocus={() => setCityFocused(true)}
              onBlur={() => setTimeout(() => setCityFocused(false), 200)}
              placeholder={state ? `Search city in ${state}...` : "Select state first"}
              disabled={disabled || !state}
              className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
            />
            {cityFocused && cityQuery && citySuggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl max-h-60 overflow-y-auto">
                {loadingCities && (
                  <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400">
                    <Loader2 className="size-4 animate-spin" /> Searching...
                  </div>
                )}
                {citySuggestions.map((s, i) => (
                  <div
                    key={s.place_id || i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const val = s.structured_formatting?.main_text || s.description;
                      setCityQuery("");
                      onCityChange?.(val);
                    }}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Building2 className="size-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{s.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Input
            value={city}
            onChange={(e) => onCityChange?.(e.target.value)}
            placeholder={state ? "Enter city/district" : "Select state first"}
            disabled={disabled || !state}
            className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
          />
        )}
      </div>

      {/* Area */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
          <Map className="size-3.5" /> Area / Locality
          <span className="text-gray-400 font-normal">(optional)</span>
        </Label>
        {hasGoogleMaps ? (
          <div className="relative">
            <Input
              ref={areaInputRef}
              value={area || areaQuery}
              onChange={(e) => {
                setAreaQuery(e.target.value);
                onAreaChange?.("");
              }}
              onFocus={() => setAreaFocused(true)}
              onBlur={() => setTimeout(() => setAreaFocused(false), 200)}
              placeholder={city ? `Search area in ${city}...` : "Enter area name"}
              disabled={disabled || !city}
              className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
            />
          </div>
        ) : (
          <Input
            value={area}
            onChange={(e) => onAreaChange?.(e.target.value)}
            placeholder="Enter area/locality"
            disabled={disabled}
            className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
          />
        )}
      </div>

      {/* Address Line */}
      {showAddressLine && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-gray-400">
            <Home className="size-3.5" /> Address Line
            <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            value={addressLine}
            onChange={(e) => onAddressLineChange?.(e.target.value)}
            placeholder="Street address, building, etc."
            disabled={disabled}
            className="rounded-xl h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
          />
        </div>
      )}
    </div>
  );
}
