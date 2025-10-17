import { useTranslation } from "react-i18next";

export function ActiveTimeCard(): JSX.Element {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-dark-brown backdrop-blur-sm rounded-xl p-2 md:p-4 border border-dark-brown/50 shadow-lg">
      <p className="text-center text-light-brown font-merriweather text-xs md:text-base">
        {t('status.activeTime')}{" "}
        {new Date().toLocaleTimeString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
