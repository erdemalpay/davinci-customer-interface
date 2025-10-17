import { Coffee, MessageSquare, Swords } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ButtonCallTypeEnum } from "./types";
import { callHelp, createFeedback } from "./utils/apis";
import { Button } from "./components/Button";
import { GenericCard } from "./components/GenericCard";
import { FeedbackModal } from "./components/FeedbackModal";
import { LanguageToggle } from "./components/LanguageToggle";
//import { ActiveTimeCard } from "./components/ActiveTimeCard";

function App() {
  const { t } = useTranslation();
  const { location, tableName } = useParams<{
    location: string;
    tableName: string;
  }>();

  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (!location || !tableName) {
    return <div className="text-red-500">{t('errors.invalidParameters')}</div>;
  }
  const handleGameMasterCall = () => {
    setActiveRequest("gamemaster");
    callHelp({
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
    callHelp({
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

  return (
    <div className="min-h-screen bg-cream-bg relative overflow-hidden flex flex-col">
      {/* Header with Language Toggle */}
      <header className="relative z-50 flex justify-end items-center pt-4 pb-2 md:py-4 px-6">
        <LanguageToggle />
      </header>

      <div className="relative z-10 flex flex-col items-center flex-1 p-3 md:p-6">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12 mt-4 md:mt-0">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-germania text-dark-brown">
              {t('header.title')}
            </h1>
          </div>
          <p className="text-base md:text-xl font-merriweather text-dark-brown">
            {t('header.welcome', { tableName })}
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl w-full">
          {/* Game Master Call */}
          <GenericCard
            icon={Swords}
            iconColor="text-dark-brown"
            title={t('gamemaster.title')}
            description={t('gamemaster.description')}
            mobileTitle={t('gamemaster.button')}
            mobileLoadingTitle={t('gamemaster.calling')}
            isLoading={activeRequest === "gamemaster"}
            showWalkingIcon={true}
            onMobileClick={handleGameMasterCall}
          >
            <Button
              onClick={handleGameMasterCall}
              disabled={activeRequest === "gamemaster"}
              variant="primary"
              showWalkingIcon={activeRequest === "gamemaster"}
            >
              {activeRequest === "gamemaster" ? t('gamemaster.calling') : t('gamemaster.button')}
            </Button>
          </GenericCard>

          {/* Service Call */}
          <GenericCard
            icon={Coffee}
            iconColor="text-dark-brown"
            title={t('service.title')}
            description={t('service.description')}
            mobileTitle={t('service.button')}
            mobileLoadingTitle={t('service.calling')}
            isLoading={activeRequest === "service"}
            showWalkingIcon={true}
            onMobileClick={handleServiceCall}
          >
            <Button
              onClick={handleServiceCall}
              disabled={activeRequest === "service"}
              variant="primary"
              showWalkingIcon={activeRequest === "service"}
            >
              {activeRequest === "service" ? t('service.calling') : t('service.button')}
            </Button>
          </GenericCard>

          {/* Feedback */}
          <GenericCard
            icon={MessageSquare}
            iconColor="text-dark-brown"
            title={t('feedback.title')}
            description={t('feedback.description')}
            mobileTitle={t('feedback.button')}
            onMobileClick={() => setShowFeedbackForm(true)}
            flipMobileIcon={true}
          >
            <Button
              onClick={() => setShowFeedbackForm(true)}
              variant="primary"
            >
              {t('feedback.button')}
            </Button>
          </GenericCard>
        </div>
      </div>

      {/* Active Time - Fixed at bottom
      <div className="relative z-10 flex justify-center pb-4 md:pb-8 px-3 md:px-6">
        <ActiveTimeCard />
      </div>
      */}

      {/* Feedback Modal */}
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
