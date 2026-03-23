import React, { useEffect, useState } from "react";
import ConfigHistory from "./configHistory";
import PlanHistory from "./planHistory";
const index = ({ stopLoading, startLoading }) => {
    const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="flex justify-between mb-2">
        <h2 id="step1" className="heading-big">History</h2>
        <div className='flex items-center'>
          <div className='relative mr-3'>
          </div>
          <div className='relative mr-3'>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center">
        <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap gap-4 pt-3 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 1
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
             Plan
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 2
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Config
              </a>
            </li>
          </ul>
          <div className="card relative flex flex-col break-words bg-white mb-6 rounded-lg">
            <div className="overflow-x-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                 <><PlanHistory /></>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <><ConfigHistory /></>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
        </div>
    </>
  );
};
export default index;
