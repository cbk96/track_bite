import { FC } from "react";
import { Spinner, CircleNotch } from "phosphor-react";

interface LoadingSpinnerProps {
  isLoading: boolean;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  isLoading = false,
}) => {
  return isLoading ? (
    <div className="flex items-center justify-center absolute w-[200px] h-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-grayCustom z-[998]">
      <span className="animate-spinSlow">
        <CircleNotch color="#ffffff" size={100} />
      </span>
    </div>
  ) : (
    <></>
  );
};
