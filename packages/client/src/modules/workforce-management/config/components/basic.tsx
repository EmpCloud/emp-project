import React, { useEffect, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import DropDown from '../../../../components/DropDown';
import { defaultBasic } from '../../../../configuration/basic';
import MemberModel from './memberModel';
function Basic() {
    useEffect(() => {
        // document.querySelector("body").classList.add("bodyBg");
    });
    // Dropdown
    const data = [
        { text: "Settings", value: 1 },
        { text: "Delete All", value: 2 },
    ];
    const roleOption = [
        { text: "Edit", value: 1 },
        { text: "Clone", value: 3 },
        { text: "Delete", value: 2 },
    ];
    const [openTab, setOpenTab] = React.useState(2);
    const [basicDetails, setBasicDetails] = useState(defaultBasic);
    return (
        <>
            <div className='font-inter'>
                <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                    <div className='font-bold mb-0 heading-big text-darkTextColor '>
                        Basic
                    </div>
                    <div className='flex items-center gap-5 sm:flex-nowrap flex-wrap'>
                        <button type="submit" className="small-button items-center py-2 flex h-9">
                            <div className='flex items-center'>
                                <p className='m-0 p-0'>Add</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='card'>
                    <div className='lg:flex items-center justify-between w-full mb-3'>
                        <div className='heading-medium mb-0 '></div>
                        <div className='flex items-center md:flex-nowrap flex-wrap gap-4'>
                            <form className='w-full'>
                                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
                                <div className="relative">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-lightTextColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <input type="search" id="default-search" className="block p-4 pl-10 w-full text-sm h-8 border-none outline-none rounded-full text-lightTextColor bg-veryveryLightGrey border-lightBlue  " placeholder="Search..." />
                                </div>
                            </form>
                            <div className='flex md:flex-none items-center justify-center'>
                                <div className='sm:text-3xl text-lightTextColor cursor-pointer transition-all hover:text-brandBlue duration-300'>
                                    <DropDown
                                        data={data}
                                        defaultValue={""}
                                        // onClick={handleSelectStatus}
                                        icon={<span className="text-2xl grey-link"><BiDotsVerticalRounded /></span>}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <>
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
                Productivity
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
                 Timesheet
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 3
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Screenshots
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 4
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                Web history
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 5
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(5);
                }}
                data-toggle="tab"
                href="#link5"
                role="tablist"
              >
                App history
              </a>
            </li>
             <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 6
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(6);
                }}
                data-toggle="tab"
                href="#link6"
                role="tablist"
              >
                Key strokes
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 7
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(7);
                }}
                data-toggle="tab"
                href="#link7"
                role="tablist"
              >
                Projects
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0">
              <a
                className={
                  "text-base font-bold py-3 block leading-normal " +
                  (openTab === 8
                    ? "text-darkBlue"
                    : "text-placeholderGrey")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(8);
                }}
                data-toggle="tab"
                href="#link8"
                role="tablist"
              >
                Tasks
              </a>
            </li>
          </ul>
          <div className="card relative flex flex-col break-words bg-white mb-6 rounded-lg">
            <div className="overflow-x-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                 <div>Productiity details</div>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <h4 className="font-bold text-darkTextColor text-xl">Timesheet</h4>
                   <table className="table-style min-w-[1050px] ">
                  <thead>
                   <tr>
                    <th className='w-[120px]'>Date</th>
                    <th className='w-[100px]'>Clock in</th>
                    <th className='w-[100px]'>Clock out</th>
                    <th className='w-[100px]'>Total hrs</th>
                    <th className='w-[100px]'>Office hrs</th>
                    <th className='w-[130px]'>Productive hrs</th>
                    <th className='w-[150px]'>Unproductive hrs</th>
                    <th className='w-[110px]'>Neutral hrs</th>
                    <th className='w-[100px]'>Ideal hrs</th>
                    <th className='w-[100px]'>Office hrs</th>
                    <th className='w-[130px]'>Productivity</th>
                   </tr>
                  </thead>
                  <tbody className="max-h-[calc(100vh-250px)]">
                   <tr>
                    <td className='w-[120px]'>
                      <span>08 Aug 2022</span>
                    </td>
                    <td className='w-[100px]'>10:04 am</td>
                    <td className='w-[100px]'>07:26 pm</td>
                    <td className='w-[100px]'>09:22 hr</td>
                    <td className='w-[100px]'>09:22 hr</td>
                    <td className='w-[130px]'>08:23 hr</td>
                    <td className='w-[150px]'>07:34 hr</td>
                    <td className='w-[110px]'>06:12 hr</td>
                    <td className='w-[100px]'>00:00 hr</td>
                    <td className='w-[100px]'>01:21 hrr</td>
                    <td className='w-[130px]'>
                      {/* progressbar */}
                      <span className=' text-defaultTextColor text-base'>85%</span>
                      <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                          <div className="bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </td>
                   </tr>
                   <tr>
                    <td className='w-[120px]'>
                      <span>08 Aug 2022</span>
                    </td>
                    <td className='w-[100px]'>10:04 am</td>
                    <td className='w-[100px]'>07:26 pm</td>
                    <td className='w-[100px]'>09:22 hr</td>
                    <td className='w-[100px]'>09:22 hr</td>
                    <td className='w-[130px]'>08:23 hr</td>
                    <td className='w-[150px]'>07:34 hr</td>
                    <td className='w-[110px]'>06:12 hr</td>
                    <td className='w-[100px]'>00:00 hr</td>
                    <td className='w-[100px]'>01:21 hrr</td>
                    <td className='w-[130px]'>
                      {/* progressbar */}
                      <span className=' text-defaultTextColor text-base'>85%</span>
                      <div className="w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey">
                          <div className="bg-brandBlue text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </td>
                   </tr>
                  </tbody>
                 </table>
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <div>Screenshots</div>
                </div>
                <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                  Web history details
                </div>
                <div className={openTab === 5 ? "block" : "hidden"} id="link5">
                  App history details
                </div>
                <div className={openTab === 6 ? "block" : "hidden"} id="link6">
                 Key strokes
                </div>
                <div className={openTab === 7 ? "block" : "hidden"} id="link7">
                  Key strokes details
                </div>
                <div className={openTab === 8 ? "block" : "hidden"} id="link8">
                  Tasks details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
                </div>
            </div>
        </>
    )
}
export default Basic;