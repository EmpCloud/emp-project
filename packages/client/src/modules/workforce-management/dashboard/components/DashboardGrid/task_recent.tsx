/* eslint-disable react-hooks/rules-of-hooks */
import DropDownWithTick from '@COMPONENTS/DropDownWithTick';
import NewToolTip from '@COMPONENTS/NewToolTip';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { AVTAR_URL } from '@HELPER/avtar';
import { formatedDate } from '@HELPER/function';
import { getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineFileText } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import { TfiAlarmClock } from 'react-icons/tfi';

const task_recent = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [recentTask, setRecentTask] = useState(null);

    const handleGetAllTask = (condition = `?sort=desc&order=createdAt&limit=${process.env.TOTAL_USERS}`) => {
        getAllTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setRecentTask(response.data?.body.data.tasks);
            }
        });
    };

    useEffect(() => {
        handleGetAllTask();
    }, []);

    return (
        <>
            <div className={` ${clickConfig ? 'outline ' : 'outline-0'} mt-5 `}>
                {clickConfig && (
                    <div className={`flex justify-between items-center ${clickConfig ? '': 'card-set'} p-3 w-full`}>
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
                <div className={` ${clickConfig ? 'opacity-30 w-full  ' : ' w-full '} card-set  project-stage w-full inline-block align-top`}>
                    <div className='flex justify-between items-center'>
                        <h1 className='heading-medium text-base mb-0 font-semibold sm:text-xl'>Recent Five Tasks</h1>
                    </div>
                    <div className='recent-projects-wrapper mt-1 relative flex flex-col gap-2 h-[300px] overflow-auto'>
                        {recentTask && recentTask.length === 0 && (
                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                No data
                            </th>
                        </tr>
                        )}
                        {!recentTask && (
                            <tr>
                            <th colSpan={2}>
                                <TinnySpinner />
                            </th>
                        </tr>
                        )}
                        {recentTask &&
                            recentTask.reverse().slice(0, 5).map(function (data, key) {
                                return (
                                    <>
                                        <div className='bg-[#ecf3fa] dark:bg-slate-600 relative  rounded-lg shadow-recent-card'>
                                            <div className='py-1 px-2'>
                                                {/* <div className='group'> */}
                                                    {/* <span
                                                        className={`absolute top-1/2 left-[-19px] rounded -translate-y-1/2 bg-[#282828] text-white text-[13px] py-[2px] w-0 invisible pr-[11px] pl-[18px] transition-all group-hover:w-[70px] group-hover:visible`}>
                                                        {data.taskStatus}
                                                    </span> */}
                                                    {/* <div
                                                        className={`priority ${
                                                            data.priority === 'High' ? '!bg-[#ff5959]' : data.priority === 'Low' ? '!bg-[#3dadff]' : '!bg-[#f8af41]'
                                                        } cursor-pointer `}></div>
                                                </div> */}

                                                <div className=''>
                                                    <h1 className='flex justify-center items-start flex-col'>
                                                        <span className='twolines-dot text-black dark:text-gray-200 font-semibold text-base overflow-hidden text-ellipsis break-words w-2/4 mt-1'>{data.taskTitle}</span>
                                                    </h1>
                                                    <div className={` ml-auto rounded-md text-sm  font-semibold`}>
                                                        <div
                                                            className={` ${
                                                                data.priority === 'High'
                                                                    ? 'text-priority1Color bg-priority1bg'
                                                                    : data.priority === 'Low'
                                                                    ? 'text-priority3Color bg-priority3bg'
                                                                    : 'text-priority2Color bg-priority2bg'
                                                            } max-w-[111px] ml-auto absolute px-2 py-1 right-2 top-2 `}>
                                                            {data.priority}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between flex-wrap text-sm py-3'>
                                                    <div className='flex gap-1 items-center justify-start text-gray-500 dark:text-gray-200'>
                                                        <span>
                                                            <AiOutlineFileText />
                                                        </span>
                                                        <span className='overflow-hidden text-ellipsis w-[100px]'>{data.projectName? data.projectName : "Independent Task"}</span>
                                                    </div>
                                                    <div className='flex gap-1 items-center justify-end text-gray-500 dark:text-gray-200'>
                                                        <span>
                                                            <TfiAlarmClock />
                                                        </span>
                                                        <span>Created at : </span>
                                                        <span>{formatedDate(data.createdAt)}</span>
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

export default task_recent;
