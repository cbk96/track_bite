import { FC } from "react";
import { PropsWithChildren } from "react";

export const CustomerMain: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="w-full bg-[#f2f2f2] min-w-[320px] min-h-[200px] flex flex-col">
        <div className="relative mx-auto max-w-screen-sm w-full lg:w-[1020px] lg:max-w-[1020px] mb-5 flex-grow">
          {children}
        </div>
      </div>
    </>
  );
};
