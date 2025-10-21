import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { WalkingIcon } from "./WalkingIcon";

interface GenericCardProps {
  icon?: LucideIcon;
  iconColor?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  mobileTitle?: string;
  onMobileClick?: () => void;
  flipMobileIcon?: boolean;
  mobileLoadingTitle?: string;
  isLoading?: boolean;
  showWalkingIcon?: boolean;
}

export function GenericCard({
  icon: Icon,
  title,
  description,
  children,
  mobileTitle,
  onMobileClick,
  flipMobileIcon = false,
  mobileLoadingTitle,
  isLoading = false,
  showWalkingIcon = false,
}: GenericCardProps): JSX.Element {
  return (
    <div
      className="relative bg-dark-brown backdrop-blur-sm rounded-xl p-6 md:p-8 border border-dark-brown/50 shadow-lg flex flex-col h-full min-h-[180px] md:min-h-0 overflow-hidden md:cursor-default cursor-pointer transition-all duration-150 active:scale-90 active:shadow-md md:active:scale-100 md:active:shadow-lg"
      onClick={onMobileClick ? (e) => {
        // Only trigger on mobile (check if button is hidden)
        const target = e.target as HTMLElement;
        if (window.innerWidth < 768 && !target.closest('button')) {
          onMobileClick();
        }
      } : undefined}
    >
      {/* Decorative background icon - only visible on mobile */}
      {Icon && (
        <div className={`absolute -left-10 top-1/2 transform -translate-y-1/2 -rotate-12 opacity-[0.08] pointer-events-none md:hidden ${flipMobileIcon ? 'scale-x-[-1]' : ''}`}>
          <Icon className="h-40 w-40 text-light-brown" />
        </div>
      )}

      <div className="text-center flex flex-col flex-1 relative z-10 justify-center pl-4 md:pl-0">
        {/* Icon - only visible on desktop */}
        {Icon && (
          <div className="hidden md:flex mx-auto mb-4 md:mb-6 items-center justify-center">
            <Icon className="w-6 h-6 md:w-10 md:h-10 text-light-brown" />
          </div>
        )}

        {/* Desktop title */}
        {title && (
          <h3 className="hidden md:block text-lg md:text-2xl font-merriweather text-light-brown mb-4">
            {title}
          </h3>
        )}

        {/* Mobile title (from button text) with walking icon */}
        {(title || mobileTitle) && (
          <h3 className="block md:hidden text-xl font-merriweather text-light-brown flex items-center justify-center gap-2 mb-4">
            {isLoading && showWalkingIcon && (
              <WalkingIcon className="w-6 h-6" />
            )}
            {isLoading && mobileLoadingTitle ? mobileLoadingTitle : (mobileTitle || title)}
          </h3>
        )}

        {description && (
          <p className="text-sm text-light-brown/90 font-merriweather mb-4 min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center px-1">
            {description}
          </p>
        )}

        {/* Queue messages and Button */}
        {children && (
          <div className="md:mt-auto [&>button]:hidden md:[&>button]:block">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
