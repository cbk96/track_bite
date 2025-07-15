import type { FC, PropsWithChildren } from "react";

import { Link } from "react-router-dom";
export type TabMenuBarProps = {
  tabNames: string[];
  tabLinks: string[];
  currentTab: string;
};

export const TabMenuBar: FC<PropsWithChildren<TabMenuBarProps>> = ({
  tabNames,
  tabLinks,
  currentTab,
}) => {
  return (
    <div className="mx-3 lg:mx-0 mb-5 min-w-[320px] max-w-[1020px] bg-white rounded-lg border-2">
      <ul className="flex flex-wrap justify-start pl-5 font-bold text-center lg:pl-10">
        {tabNames.map((tabName, index) => (
          <li key={tabName} className="inline-block min-w-[150px] ">
            {tabName == currentTab ? (
              <span className="inline-block w-[80%] pt-[20px] pb-[14px] border-b-[6px] border-main box-content">
                {tabName}
              </span>
            ) : (
              <Link
                className="inline-block pt-[20px] pb-[14px]"
                to={tabLinks[index]}
              >
                {tabName}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
