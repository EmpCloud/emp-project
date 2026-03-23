/* eslint-disable react-hooks/rules-of-hooks */
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { formatedDate } from '@HELPER/function';
import { getAllSubTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileText } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import { TfiAlarmClock } from 'react-icons/tfi';

const subtask_recent = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [recentSubtask, setRecentSubtask] = useState(null);

    const handleGetAllTask = (condition = '?sort=desc&order=createdAt') => {
        getAllSubTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setRecentSubtask(response.data?.body.data.subTasks);
            }
        });
    };

    useEffect(() => {
        handleGetAllTask('?sort=desc&order=createdAt');
    }, []);
    return (
        <>
            <div className={` ${clickConfig ? 'outline ' : 'outline-0'} mt-5 `}>
                {clickConfig && (
                    <div className='flex justify-between items-center card p-3 w-full'>
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
                <div className={` ${clickConfig ? 'opacity-30 w-full  ' : ' w-full '} card-set maxsm:min-h-full`}>
                    <div className='flex justify-between items-center'>
                        <h1 className='heading-medium text-md md:text-xl mb-0 font-semibold'>Recent Five Subtasks</h1>
                    </div>
                    <div className='recent-projects-wrapper mt-2 relative flex flex-col gap-2 max-h-[310px] overflow-y-auto'>
                        {recentSubtask && recentSubtask.length === 0 && (
                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                <th scope='row' className='col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                    No data
                                </th>
                            </tr>
                        )}
                        {!recentSubtask && (
                            <tr>
                                <th colSpan={2}>
                                    <TinnySpinner />
                                </th>
                            </tr>
                        )}
                        {recentSubtask &&
                            recentSubtask.reverse().slice(0, 5).map(function (data, key) {
                                return (
                                    <>
                                        <div className='bg-[#ecf3fa] dark:bg-gray-600 relative  rounded-lg shadow-recent-card'>
                                            <div className='py-2 px-4'>
                                                <div className='group'>
                                                    <span
                                                        className={`absolute top-1/2 left-[-19px] rounded -translate-y-1/2 bg-[#282828] text-white text-[13px] py-[2px] w-0 invisible pr-[11px] pl-[18px] transition-all group-hover:w-[70px] group-hover:visible`}>
                                                        {data.subTaskStatus}
                                                    </span>
                                                    <div
                                                        className={`priority ${
                                                            data.priority === 'High' ? '!bg-[#ff5959]' : data.priority === 'Low' ? '!bg-[#3dadff]' : '!bg-[#f8af41]'
                                                        } cursor-pointer `}>
                                                    </div>
                                                </div>

                                                <div className='flex gap-2 items-start justify-between'>
                                                    <h1 className='flex justify-center items-start flex-col'>
                                                        <span className='twolines-dot text-black dark:text-gray-200 font-semibold text-md overflow-hidden text-ellipsis break-all'>{data.subTaskTitle}</span>
                                                    </h1>
                                                    <div className={` max-w-[111px] rounded-md  font-semibold`}>
                                                        <div
                                                            className={` text-base ${
                                                                data.priority === 'High'
                                                                    ? 'text-priority1Color bg-priority1bg'
                                                                    : data.priority === 'Low'
                                                                    ? 'text-priority3Color bg-priority3bg'
                                                                    : 'text-priority2Color bg-priority2bg'
                                                            } priority-with-bg leading-none `}>
                                                            {data.priority}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex flex-wrap py-1 text-md justify-between'>
                                                    <div className='flex gap-1 items-center justify-start text-gray-500 dark:text-gray-200'>
                                                        <span>
                                                            <AiOutlineFileText />
                                                        </span>
                                                        <span className='overflow-hidden text-ellipsis w-full whitespace-nowrap max-w-[150px]'>{data.task[0].taskTitle}</span>
                                                    </div>
                                                    <div className='flex gap-1 items-center justify-end text-gray-500 dark:text-gray-200'>
                                                        <span>
                                                            <TfiAlarmClock />
                                                        </span>
                                                        <span>Created at : </span>
                                                        <span  className="text-md">{formatedDate(data.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default subtask_recent;
