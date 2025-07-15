import { FC, PropsWithChildren } from "react";

interface PopupLayoutCustProps {
  title: string;
}

export const PopupLayoutCust: FC<PropsWithChildren<PopupLayoutCustProps>> = ({
  title,
  children,
}) => {
  return (
    <div className="fixed bottom-0 lg:bottom-auto lg:relative flex flex-col w-full lg:w-[600px] h-[600px] rounded-t-xl lg:rounded-xl overflow-hidden bg-[#f2f2f2]">
      <p className="text-center h-[57px] bg-white leading-[57px] font-bold text-[20px]">
        {title}
      </p>
      {children}
    </div>
  );
};
