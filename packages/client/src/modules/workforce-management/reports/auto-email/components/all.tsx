import React from "react";

import editIcon from "public/imgs/ri_edit.png";
import deleteIcon from "public/imgs/delete-icn.png";

import AutoEmailReportModal from "./autoEmailReportModal";

import Image from "next/image";

const all = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="flex items-center justify-between my-2 mb-2 -mt-4 flex-wrap font-inter">
        <div className="heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1">
          Auto Email Report
        </div>
        <div className="flex items-center">
          <div className="relative mr-3">
            <button className="small-button items-center py-2 flex h-8">
              <div className="flex items-center">
                <p className="m-0 p-0">Create new report</p>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="flex justify-start items-start lg:justify-between lg:items-center flex-col lg:flex-row gap-5">
          <div className="flex items-center">
            <p className="p-0 m-0 text-lightTextColor text-base">Show</p>
            <select className="border py-1  rounded-md outline-none w-15 h-6 text-sm px-2 mx-1">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
            <p className="p-0 m-0 text-lightTextColor text-base">Entries</p>
          </div>
          <div className="wrapper relative rounded-search flex gap-2 items-center">
            <div className=" text-placeholderGrey">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              className={`text-base placeholder:text-base outline-none bg-transparent md:w-80`}
              type="text"
              placeholder="Search by title or recipients..."
            />
          </div>
        </div>
        <div className="mt-2 overflow-x-scroll relative shadow-md sm:rounded-lg 2xl:max-h-[650px] xl:max-h-[480px] lg:max-h-[400px]">
          <table className="table-style w-full">
            <thead className="!border-b-0 sticky top-0 z-40">
              <tr className="text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400">
                <th className="cursor-pointer w-[150px]">
                  <div className="flex items-center justify-start">
                    <div>Name</div>
                    <button>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        className="cursor-pointer ml-1"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="cursor-pointer w-[150px]">
                  <div className="flex items-center justify-start">
                    <div>Email</div>
                    <button>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        className="cursor-pointer ml-1"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="cursor-pointer w-[150px]">
                  <div className="flex items-center justify-center">
                    <div>Project Count</div>
                    <button>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        className="cursor-pointer ml-1"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="cursor-pointer w-[150px]">
                  <div className="flex items-center justify-center">
                    <div>Task Count</div>
                    <button>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        className="cursor-pointer ml-1"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="cursor-pointer w-[150px]">
                  <div className="flex items-center justify-center">
                    <div>Assign Role</div>
                    <button>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 448 512"
                        className="cursor-pointer ml-1"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
                      </svg>
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="">
              <tr>
                <td className="font-bold">Harish test</td>
                <td>Daily</td>
                <td>harishc@globussoft.in</td>
                <td>
                  Productivity   Timesheets   Application Usage   Website Usage
                   
                </td>
                <td>
                  <span className="flex justify-center items-center gap-5">
                    <Image
                      className="cursor-pointer"
                      src={editIcon}
                      alt="edit"
                      height={20}
                      width={20}
                      onClick={openModal}
                    />
                    <Image
                      className="cursor-pointer"
                      src={deleteIcon}
                      alt="edit"
                      height={20}
                      width={20}
                    />
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Harish test</td>
                <td>Daily</td>
                <td>harishc@globussoft.in</td>
                <td>
                  Productivity   Timesheets   Application Usage   Website Usage
                   
                </td>
                <td>
                  <span className="flex justify-center items-center gap-5">
                    <Image
                      className="cursor-pointer"
                      src={editIcon}
                      alt="edit"
                      height={20}
                      width={20}
                      onClick={openModal}
                    />
                    <Image
                      className="cursor-pointer"
                      src={deleteIcon}
                      alt="edit"
                      height={20}
                      width={20}
                    />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <AutoEmailReportModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
    </>
  );
};

export default all;
