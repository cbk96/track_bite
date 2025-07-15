import { FC, PropsWithChildren } from "react";
import { CircleNotch } from "phosphor-react";

interface props {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  isFetching?: boolean;
  className?: string;
}

export const FetchButton: FC<PropsWithChildren<props>> = ({
  type = "button",
  onClick,
  isFetching,
  className,
  children,
}) => {
  return (
    <button
      type={type}
      disabled={isFetching}
      className={className}
      onClick={onClick}
    >
      {isFetching ? (
        <CircleNotch
          size={25}
          className="inline-block w-full text-center animate-spinSlow"
        />
      ) : (
        children
      )}
    </button>
  );
};
