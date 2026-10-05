import { ArrowLeft, BookOpen, HelpCircle, Lightbulb, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GmCallReasonEnum } from "../types";
import { useGetGamesMinimal } from "../utils/api/game";

const MAX_GAME_RESULTS = 30;

interface GameMasterCallModalProps {
  onClose: () => void;
  onSubmit: (reason: GmCallReasonEnum, game?: number) => void;
}

// Mounted only while open, so the game list is fetched on demand.
export function GameMasterCallModal({
  onClose,
  onSubmit,
}: GameMasterCallModalProps): JSX.Element {
  const { t } = useTranslation();
  const [step, setStep] = useState<"reason" | "game">("reason");
  const [search, setSearch] = useState("");

  const reasons = [
    {
      reason: GmCallReasonEnum.RECOMMENDATION,
      icon: Lightbulb,
      label: t("gamemaster.reasons.recommendation"),
    },
    {
      reason: GmCallReasonEnum.EXPLANATION,
      icon: BookOpen,
      label: t("gamemaster.reasons.explanation"),
    },
    {
      reason: GmCallReasonEnum.QUESTION,
      icon: HelpCircle,
      label: t("gamemaster.reasons.question"),
    },
  ];

  const handleReason = (reason: GmCallReasonEnum) => {
    if (reason === GmCallReasonEnum.EXPLANATION) {
      setStep("game");
      return;
    }
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        role="dialog"
        aria-modal="true"
        className="rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[85vh] flex flex-col"
        style={{
          backgroundColor: "#F7F3ED",
          border: "1px solid rgba(31, 41, 55, 0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-5 gap-2">
          {step === "game" ? (
            <button
              onClick={() => setStep("reason")}
              aria-label={t("back")}
              className="p-1 -ml-1 text-davinci-black/70 hover:text-davinci-black"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <span className="w-6" />
          )}
          <h3 className="text-xl md:text-2xl font-body font-bold text-davinci-black text-center flex-1">
            {step === "reason"
              ? t("gamemaster.chooseReason")
              : t("gamemaster.chooseGame")}
          </h3>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="p-1 -mr-1 text-davinci-black/70 hover:text-davinci-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === "reason" ? (
          <div className="flex flex-col gap-3">
            {reasons.map(({ reason, icon: Icon, label }) => (
              <button
                key={reason}
                onClick={() => handleReason(reason)}
                className="flex items-center gap-3 w-full rounded-xl px-4 py-4 text-left font-body font-semibold text-white transition-transform active:scale-[0.98]"
                style={{ background: "#1F2937" }}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <GamePicker
            search={search}
            onSearch={setSearch}
            onSelect={(game) => onSubmit(GmCallReasonEnum.EXPLANATION, game)}
          />
        )}
      </div>
    </div>
  );
}

function GamePicker({
  search,
  onSearch,
  onSelect,
}: {
  search: string;
  onSearch: (value: string) => void;
  onSelect: (game: number) => void;
}) {
  const { t, i18n } = useTranslation();
  const games = useGetGamesMinimal();

  const results = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(i18n.language);
    if (!query) return [];
    return games
      .filter((game) =>
        game.name.toLocaleLowerCase(i18n.language).includes(query)
      )
      .slice(0, MAX_GAME_RESULTS);
  }, [games, search, i18n.language]);

  return (
    <div className="flex flex-col min-h-0">
      <input
        autoFocus
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={t("gamemaster.searchGame")}
        className="w-full rounded-xl border border-davinci-black/20 bg-white px-4 py-3 font-body text-davinci-black focus:outline-none focus:ring-2 focus:ring-davinci-black/40"
      />
      <ul className="mt-3 overflow-y-auto min-h-0 flex-1">
        {results.map((game) => (
          <li key={game._id}>
            <button
              onClick={() => onSelect(game._id)}
              className="w-full text-left px-4 py-3 rounded-lg font-body text-davinci-black hover:bg-davinci-black/5 active:bg-davinci-black/10"
            >
              {game.name}
            </button>
          </li>
        ))}
      </ul>
      {search.trim() && results.length === 0 && (
        <p className="mt-3 text-center font-body text-davinci-black/60">
          {t("gamemaster.noGameFound")}
        </p>
      )}
    </div>
  );
}
