import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { WalkingIcon } from "./WalkingIcon";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  Icon?: LucideIcon;
  className?: string;
  borderstyles?: string;
  variant?: "primary" | "secondary" | "success";
  showWalkingIcon?: boolean;
}

export function Button({
  children,
  onClick,
  disabled = false,
  Icon,
  className = "",
  variant = "primary",
  showWalkingIcon = false,
}: ButtonProps): JSX.Element {
  const variantStyles = {
    primary: "bg-light-brown text-dark-brown",
    secondary: "bg-orange-600 text-white",
    success: "bg-green-600 text-white",
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full py-2 md:py-3 px-4 md:px-6 font-merriweather rounded-xl transition-all duration-200 hover:scale-105 hover:drop-shadow-lg flex items-center justify-center gap-2 text-sm md:text-base ${
        variantStyles[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {showWalkingIcon ? (
        <WalkingIcon />
      ) : Icon ? (
        <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
      ) : null}
      <span className="leading-tight">{children}</span>
    </button>
  );
}
