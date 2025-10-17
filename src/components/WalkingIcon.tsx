interface WalkingIconProps {
  className?: string;
}

export function WalkingIcon({ className = "w-5 h-5 md:w-6 md:h-6" }: WalkingIconProps): JSX.Element {
  return (
    <svg
      className={`${className} flex-shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="animate-walking">
        {/* Head */}
        <circle cx="12" cy="4" r="2" fill="currentColor" />
        {/* Body */}
        <path d="M12 6 L12 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Left arm */}
        <path d="M12 8 L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-arm-left" />
        {/* Right arm */}
        <path d="M12 8 L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-arm-right" />
        {/* Left leg */}
        <path d="M12 14 L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-leg-left" />
        {/* Right leg */}
        <path d="M12 14 L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-leg-right" />
      </g>
    </svg>
  );
}
