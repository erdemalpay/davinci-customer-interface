import { FaDice } from "react-icons/fa";
import { HiBellAlert, HiSpeakerXMark } from "react-icons/hi2";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useParams } from "react-router-dom";
import { ScreenImageSlideshow } from "../components/ScreenImageSlideshow";
import { useWebSocket } from "../hooks/useWebSocket";
import { ButtonCall, ButtonCallTypeEnum } from "../types";
import { useGetScreenImages } from "../utils/api/asset";
import { useGetActiveButtonCalls } from "../utils/api/buttonCall";
import logoUrl from "../assets/images/logo.png";

export default function ActiveButtonCallsPage() {
  const { location } = useParams<{ location: string }>();
  const selectedLocationId = Number(location);
  const { isAudioBlocked } = useWebSocket(selectedLocationId);

  const buttonCalls = useGetActiveButtonCalls(selectedLocationId);
  const screenImages = useGetScreenImages();

  const activeButtonCalls = buttonCalls?.reduce(
    (acc: { active: ButtonCall[] }, buttonCall: ButtonCall) => {
      if (
        buttonCall?.location == selectedLocationId &&
        !buttonCall?.finishHour
      ) {
        acc.active.push(buttonCall);
      }
      return acc;
    },
    { active: [] },
  ).active;

  const groupedCalls = {
    gameMasterAndTable: activeButtonCalls.filter(
      (call: ButtonCall) =>
        call.type === ButtonCallTypeEnum.GAMEMASTERCALL ||
        call.type === ButtonCallTypeEnum.TABLECALL,
    ),
    order: activeButtonCalls.filter(
      (call: ButtonCall) => call.type === ButtonCallTypeEnum.ORDERCALL,
    ),
  };

  function getBackgroundColor(type: ButtonCallTypeEnum) {
    switch (type) {
      case ButtonCallTypeEnum.TABLECALL:
        return "bg-green-500";
      case ButtonCallTypeEnum.GAMEMASTERCALL:
        return "bg-blue-500";
      case ButtonCallTypeEnum.ORDERCALL:
        return "bg-davinci-red";
      default:
        return "bg-green-500";
    }
  }

  function getIcon(type: ButtonCallTypeEnum) {
    switch (type) {
      case ButtonCallTypeEnum.TABLECALL:
        return <HiBellAlert className="text-6xl" />;
      case ButtonCallTypeEnum.GAMEMASTERCALL:
        return <FaDice className="text-6xl" />;
      case ButtonCallTypeEnum.ORDERCALL:
        return <MdOutlineRestaurantMenu className="text-6xl" />;
      default:
        return <HiBellAlert className="text-6xl" />;
    }
  }

  const totalCalls = activeButtonCalls.length;
  const getDynamicSizes = () => {
    if (totalCalls <= 6) {
      return { cardText: "text-8xl", cardPadding: "px-16 py-14", cardSize: "min-h-[180px] min-w-[220px]", iconSize: "text-7xl", gap: "gap-6", mbGroup: "mb-10" };
    } else if (totalCalls <= 12) {
      return { cardText: "text-7xl", cardPadding: "px-14 py-12", cardSize: "min-h-[160px] min-w-[190px]", iconSize: "text-6xl", gap: "gap-5", mbGroup: "mb-9" };
    } else if (totalCalls <= 18) {
      return { cardText: "text-6xl", cardPadding: "px-12 py-10", cardSize: "min-h-[140px] min-w-[160px]", iconSize: "text-5xl", gap: "gap-4", mbGroup: "mb-8" };
    } else {
      return { cardText: "text-5xl", cardPadding: "px-10 py-8", cardSize: "min-h-[120px] min-w-[140px]", iconSize: "text-4xl", gap: "gap-3", mbGroup: "mb-7" };
    }
  };

  const sizes = getDynamicSizes();

  const audioLockBadge = isAudioBlocked ? (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-davinci-black/80 px-6 py-4 text-white shadow-xl cursor-pointer">
      <HiSpeakerXMark className="text-3xl" />
      <span className="font-body text-xl font-semibold">
        Press Any Button To Enable Sound
      </span>
    </div>
  ) : null;

  const renderCallGroup = (calls: ButtonCall[], type: ButtonCallTypeEnum) => {
    if (calls.length === 0) return null;

    return (
      <div className={`flex items-center gap-8 ${sizes.mbGroup}`}>
        <div className={`text-davinci-black/50 flex-shrink-0 ${sizes.iconSize}`}>{getIcon(type)}</div>
        <div className={`flex flex-wrap ${sizes.gap}`}>
          {calls.map((buttonCall: ButtonCall) => (
            <div
              key={buttonCall._id}
              className={`${getBackgroundColor(buttonCall.type)} relative text-white ${sizes.cardPadding} rounded-3xl shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${sizes.cardSize}`}
              title={buttonCall.tableName}
            >
              <span className={`${sizes.cardText} font-bold`}>{buttonCall.tableName}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (activeButtonCalls.length === 0 && screenImages.length > 0) {
    return (
      <>
        <ScreenImageSlideshow images={screenImages} />
        {audioLockBadge}
      </>
    );
  }

  if (activeButtonCalls.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen relative overflow-hidden" style={{ backgroundColor: "#F7F3ED" }}>
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: "absolute", inset: 0, opacity: 0.07,
            backgroundImage: "linear-gradient(45deg, #1F2937 25%, transparent 25%), linear-gradient(-45deg, #1F2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1F2937 75%), linear-gradient(-45deg, transparent 75%, #1F2937 75%)",
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
          }}
        />
        <div className="text-center relative z-10">
          <HiBellAlert className="text-8xl text-davinci-gray-300 mx-auto mb-4" />
          <p className="text-3xl text-davinci-gray-500 font-body font-medium">No Active Button Calls</p>
        </div>
        {audioLockBadge}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: "#F7F3ED" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: "absolute", inset: 0, opacity: 0.07,
          backgroundImage: "linear-gradient(45deg, #1F2937 25%, transparent 25%), linear-gradient(-45deg, #1F2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1F2937 75%), linear-gradient(-45deg, transparent 75%, #1F2937 75%)",
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
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Da Vinci Logo" className="h-10 md:h-12 w-auto object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-white text-lg md:text-xl">Da Vinci</span>
            <span className="font-body text-white/75 text-xs md:text-sm tracking-[0.08em] uppercase">Board Game Cafe</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center p-10 relative z-10">
        <div className="max-w-full mx-auto w-full">
          <div className="flex flex-col gap-10">
            {groupedCalls.gameMasterAndTable.length > 0 &&
              renderCallGroup(groupedCalls.gameMasterAndTable, ButtonCallTypeEnum.GAMEMASTERCALL)}
            {groupedCalls.order.length > 0 &&
              renderCallGroup(groupedCalls.order, ButtonCallTypeEnum.ORDERCALL)}
          </div>
        </div>
      </div>

      {audioLockBadge}
    </div>
  );
}
