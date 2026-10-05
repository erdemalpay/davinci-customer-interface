import { ArrowLeft, BookOpen, HelpCircle, Lightbulb, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GmCallReasonEnum } from "../types";
import {
  GameAvailability,
  GameAvailabilityStatus,
  checkGameAvailability,
  useGetGamesMinimal,
} from "../utils/api/game";

const MAX_GAME_RESULTS = 30;

interface GameMasterCallModalProps {
  location: number;
  tableName: string;
  onClose: () => void;
  onSubmit: (reason: GmCallReasonEnum, game?: number) => void;
  // Everyone who knows the requested game declined the table's call: start
  // by offering another game instead of asking for a reason.
  explainerDeclined?: boolean;
  onCancelCall?: () => void;
}

type Step = "reason" | "game" | "unmet" | "declined";

// Mounted only while open, so the game list is fetched on demand.
export function GameMasterCallModal({
  location,
  tableName,
  onClose,
  onSubmit,
  explainerDeclined = false,
  onCancelCall,
}: GameMasterCallModalProps): JSX.Element {
  const { t } = useTranslation();
  const firstStep: Step = explainerDeclined ? "declined" : "reason";
  const [step, setStep] = useState<Step>(firstStep);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<number>();
  const [availability, setAvailability] = useState<GameAvailability>();
  const [isChecking, setIsChecking] = useState(false);

  // Before calling for an explanation, check whether someone who knows the
  // game is free; otherwise let the table wait in line or pick another game.
  const handleGameSelect = async (game: number) => {
    setIsChecking(true);
    try {
      const result = await checkGameAvailability({ location, tableName, game });
      if (result.status === GameAvailabilityStatus.AVAILABLE) {
        onSubmit(GmCallReasonEnum.EXPLANATION, game);
        return;
      }
      setSelectedGame(game);
      setAvailability(result);
      setStep("unmet");
    } catch {
      // Still call; the API keeps the request waiting for someone who
      // knows the game.
      onSubmit(GmCallReasonEnum.EXPLANATION, game);
    } finally {
      setIsChecking(false);
    }
  };

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
          {step !== firstStep ? (
            <button
              onClick={() => setStep(step === "unmet" ? "game" : firstStep)}
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
              : step === "game"
                ? t("gamemaster.chooseGame")
                : step === "declined"
                  ? t("gamemaster.declined.title")
                  : t("gamemaster.unmet.title")}
          </h3>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="p-1 -mr-1 text-davinci-black/70 hover:text-davinci-black"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === "declined" ? (
          <div className="flex flex-col gap-3">
            <p className="font-body text-davinci-black/80 text-center mb-2">
              {t("gamemaster.declined.message")}
            </p>
            <button
              onClick={() => setStep("game")}
              className="w-full rounded-xl px-4 py-4 font-body font-semibold text-white transition-transform active:scale-[0.98]"
              style={{ background: "#1F2937" }}
            >
              {t("gamemaster.unmet.pickAnotherGame")}
            </button>
            <button
              onClick={() => onSubmit(GmCallReasonEnum.RECOMMENDATION)}
              className="w-full rounded-xl px-4 py-4 font-body font-semibold border border-davinci-black/30 text-davinci-black transition-transform active:scale-[0.98]"
            >
              {t("gamemaster.reasons.recommendation")}
            </button>
            {onCancelCall && (
              <button
                onClick={onCancelCall}
                className="w-full rounded-xl px-4 py-3 font-body text-davinci-black/70 underline"
              >
                {t("gamemaster.declined.cancelCall")}
              </button>
            )}
          </div>
        ) : step === "reason" ? (
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
        ) : step === "game" ? (
          <GamePicker
            search={search}
            onSearch={setSearch}
            onSelect={handleGameSelect}
            disabled={isChecking}
          />
        ) : (
          <UnmetRequestChoice
            availability={availability!}
            onWait={() => onSubmit(GmCallReasonEnum.EXPLANATION, selectedGame)}
            onPickAnotherGame={() => setStep("game")}
            onAskRecommendation={() =>
              onSubmit(GmCallReasonEnum.RECOMMENDATION)
            }
          />
        )}
      </div>
    </div>
  );
}

function UnmetRequestChoice({
  availability,
  onWait,
  onPickAnotherGame,
  onAskRecommendation,
}: {
  availability: GameAvailability;
  onWait: () => void;
  onPickAnotherGame: () => void;
  onAskRecommendation: () => void;
}) {
  const { t } = useTranslation();
  const canWait = availability.status !== GameAvailabilityStatus.UNAVAILABLE;
  const message =
    availability.status === GameAvailabilityStatus.BUSY
      ? t("gamemaster.unmet.busy")
      : availability.status === GameAvailabilityStatus.LATER
        ? t("gamemaster.unmet.later", { hour: availability.availableFrom })
        : t("gamemaster.unmet.unavailable");

  const buttonClass =
    "w-full rounded-xl px-4 py-4 font-body font-semibold transition-transform active:scale-[0.98]";
  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-davinci-black/80 text-center mb-2">
        {message}
      </p>
      {canWait && (
        <button
          onClick={onWait}
          className={`${buttonClass} text-white`}
          style={{ background: "#1F2937" }}
        >
          {t("gamemaster.unmet.wait")}
        </button>
      )}
      <button
        onClick={onPickAnotherGame}
        className={`${buttonClass} ${
          canWait
            ? "border border-davinci-black/30 text-davinci-black"
            : "text-white"
        }`}
        style={canWait ? undefined : { background: "#1F2937" }}
      >
        {t("gamemaster.unmet.pickAnotherGame")}
      </button>
      {!canWait && (
        <button
          onClick={onAskRecommendation}
          className={`${buttonClass} border border-davinci-black/30 text-davinci-black`}
        >
          {t("gamemaster.reasons.recommendation")}
        </button>
      )}
    </div>
  );
}

function GamePicker({
  search,
  onSearch,
  onSelect,
  disabled,
}: {
  search: string;
  onSearch: (value: string) => void;
  onSelect: (game: number) => void;
  disabled: boolean;
}) {
  const { t, i18n } = useTranslation();
  const games = useGetGamesMinimal();

  const results = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(i18n.language);
    if (!query) return [];
    return games
      .filter((game) =>
        game.name.toLocaleLowerCase(i18n.language).includes(query),
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
              disabled={disabled}
              className="w-full text-left px-4 py-3 rounded-lg font-body text-davinci-black hover:bg-davinci-black/5 active:bg-davinci-black/10 disabled:opacity-50"
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
