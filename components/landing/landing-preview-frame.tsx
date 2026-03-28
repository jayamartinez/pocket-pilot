import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

interface LandingPreviewFrameProps {
  src: StaticImageData;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export function LandingPreviewFrame({
  src,
  alt,
  caption,
  className,
  imageClassName,
  priority = false,
  sizes = "100vw",
}: LandingPreviewFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(79,140,255,0.12),rgba(79,140,255,0.02)_28%,rgba(255,255,255,0.03)),var(--card)] p-3 shadow-[0_26px_80px_rgb(0_0_0_/_0.36)] transition-transform duration-500 hover:-translate-y-1.5",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-10 top-0 h-20 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.32),transparent_68%)] blur-3xl" />
      {caption ? (
        <span className="relative mb-3 inline-flex rounded-full border border-white/10 bg-background/72 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          {caption}
        </span>
      ) : null}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0d11]">
        <Image
          alt={alt}
          className={cn("h-auto w-full object-cover", imageClassName)}
          priority={priority}
          sizes={sizes}
          src={src}
        />
      </div>
    </div>
  );
}
