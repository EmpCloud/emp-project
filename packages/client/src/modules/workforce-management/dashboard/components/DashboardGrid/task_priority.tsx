/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import { Card, CardHeader, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const task_priority = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const priorityList = [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
    ];
    const [taskByPriority, setTaskByPriority] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [taskDetails, setTaskDetails] = useState(null);

    useEffect(() => {
        getAllTask(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data?.body.status === 'success') {
                setTaskDetails(response.data?.body.data.tasks);
            }
        });
    }, []);

    const filterPriority = priority => {
        if (!taskDetails && !priority) return false;
        let tempTasks = taskDetails?.filter(d => {
            return d.priority == priority;
        });
        setTaskByPriority(tempTasks);
    };

    useEffect(() => {
        filterPriority(priorityList && priorityList[0].value);
    }, [taskDetails]);

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
                        <div className='flex justify-between items-center mb-3'>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl font-semibold'>Task Priority</h1>
                            <div className='TaskManageLabel max-w-xs md:w-[8rem] py-2'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={priorityList}
                                    name={'priorityList'}
                                    className={`!mb-0`}
                                    value={selectedOption ?? ''}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterPriority(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className=' overflow-x-auto relative shadow-md max-h-[280px] overflow-y-auto'>
                            <table className='table-style w-full min-w-[400px]'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th scope="col" className='py-3 px-6 text-base'>
                                             <div className="flex items-center">

                                            Task
                                             </div>
                                            </th>
                                        <th scope="col" className='py-3 px-6 text-base'>
                                             <div className="flex items-center justify-center">

                                            Created At
                                             </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                             <div className="flex items-center justify-center">

                                            Created By
                                             </div>
                                            </th>
                                        <th scope="col" className='py-3 px-6 text-base'>
                                             <div className="flex items-center justify-center">

                                            Assigned To
                                             </div>
                                            </th>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {taskByPriority && taskByPriority.length === 0 && (
                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>
                                    )}

                                    {taskByPriority &&
                                        taskByPriority.map(function (item, index) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                            <h5 className='capitalize break-words'>{item.taskTitle}</h5>
                                                    </td>
                                                    <td>
                                                        <div className=' flex justify-center items-center'>
                                                        {formatedDate(item.createdAt)}
                                                        </div>
                                                        </td>
                                                    <td className=''>
                                                        <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer'>
                                                            <div className='relative'>
                                                                <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={item.taskCreator.firstName} >
                                                                <img onClick={()=>handleUserClick(item.taskCreator.isAdmin ,item.taskCreator.id ,item.taskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                        src={ item.taskCreator.profilePic ?? USER_AVTAR_URL+ item.taskCreator.firstName+".svg"}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer -space-x-4'>
                                                        {filterMembers(item.assignedTo).length == 0 && <>Not Assigned</>}
                                                        {filterMembers(item.assignedTo)?.length <= 1 ? (
                                                            filterMembers(item.assignedTo).map(function (d1,index) {
                                                                return (
                                                                    <ToolTip key={index} className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} >
                                                                        <img onClick={()=>handleUserClick(d1?.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                            src={d1.profilePic}
                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            alt='-'
                                                                        />
                                                                    </ToolTip>
                                                                )
                                                            })
                                                            ) : (
                                                                <div className='flex items-center -space-x-4'>
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
                    </div >
                </div>
            </div >
 </>
 )}

export default task_priority;
