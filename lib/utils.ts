import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCloudinaryUrl(key: string, options?: { w?: number; h?: number; q?: string }) {
  const base = process.env.NEXT_PUBLIC_CLOUDINARY_URL || "https://res.cloudinary.com/dmlu7hni7/image/upload";
  const transformations = [
    "f_auto",
    "q_auto",
    options?.w ? `w_${options.w}` : null,
    options?.h ? `h_${options.h}` : null,
    options?.h ? `c_fill` : null,
  ].filter(Boolean).join(",");
  return `${base}/${transformations}/${key}`;
}
