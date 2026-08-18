import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export function BrandLogo({ size = 32, className = "" }: BrandLogoProps) {
  return (
    <Image
      src="/icons/ec-icon-circle.png"
      alt="EduConnect"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
}