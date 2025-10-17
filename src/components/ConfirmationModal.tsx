import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
  isOpen: boolean;
}

export function ConfirmationModal({
  isOpen,
}: ConfirmationModalProps): JSX.Element | null {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-cream-bg rounded-2xl p-8 max-w-md w-full border-4 border-dark-brown shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-20 h-20 text-dark-brown" />
          </div>
          <h3 className="text-2xl font-merriweather text-dark-brown mb-2">
            {t("feedback.successTitle")}
          </h3>
          <p className="text-dark-brown/70 font-merriweather">
            {t("feedback.successMessage")}
          </p>
        </div>
      </div>
    </div>
  );
}
