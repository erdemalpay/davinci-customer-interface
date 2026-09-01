import { ScreenImage } from "../../types";
import { Paths, useGetList } from "./factory";

export function useGetScreenImages() {
  return useGetList<ScreenImage>(`${Paths.Asset}/screen-images`, [
    Paths.Asset,
    "screen-images",
  ]);
}
