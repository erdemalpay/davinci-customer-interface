import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import {
  ButtonCallActionEnum,
  ButtonCallChangedPayload,
  ButtonCallTypeEnum,
} from "../types";
import { socketEventListeners } from "./socketConstant";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

const GESTURE_EVENTS = [
  "click",
  "pointerdown",
  "touchstart",
  "keydown",
] as const;

const SOUND_PATHS: Record<ButtonCallTypeEnum, string> = {
  [ButtonCallTypeEnum.GAMEMASTERCALL]: "/sounds/gameMasterCall.wav",
  [ButtonCallTypeEnum.TABLECALL]: "/sounds/gameMasterCall.wav",
  [ButtonCallTypeEnum.ORDERCALL]: "/sounds/orderCall.wav",
};

export function useWebSocket(soundLocation?: number) {
  const queryClient = useQueryClient();
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);

  const audiosRef = useRef<
    Partial<Record<ButtonCallTypeEnum, HTMLAudioElement>>
  >({});
  useEffect(() => {
    if (soundLocation === undefined) {
      return;
    }

    (Object.entries(SOUND_PATHS) as [ButtonCallTypeEnum, string][]).forEach(
      ([type, path]) => {
        audiosRef.current[type] = new Audio(path);
      }
    );

    const getAutoplayPolicy = (
      navigator as Navigator & {
        getAutoplayPolicy?: (type: string) => string;
      }
    ).getAutoplayPolicy;
    const autoplayPolicy = getAutoplayPolicy?.call(navigator, "mediaelement");
    if (autoplayPolicy && autoplayPolicy !== "allowed") {
      setIsAudioBlocked(true);
    }

    const handleFirstGesture = () => setIsAudioBlocked(false);
    GESTURE_EVENTS.forEach((evt) =>
      document.addEventListener(evt, handleFirstGesture, {
        once: true,
        passive: true,
      })
    );

    return () => {
      GESTURE_EVENTS.forEach((evt) =>
        document.removeEventListener(evt, handleFirstGesture)
      );
      audiosRef.current = {};
    };
  }, [soundLocation]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    let hasConnectedBefore = false;

    socket.on("connect", () => {
      console.log("Connected to WebSocket.");
      if (hasConnectedBefore) {
        queryClient.invalidateQueries();
      }
      hasConnectedBefore = true;
    });

    socketEventListeners.forEach((eventConfig) => {
      socket.on(eventConfig.event, () => {
        // Handle the event here if needed
        console.log(`Received event: ${eventConfig.event}`);
        eventConfig.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      });
    });

    socket.on("buttonCallChanged", (payload?: ButtonCallChangedPayload) => {
      if (soundLocation === undefined || !payload?.type) return;
      if (payload.action === ButtonCallActionEnum.CLOSE) return;
      if (payload.location !== soundLocation) return;

      const audio = audiosRef.current[payload.type];
      if (!audio) return;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsAudioBlocked(false))
        .catch((error) => {
          setIsAudioBlocked(error?.name === "NotAllowedError");
          console.error("Error playing sound:", error);
        });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, soundLocation]);

  return { isAudioBlocked };
}
