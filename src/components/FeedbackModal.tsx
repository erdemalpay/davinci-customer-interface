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
          index < rating ? "text-yellow-400" : "text-gray-300"
        } hover:text-yellow-400`}
      >
        ★
      </button>
    ));
  };

  const isFormValid = feedback.trim() && rating > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-cream-bg rounded-2xl p-8 max-w-md w-full border-4 border-dark-brown shadow-2xl">
        <h3 className="text-2xl font-merriweather text-dark-brown mb-6">
          {t("feedback.modalTitle")}
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-merriweather font-bold text-dark-brown mb-2">
            {t("feedback.rateLabel")}
          </label>
          <div className="flex justify-center gap-1">{renderStars()}</div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-merriweather font-bold text-dark-brown mb-2">
              {t("feedback.commentLabel")}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border-2 border-dark-brown rounded-lg focus:outline-none resize-none font-merriweather bg-white text-dark-brown placeholder:text-gray-400"
              rows={4}
              placeholder={t("feedback.commentPlaceholder")}
            />
          </div>

          <div className="h-5 flex items-center justify-center">
            {showWarning && (
              <p className="text-center text-dark-brown font-merriweather text-sm">
                {t("feedback.warning")}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-light-brown hover:bg-light-brown/80 text-dark-brown font-merriweather font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border-2 border-dark-brown"
            >
              {t("feedback.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 font-merriweather font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border-2 border-dark-brown ${
                isFormValid
                  ? "bg-dark-brown hover:bg-dark-brown/90 text-light-brown"
                  : "bg-light-brown text-dark-brown cursor-not-allowed"
              }`}
            >
              {t("feedback.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
