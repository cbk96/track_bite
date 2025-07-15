import { FC } from "react";
import { PropsWithChildren } from "react";
import { MobileSideBar, SideBar } from "../../components";

interface props {
  className?: string;
}

export const AdminMain: FC<PropsWithChildren<props>> = ({
  children,
  className,
}) => {
  return (
    <>
      <div
        className={`w-full bg-[#f2f2f2] min-w-[320px] min-h-[1000px] flex flex-col ${className}`}
      >
        <div className="flex items-start relative w-full mx-auto pt-5 max-w-[1300px] flex-grow">
          <SideBar />
          <MobileSideBar />
          <div className="w-full lg:w-[1020px]">{children}</div>
        </div>
      </div>
    </>
  );
};
