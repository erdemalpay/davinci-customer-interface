import { FaDice } from "react-icons/fa";
import { HiBellAlert } from "react-icons/hi2";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { ButtonCall, ButtonCallTypeEnum } from "../types";
import { useGetActiveButtonCalls } from "../utils/api/buttonCall";
import logoUrl from "../assets/images/logo.png";

export default function ActiveButtonCallsPage() {
  useWebSocket();
  const { location } = useParams<{ location: string }>();
  const selectedLocationId = Number(location);

  const buttonCalls = useGetActiveButtonCalls(selectedLocationId);

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

  // Group calls by type
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
        return "bg-green-500 ";
      case ButtonCallTypeEnum.GAMEMASTERCALL:
        return "bg-blue-500 ";
      case ButtonCallTypeEnum.ORDERCALL:
        return "bg-orange-500 ";
      default:
        return "bg-green-500 ";
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

  // Dinamik boyut hesaplama
  const totalCalls = activeButtonCalls.length;
  const getDynamicSizes = () => {
    if (totalCalls <= 6) {
      return {
        cardText: "text-8xl",
        cardPadding: "px-16 py-14",
        cardSize: "min-h-[180px] min-w-[220px]",
        iconSize: "text-7xl",
        gap: "gap-6",
        mbGroup: "mb-10",
      };
    } else if (totalCalls <= 12) {
      return {
        cardText: "text-7xl",
        cardPadding: "px-14 py-12",
        cardSize: "min-h-[160px] min-w-[190px]",
        iconSize: "text-6xl",
        gap: "gap-5",
        mbGroup: "mb-9",
      };
    } else if (totalCalls <= 18) {
      return {
        cardText: "text-6xl",
        cardPadding: "px-12 py-10",
        cardSize: "min-h-[140px] min-w-[160px]",
        iconSize: "text-5xl",
        gap: "gap-4",
        mbGroup: "mb-8",
      };
    } else {
      return {
        cardText: "text-5xl",
        cardPadding: "px-10 py-8",
        cardSize: "min-h-[120px] min-w-[140px]",
        iconSize: "text-4xl",
        gap: "gap-3",
        mbGroup: "mb-7",
      };
    }
  };

  const sizes = getDynamicSizes();

  const renderCallGroup = (calls: ButtonCall[], type: ButtonCallTypeEnum) => {
    if (calls.length === 0) return null;

    return (
      <div className={`flex items-center gap-8 ${sizes.mbGroup}`}>
        <div className={`text-gray-700 flex-shrink-0 ${sizes.iconSize}`}>{getIcon(type)}</div>

        <div className={`flex flex-wrap ${sizes.gap}`}>
          {calls.map((buttonCall: ButtonCall) => (
            <div
              key={buttonCall._id}
              className={`${getBackgroundColor(
                buttonCall.type,
              )} relative group text-white ${sizes.cardPadding} rounded-3xl shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer ${sizes.cardSize}`}
              title={buttonCall.tableName}
            >
              <span className={`${sizes.cardText} font-bold`}>{buttonCall.tableName}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (activeButtonCalls.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream-bg relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url('${logoUrl}')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px auto',
            filter: 'grayscale(1) brightness(0.5)',
          }}
        />
        <div className="text-center relative z-10">
          <HiBellAlert className="text-8xl text-gray-300 mx-auto mb-4" />
          <p className="text-3xl text-gray-400 font-medium">No Active Button Calls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-bg relative overflow-hidden flex items-center justify-center p-10">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url('${logoUrl}')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px auto',
          filter: 'grayscale(1) brightness(0.5)',
        }}
      />
      <div className="max-w-full mx-auto relative z-10">
        <div className="flex flex-col gap-10">
          {groupedCalls.gameMasterAndTable.length > 0 &&
            renderCallGroup(
              groupedCalls.gameMasterAndTable,
              ButtonCallTypeEnum.GAMEMASTERCALL,
            )}

          {groupedCalls.order.length > 0 &&
            renderCallGroup(groupedCalls.order, ButtonCallTypeEnum.ORDERCALL)}
        </div>
      </div>
    </div>
  );
}
