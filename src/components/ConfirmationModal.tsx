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
      <div
        className="rounded-2xl p-8 max-w-md w-full shadow-2xl"
        style={{
          backgroundColor: "#F7F3ED",
          border: "1px solid rgba(31, 41, 55, 0.12)",
        }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-20 h-20 text-davinci-red" />
          </div>
          <h3 className="text-2xl font-body font-bold text-davinci-black mb-2">
            {t("feedback.successTitle")}
          </h3>
          <p className="text-davinci-gray-600 font-body">
            {t("feedback.successMessage")}
          </p>
        </div>
      </div>
    </div>
  );
}
