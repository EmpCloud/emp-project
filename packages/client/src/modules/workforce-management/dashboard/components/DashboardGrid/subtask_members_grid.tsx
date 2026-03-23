/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { ToolTip } from '@COMPONENTS/ToolTip';
import { priorityList } from '@HELPER/exportData';
import { filterMembers, formatedDate } from '@HELPER/function';
import { getAllSubTask, getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { data } from '../graph/PolarAreaCharts';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { getAllUsers } from '@WORKFORCE_MODULES/members/api/get';

const subtask_members_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {

    const [prpojectPriority, setPrpojectPriority] = useState(null);
    const [membersDetail, setMemberDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [taskDetails, setTaskDetails] = useState(null);
    const [subtaskList, setSubtaskList] = useState(null);

    useEffect(() => {
        getAllSubTask(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data?.body.status === 'success') {
                let subtaskList = response.data?.body.data.subTasks.map(item => {
                    return {
                        text: item.subTaskTitle,
                        value: item._id ? item._id : [],
                        item,
                    };
                });
                setSubtaskList(subtaskList);
            }
        });
    }, []);

    const filterMember = _id => {
        if (!subtaskList) return false;
        let taskTemp = subtaskList.filter(item => item.value == _id);
        if (taskTemp.length != 0) {
            setMemberDetails(
                taskTemp[0]?.item?.subTaskAssignedTo
            );
        }
    };

    useEffect(() => {
        if (subtaskList && subtaskList.length != 0)
            filterMember(subtaskList && subtaskList[0].value);
    }, [subtaskList]);


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
                    <div className={`card-set project-stage w-full inline-block align-top`}>
                        <div className='flex justify-between items-center'>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl font-semibold'>SubTask Members</h1>
                            <div className='TaskManageLabel max-w-xs md:w-[8rem] py-2'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={subtaskList}
                                    name={'subtaskList'}
                                    className={`!mb-0`}
                                    value={selectedOption ?? ''}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterMember(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='mt-2 overflow-x-scroll relative shadow-md max-h-[300px]'>
                            <table className='table-style min-w-[380px] w-full'>
                                <thead className='!border-b-0 sticky z-40 top-0'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className=' flex items-center'>

                                            Name
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className=' flex items-center'>

                                            Role
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className=' flex items-center'>

                                            Permission
                                            </div>
                                            </th>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {membersDetail && membersDetail.length === 0 && (
                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>
                                    )}

                                    {membersDetail &&
                                        membersDetail.map(function (item, index) {
                                            return (
                                                <tr key={index}>
                                                    <td className='capitalize break-words '>{item.firstName + ' ' + item.lastName}

                                                    </td>
                                                    <td className='capitalize !w-auto '>{item.role}

                                                    </td>
                                                    <td className='capitalize '>{item.permission}

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

export default subtask_members_grid;