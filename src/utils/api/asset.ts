import { ScreenImage } from "../../types";
import { Paths, useGetList } from "./factory";

// Campaign images follow their popup's day, so refetch now and then for day changes
const SCREEN_IMAGES_REFETCH_INTERVAL = 30 * 60 * 1000;

export function useGetScreenImages(location: number) {
  return useGetList<ScreenImage>(
    `${Paths.Asset}/screen-images?location=${location}`,
    [Paths.Asset, "screen-images", location],
    false,
    SCREEN_IMAGES_REFETCH_INTERVAL
  );
}
