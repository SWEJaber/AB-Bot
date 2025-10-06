import Image from "next/image";
import React, { useState } from "react";

type Props = {
  /** Image URL to display */
  src?: string;
  /** Optional hyperlink - if provided the circle becomes a link */
  href?: string;
  /** alt text for the image (also used for aria-label) */
  alt?: string;
  /** diameter in pixels (default 48) */
  size?: number;
  /** If image fails, use this name to render initials as fallback */
  name?: string;
  /** Extra classes to apply to the outer container */
  className?: string;
};

export default function Avatar({
  src,
  href,
  alt = "avatar",
  size = 48,
  name,
  className = "",
}: Props) {
  const [errored, setErrored] = useState(false);

  const wrapperStyle = {
    width: `${size}px`,
    height: `${size}px`,
  } as React.CSSProperties;

  const content = (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${className}`}
      style={wrapperStyle}
      role={href ? undefined : "img"}
      aria-label={alt}
      title={alt}
    >
      {src && !errored ? (
        <Image
          width={size}
          height={size}
          src={src}
          alt={alt}
          className="object-cover w-full h-full block"
          onError={() => setErrored(true)}
        />
      ) : name ? (
        // initials fallback
        <span className="select-none font-medium text-gray-700 text-sm">
          {getInitials(name)}
        </span>
      ) : (
        // generic SVG fallback (keeps it crisp at any size)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-2/3 h-2/3"
          aria-hidden
        >
          <rect width="100%" height="100%" rx="999" fill="#E5E7EB" />
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="#9CA3AF"
          />
        </svg>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block" aria-label={alt} title={alt}>
        {content}
      </a>
    );
  }

  return content;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
