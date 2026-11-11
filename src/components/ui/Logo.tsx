import { cn } from "@/lib/utils";

interface LogoProps {
  src: string | null | undefined;
  /** Used for the fallback letter when there's no image */
  name: string;
  className?: string;
}

// Small round logo from a third-party URL (already checked with safeUrl). Decorative: the name is always
// shown next to it, so alt="". Without a URL it shows the first letter instead.
export const Logo = ({ src, name, className }: LogoProps) =>
  src ? (
    <img src={src} alt="" loading="lazy" className={cn("size-6 rounded-full bg-surface-container-high shrink-0 object-cover", className)} />
  ) : (
    <span
      aria-hidden
      className={cn(
        "size-6 rounded-full bg-surface-container-high shrink-0 grid place-items-center font-headline text-[10px] font-bold text-on-surface-variant",
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
