/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate } from '@HELPER/function';
import { getAllSubTask, searchSubTask, searchTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const subtask_grid_small = ({ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, subtaskCount }) => {
    const [subtaskDetails, setSubtaskDetails] = useState(null);
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });

    useEffect(() => {
        handleGetAllSubtask('?limit=' + sortTable.limit);
    }, [sortTable.limit]);

    const handleGetAllSubtask = (condition = '?limit=' + sortTable.limit) => {
        getAllSubTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setSubtaskDetails(response.data?.body.data.subTasks);
            }
        });
    };

    const handleSearchSubTask = event => {
        searchSubTask('keyword=' + event.target.value + '&limit=' + sortTable.limit).then(response => {
            if (response.data.body.status === 'success') {
                setSubtaskDetails(response.data?.body.data);
            }
        });
    };
   
    const handlePaginationSubTasks = condition => {
        searchSubTask(condition).then(response => {
            if (response.data.body.status === 'success') {
                setSubtaskDetails(response.data.body.data);
            }
        });
    };
    useEffect(() => {}, [subtaskDetails]);
    return (
        <>
            <div className={clickConfig ? 'outline' : ''}>
                {clickConfig && (
                    <div className='flex justify-between items-center mt-4 card p-4 w-full '>
                        <div>
                            <p className='project-details'>{data.name}</p>
                        </div>
                        <div>
                            <ImCross
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={event => {
                                    handleRemoveGrid(event, data, key);
                                }}
                            />
                        </div>
                    </div>
                )}
                <div className={clickConfig ? 'opacity-30 ' : 'mt-5'}>
                    <div className='card p-7 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium'>Subtask small</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-sm'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value });
                                    }}
                                    className='border py-1  rounded-md outline-none w-15 h-8 text-[15px] px-2 mx-1'>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={25}>25</option>
                                </select>
                                <p className='p-0 m-0 text-lightTextColor text-[15px]'>Entries</p>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    className='flex ml-3'
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center pl-0 pr-4'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    Total Subtask(s) — {subtaskCount ? subtaskCount : 0}
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchSubTask} placeholder={'Search a task'} />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
                                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                    <thead className='text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                        <tr>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Subtask Title </div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Due date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='whitespace-nowrap text-ellipsis w-full  overflow-hidden block max-w-[117px]'>Assigned to</div>
                                            </th>

                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Status</div>
                                            </th>

                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Priority</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    {subtaskDetails && subtaskDetails.length === 0 && (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th
                                          colSpan={10}
                                          scope="row"
                                          className="col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                          No data
                                        </th>
                                      </tr>
                                    )}
                                    {!subtaskDetails && (
                                        <tr>
                                            <th colSpan={10}>
                                                <TinnySpinner />
                                            </th>
                                        </tr>
                                    )}
                                    <tbody>
                                        {subtaskDetails &&
                                            subtaskDetails.map(function (data) {
                                                return (
                                                    <>
                                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {data.subTaskTitle}
                                                            </th>

                                                            {/* <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={data.subTaskCreator.firstName}>
                                                                    <img
                                                                        src={data.subTaskCreator.profilePic}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='-'
                                                                    />
                                                                </ToolTip>
                                                            </th> */}
                                                            <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {formatedDate(data.dueDate)}
                                                            </th>
                                                            <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className='flex -space-x-4'>
                                                                    {filterMembers(data.subTaskAssignedTo).length == 0 && <>Not Assigned</>}

                                                                    {filterMembers(data.subTaskAssignedTo).length > 2 ? (
                                                                        <ToolTip
                                                                            message={
                                                                                data.subTaskAssignedTo != null
                                                                                    ? data.subTaskAssignedTo.map(function (d) {
                                                                                          return d.firstName + ' ' + d.lastName;
                                                                                      })
                                                                                    : ''
                                                                            }>
                                                                            <div className='flex -space-x-4'>
                                                                                <img
                                                                                    className='w-10 h-10 border-2 border-white rounded-full dark:border-gray-800'
                                                                                    src='https://avatars.dicebear.com/api/bottts/ydhd.svg'
                                                                                    alt=''
                                                                                />
                                                                                <img
                                                                                    className='w-10 h-10 border-2 border-white rounded-full dark:border-gray-800'
                                                                                    src='https://avatars.dicebear.com/api/bottts/fhfhd.svg'
                                                                                    alt=''
                                                                                />
                                                                                <a
                                                                                    className='flex items-center justify-center w-10 h-10 text-base font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800'
                                                                                    href='#'>
                                                                                    {'+' + (filterMembers(data.subTaskAssignedTo).length - 2)}
                                                                                </a>
                                                                            </div>
                                                                        </ToolTip>
                                                                    ) : (
                                                                        filterMembers(data.subTaskAssignedTo).map(function (d1) {
                                                                            return d1 ? (
                                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName}>
                                                                                    <img
                                                                                        src={d1.profilePic ?? USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </ToolTip>
                                                                            ) : (
                                                                                ' '
                                                                            );
                                                                        })
                                                                    )}
                                                                </div>
                                                            </th>
                                                            {/* <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {data.subTaskType}
                                                            </th> */}
                                                            {/* <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {data.subTaskCategory}
                                                            </th> */}
                                                            {/* <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {data.subTaskStageName}
                                                            </th> */}
                                                            <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {data.subTaskStatus}
                                                            </th>
                                                            <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <b>
                                                                    {data.priority === 'High' ? (
                                                                        <ToolTip message={data.priority}>
                                                                            <p className='priority-with-bg text-priority1Color bg-priority1bg'>{data.priority}</p>
                                                                        </ToolTip>
                                                                    ) : data.priority === 'Medium' ? (
                                                                        <ToolTip message={data.priority}>
                                                                            <p className='priority-with-bg text-priority2Color bg-priority2bg'>{data.priority}</p>
                                                                        </ToolTip>
                                                                    ) : (
                                                                        <ToolTip message={data.priority}>
                                                                            <p className='priority-with-bg text-priority3Color bg-priority3bg'>{data.priority}</p>
                                                                        </ToolTip>
                                                                    )}
                                                                </b>
                                                            </th>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            {subtaskDetails && subtaskDetails.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                        {sortTable.limit * sortTable.pageNo < subtaskCount ? sortTable.limit * sortTable.pageNo : subtaskCount} of {subtaskCount}{' '}
                                    </p>
                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                                handlePaginationSubTasks('skip=' + 0 + '&limit=' + sortTable.limit);
                                            }}
                                            className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                            <MdKeyboardArrowLeft />
                                        </button>
                                        <div className='pages'>
                                            <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                                Page <span>{sortTable.pageNo}</span>
                                            </p>
                                        </div>
                                        <button
                                            disabled={sortTable.pageNo === Math.ceil(subtaskCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                                handlePaginationSubTasks('skip=' + sortTable.skip + '&limit=' + sortTable.limit);
                                            }}
                                            className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                            <MdKeyboardArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default subtask_grid_small;
