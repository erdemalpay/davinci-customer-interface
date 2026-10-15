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
  // Url of the image after the shown one, kept for when the shown one is removed
  const nextUrlRef = useRef<string | null>(null);

  let image = images.find(({ url }) => url === currentUrl);
  if (!image && currentUrl) {
    // The shown image was removed (e.g. its campaign ended): go on with the one
    // that was next, so the rotation does not start over
    image = images.find(({ url }) => url === nextUrlRef.current) ?? images[0];
    setCurrentUrl(image?.url ?? null);
  }
  // Nothing is shown yet
  image ??= images[0];
  const imageUrl = image?.url;
  const imageDuration = image?.duration;
  const hasNextImage = images.length > 1;

  // Each image stays for its own duration; the next one is preloaded meanwhile.
  // The timer restarts only when the shown image or its duration changes.
  useEffect(() => {
    if (!imageUrl || !hasNextImage) return;

    const nextImageOf = (list: ScreenImage[]) =>
      list[(list.findIndex(({ url }) => url === imageUrl) + 1) % list.length];
    nextUrlRef.current = nextImageOf(imagesRef.current).url;
    new Image().src = nextUrlRef.current;
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
