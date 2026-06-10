type Props = {
  className?: string;
  alt?: string;
};

/** Logo without CSS filters — Safari iOS breaks filtered SVGs inside composited headers. */
export function SiteLogo({ className = "h-7 sm:h-9 w-auto shrink-0 object-contain", alt = "Souvenir Hunt" }: Props) {
  return (
    <img
      src="/assets/branding/logo-main.svg"
      alt={alt}
      className={`site-logo-img ${className}`}
      width={36}
      height={36}
      decoding="async"
    />
  );
}
