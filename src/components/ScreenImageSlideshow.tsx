import { useEffect, useState } from "react";
import { ScreenImage } from "../types";

const SLIDE_DURATION = 10000;

type Props = {
  images: ScreenImage[];
};

export function ScreenImageSlideshow({ images }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % images.length),
      SLIDE_DURATION
    );
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  const image = images[index % images.length];

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
