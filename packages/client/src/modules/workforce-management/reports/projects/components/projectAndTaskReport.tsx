import React, { useEffect, useState } from 'react';
import { getAllProject } from '../../../projects/api/get';
import { getAllSubTask, getAllTask } from '../../../task/api/get';
import Task_grid_XL from './ReportGrids/task_grid_xl';
import Activity_grid from './ReportGrids/activity_grid';
import Subtask_grid_XL from './ReportGrids/subtask_grid_XL';
import Member_Chart from './ReportGrids/member_Chart';
import Project_grid_XL from './ReportGrids/project_grid_xl'
import Project_task from './ReportGrids/project_task'
import Project_budget_grid from './ReportGrids/project_budget_grid'
import Project_by_status from './ReportGrids/project_by_status'
import Budget_bubble from './ReportGrids/budget_bubble'
import NoSsr from '@COMPONENTS/NoSsr';
import toast from '../../../../../components/Toster/index';
export const index = ({ projectSelected }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const [subtaskCount, setSubtaskCount] = useState(null);
    const [projectCount, setProjectCount] = useState(0);
    const [id, setId] = useState(null);
    const [taskCount, setTotalTaskCount] = useState(null);
    useEffect(() => {
        if (projectSelected !== null) {
            setId(projectSelected?.item?._id);
            setTotalTaskCount(projectSelected?.item?.taskCount);
            setProjectList(projectSelected);
        }
    }, [projectSelected]);

    const handleGetAllProject = () => {
        getAllProject()
            .then(response => {
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
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };
    useEffect(() => {
        handleGetAllProject();
        handleGetAllTask();
        handleGetAllSubtask();
    }, []);

    const handleGetAllTask = (condition = '') => {
        getAllTask(condition)
            .then(response => {
                if (response.data?.body.status === 'success') {
                    let taskList = response.data?.body.data.tasks.map(item => {
                        return {
                            text: item.taskTitle,
                            value: item._id ? item._id : [],
                            item,
                        };
                    });
                    setTaskList(taskList);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };

    const handleGetAllSubtask = () => {
        getAllSubTask()
            .then(response => {
                if (response.data?.body.status === 'success') {
                    setSubtaskCount(response.data?.body.data.subTaskCount);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };

    return (
        <>
            <div className='w-full flex flex-col gap-5'>
                    <div className='2xl:w-full xl:w-full lg:w-full px-2'><Project_grid_XL  {...{ projectSelected}} /></div>           
                    <div className='2xl:w-full xl:w-full lg:w-full px-2'><Project_by_status {...{projectSelected }} /></div>
            </div>
            <div className='w-full flex gap-5 md:flex-row flex-col justify-between my-5'>
                    <div className='2xl:w-[49%] xl:w-[49%] lg:w-[50%] w-full px-2'><Project_task {...{projectSelected }} /></div>
                    <div className='2xl:w-[49%] xl:w-[49%] lg:w-[50%] w-full px-2'><Project_budget_grid {...{projectSelected }} /></div>
            </div>
            <div className='w-full flex gap-5 md:flex-row flex-col justify-between my-5'>
                    <div className='2xl:w-[49%] xl:w-[49%] lg:w-[50%] w-full px-2'><Budget_bubble {...{projectSelected }} /></div>
                    <div className='2xl:w-[49%] xl:w-[49%] lg:w-[50%] w-full px-2'><Member_Chart {...{projectSelected }} /></div>
            </div>
                <NoSsr>
                    <div className='2xl:w-full xl:w-full lg:w-[full] px-2'><Task_grid_XL {...{ taskCount }} Id={id} {...{projectSelected }}/></div>
                    <div className='2xl:w-full xl:w-full lg:w-[full] px-2'><Subtask_grid_XL Id={id} projectList={projectList} /></div>
                    <div className='2xl:w-full xl:w-full lg:w-[full] px-2'><Activity_grid Id={id} /></div>
                </NoSsr>
                            {/* <div className='w-full flex flex-wrap'>
                                            <Project_timeline  {...{ projectSelected}} />
                                 
                            </div> */}
        </>
    );
};

export default index;
