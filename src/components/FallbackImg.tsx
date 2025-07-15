import { FC } from "react";
import * as CT from "../constants";

interface props {
  src: string | undefined;
  alt: string;
  className?: string;
  fallback?: string;
}

export const FallbackImg: FC<props> = ({
  src,
  alt,
  fallback = "defaultImg.jpg",
  className,
  ...rest
}) => {
  const fallBackSrc = CT.LOCAL_IMAGE_PATH + "/" + fallback;
  const srcError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallBackTarget = e.currentTarget;

    if (fallBackTarget.src === fallBackSrc) {
      fallBackTarget.onerror = null;
      return;
    }

    fallBackTarget.src = fallBackSrc;
  };
  return (
    <img
      src={src || fallBackSrc}
      alt={alt}
      onError={srcError}
      className={className}
      {...rest}
    />
  );
};
