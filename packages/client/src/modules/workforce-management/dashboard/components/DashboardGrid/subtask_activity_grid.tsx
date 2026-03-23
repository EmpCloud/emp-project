/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import ToolTip from '@COMPONENTS/ToolTip';
import { formatedDate } from '@HELPER/function';
import { getAllSubTask, getSubTaskActivity, getTaskActivity } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const subtask_activity_grid = ({ clickConfig, handleRemoveGrid, data, key,  }) => {
    const [subtaskActivity, setSubtaskActivity] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [subtaskList, setSubtaskList] = useState('');

 
    const handleGetSubTaskActivity = id => {
        getSubTaskActivity(id).then(response => {
            if (response.data.body.status === 'success') {
                setSubtaskActivity(response.data.body.data);
            }
        });
    };

    useEffect(()=>{
        getAllSubTask().then(response => {
            if (response.data?.body.status === 'success') {
                let subtaskList = response.data?.body.data.subTasks.map((item)=>{
                    return {
                        text : item.subTaskTitle,
                        value: item._id
                    }
                })
                setSubtaskList(subtaskList);
            }
        });
    },[])
    
    useEffect(() => {
        handleGetSubTaskActivity(subtaskList ? subtaskList[0].value : null);
    }, [subtaskList]);


    return (
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
                    <div className='block gap-4 justify-between md:flex flex-wrap'>
                        <div className='w-full rounded-lg'>
                            <div className=' '>
                                <div className='flex justify-between items-center'>
                                    <h4 className='heading-medium'>Task Activity</h4>
                                    <div className='TaskManageLabel md:w-80 py-2'>
                                        <FloatingOnlySelectfield
                                            label={''}
                                            optionsGroup={subtaskList}
                                            name={'subtaskList'}
                                            value={selectedOption ?? ''}
                                            onChange={event => {
                                                setSelectedOption(event.target.value);
                                                // filterTask(event.target.value);
                                                handleGetSubTaskActivity(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='mt-5 overflow-x-auto relative shadow-md sm:rounded-lg' role='alert'>
                                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                        <thead className='text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                            <tr>
                                                <th scope='col' className='py-3 px-6'>
                                                    <div className='flex items-center'>Activity</div>
                                                </th>
                                                <th scope='col' className='py-3 px-6'>
                                                    <div className='flex items-center'>Category</div>
                                                </th>
                                                <th scope='col' className='py-3 px-6'>
                                                    <div className='flex items-center'>Activity Creator</div>
                                                </th>
                                                <th scope='col' className='py-3 px-6'>
                                                    <div className='flex items-center'>Created At</div>
                                                </th>
                                                <th scope='col' className='py-3 px-6'>
                                                    <div className='flex items-center'>Updated At</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        {!subtaskActivity || subtaskActivity  && subtaskActivity.length === 0 && (
                                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                    No data
                                                </th>
                                            </tr>
                                        )}
                                    
                                        
                                        <tbody>
                                            {subtaskActivity && subtaskActivity.map(function (data, key) {
                                                    return (
                                                        <>
                                                            <tr key={key} className='bg-white border-b-0 dark:bg-gray-800 dark:border-gray-700'>
                                                                <th scope='row' className='max-w-[250px] w-auto py-4 px-6 font-medium text-gray-900 dark:text-white'>
                                                                    <span className='overflow-hidden text-ellipsis inline-block overflow-y-auto overflow-x-hidden max-h-[78px] whitespace-normal break-words w-full'>
                                                                        {data.activity}
                                                                    </span>
                                                                </th>
                                                                <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    {data.category}
                                                                </th>
                                                                <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    <div className='flex mb-5 -space-x-4'>
                                                                        <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={data.userDetails.name}>
                                                                            <img
                                                                                key={key}
                                                                                src={data.userDetails.profilePic}
                                                                                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                alt='-'
                                                                            />
                                                                        </ToolTip>
                                                                    </div>
                                                                </th>
                                                                <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    {data.createdAt? formatedDate(data.createdAt): "No Data"}
                                                                </th>

                                                                <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                    {formatedDate(data.updatedAt)}
                                                                </th>
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
        </div>
    );
};

export default subtask_activity_grid;


