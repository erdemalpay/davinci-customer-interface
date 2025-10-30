import { Coffee, MessageSquare, Swords } from "lucide-react";
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

function App() {
  const { t } = useTranslation();
  useWebSocket();
  const { location, tableName } = useParams<{
    location: string;
    tableName: string;
  }>();

  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const { createFeedback } = useFeedbackMutations();
  const { createButtonCall, closeButtonCallFromPanel } = useButtonCallMutations();
  const queue = useGetQueue(Number(location), tableName ?? "");

  if (!location || !tableName) {
    return <div className="text-red-500">{t("errors.invalidParameters")}</div>;
  }

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

  const gmQueue = queue?.[ButtonCallTypeEnum.GAMEMASTERCALL];
  const svcQueue = queue?.[ButtonCallTypeEnum.ORDERCALL];

  return (
    <div className="min-h-screen bg-cream-bg relative overflow-hidden flex flex-col">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url('/src/assets/images/logo.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px auto',
          filter: 'grayscale(1) brightness(0.5)',
        }}
      />

      <header className="relative z-50 flex justify-end items-center pt-4 pb-2 md:py-4 px-6">
        <LanguageToggle />
      </header>

      <div className="relative z-10 flex flex-col items-center flex-1 p-3 md:p-6 md:justify-center">
        <div className="text-center mb-4 md:mb-12 mt-4 md:mt-0">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-germania text-dark-brown">
              {t("header.title")}
            </h1>
          </div>
          <p className="text-base md:text-xl font-merriweather text-dark-brown">
            {t("header.welcome", { locationName, tableName })}
          </p>
        </div>

        <div
          key={`${
            queue?.[ButtonCallTypeEnum.GAMEMASTERCALL]?.waitingCount ?? ""
          }-${queue?.[ButtonCallTypeEnum.ORDERCALL]?.waitingCount ?? ""}`}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl w-full"
        >
          <GenericCard
            icon={Swords}
            iconColor="text-dark-brown"
            title={t("gamemaster.title")}
            description={t("gamemaster.description")}
            mobileTitle={t("gamemaster.button")}
            mobileLoadingTitle={t("gamemaster.calling")}
            isLoading={activeRequest === "gamemaster"}
            showWalkingIcon={true}
            onMobileClick={handleGameMasterCall}
            showCancelButton={gmQueue?.isQueued || false}
            onCancelClick={() => handleCancelRequest("gamemaster")}
            cancelButtonText={t("cancel")}
          >
            {gmQueue?.isQueued && gmQueue.position === 1 ? (
              <div className="mb-2 text-base md:text-base font-merriweather text-light-brown animate-gentle-bounce">
                {t("queue.yourTurn")}
              </div>
            ) : gmQueue?.waitingCount && gmQueue.waitingCount > 0 ? (
              <div className="mb-2 text-base md:text-base font-merriweather text-light-brown/90 animate-gentle-bounce">
                {t("queue.waitingCount", {
                  count: gmQueue.waitingCount,
                })}
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
            iconColor="text-dark-brown"
            title={t("service.title")}
            description={t("service.description")}
            mobileTitle={t("service.button")}
            mobileLoadingTitle={t("service.calling")}
            isLoading={activeRequest === "service"}
            showWalkingIcon={true}
            onMobileClick={handleServiceCall}
            showCancelButton={svcQueue?.isQueued || false}
            onCancelClick={() => handleCancelRequest("service")}
            cancelButtonText={t("cancel")}
          >
            {svcQueue?.isQueued && svcQueue.position === 1 ? (
              <div className="mb-2 text-base md:text-base font-merriweather text-light-brown animate-gentle-bounce">
                {t("queue.yourTurn")}
              </div>
            ) : svcQueue?.waitingCount && svcQueue.waitingCount > 0 ? (
              <div className="mb-2 text-base md:text-base font-merriweather text-light-brown/90 animate-gentle-bounce">
                {t("queue.waitingCount", {
                  count: svcQueue.waitingCount,
                })}
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

          <GenericCard
            icon={MessageSquare}
            iconColor="text-dark-brown"
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
