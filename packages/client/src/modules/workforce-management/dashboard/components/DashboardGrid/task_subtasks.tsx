/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import ToolTip from '@COMPONENTS/ToolTip';
import { formatedDate, handleUserClick } from '@HELPER/function';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import { getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { data } from '../graph/PolarAreaCharts';

const task_subtasks = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [subtaskDetails, setSubtaskDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllTask(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data?.body.status === 'success') {
                let taskList = response.data?.body.data.tasks.map(item => {
                    return {
                        text: item.taskTitle,
                        value: item._id ? item._id : [],
                        item,
                    };
                });
                setTaskList(taskList);
            }
        });
    }, []);

    const filterSubTask = _id => {
        if (!taskList) return false;
        let subtaskTemp = taskList.filter(project => project.value == _id);
        setSubtaskDetails(subtaskTemp[0]?.item?.subTasks);
    };

    useEffect(() => {
        filterSubTask(taskList ? taskList[0]?.value : []);
    }, [taskList]);

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
                    <div className={`card-d project-by-status w-full inline-block align-top`}>
                        <div className='flex justify-between items-center'>
                            <h1 className='heading-medium font-semibold'>Task Subtask</h1>
                                <div className='max-w-xs md:w-[8rem]'>
                                    <FloatingOnlySelectfield
                                        label={undefined}
                                        optionsGroup={taskList}
                                        value={selectedOption ?? ''}
                                        onChange={event => {
                                            setSelectedOption(event.target.value);
                                            filterSubTask(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        <div className='mt-4 relative overflow-x-auto shadow-md max-h-[260px] min-h-[260px] overflow-y-auto'>
                            <table className='table-style w-full min-w-[500px] border-b'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className="flex items-center">

                                            Subtasks
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className="flex items-center justify-center">

                                            Category
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className="flex items-center justify-center">

                                            Due Date
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className="flex items-center justify-center">

                                            Created By
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className="flex items-center justify-center">

                                            Status
                                            </div>
                                            </th>
                                    </tr>
                                </thead>
                                {subtaskDetails && subtaskDetails.length === 0 && (
                                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                        <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                            No data
                                        </th>
                                    </tr>
                                )}
                                {/* {!subtaskDetails && (
                <tr>
                  <th colSpan={2} className='h-[56.6px]'>
                    Select Task
                  </th>
                </tr>
              )} */}
                                <tbody className=''>
                                    {subtaskDetails &&
                                        subtaskDetails.map(function (subtask, index) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize break-words'>{subtask.subTaskTitle}</h5>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className=" text-center break-words">
                                                        {subtask.subTaskCategory}
                                                        </div>
                                                        </td>
                                                    <td>
                                                    <div className="flex justify-center">
                                                        {formatedDate(subtask.dueDate)}
                                                        </div>
                                                        </td>
                                                    <td className='!w-auto'>
                                                        <div className='user-profile-img user-img-group flex items-center justify-center cursor-pointer'>
                                                            <div className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full flex flex-col items-center group'>
                                                                <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={`${subtask.subTaskCreator.firstName} ${subtask.subTaskCreator.lastName}`} userId={subtask.subTaskCreator.id}>
                                                                <img onClick={()=>handleUserClick(subtask.subTaskCreator?.isAdmin ,subtask.subTaskCreator._id,subtask.subTaskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                        src={subtask.subTaskCreator.profilePic ??  "https://avatars.dicebear.com/api/bottts/"+ subtask.subTaskCreator.firstName+".svg"}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={` py-1 px-3 rounded font-bold flex justify-center `}>{subtask.subTaskStatus}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default task_subtasks;
