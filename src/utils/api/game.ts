import { MinimalGame } from "../../types";
import { post } from ".";
import { Paths, useGetList } from "./factory";

export function useGetGamesMinimal() {
  return useGetList<MinimalGame>(`${Paths.Games}/minimal`);
}

export enum GameAvailabilityStatus {
  AVAILABLE = "available",
  BUSY = "busy",
  LATER = "later",
  UNAVAILABLE = "unavailable",
}

export interface GameAvailability {
  status: GameAvailabilityStatus;
  availableFrom?: string;
}

// Whether someone who knows the game can explain it now. The API records
// the request when nobody can.
export function checkGameAvailability(payload: {
  location: number;
  tableName: string;
  game: number;
}) {
  return post<typeof payload, GameAvailability>({
    path: `${Paths.ButtonCalls}/game-availability`,
    payload,
  });
}
