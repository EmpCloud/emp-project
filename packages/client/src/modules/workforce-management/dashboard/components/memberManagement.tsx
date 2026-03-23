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

export const index = ({ dashboardConfigDetails, clickConfig, setClickConfig, setDashboardConfigDetails}) => {
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

    const handleUpdateDashboardConfig = (data) => {
        let obj ={};
        data.map((d)=>{ 
            obj[d.name] = d.value;
            return obj;       
        })
        updateDashboardConfig("4",obj)
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
            <div className='flex flex-wrap justify-center md:justify-between mb-16'>
            {dashboardConfigDetails &&
                dashboardConfigDetails.map(function (data, key) {
                    return (
                        <>
                            {data.name === 'roles_member_grid' || data.name === 'permission_members_grid' ? (
                                <div className='w-full md:w-[49%]'>
                                    {data.name === 'permission_members_grid' && Boolean(data.value) && <Permission_members_grid {...{ clickConfig, handleRemoveGrid, data, key, taskList }} />}
                                    {data.name === 'roles_member_grid' && Boolean(data.value) && <Roles_member_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : data.name === 'task_members_grid' || data.name === 'project_member' || data.name === 'subtask_member_grid' ? (
                                <div className='w-full md:w-[32%]'>
                                    {data.name === 'project_member' && Boolean(data.value) && <Project_members_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'task_members_grid' && Boolean(data.value) && <Task_members_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'subtask_member_grid' && Boolean(data.value) && <Subtask_members_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                </div>
                            ) : (
                                <div className='w-full'>
                                    {data.name === 'member_grid_XL' && Boolean(data.value) && <Member_grid_XL {...{ clickConfig, handleRemoveGrid, data, key }} />}
                                    {data.name === 'permission_grid' && Boolean(data.value) && <Permission_grid {...{ clickConfig, handleRemoveGrid, data, key }} />}
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
