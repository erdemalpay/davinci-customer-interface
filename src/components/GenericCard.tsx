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
  showCancelButton?: boolean;
  onCancelClick?: () => void;
  cancelButtonText?: string;
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
  showCancelButton = false,
  onCancelClick,
  cancelButtonText = "cancel",
}: GenericCardProps): JSX.Element {
  const shouldDisableMobileClick = showCancelButton;

  return (
    <div
      className={`
        relative rounded-xl p-6 md:p-8 flex flex-col h-full min-h-[180px] md:min-h-0 overflow-hidden
        md:cursor-default md:backdrop-blur-sm
        bg-[#1F2937] md:bg-white/70
        border border-white/10 md:border-white/60
        shadow-[0_4px_24px_rgba(0,0,0,0.20)] md:shadow-[0_4px_24px_rgba(31,41,55,0.10)]
        transition-all duration-150
        ${shouldDisableMobileClick ? 'cursor-default' : 'cursor-pointer active:scale-90 active:shadow-md md:active:scale-100 md:active:shadow-lg'}
      `}
      onClick={onMobileClick && !shouldDisableMobileClick ? (e) => {
        const target = e.target as HTMLElement;
        if (window.innerWidth < 768 && !target.closest('button')) {
          onMobileClick();
        }
      } : undefined}
    >
      {/* Decorative background icon - only visible on mobile */}
      {Icon && (
        <div className={`absolute -left-10 top-1/2 transform -translate-y-1/2 -rotate-12 opacity-10 pointer-events-none md:hidden ${flipMobileIcon ? 'scale-x-[-1]' : ''}`}>
          <Icon className="h-40 w-40 text-white" />
        </div>
      )}

      <div className="text-center flex flex-col flex-1 relative z-10 justify-center pl-4 md:pl-0">
        {/* Icon - only visible on desktop */}
        {Icon && (
          <div className="hidden md:flex mx-auto mb-4 md:mb-6 items-center justify-center">
            <Icon className="w-6 h-6 md:w-10 md:h-10 text-davinci-black-deep" />
          </div>
        )}

        {/* Desktop title */}
        {title && (
          <h3 className="hidden md:block text-lg md:text-2xl font-body font-bold text-davinci-black mb-3">
            {title}
          </h3>
        )}

        {/* Mobile title with walking icon */}
        {(title || mobileTitle) && (
          <h3 className="block md:hidden text-xl font-body font-bold text-white flex items-center justify-center gap-2 mb-3">
            {isLoading && showWalkingIcon && (
              <WalkingIcon className="w-6 h-6" />
            )}
            {isLoading && mobileLoadingTitle ? mobileLoadingTitle : (mobileTitle || title)}
          </h3>
        )}

        {description && (
          <p className="text-sm text-white/70 md:text-davinci-gray-600 font-body mb-4 min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center px-1">
            {description}
          </p>
        )}

        {children && (
          <div className="md:mt-auto [&>button]:hidden md:[&>button]:block">
            {children}
          </div>
        )}

        {showCancelButton && onCancelClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelClick();
            }}
            className="mt-3 px-4 py-2 text-base font-body rounded-full transition-all duration-200 active:scale-95 bg-davinci-red hover:bg-davinci-red-dark text-white md:bg-davinci-black-deep md:hover:bg-davinci-black"
          >
            {cancelButtonText}
          </button>
        )}
      </div>
    </div>
  );
}
