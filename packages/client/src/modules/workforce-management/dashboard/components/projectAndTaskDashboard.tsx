/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { getAllProject, searchProject } from '../../projects/api/get';
import { getAllSubTask, getAllTask, searchTask } from '../../task/api/get';
import Project_progress from './DashboardGrid/project_progress';
import Project_recent from './DashboardGrid/project_recent';
import Project_task from './DashboardGrid/project_task';
import Project_grid_XL from './DashboardGrid/project_grid_xl';
import Project_budget_grid from './DashboardGrid/project_budget_grid';
import Project_by_status from './DashboardGrid/project_by_status';
import Project_status from './DashboardGrid/project_status';
import Task_members_grid from './DashboardGrid/task_members_grid';
import Project_members_grid from './DashboardGrid/project_members_grid';
import { updateDashboardConfig } from '../api/put';
export const index = ({ dashboardConfigDetails, clickConfig, setClickConfig, setDashboardConfigDetails,selectDashboardType }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const [subtaskCount, setSubtaskCount] = useState(null);
    const [projectCount, setProjectCount] = useState(0);

    const [taskCount, setTaskCount] = useState(0);

    const handleGetAllProject = (condition) => {
        getAllProject(condition).then(response => {
            if (response && response.data?.body?.status === 'success') {
                setProjectDetails(response.data?.body?.data?.project);
                setProjectCount(response.data?.body?.data.projectCount);
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

  
    const handlePaginationProject = (condition: any) => {
        searchProject(condition).then(response => {
            if (response.data.body.status === 'success') {
                setProjectDetails(response.data.body.data.projectData);
            }
        });
    };
    const handleUpdateDashboardConfig = (data) => {
        let obj ={};
        data.map((d)=>{ 
            obj[d.name] = d.value;
            return obj;       
        })
        updateDashboardConfig("1",obj)
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

            <div className='flex flex-wrap justify-center md:justify-between px-2'>
            {dashboardConfigDetails &&
                dashboardConfigDetails.map(function (data, key) {
                    return (
                        <>
                            {data.name === 'project_task' || data.name === 'project_budget_grid' ? (
                                <div className='w-full lg:w-[49%]'>
                                    {data.name === 'project_task' && Boolean(data.value) && <Project_task {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'project_budget_grid' && Boolean(data.value) && (
                                        <Project_budget_grid {...{ clickConfig, handleRemoveGrid, data, key,  projectDetails }} />
                                    )}
                                </div>
                            ) : data.name === 'project_progress' || data.name === 'project_member' || data.name === 'project_recent' || data.name === 'project_status' ? (
                            
                                <div className='w-full lg:w-[32%]'>
                                    {data.name === 'project_status' && Boolean(data.value) && <Project_status {...{ clickConfig, handleRemoveGrid, data, key, projectCount }} />}
                                    {data.name === 'project_recent' && Boolean(data.value) && <Project_recent {...{ clickConfig, handleRemoveGrid, data, key, projectDetails }} />}
                                    {data.name === 'project_progress' && Boolean(data.value) && <Project_progress {...{ clickConfig, handleRemoveGrid, data, key, projectCount, projectDetails }} />}
                                    {data.name === 'project_member' && Boolean(data.value) && <Project_members_grid {...{ selectDashboardType, clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : data.name === 'project_by_status' ? (
                                <div className=' w-full lg:w-[66%]'>
                                    {data.name === 'project_by_status' && Boolean(data.value) && <Project_by_status {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : (
                                <div className='w-full'>
                                    {data.name === 'project_grid_XL' && Boolean(data.value) && (
                                        <Project_grid_XL
                                            {...{
                                                projectCount,
                                                handlePaginationProject,
                                                key,
                                                data,
                                                handleRemoveGrid,
                                                clickConfig,
                                                setClickConfig,
                                            }}
                                        />
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
