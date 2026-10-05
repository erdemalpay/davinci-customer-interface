import { MinimalGame } from "../../types";
import { Paths, useGetList } from "./factory";

export function useGetGamesMinimal() {
  return useGetList<MinimalGame>(`${Paths.Games}/minimal`);
}
