/* eslint-disable react-hooks/rules-of-hooks */
import {FloatingOnlySelectfield} from '@COMPONENTS/FloatingOnlySelectfield';
import ToolTip from '@COMPONENTS/ToolTip';
import {formatedDate} from '@HELPER/function';
import {getAllActivity} from '@WORKFORCE_MODULES/dashboard/api/get';
import React, {useEffect, useState} from 'react';
import {ImCross} from 'react-icons/im';
import {HiOutlineClipboardCheck} from 'react-icons/hi';
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { USER_AVTAR_URL } from '@HELPER/avtar';

const activity_Main_categories_grid = ({clickConfig, handleRemoveGrid, data, key}) => {
  const [activity, setActivity] = useState(null);
  const [activityCount, setActivityCount] = useState(0);
  const [sortTable, setSortTable] = useState({
    skip: 5,
    limit: 5,
    pageNo: 1,
  });
  const [selectedOption, setSelectedOption] = useState('');
  const activityList = [
    {text: 'Updated', value: 'Updated'},
    {text: 'Created', value: 'Created'},
    {text: 'Created/Updated', value: 'Created%2FUpdated'},
    {text: 'Viewed', value: 'Viewed'},
    {text: 'Deleted', value: 'Deleted'},
    {text: 'Searched', value: 'Searched'},
    {text: 'Filtered', value: 'Filtered'},
    {text: 'Login', value: 'Login'},
    {text: 'Registered', value: 'Registered'},
    {text: 'Verified', value: 'Verified'},
    {text: 'Update Password', value: 'UpdatedPassword'},
    {text: 'Reset Password', value: 'Reset%20Password'},
    {text: 'Selected', value: 'Selected'}, 
    {text: 'Restored', value: 'Restored'},
  ];

  const handleGetActivity = category => {
    getAllActivity('?category='+category).then(response => {
      if (response.data.body.status === 'success') {
        setActivity(response.data.body.data.activity);
        setActivityCount(response.data.body.data.totalActivityCount);
      } else {
        setActivity(null);
      }
    });
  };  

  useEffect(() => {
    handleGetActivity(activityList ? activityList[0].value : null);
  }, []);
  const handleGetlimitActivity = (condition = '?limit=' + sortTable.limit) => {
    getAllActivity(condition).then(response => {
      if (response.data.body.status === 'success') {
        setActivity(response.data.body.data.activity);
        setActivityCount(response.data.body.data.totalActivityCount);
      } else {
        setActivity(null);
      }
    });
  };
  useEffect(() => {
    handleGetlimitActivity('?limit=' + sortTable.limit);
  }, [sortTable.limit]);
  const handlePaginationGroupActivity = condition => {
    getAllActivity(condition).then(response => {
      if (response.data.body.status === 'success') {
        setActivity(response.data.body.data.activity);
      }
    });
  };

  return (
    <div className={clickConfig ? 'outline' : ''}>
      {clickConfig && (
        <div className="flex justify-between items-center mt-4 card p-4 w-full ">
          <div>
            <p className="project-details">{data.name}</p>
          </div>
          <div>
            <ImCross
              style={{color: 'red', cursor: 'pointer'}}
              onClick={event => {
                handleRemoveGrid(event, data, key);
              }}
            />
          </div>
        </div>
      )}
      <div className={clickConfig ? 'opacity-30 ' : 'mt-5'}>
        <div className="card p-7 w-full d-flex">
          <div className="block gap-4 justify-between md:flex flex-wrap">
            <div className="w-full rounded-lg">
              <div className="">
                <div className="flex justify-between items-center mt-4">
                  <div className="d-block">
                    <h3 className="heading-medium">Activity Categories</h3>
                    <div>
                      <p className="project-details flex items-center pl-0 pr-4">
                        <span className="mr-1">
                          <HiOutlineClipboardCheck />
                        </span>
                        Total Activity(s) — {activityCount ? activityCount : 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="wrapper relative">
                      {/* <SearchInput
                        onChange={handleSearchProject}
                        placeholder={'Search a project'}
                      /> */}
                      <div className="TaskManageLabel md:w-80 py-2">
                      <div className="flex items-center my-5 mx-10 ">
                          <p className="p-0 m-0 text-lightTextColor text-sm">
                            Show
                          </p>
                          <select
                            value={sortTable.limit}
                            onChange={event => {
                              setSortTable({
                                ...sortTable,
                                limit: event.target.value,
                              });
                            }}
                            className="border py-1  rounded-md outline-none w-15 h-8 text-base px-2 mx-1"
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                          </select>
                          <p className="p-0 m-0 text-lightTextColor text-sm">
                            Entries
                          </p>
                        </div>
                        <FloatingOnlySelectfield
                          label={''}
                          optionsGroup={activityList}
                          name={'activityList'}
                          value={selectedOption ?? ''}
                          onChange={event => {
                            setSelectedOption(event.target.value);
                            handleGetActivity(event.target.value);
                          }}
                        />
                        
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-5 overflow-x-auto relative shadow-md sm:rounded-lg"
                  role="alert"
                >
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center">Activity</div>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center">Category</div>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center">
                            Activity Creator
                          </div>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center">Created At</div>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="flex items-center">Updated At</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='max-h-[calc(100vh-250px)]'>
                    {!activity ||
                      (activity && activity.length === 0 && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <th
                            scope="row"
                            className="col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            No data
                          </th>
                        </tr>
                      ))}
                    {activity === null && (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th colSpan={2}
                          scope="row"
                          className="col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <TinnySpinner />
                          {/* No Activity Present */}
                        </th>
                      </tr>
                    )}
                   
                      {activity &&
                        activity.map(function (data, key) {
                          return (
                            <>
                              <tr
                                key={key}
                                className="bg-white border-b-0 dark:bg-gray-800 dark:border-gray-700"
                              >
                                <th
                                  scope="row"
                                  className="max-w-[250px] w-auto py-4 px-6 font-medium text-gray-900 dark:text-white"
                                >
                                  <span className="overflow-hidden text-ellipsis inline-block overflow-y-auto overflow-x-hidden max-h-[78px] whitespace-normal break-words w-full">
                                    {data.activity}
                                  </span>
                                </th>
                                <th
                                  scope="row"
                                  className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  {data.category}
                                </th>
                                <th
                                  scope="row"
                                  className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  <div className="flex mb-5 -space-x-4">
                                    <ToolTip
                                      className="relative w-[30px] h-[30px] bg-white shadow-md rounded-full"
                                      message={data.userDetails.name}
                                    >
                                      <img
                                        src={data.userDetails.profilePic ??
                                          USER_AVTAR_URL +
                                          data.userDetails.name +
                                          '.svg'
                                        }
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full"
                                        alt="user"
                                      />
                                    </ToolTip>
                                  </div>
                                </th>
                                <th
                                  scope="row"
                                  className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  {data.createdAt
                                    ? formatedDate(data.createdAt)
                                    : 'No Data'}
                                </th>

                                <th
                                  scope="row"
                                  className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  {formatedDate(data.updatedAt)}
                                </th>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                {activity && activity.length != 0 && (
                  <div className="flex justify-between items-center">
                    <p className="p-0 m-0 text-lightTextColor text-base sm:my-4 my-2">
                      Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                      {sortTable.limit * sortTable.pageNo < activityCount
                        ? sortTable.limit * sortTable.pageNo
                        : activityCount}{' '}
                      of {activityCount}
                    </p>

                    <div className="flex items-center ">
                      <button
                        disabled={sortTable.pageNo == 1}
                        onClick={() => {
                          setSortTable({
                            ...sortTable,
                            pageNo: sortTable.pageNo - 1,
                          });
                          handlePaginationGroupActivity(
                            '?skip=' + 0 + '&limit=' + sortTable.limit
                          );
                        }}
                        className="disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                      >
                        <MdKeyboardArrowLeft />
                      </button>
                      <div className="pages">
                        <p className="p-0 m-0 text-lightTextColor text-base sm:my-4 my-2">
                          Page <span>{sortTable.pageNo}</span>
                        </p>
                      </div>
                      <button
                        disabled={
                          sortTable.pageNo ===
                          Math.ceil(activityCount / sortTable.limit)
                        }
                        onClick={() => {
                          setSortTable({
                            ...sortTable,
                            pageNo: sortTable.pageNo + 1,
                            skip: sortTable.pageNo * sortTable.limit,
                          });
                          handlePaginationGroupActivity(
                            '?skip=' +
                              sortTable.skip +
                              '&limit=' +
                              sortTable.limit
                          );
                        }}
                        className="disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                      >
                        <MdKeyboardArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default activity_Main_categories_grid;
