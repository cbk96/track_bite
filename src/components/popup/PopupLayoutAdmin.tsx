import { FC, PropsWithChildren } from "react";

interface PopupLayoutAdminProps {
  title: string;
}

export const PopupLayoutAdmin: FC<PropsWithChildren<PopupLayoutAdminProps>> = ({
  title,
  children,
}) => {
  return (
    <div className="fixed bottom-0 lg:bottom-auto lg:relative flex flex-col w-full lg:w-[600px] h-[600px] rounded-t-xl lg:rounded-xl bg-[#f2f2f2] overflow-hidden">
      <p className="text-center h-[57px] bg-main leading-[57px] font-bold text-white text-[20px]">
        {title}
      </p>
      {children}
    </div>
  );
};
