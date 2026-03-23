/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { getAllProject, searchProject } from '../../projects/api/get';
import { getAllSubTask, getAllTask, searchTask } from '../../task/api/get';
import Task_progress from './DashboardGrid/task_progress';
import Task_recent from './DashboardGrid/task_recent';
import Task_grid_XL from './DashboardGrid/task_grid_xl';
import Task_priority from './DashboardGrid/task_priority';
import Task_type from './DashboardGrid/task_type';
import Task_category from './DashboardGrid/task_category';
import Task_status from './DashboardGrid/task_status';
import Project_task from './DashboardGrid/project_task';
import { updateDashboardConfig } from '../api/put';

export const index = ({ dashboardConfigDetails, clickConfig, setClickConfig, setDashboardConfigDetails }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const [subtaskCount, setSubtaskCount] = useState(null);
    const [taskCount, setTaskCount] = useState(0);

    const handleGetAllProject = (condition) => {
        getAllProject(condition).then(response => {
            if (response && response.data?.body?.status === 'success') {
                setProjectDetails(response.data?.body?.data?.project);
                let projectList = response.data?.body.data.project.map(item => {
                    return {
                        text: item.projectName,
                        value: item._id ? item._id : [],
                        item,
                    };
                });
                setProjectList(projectList);
            }
        });
    };
    useEffect(() => {
        handleGetAllProject(`?limit=${process.env.TOTAL_USERS}`);
        handleGetAllTask(`?limit=${process.env.TOTAL_USERS}`);
        handleGetAllSubtask(`?limit=${process.env.TOTAL_USERS}`);
    }, []);

    const handleGetAllTask = (condition = '') => {
        getAllTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setTaskCount(response.data?.body.data.taskCount);
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
        updateDashboardConfig("2",obj)
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
                {!clickConfig ? 'Customize dashboard ' : 'Back to dashboard'}
                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 Sm:h-5 sm:w-5 ' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
            </button>

            <div className='flex flex-wrap justify-center md:justify-between mb-16'>
            {dashboardConfigDetails &&
                dashboardConfigDetails.map(function (data, key) {
                    return (
                        <>
                            {data.name === 'project_task' || 
                            data.name === 'task_priority' || 
                            data.name === 'task_category' ||
                            data.name === 'task_type' ? (
                                <div className='w-full lg:w-[49%]'>
                                    {data.name === 'project_task' && Boolean(data.value) && <Project_task {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_priority' && Boolean(data.value) && <Task_priority {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_type' && Boolean(data.value) && <Task_type {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_category' && Boolean(data.value) && <Task_category {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : data.name === 'task_recent' || 
                              data.name === 'task_progress' || 
                              data.name === 'task_status' ? (
                                <div className='w-full lg:w-[32%]'>
                                    {data.name === 'task_recent' && Boolean(data.value) && (
                                        <Task_recent {...{ clickConfig, handleRemoveGrid, data, key,  taskCount }} />
                                    )}
                                    {data.name === 'task_progress' && Boolean(data.value) && <Task_progress {...{ clickConfig, handleRemoveGrid, data, key ,projectList}} />}
                                    {data.name === 'task_status' && Boolean(data.value) && <Task_status {...{ clickConfig, handleRemoveGrid, data, key, projectList }} />}
                                </div>
                            ) : (
                                <div className='w-full'>
                                    {data.name === 'task_grid_XL' && Boolean(data.value) && (
                                        <Task_grid_XL {...{ clickConfig, handleRemoveGrid, data, key,  taskCount }} />
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
