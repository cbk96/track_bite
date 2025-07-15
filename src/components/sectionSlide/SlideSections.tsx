import { FC, PropsWithChildren, useRef } from "react";

interface SlideSectionsProps {
  slideSectionsRef: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  className?: string;
}

export const SlideSections: FC<PropsWithChildren<SlideSectionsProps>> = ({
  slideSectionsRef,
  index,
  children,
  className = "",
  ...rest
}) => {
  return (
    <div
      {...rest}
      ref={(el) => {
        slideSectionsRef.current[index] = el;
      }}
      className={`w-full ` + className}
    >
      {children}
    </div>
  );
};
