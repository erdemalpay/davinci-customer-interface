import { FaDice } from "react-icons/fa";
import { HiBellAlert } from "react-icons/hi2";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { ButtonCall, ButtonCallTypeEnum } from "../types";
import { useGetActiveButtonCalls } from "../utils/api/buttonCall";

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
        return "bg-green-500 hover:bg-green-600";
      case ButtonCallTypeEnum.GAMEMASTERCALL:
        return "bg-blue-500 hover:bg-blue-600";
      case ButtonCallTypeEnum.ORDERCALL:
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-green-500 hover:bg-green-600";
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

  const renderCallGroup = (calls: ButtonCall[], type: ButtonCallTypeEnum) => {
    if (calls.length === 0) return null;

    return (
      <div className="flex items-center gap-10 mb-12">
        <div className="text-gray-700 flex-shrink-0">{getIcon(type)}</div>

        <div className="flex flex-wrap gap-6">
          {calls.map((buttonCall: ButtonCall) => (
            <div
              key={buttonCall._id}
              className={`${getBackgroundColor(
                buttonCall.type,
              )} relative group text-white px-16 py-14 rounded-3xl shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer min-h-[180px] min-w-[200px]`}
              title={buttonCall.tableName}
            >
              <span className="text-7xl font-bold">{buttonCall.tableName}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (activeButtonCalls.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <HiBellAlert className="text-8xl text-gray-300 mx-auto mb-4" />
          <p className="text-3xl text-gray-400 font-medium">No Active Calls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col gap-12">
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
