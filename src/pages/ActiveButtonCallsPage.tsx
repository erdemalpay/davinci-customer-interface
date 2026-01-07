import { useEffect, useState } from "react";
import { FaDice } from "react-icons/fa";
import { HiBellAlert } from "react-icons/hi2";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../hooks/useWebSocket";
import { ButtonCall, ButtonCallType, ButtonCallTypeEnum } from "../types";
import {
  useFinishButtonCallMutation,
  useGetActiveButtonCalls,
} from "../utils/api/buttonCall";

export default function ActiveButtonCallsPage() {
  useWebSocket();
  const { location } = useParams<{ location: string }>();
  const selectedLocationId = Number(location);
  const { mutate: finishButtonCall } =
    useFinishButtonCallMutation(selectedLocationId);
  const buttonCalls = useGetActiveButtonCalls(
    selectedLocationId,
    ButtonCallType.ACTIVE
  );

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
    { active: [] }
  ).active;

  // Group calls by type
  const groupedCalls = {
    gameMasterAndTable: activeButtonCalls.filter(
      (call: ButtonCall) =>
        call.type === ButtonCallTypeEnum.GAMEMASTERCALL ||
        call.type === ButtonCallTypeEnum.TABLECALL
    ),
    order: activeButtonCalls.filter(
      (call: ButtonCall) => call.type === ButtonCallTypeEnum.ORDERCALL
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

  function handleChipClose(buttonCallId: string, buttonCallType: string) {
    const buttonCall = buttonCalls?.find(
      (buttonCallItem: ButtonCall) =>
        buttonCallItem.tableName == buttonCallId &&
        buttonCallItem.type == buttonCallType
    );
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("tr-TR", { hour12: false });

    if (buttonCall)
      finishButtonCall({
        location: selectedLocationId,
        tableName: buttonCall.tableName,
        hour: formattedTime,
        type: buttonCall.type,
      });
  }

  const [timeAgo, setTimeAgo] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(() => {
        const newTimes: { [key: string]: string } = {};
        activeButtonCalls.forEach((buttonCall: ButtonCall) => {
          const diffInSeconds = getElapsedSeconds(buttonCall.startHour);
          newTimes[buttonCall.tableName] = formatTimeAgo(diffInSeconds);
        });
        return newTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeButtonCalls]);

  const getElapsedSeconds = (startHour: string): number => {
    const timeParts = startHour.split(":").map(Number);
    if (timeParts.length !== 3 || timeParts.some(isNaN)) return 0;

    const [hours, minutes, seconds] = timeParts;
    const startTime = new Date();
    startTime.setHours(hours, minutes, seconds, 0);

    const now = new Date();
    return Math.floor((now.getTime() - startTime.getTime()) / 1000);
  };

  const formatTimeAgo = (seconds: number): string => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;
  };

  const renderCallGroup = (calls: ButtonCall[], type: ButtonCallTypeEnum) => {
    if (calls.length === 0) return null;

    return (
      <div className="flex items-center gap-10 mb-12">
        <div className="text-gray-700 flex-shrink-0">{getIcon(type)}</div>

        <div className="flex flex-wrap gap-6">
          {calls.map((buttonCall: ButtonCall) => (
            <div
              key={buttonCall.tableName}
              className={`${getBackgroundColor(
                buttonCall.type
              )} relative group text-white px-12 py-10 rounded-3xl shadow-xl transition-all duration-200 flex items-center gap-6 cursor-pointer min-h-[140px]`}
              title={`${buttonCall.tableName} - ${
                timeAgo[buttonCall.tableName] || "00:00"
              }`}
            >
              {/* Table Name */}
              <span className="text-6xl font-bold whitespace-nowrap">
                {buttonCall.tableName}
              </span>

              {/* Timer */}
              <span className="text-5xl font-mono opacity-90 whitespace-nowrap">
                {timeAgo[buttonCall.tableName] || "00:00"}
              </span>

              {/* Close Button */}
              <button
                onClick={() =>
                  handleChipClose(buttonCall.tableName, buttonCall.type)
                }
                className="ml-3 w-14 h-14 bg-white/20 hover:bg-white/40 active:bg-white/60 rounded-full flex items-center justify-center text-white text-3xl transition-all duration-200 touch-manipulation"
                aria-label="Close call"
              >
                ✕
              </button>
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
              ButtonCallTypeEnum.GAMEMASTERCALL
            )}

          {groupedCalls.order.length > 0 &&
            renderCallGroup(groupedCalls.order, ButtonCallTypeEnum.ORDERCALL)}
        </div>
      </div>
    </div>
  );
}
