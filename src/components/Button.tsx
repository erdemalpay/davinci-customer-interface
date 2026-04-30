import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { WalkingIcon } from "./WalkingIcon";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  Icon?: LucideIcon;
  className?: string;
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
  const variantBase = {
    primary: { background: "var(--red, #A80000)", color: "#fff", boxShadow: "0 4px 20px rgba(168,0,0,0.25)" },
    secondary: { background: "#4A5568", color: "#fff", boxShadow: "none" },
    success: { background: "#16a34a", color: "#fff", boxShadow: "none" },
  };

  const styles = variantBase[variant];

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full py-2 md:py-3 px-4 md:px-6 font-body font-semibold rounded-full transition-all duration-200 text-sm md:text-base ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-[1.02] hover:brightness-90"
      } ${className}`}
      style={{
        background: styles.background,
        color: styles.color,
        boxShadow: disabled ? "none" : styles.boxShadow,
      }}
    >
      <div className="flex items-center justify-center gap-2">
        {showWalkingIcon ? (
          <WalkingIcon />
        ) : Icon ? (
          <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        ) : null}
        <span className="whitespace-nowrap">{children}</span>
      </div>
    </button>
  );
}
