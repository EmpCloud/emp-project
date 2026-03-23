/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import { ToolTip } from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllCategory } from '@WORKFORCE_MODULES/config/api/get';
import { getAllSubTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const subtask_category = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [categoryList, setCategoryList] = useState(null);

    const handleGetAllCategory = () => {
        getAllCategory().then(response => {
            if (response.data.body.status === 'success') {
                setCategoryList(
                    response.data.body.data.category.map(d => {
                        return { text: d.taskCategory, value: d.taskCategory };
                    })
                );
            }
        });
    };

    const [subtaskByCategory, setSubtaskByCategory] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [subtaskDetails, setSubtaskDetails] = useState(null);

    useEffect(() => {
        getAllSubTask(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data?.body.status === 'success') {
                setSubtaskDetails(response.data?.body.data.subTasks);
            }
        });
    }, []);

    useEffect(() => {
        handleGetAllCategory();
    }, []);

    const filterCategory = category => {
        if (!subtaskDetails && !category) return false;
        let tempTasks = subtaskDetails?.filter(d => {
            return d.subTaskCategory == category;
        });
        setSubtaskByCategory(tempTasks);
    };

    useEffect(() => {
        filterCategory(categoryList && categoryList[0]?.value);
    }, [subtaskDetails, categoryList]);

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
                            <h1 className='heading-medium text-lg mb-0 sm:text-xl font-semibold'>Subtask Category</h1>
                            <div className=' max-w-xs md:w-[8rem]'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={categoryList}
                                    className={`!mb-0`}
                                    value={selectedOption ?? ''}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterCategory(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='mt-4 overflow-x-auto relative shadow-md max-h-[260px] min-h-[260px] overflow-y-auto'>
                            <table className='table-style min-w-[500px] w-full'>
                                <thead className='!border-b-0'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th scope='col' className='py-3 px-6 text-base w-[140px]'>
                                            <div className='flex items-center'>

                                            SubTask
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center justify-center'>

                                            Created At
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center justify-center'>

                                            Created By
                                            </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center justify-center'>

                                            Assigned To
                                            </div>
                                            </th>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {subtaskByCategory && subtaskByCategory.length === 0 && (
                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>
                                    )}

                                    {subtaskByCategory &&
                                        subtaskByCategory.map(function (item, index) {
                                            return (
                                                <tr key={index}>
                                                    <td className=' w-[140px] break-words'>
                                                            <h5 className='capitalize break-words'>{item.subTaskTitle}</h5>
                                                    </td>
                                                    <td>
                                                        <div className=' flex justify-center'>

                                                        {formatedDate(item.createdAt)}
                                                        </div>
                                                        </td>
                                                    <td className='!w-auto'>
                                                        <div className='user-profile-img user-img-group flex justify-center items-center cursor-pointer'>
                                                            <div className='relative'>
                                                                <ToolTip
                                                                    className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full'
                                                                    message={`${item.subTaskCreator.firstName} ${item.subTaskCreator.lastName}`}>
                                                                    <img onClick={()=>handleUserClick(item.subTaskCreator?.isAdmin ,item.subTaskCreator.id ,item.subTaskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                                                         src={item.subTaskCreator.profilePic ?? USER_AVTAR_URL + item.subTaskCreator.firstName + '.svg'}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='flex justify-center'>
                                                        <div className='user-profile-img user-img-group items-center cursor-pointer -space-x-4'>
                                                        {filterMembers(item.subTaskAssignedTo).length == 0 && <>Not Assigned</>}
                                                        {filterMembers(item.subTaskAssignedTo)?.length <= 1 ? (
                                                            filterMembers(item.subTaskAssignedTo).map(function (d1) {
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
                                                                <div className='flex items-center -space-x-4'>
                                                                    <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                        <img
                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            src={ filterMembers(item.subTaskAssignedTo) === undefined ? [] : filterMembers(item.subTaskAssignedTo)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.subTaskAssignedTo)[0].firstName}.svg`}
                                                                            alt=''
                                                                        />
                                                                    </div>
                                                                    {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                        <img
                                                                            className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            src={filterMembers(item.subTaskAssignedTo) === undefined ? [] : filterMembers(item.subTaskAssignedTo)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.subTaskAssignedTo)[1].firstName}.svg`}
                                                                            alt=''
                                                                        />
                                                                    </div> */}
                                                                    <MemberModal members={item.subTaskAssignedTo ? filterMembers(item.subTaskAssignedTo) : ""} remainingCount={filterMembers(item.subTaskAssignedTo)?.length - 1}  />
                                                                </div>
                                                            )
                                                        }
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

export default subtask_category;
