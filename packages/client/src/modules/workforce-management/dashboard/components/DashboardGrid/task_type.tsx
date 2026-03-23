/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllTaskType } from '@WORKFORCE_MODULES/config/api/get';
import { getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const task_type = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [typeList, setTypeList] = useState(null);
    const [taskByTask, setTaskByTask] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [taskDetails, setTaskDetails] = useState(null);

    const handleGetAllTaskType = () => {
        getAllTaskType().then(response => {
            if (response.data.body.status === 'success') {
                setTypeList(
                    response.data?.body.data.data.map(d => {
                        return { text: d.taskType, value: d.taskType };
                    })
                );
            }
        });
    };

    useEffect(() => {
        getAllTask(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data?.body.status === 'success') {
                setTaskDetails(response.data?.body.data.tasks);
            }
        });
    }, []);

    useEffect(() => {
        handleGetAllTaskType();
    }, []);

    const filterType = type => {
        if (!taskDetails && !type) return false;
        let tempTasks = taskDetails?.filter(d => {
            return d.taskType == type;
        });
        setTaskByTask(tempTasks);
    };

    useEffect(() => {
        filterType(typeList && typeList[0].value);
    }, [taskDetails, typeList]);

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
                    <div className={`card-d project-stage w-full inline-block align-top`}>
                        <div className='flex justify-between items-center'>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl font-semibold'>Task By Type</h1>
                            <div className='TaskManageLabel max-w-xs md:w-[8rem] py-2'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={typeList}
                                    name={'statusDetails'}
                                    className={`!mb-0`}
                                    value={selectedOption ?? ''}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterType(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='mt-1 overflow-x-auto relative shadow-md max-h-[280px] overflow-y-auto'>
                            <table className='table-style w-full min-w-[500px]'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th scope="col" className="py-3 px-6">
                                            <div className="flex items-center">

                                            Task
                                            </div>
                                            </th>
                                        <th scope="col" className="py-3 px-6">
                                            <div className="flex items-center justify-center">

                                            Created At
                                            </div>
                                            </th>
                                        <th scope="col" className="py-3 px-6">
                                            <div className="flex items-center justify-center">

                                            Created By
                                            </div>
                                            </th>
                                        <th scope="col" className="py-3 px-6">
                                            <div className="flex items-center justify-center">

                                            Assigned To
                                            </div>
                                            </th>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {taskByTask && taskByTask.length === 0 && (
                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>
                                    )}

                                    {taskByTask &&
                                        taskByTask.map(function (item, index) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize break-words'>{item.taskTitle}</h5>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className=' flex justify-center'>
                                                        {formatedDate(item.createdAt)}
                                                        </div>
                                                        </td>
                                                    <td>
                                                        <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer'>
                                                            <div className='relative'>
                                                                <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={item.taskCreator.firstName} >
                                                                <img onClick={()=>handleUserClick(item.taskCreator.isAdmin ,item.taskCreator.id,item.taskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                        src={ item.taskCreator.profilePic ?? USER_AVTAR_URL+ item.taskCreator.firstName+".svg"}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer -space-x-4'>
                                                        {filterMembers(item.assignedTo).length == 0 && <>Not Assigned</>}
                                                        {filterMembers(item.assignedTo)?.length <= 1 ? (
                                                            filterMembers(item.assignedTo).map(function (d1) {
                                                                return (
                                                                    <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} userId={d1._id}>
                                                                        <img onClick={()=>handleUserClick(d1?.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                            src={d1.profilePic}
                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            alt='-'
                                                                        />
                                                                    </ToolTip>
                                                                )
                                                            })
                                                            ) : (
                                                                <div className='flex justify-center items-center -space-x-4'>
                                                                    <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                        <img
                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            src={ filterMembers(item.assignedTo) === undefined ? [] : filterMembers(item.assignedTo)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.assignedTo)[0].firstName}.svg`}
                                                                            alt=''
                                                                        />
                                                                    </div>
                                                                    {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                        <img
                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            src={filterMembers(item.assignedTo) === undefined ? [] : filterMembers(item.assignedTo)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.assignedTo)[1].firstName}.svg`}
                                                                            alt=''
                                                                        />
                                                                    </div> */}
                                                                    <MemberModal members={item.assignedTo ? filterMembers(item.assignedTo) : ""} remainingCount={filterMembers(item.assignedTo)?.length - 1}  />
                                                                </div>
                                                        )}
                                                        </div>
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

export default task_type;
