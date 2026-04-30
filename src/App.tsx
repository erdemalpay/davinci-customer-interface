import { Coffee, MessageSquare, Swords, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Button } from "./components/Button";
import { FeedbackModal } from "./components/FeedbackModal";
import { GenericCard } from "./components/GenericCard";
import { LanguageToggle } from "./components/LanguageToggle";
import { useWebSocket } from "./hooks/useWebSocket";
import { ButtonCallTypeEnum, LocationEnum } from "./types";
import { useButtonCallMutations, useGetQueue } from "./utils/api/buttonCall";
import { useFeedbackMutations } from "./utils/api/feedback";
import { getOrdinal } from "./utils/ordinal";
import { decodeTableUrl } from "./utils/qrEncoding";
import logoUrl from "./assets/images/logo.png";

function App() {
  const { t, i18n } = useTranslation();
  useWebSocket();
  const { encodedTable } = useParams<{
    encodedTable: string;
  }>();

  const decodedData = encodedTable ? decodeTableUrl(encodedTable) : null;

  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const { createFeedback } = useFeedbackMutations();
  const { createButtonCall, closeButtonCallFromPanel } = useButtonCallMutations();
  const queue = useGetQueue(
    decodedData?.location ?? 0,
    decodedData?.tableName ?? ""
  );

  if (!encodedTable || !decodedData) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#F7F3ED" }}>
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "linear-gradient(45deg, #1F2937 25%, transparent 25%), linear-gradient(-45deg, #1F2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1F2937 75%), linear-gradient(-45deg, transparent 75%, #1F2937 75%)",
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
          }}
        />
        <div className="text-center relative z-10">
<h1 className="text-7xl md:text-9xl font-body font-bold text-davinci-black mb-6">404</h1>
          <p className="text-2xl md:text-4xl font-body text-davinci-black/70">
            {t("errors.invalidParameters")}
          </p>
        </div>
      </div>
    );
  }

  const location = decodedData.location;
  const tableName = decodedData.tableName;

  const getLocationName = (locationId: number): string => {
    switch (locationId) {
      case LocationEnum.BAHCELI:
        return "Bahçeli";
      case LocationEnum.NEORAMA:
        return "Neorama";
      default:
        return "";
    }
  };

  const locationName = getLocationName(Number(location));

  const handleGameMasterCall = () => {
    setActiveRequest("gamemaster");
    createButtonCall({
      location: Number(location),
      type: ButtonCallTypeEnum.GAMEMASTERCALL,
      tableName: tableName,
      hour: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
    setTimeout(() => setActiveRequest(null), 3000);
  };

  const handleServiceCall = () => {
    setActiveRequest("service");
    createButtonCall({
      location: Number(location),
      type: ButtonCallTypeEnum.ORDERCALL,
      tableName: tableName,
      hour: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
    setTimeout(() => setActiveRequest(null), 3000);
  };

  const handleCancelRequest = (type: "gamemaster" | "service") => {
    closeButtonCallFromPanel({
      location: Number(location),
      tableName: tableName,
      hour: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      type: type === "gamemaster"
        ? ButtonCallTypeEnum.GAMEMASTERCALL
        : ButtonCallTypeEnum.ORDERCALL,
    });
    setActiveRequest(null);
  };

  const handleMenuClick = () => {
    const menuUrl = `https://menu.davinciboardgame.com/${location}`;
    window.location.href = menuUrl;
  };

  const handleFeedbackSubmit = (feedback: string, rating: number) => {
    createFeedback({
      location: Number(location),
      tableName: tableName,
      starRating: rating,
      comment: feedback,
    });
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setShowFeedbackForm(false);
    }, 2000);
  };

  const gameMasterQueue = queue?.[ButtonCallTypeEnum.GAMEMASTERCALL];
  const serviceQueue = queue?.[ButtonCallTypeEnum.ORDERCALL];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: "#F7F3ED" }}>
      {/* Checkered background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            "linear-gradient(45deg, #1F2937 25%, transparent 25%), linear-gradient(-45deg, #1F2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1F2937 75%), linear-gradient(-45deg, transparent 75%, #1F2937 75%)",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
        }}
      />

      {/* Header */}
      <header
        className="relative z-50 w-full h-16 flex items-center px-4 lg:px-8"
        style={{
          background: "linear-gradient(180deg, #111827 0%, #1F2937 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <a href="https://davinciboardgame.com">
              <img
                src={logoUrl}
                alt="Da Vinci Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </a>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-white text-lg md:text-xl">
                Da Vinci
              </span>
              <span className="font-body text-white/75 text-xs md:text-sm tracking-[0.08em] uppercase">
                Board Game Cafe
              </span>
            </div>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center flex-1 p-3 md:p-6 md:justify-center">
        <div className="text-center mb-4 md:mb-12 mt-4 md:mt-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-body font-bold text-davinci-black mb-2 md:mb-4">
            {t("header.title")}
          </h1>
          <p className="text-base md:text-xl font-body text-davinci-black/70">
            {t("header.welcome", { locationName, tableName })}
          </p>
        </div>

        <div
          key={`${
            queue?.[ButtonCallTypeEnum.GAMEMASTERCALL]?.waitingCount ?? ""
          }-${queue?.[ButtonCallTypeEnum.ORDERCALL]?.waitingCount ?? ""}`}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full"
        >
          <GenericCard
            icon={Swords}
            title={t("gamemaster.title")}
            description={t("gamemaster.description")}
            mobileTitle={t("gamemaster.button")}
            mobileLoadingTitle={t("gamemaster.calling")}
            isLoading={activeRequest === "gamemaster"}
            showWalkingIcon={true}
            onMobileClick={handleGameMasterCall}
            showCancelButton={gameMasterQueue?.isQueued || false}
            onCancelClick={() => handleCancelRequest("gamemaster")}
            cancelButtonText={t("cancel")}
          >
            {gameMasterQueue?.isQueued && gameMasterQueue.position === 1 ? (
              <div className="mb-2 text-base font-body font-semibold text-white md:text-davinci-red animate-gentle-bounce">
                {t("queue.yourTurn")}
              </div>
            ) : gameMasterQueue?.waitingCount && gameMasterQueue.waitingCount > 0 ? (
              <div className="mb-2 text-base font-body font-semibold text-white/80 md:text-davinci-black-deep animate-gentle-bounce">
                {t("queue.waitingCount").replace(
                  "{{count}}",
                  i18n.language === "en"
                    ? getOrdinal(gameMasterQueue.waitingCount + 1)
                    : `${gameMasterQueue.waitingCount + 1}.`
                )}
              </div>
            ) : (
              <Button
                onClick={handleGameMasterCall}
                disabled={activeRequest === "gamemaster"}
                variant="primary"
                showWalkingIcon={activeRequest === "gamemaster"}
              >
                {activeRequest === "gamemaster"
                  ? t("gamemaster.calling")
                  : t("gamemaster.button")}
              </Button>
            )}
          </GenericCard>

          <GenericCard
            icon={Coffee}
            title={t("service.title")}
            description={t("service.description")}
            mobileTitle={t("service.button")}
            mobileLoadingTitle={t("service.calling")}
            isLoading={activeRequest === "service"}
            showWalkingIcon={true}
            onMobileClick={handleServiceCall}
            showCancelButton={serviceQueue?.isQueued || false}
            onCancelClick={() => handleCancelRequest("service")}
            cancelButtonText={t("cancel")}
          >
            {serviceQueue?.isQueued && serviceQueue.position === 1 ? (
              <div className="mb-2 text-base font-body font-semibold text-white md:text-davinci-red animate-gentle-bounce">
                {t("queue.yourTurn")}
              </div>
            ) : serviceQueue?.waitingCount && serviceQueue.waitingCount > 0 ? (
              <div className="mb-2 text-base font-body font-semibold text-white/80 md:text-davinci-black-deep animate-gentle-bounce">
                {t("queue.waitingCount").replace(
                  "{{count}}",
                  i18n.language === "en"
                    ? getOrdinal(serviceQueue.waitingCount + 1)
                    : `${serviceQueue.waitingCount + 1}.`
                )}
              </div>
            ) : (
              <Button
                onClick={handleServiceCall}
                disabled={activeRequest === "service"}
                variant="primary"
                showWalkingIcon={activeRequest === "service"}
              >
                {activeRequest === "service"
                  ? t("service.calling")
                  : t("service.button")}
              </Button>
            )}
          </GenericCard>

          <div className="col-span-1 md:col-span-1">
            <GenericCard
              icon={UtensilsCrossed}
              title={t("menu.title")}
              description={t("menu.description")}
              mobileTitle={t("menu.button")}
              onMobileClick={handleMenuClick}
            >
              <Button onClick={handleMenuClick} variant="primary">
                {t("menu.button")}
              </Button>
            </GenericCard>
          </div>

          <div className="col-span-1 md:col-span-1">
            <GenericCard
              icon={MessageSquare}
              title={t("feedback.title")}
              description={t("feedback.description")}
              mobileTitle={t("feedback.button")}
              onMobileClick={() => setShowFeedbackForm(true)}
              flipMobileIcon={true}
            >
              <Button onClick={() => setShowFeedbackForm(true)} variant="primary">
                {t("feedback.button")}
              </Button>
            </GenericCard>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
        onSubmit={handleFeedbackSubmit}
        isSuccess={feedbackSuccess}
      />
    </div>
  );
}

export default App;
