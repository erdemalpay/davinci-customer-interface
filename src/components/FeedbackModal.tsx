import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "./ConfirmationModal";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string, rating: number) => void;
  isSuccess: boolean;
}

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  isSuccess,
}: FeedbackModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  if (!isOpen) return null;

  if (isSuccess) {
    return <ConfirmationModal isOpen={isSuccess} />;
  }

  const handleSubmit = () => {
    if (!feedback.trim() || rating === 0) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    onSubmit(feedback, rating);
    setFeedback("");
    setRating(0);
    setShowWarning(false);
  };

  const handleClose = () => {
    setFeedback("");
    setRating(0);
    setShowWarning(false);
    onClose();
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => setRating(index + 1)}
        className={`text-2xl transition-colors duration-200 ${
          index < rating ? "text-yellow-400" : "text-davinci-gray-300"
        } hover:text-yellow-400`}
      >
        ★
      </button>
    ));
  };

  const isFormValid = feedback.trim() && rating > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="rounded-2xl p-8 max-w-md w-full shadow-2xl"
        style={{
          backgroundColor: "#F7F3ED",
          border: "1px solid rgba(31, 41, 55, 0.12)",
        }}
      >
        <h3 className="text-2xl font-body font-bold text-davinci-black mb-6">
          {t("feedback.modalTitle")}
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-body font-semibold text-davinci-black mb-2">
            {t("feedback.rateLabel")}
          </label>
          <div className="flex justify-center gap-1">{renderStars()}</div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-body font-semibold text-davinci-black mb-2">
              {t("feedback.commentLabel")}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-davinci-gray-300 rounded-lg focus:outline-none focus:border-davinci-red resize-none font-body bg-white text-davinci-black placeholder:text-davinci-gray-500"
              rows={4}
              placeholder={t("feedback.commentPlaceholder")}
            />
          </div>

          <div className="h-5 flex items-center justify-center">
            {showWarning && (
              <p className="text-center text-davinci-red font-body text-sm">
                {t("feedback.warning")}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 font-body font-semibold py-3 px-4 rounded-full transition-all duration-200"
              style={{
                background: "var(--gray-200, #EDF0F4)",
                color: "#1F2937",
                border: "1px solid rgba(31, 41, 55, 0.15)",
              }}
            >
              {t("feedback.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 font-body font-semibold py-3 px-4 rounded-full transition-all duration-200"
              style={{
                background: isFormValid ? "var(--red, #A80000)" : "var(--gray-300, #DDE3EB)",
                color: isFormValid ? "#fff" : "#9AA5B4",
                cursor: isFormValid ? "pointer" : "not-allowed",
                boxShadow: isFormValid ? "0 4px 20px rgba(168,0,0,0.25)" : "none",
              }}
            >
              {t("feedback.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
