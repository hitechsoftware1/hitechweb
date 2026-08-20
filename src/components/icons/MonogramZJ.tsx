import React from 'react';

/**
 * Custom "Z" with a "J" passing through it — used for the AI Studio nav
 * icon in place of a stock Lucide icon. Drawn with the same
 * stroke/viewBox conventions as lucide-react so it drops into <link.icon
 * className="..." /> call sites exactly like any other icon.
 */
export const MonogramZJ = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 5h14L5 19h14" />
      <path d="M16 4v10a4 4 0 0 1-8 0" />
    </svg>
  )
);
MonogramZJ.displayName = 'MonogramZJ';
