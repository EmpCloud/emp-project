/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import Subtask_recent from './DashboardGrid/subtask_recent';
import Task_subtasks from './DashboardGrid/task_subtasks';
import Subtask_grid_XL from './DashboardGrid/subtask_grid_XL';
import Subtask_category from './DashboardGrid/subtask_category';
import Subtask_priority from './DashboardGrid/subtask_priority';
import Subtask_status from './DashboardGrid/subtask_status';
import Subtask_type from './DashboardGrid/subtask_type';
import Subtask_by_status from './DashboardGrid/subtask_by_status';
import Subtask_progress from './DashboardGrid/subtask_progress';
import { getAllSubTask, getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import { updateDashboardConfig } from '../api/put';

export const index = ({ dashboardConfigDetails, clickConfig, setClickConfig, setDashboardConfigDetails }) => {
    const [taskList, setTaskList] = useState(null);
    const [subtaskCount, setSubtaskCount] = useState(null);
    useEffect(() => {
        handleGetAllTask(`?limit=${process.env.TOTAL_USERS}`);
        handleGetAllSubtask(`?limit=${process.env.TOTAL_USERS}`);
    }, []);

    const handleGetAllTask = (condition = '') => {
        getAllTask(condition).then(response => {
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
    };

    const handleGetAllSubtask = (condition) => {
        getAllSubTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setSubtaskCount(response.data?.body.data.subTaskCount);
            }
        });
    };

    const handleRemoveGrid = (event: any, data: any, key: any) => {
        event.preventDefault();
        setDashboardConfigDetails(dashboardConfigDetails.map(item => (item.name === data.name ? { ...item, value: item.value === 1 ? 0 : 1 } : item)));
        let configData = dashboardConfigDetails.map(item => (item.name === data.name ? { ...item, value: item.value === 1 ? 0 : 1 } : item))
        handleUpdateDashboardConfig(configData);
    };
    const handleUpdateDashboardConfig = (data) => {
        let obj ={};
        data.map((d)=>{ 
            obj[d.name] = d.value;
            return obj;       
        })
        updateDashboardConfig("3",obj)
            .then(function (response) {
                if (response.data?.statusCode == 200) {
                    // toast({
                    //     type: 'success',
                    //     message: response ? response.data.body.message : 'Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: response ? response.data.body.message : 'Error',
                    // });
                }
            })
            .catch(function (result) {
                // toast({
                //     type: 'error',
                //     message: result ? result.data.body.message : 'Something went wrong, Try again !',
                // });
            });
    };
    return (
        <>
            <button
                onClick={() => {
                    setClickConfig(!clickConfig);
                }}
                className='small-button items-center xs:w-fit flex sm:text-md text-sm z-[100] config-button w-22 fixed right-5 bottom-5 cursor-pointer drop-shadow-[0_5px_5px_rgba(0,0,0,0.22)] z-50'>
                {!clickConfig ? 'Customized dashboard ' : 'Back to dashboard'}
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 Sm:h-5 sm:w-5 ' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
            </button>
            
            <div className='flex flex-wrap justify-center md:justify-between mb-20'>
            {dashboardConfigDetails &&
                dashboardConfigDetails.map(function (data, key) {
                    return (
                        <>
                            {data.name === 'task_subtasks' || data.name === 'subtask_priority' ? (
                                <div className='w-full lg:w-[48.5%]'>
                                    {data.name === 'task_subtasks' && Boolean(data.value) && <Task_subtasks {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_priority' && Boolean(data.value) && <Subtask_priority {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : data.name === 'subtask_progress' || 
                              data.name === 'subtask_category' || 
                              data.name === 'subtask_recent' ||
                              data.name === 'subtask_type' || 
                              data.name === 'subtask_status' || 
                              data.name === 'status' ? ( 
                                <div className='w-full lg:w-[32%]'>
                                    {data.name === 'subtask_category' && Boolean(data.value) && <Subtask_category {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_progress' && Boolean(data.value) && <Subtask_progress {...{ clickConfig, handleRemoveGrid, data, key ,taskList}} />}
                                    {data.name === 'subtask_status' && Boolean(data.value) && <Subtask_status {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />}
                                    {data.name === 'subtask_recent' && Boolean(data.value) && <Subtask_recent {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_type' && Boolean(data.value) && <Subtask_type {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'status' && Boolean(data.value) && <Subtask_by_status {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />}
                                </div>
                            ) : (
                                <div className='w-full'>
                                    {data.name === 'Subtask_grid' && Boolean(data.value) && (
                                        <Subtask_grid_XL {...{ clickConfig, handleRemoveGrid, data, key, subtaskCount }} />
                                    )}
                                </div>
                            )}
                        </>
                    );
                })}
                </div>
        </>
    );
};

export default index;
