/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import NewToolTip from '@COMPONENTS/NewToolTip';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const project_task = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [taskDetails, setTaskDetails] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const taskList = [
        { name: 'Task Title', key: 1 },
        { name: 'Created By', key: 2 },
        { name: 'Assigned To', key: 3 },
        { name: 'Task Type', key: 4 },
        { name: 'Category', key: 5 },
        { name: 'Status', key: 6 },
        { name: 'Priority', key: 7 },
    ];
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllProject(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data?.body.status === 'success') {
                let projectList = response.data?.body.data.project.map(project => {
                    return {
                        text: project.projectName,
                        value: project._id ? project._id : [],
                        project,
                    };
                });
                setProjectList(projectList);
            }
        });
    }, []);

    const filterTask = _id => {
        if (!projectList) return false;
        let taskTemp = projectList?.filter(project => project?.value == _id);
        if (taskTemp.length != 0) setTaskDetails(taskTemp[0]?.project?.taskDetails);
    };

    useEffect(() => {
        if (projectList && projectList.length != 0) {
            filterTask(projectList && projectList[0].value);
        }
    }, [projectList]);

    return (
        <>
            <div className={` ${clickConfig ? 'outline ' : 'outline-0'} mt-5  `}>
                {clickConfig && (
                    <div className='flex justify-between items-center mt-4 card p-4 w-full'>
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
                <div className={`${clickConfig ? 'opacity-30 w-full  ' : ' w-full '} card-d  maxsm:min-h-full`}>
                    <div className='flex gap-4 justify-between md:flex flex-wrap'>
                        <div className='w-full rounded-lg'>
                            <div className=' '>
                                <div className='flex flex-wrap justify-between items-center'>
                                    <h4 className='heading-medium font-semibold text-lg sm:text-xl w-2/4'>Project Task</h4>

                                    <div className='TaskManageLabel py-2 md:w-[8rem]'>
                                        <FloatingOnlySelectfield
                                            label={''}
                                            optionsGroup={projectList}
                                            name={'projectList'}
                                            value={selectedOption ?? ''}
                                            onChange={event => {
                                                setSelectedOption(event.target.value);
                                                filterTask(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* taskDetails */}
                                <div className='mt-1 overflow-x-scroll relative shadow-md max-h-[280px] overflow-y-scroll' role='alert'>
                                    <table className='table-style min-w-[900px] w-full'>
                                        <thead className='!border-b-0 sticky top-0 z-40'>
                                            <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                                {taskList &&
                                                    taskList.map(function (data, key) {
                                                        return (
                                                            <th scope='col' className='py-3 px-6 text-base' key={key}>
                                                                <div className={`flex items-center ${data.name === 'Task Title'? '' : 'justify-center'}`}>{data.name}</div>
                                                            </th>
                                                        );
                                                    })}
                                            </tr>
                                        </thead>
                                        {taskDetails && taskDetails.length === 0 && (
                                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                    No data
                                                </th>
                                            </tr>
                                        )}
                                        {!taskDetails && (
                                            <tr>
                                                <th colSpan={2} className='h-[56.6px]'>
                                                    Select Project
                                                </th>
                                            </tr>
                                        )}
                                        <tbody className=''>
                                            {taskDetails &&
                                                taskDetails.length !== 0 &&
                                                taskDetails.map(function (data, key) {
                                                    return (
                                                        <>
                                                            <tr key={key} className='bg-white border-b-0 dark:bg-gray-800 dark:border-gray-700'>
                                                                {/* task name */}

                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className='w-[30px] ps-4'>
                                                                        <NewToolTip direction='right' message={data.taskTitle}></NewToolTip>
                                                                    </div>
                                                                    <div className='w-[140px]  break-words capitalize whitespace-normal'>{data.taskTitle}</div>
                                                                </td>

                                                                {/* created by */}

                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className=' flex justify-center'>

                                                                    <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={data.taskCreator.firstName} userId={data.taskCreator.id}>
                                                                    <img onClick={()=>handleUserClick(data.taskCreator?.isAdmin ,data.taskCreator.id,data.taskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                            src={data.taskCreator.profilePic ?? USER_AVTAR_URL+ data.taskCreator.firstName+".svg"}
                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 cursor-pointer rounded-full'
                                                                            alt='-'
                                                                            />
                                                                    </ToolTip>
                                                                    </div>
                                                                </td>

                                                                {/* assigned to */}

                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className='flex justify-center items-center -space-x-4'>
                                                                    {filterMembers(data.assignedTo).length == 0 && <>Not Assigned</>}
                                                                    {filterMembers(data.assignedTo)?.length <= 1 ? (
                                                                        filterMembers(data.assignedTo).map(function (d1) {
                                                                            return (
                                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} userId={d1._id}>
                                                                                    <img onClick={()=>handleUserClick(d1.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
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
                                                                                        src={ filterMembers(data.assignedTo) === undefined ? [] : filterMembers(data.assignedTo)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(data.assignedTo)[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={filterMembers(data.assignedTo) === undefined ? [] : filterMembers(data.assignedTo)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(data.assignedTo)[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div> */}
                                                                                <MemberModal members={data.assignedTo ? filterMembers(data.assignedTo) : ""} remainingCount={filterMembers(data.assignedTo)?.length - 1}  />
                                                                            </div>
                                                                    )}
                                                                    </div>
                                                                </td>

                                                                {/* task type  */}
                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className=' flex justify-center'>
                                                                    {data.taskType}
                                                                    </div>
                                                                </td>

                                                                {/* task category */}
                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className="flex justify-center">
                                                                    {data.category}
                                                                    </div>
                                                                </td>

                                                                {/* status */}

                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className="flex justify-center">
                                                                    {data.taskStatus}
                                                                    </div>
                                                                </td>

                                                                {/* priority */}
                                                                <td scope='row' className='!py-2 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <span
                                                                        className={`${
                                                                            data.priority === 'Low'
                                                                                ? 'text-priority3Color bg-priority3bg'
                                                                                : data.priority === 'High'
                                                                                ? 'text-priority1Color bg-priority1bg'
                                                                                : 'text-priority2Color bg-priority2bg'
                                                                        } priority-with-bg font-bold flex justify-center`}>
                                                                        {data.priority}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default project_task;
