import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "./ConfirmationModal";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    feedback: string,
    rating: number,
    fullName: string,
    phone: string
  ) => void;
  isSuccess: boolean;
}

// Keeps only digits, drops a leading 0 (max 10) and groups them as "5XX XXX XX XX".
// A number starting with "+" is international: "+" and up to 15 digits, no grouping.
function formatPhone(value: string): string {
  if (value.trimStart().startsWith("+")) {
    return `+${value.replace(/\D/g, "").slice(0, 15)}`;
  }
  const digits = value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 10);
  return [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 8),
    digits.slice(8, 10),
  ]
    .filter(Boolean)
    .join(" ");
}

const inputClassName =
  "w-full p-3 border border-davinci-gray-300 rounded-lg focus:outline-none focus:border-davinci-red font-body bg-white text-davinci-black placeholder:text-davinci-gray-500";

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  isSuccess,
}: FeedbackModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

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
    onSubmit(feedback, rating, fullName.trim(), phone.trim());
    setFeedback("");
    setRating(0);
    setFullName("");
    setPhone("");
    setShowWarning(false);
  };

  const handleClose = () => {
    setFeedback("");
    setRating(0);
    setFullName("");
    setPhone("");
    setShowWarning(false);
    onClose();
  };

  const renderStars = () => {
    const activeRating = hoverRating || rating;
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => setRating(index + 1)}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className={`text-2xl transition-colors duration-150 ${
          index < activeRating ? "text-yellow-400" : "text-davinci-gray-600"
        }`}
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
            {t("feedback.rateLabel")} <span className="text-davinci-red">*</span>
          </label>
          <div className="flex justify-center gap-1">{renderStars()}</div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-body font-semibold text-davinci-black mb-2">
              {t("feedback.commentLabel")}{" "}
              <span className="text-davinci-red">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-davinci-gray-300 rounded-lg focus:outline-none focus:border-davinci-red resize-none font-body bg-white text-davinci-black placeholder:text-davinci-gray-500"
              rows={4}
              placeholder={t("feedback.commentPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-davinci-black mb-2">
              {t("feedback.nameLabel")}
            </label>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClassName}
              placeholder={t("feedback.namePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-davinci-black mb-2">
              {t("feedback.phoneLabel")}
            </label>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className={inputClassName}
              placeholder="5XX XXX XX XX"
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
                background: "#A80000",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(168,0,0,0.25)",
              }}
            >
              {t("feedback.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 font-body font-semibold py-3 px-4 rounded-full transition-all duration-200"
              style={{
                background: isFormValid ? "#1F2937" : "var(--gray-300, #DDE3EB)",
                color: isFormValid ? "#fff" : "#9AA5B4",
                cursor: isFormValid ? "pointer" : "not-allowed",
                boxShadow: isFormValid ? "0 4px 20px rgba(31,41,55,0.25)" : "none",
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
