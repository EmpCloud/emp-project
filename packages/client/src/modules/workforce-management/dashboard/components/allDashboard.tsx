/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { apiIsNotWorking } from '../../../../helper/function';
import { getAllProject, searchProject } from '../../projects/api/get';
import { getAllSubTask, getAllTask, searchTask } from '../../task/api/get';
import Project_member_grid from './DashboardGrid/project_member_grid';
import Project_progress from './DashboardGrid/project_progress';
import Project_recent from './DashboardGrid/project_recent';
import Project_task from './DashboardGrid/project_task';
import Subtask_recent from './DashboardGrid/subtask_recent';
import Task_progress from './DashboardGrid/task_progress';
import Task_recent from './DashboardGrid/task_recent';
import Project_grid_XL from './DashboardGrid/project_grid_xl';
import Project_grid_Large from './DashboardGrid/project_grid_large';
import Project_grid_small from './DashboardGrid/project_grid_small';
import Project_budget_grid from './DashboardGrid/project_budget_grid';
import Project_by_status from './DashboardGrid/project_by_status';
import Project_stage_grid from './DashboardGrid/project_stage_grid';
import Project_subtask from './DashboardGrid/project_subtask';
import Project_status from './DashboardGrid/project_status';
import Task_grid_XL from './DashboardGrid/task_grid_xl';
import Task_grid_large from './DashboardGrid/task_grid_Large';
import Task_grid_small from './DashboardGrid/task_grid_small';
import Task_subtasks from './DashboardGrid/task_subtasks';
import Task_member_grid from './DashboardGrid/task_member_grid';
import Task_priority from './DashboardGrid/task_priority';
import Task_type from './DashboardGrid/task_type';
import Task_category from './DashboardGrid/task_category';
import Task_status from './DashboardGrid/task_status';
import Subtask_grid_XL from './DashboardGrid/subtask_grid_XL';
import Subtask_category from './DashboardGrid/subtask_category';
import Subtask_grid_Large from './DashboardGrid/subtask_grid_Large';
import Subtask_grid_small from './DashboardGrid/subtask_grid_small';
import Subtask_priority from './DashboardGrid/subtask_priority';
import Subtask_status from './DashboardGrid/subtask_status';
import Subtask_type from './DashboardGrid/subtask_type';
import Roles_grid from './DashboardGrid/roles_grid';
import Member_grid_XL from './DashboardGrid/member_grid_XL';
import Member_grid_Large from './DashboardGrid/member_grid_Large';
import Member_grid_small from './DashboardGrid/member_grid_small';
import Roles_member_grid from './DashboardGrid/roles_member_grid';
import Permission_grid from './DashboardGrid/permission_grid';
import Project_Activity_grid from './DashboardGrid/project_Activity_grid';
import Task_activity_grid from './DashboardGrid/task_activity_grid';
import Subtask_activity_grid from './DashboardGrid/subtask_activity_grid';
import Activity_grid from './DashboardGrid/activity_grid';
import Subtask_by_status from './DashboardGrid/subtask_by_status';
import Permission_members_grid from './DashboardGrid/permission_members_grid';
import Custom_roles_grid from './DashboardGrid/custom_roles_grid';
import Project_members_grid from './DashboardGrid/project_members_grid';
import Task_members_grid from './DashboardGrid/task_members_grid';
import Subtask_members_grid from './DashboardGrid/subtask_members_grid';
import Custom_permission_grid from './DashboardGrid/custom_permission_grid';
import Activity_Main_categories_grid from './DashboardGrid/activity_Main_categories_grid';
import Subtask_progress from './DashboardGrid/subtask_progress';
import { updateDashboardConfig } from '../api/put';

export const index = ({ dashboardConfigDetails, clickConfig, setClickConfig, setDashboardConfigDetails }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const [subtaskCount, setSubtaskCount] = useState(null);
    const [expandedMemberRows, setExpandedMemberRows] = useState([]);
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

    const dropdownData = [
        { text: 'Import tasks', value: 1 },
        { text: 'Delete all', value: 2 },
    ];
    const dashboardType = [{ name: 'Projects' }, { name: 'Tasks' }, { name: 'All' }];

    const handleSelectStatus = (event, v: any) => {
        event.preventDefault;
    };
    const handleRemoveGrid = (event: any, data: any, key: any) => {
        event.preventDefault();
        setDashboardConfigDetails(dashboardConfigDetails.map(item => (item.name === data.name ? { ...item, value: item.value === 1 ? 0 : 1 } : item)));
        let configData = dashboardConfigDetails.map(item => (item.name === data.name ? { ...item, value: item.value === 1 ? 0 : 1 } : item))
        handleUpdateDashboardConfig(configData);
    };

    const handleEpandMemberRow = (event, projectId) => {
        const currentExpandedRows = expandedMemberRows;
        const isRowExpanded = currentExpandedRows.includes(projectId);
        let obj = {};
        isRowExpanded ? (obj[projectId] = false) : (obj[projectId] = true);
        const newExpandedRows = isRowExpanded ? currentExpandedRows.filter(id => id !== projectId) : currentExpandedRows.concat(projectId);
        setExpandedMemberRows(newExpandedRows);
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
        updateDashboardConfig("5",obj)
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
            {dashboardConfigDetails &&
                dashboardConfigDetails.map(function (data, key) {
                    return (
                        <>
                            {data.name === 'project_task' ||
                                data.name === 'project_budget_grid' ||
                                data.name === 'task_subtasks' ||
                                data.name === 'task_priority' ||
                                data.name === 'task_category' ||
                                data.name === 'task_type' ||
                                data.name === 'subtask_priority' ? (
                                <div className='w-[48.5%] mr-5 inline-block '>
                                    {data.name === 'project_task' && Boolean(data.value) && <Project_task {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'project_budget_grid' && Boolean(data.value) && (
                                        <Project_budget_grid {...{ clickConfig, handleRemoveGrid, data, key, expandedMemberRows, handleEpandMemberRow, projectDetails }} />
                                    )}
                                    {data.name === 'task_priority' && Boolean(data.value) && <Task_priority {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_subtasks' && Boolean(data.value) && <Task_subtasks {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_type' && Boolean(data.value) && <Task_type {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_category' && Boolean(data.value) && <Task_category {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_priority' && Boolean(data.value) && <Subtask_priority {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : data.name === 'subtask_progress' ||
                                data.name === 'project_progress' ||
                                data.name === 'subtask_category' ||
                                data.name === 'project_subtask' ||
                                data.name === 'project_member_grid' ||
                                data.name === 'project_recent' ||
                                data.name === 'project_by_status' ||
                                data.name === 'project_stage_grid' ||
                                data.name === 'project_status' ||
                                data.name === 'task_recent' ||
                                data.name === 'task_member_grid' ||
                                data.name === 'task_progress' ||
                                data.name === 'subtask_recent' ||
                                data.name === 'subtask_priority' ||
                                data.name === 'subtask_type' ||
                                data.name === 'task_status' ||
                                // data.name === 'subtask_member_grid' ||
                                data.name === 'subtask_status' ||
                                data.name === 'roles_member_grid' ||
                                data.name === 'member_grid_small' ||
                                data.name === 'roles_grid' ||
                                data.name === 'custom_roles_grid' ||
                                data.name === 'project_members_grid' ||
                                data.name === 'task_members_grid' ||
                                data.name === 'subtask_member_grid' ||
                                data.name === 'custom_permission_grid' ||
                                data.name === 'permission_members_grid'||
                                data.name === 'status'? (
                                <div className='w-[32%] mr-5 inline-block'>
                                    {data.name === 'subtask_category' && Boolean(data.value) && <Subtask_category {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_progress' && Boolean(data.value) && <Subtask_progress {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'project_by_status' && Boolean(data.value) && <Project_by_status {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'project_status' && Boolean(data.value) && <Project_status {...{ clickConfig, handleRemoveGrid, data, key, projectCount }} />}
                                    {data.name === 'project_subtask' && Boolean(data.value) && <Project_subtask {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'project_recent' && Boolean(data.value) && <Project_recent {...{ clickConfig, handleRemoveGrid, data, key, projectDetails }} />}
                                    {data.name === 'project_progress' && Boolean(data.value) && <Project_progress {...{ clickConfig, handleRemoveGrid, data, key, projectCount, projectDetails }} />}
                                    {data.name === 'project_stage_grid' && Boolean(data.value) && <Project_stage_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_recent' && Boolean(data.value) && (
                                        <Task_recent {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, taskCount }} />
                                    )}
                                    {data.name === 'task_progress' && Boolean(data.value) && <Task_progress {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_status' && Boolean(data.value) && <Task_status {...{ clickConfig, handleRemoveGrid, data, key, projectList }} />}

                                    {data.name === 'subtask_status' && Boolean(data.value) && <Subtask_status {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />}
                                    {data.name === 'subtask_recent' && Boolean(data.value) && <Subtask_recent {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_priority' && Boolean(data.value) && <Subtask_priority {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_type' && Boolean(data.value) && <Subtask_type {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'roles_grid' && Boolean(data.value) && <Roles_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'member_grid_small' && Boolean(data.value) && <Member_grid_small {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'roles_member_grid' && Boolean(data.value) && <Roles_member_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'permission_members_grid' && Boolean(data.value) && <Permission_members_grid {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />}
                                    {data.name === 'custom_roles_grid' && Boolean(data.value) && <Custom_roles_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'project_members_grid' && Boolean(data.value) && <Project_members_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_members_grid' && Boolean(data.value) && <Task_members_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_member_grid' && Boolean(data.value) && <Subtask_members_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'custom_permission_grid' && Boolean(data.value) && <Custom_permission_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'status' && Boolean(data.value) && <Subtask_by_status {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />}

                                </div>
                            ) : data.name === 'project_grid_small' || data.name === 'task_grid_small' || data.name === 'subtask_grid_small' ? (
                                <div className='w-[65%] mr-5 inline-block'>
                                    {data.name === 'project_grid_small' && Boolean(data.value) && (
                                        <Project_grid_small
                                            {...{
                                                projectCount,
                                                handlePaginationProject,
                                                dashboardConfigDetails,
                                                key,
                                                data,
                                                handleRemoveGrid,
                                                clickConfig,
                                                setClickConfig,
                                                dropdownData,
                                                handleSelectStatus,
                                            }}
                                        />
                                    )}
                                    {data.name === 'task_grid_small' && Boolean(data.value) && (
                                        <Task_grid_small {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, taskCount }} />
                                    )}
                                    {data.name === 'subtask_grid_small' && Boolean(data.value) && (
                                        <Subtask_grid_small {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, subtaskCount }} />
                                    )}
                                </div>
                            ) : (
                                <div className=''>
                                    {data.name === 'project_grid_XL' && Boolean(data.value) && (
                                        <Project_grid_XL
                                            {...{
                                                projectCount,
                                                handlePaginationProject,
                                                dashboardConfigDetails,
                                                key,
                                                data,
                                                handleRemoveGrid,
                                                clickConfig,
                                                setClickConfig,
                                                dropdownData,
                                                handleSelectStatus,
                                            }}
                                        />
                                    )}
                                    {data.name === 'project_grid_Large' && Boolean(data.value) && (
                                        <Project_grid_Large
                                            {...{
                                                projectCount,
                                                handlePaginationProject,
                                                dashboardConfigDetails,
                                                key,
                                                data,
                                                handleRemoveGrid,
                                                clickConfig,
                                                setClickConfig,
                                                dropdownData,
                                                handleSelectStatus,
                                            }}
                                        />
                                    )}
                                    {data.name === 'task_grid_XL' && Boolean(data.value) && (
                                        <Task_grid_XL {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, taskCount }} />
                                    )}
                                    {data.name === 'task_grid_Large' && Boolean(data.value) && (
                                        <Task_grid_large {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, taskCount }} />
                                    )}
                                    {data.name === 'Subtask_grid' && Boolean(data.value) && (
                                        <Subtask_grid_XL {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, subtaskCount }} />
                                    )}
                                    {data.name === 'subtask_grid_Large' && Boolean(data.value) && (
                                        <Subtask_grid_Large {...{ clickConfig, handleRemoveGrid, data, key, dropdownData, handleSelectStatus, subtaskCount }} />
                                    )}
                                    {data.name === 'member_grid_XL' && Boolean(data.value) && <Member_grid_XL {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'member_grid_Large' && Boolean(data.value) && <Member_grid_Large {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'activity_grid' && Boolean(data.value) && <Activity_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {/* {data.name === 'activity_Main_categories_grid' && Boolean(data.value) && <Activity_Main_categories_grid {...{ clickConfig, handleRemoveGrid, data, key }} />} */}
                                    {data.name === 'permission_grid' && Boolean(data.value) && <Permission_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            )}

                            {/*
                             */}
                            {/* 
                           
                             */}

                            {/* {data.name === 'project_Activity_grid' && Boolean(data.value) && (<Project_Activity_grid {...{ clickConfig, handleRemoveGrid, data, key }} />)}
                            {data.name === 'task_activity_grid' && Boolean(data.value) && (<Task_activity_grid {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />)}
                            {data.name === 'subtask_activity_grid' && Boolean(data.value) && (<Subtask_activity_grid {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />)}  */}
                        </>
                    );
                })}
        </>
    );
};

export default index;
