import { useEffect, useRef, useState } from "react";
import { ScreenImage } from "../types";

const DEFAULT_DURATION_SECONDS = 10;

type Props = {
  images: ScreenImage[];
};

export function ScreenImageSlideshow({ images }: Props) {
  // Tracked by url, not index, so a reorder does not cut the current image short
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  // Falls back to the first image when nothing is shown yet or the current one was removed
  const image = images.find(({ url }) => url === currentUrl) ?? images[0];
  const imageUrl = image?.url;
  const imageDuration = image?.duration;
  const hasNextImage = images.length > 1;

  // Each image stays for its own duration; the next one is preloaded meanwhile.
  // The timer restarts only when the shown image or its duration changes.
  useEffect(() => {
    if (!imageUrl || !hasNextImage) return;

    const nextImageOf = (list: ScreenImage[]) =>
      list[(list.findIndex(({ url }) => url === imageUrl) + 1) % list.length];
    new Image().src = nextImageOf(imagesRef.current).url;
    const timeout = setTimeout(
      () => setCurrentUrl(nextImageOf(imagesRef.current).url),
      (imageDuration || DEFAULT_DURATION_SECONDS) * 1000
    );
    return () => clearTimeout(timeout);
  }, [imageUrl, imageDuration, hasNextImage]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src={image.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-50"
        />
        <img
          src={image.url}
          alt=""
          className="relative w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
