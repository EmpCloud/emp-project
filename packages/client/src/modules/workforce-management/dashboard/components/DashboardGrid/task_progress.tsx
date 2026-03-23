/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ImCross } from 'react-icons/im';
import { getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
const TaskProgress = dynamic(() => import('../graph/TashProgressChart'), { ssr: false });

const task_progress = ({ clickConfig, handleRemoveGrid, data, key ,projectList}) => {
    const [taskDetails, setTaskDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [taskStatusCount, setTaskStatusCount] = useState('');

    useEffect(() => {
        if (projectList && projectList.length > 0) {
        handleGetAllTask(`?limit=${process.env.TOTAL_USERS}&projectId=${projectList[0].value}`);
        }
    }, [projectList]);

    const handleGetAllTask = (condition = '') => {
        getAllTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setTaskDetails(response.data?.body.data.tasks);
            }
        });
    };
    const labels = [];
    const progress_in_percent = [];

    taskDetails &&
        taskDetails.map(task => {
            const truncatedTitle = task.taskTitle ? (task.taskTitle.length > 25 ? task.taskTitle.slice(0, 25) + '...' : task.taskTitle) : 'Task Name';
            labels.push(truncatedTitle);
            progress_in_percent.push(task.progress ?? 0);
        });

    

    return (
        <>
            <div className={` ${clickConfig ? 'outline ' : 'outline-0'}  mt-4`}>
                {clickConfig && (
                    <div className='flex justify-between items-center card p-4 w-full'>
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
                <div className={clickConfig ? 'opacity-30  w-full' : 'mt-5'}>
                    <div className={`card-set pl-0 project-stage w-full inline-block align-top `}>
                        <div className='flex justify-between items-center mb-1'>
                            <h1 className='heading-medium text-base w-2/4 mb-0 pl-5 sm:text-xl font-semibold'>Task Progress</h1>
                            <div className='flex justify-center w-[4rem] md:w-[8rem] items-center text-sm pl-1 sm:text-xl rounded'>
                                <FloatingOnlySelectfield
                                    label={undefined}
                                    optionsGroup={projectList}
                                    value={selectedOption ?? ''}
                                    // className={`!mb-0`}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        handleGetAllTask(`?projectId=${event.target.value}&limit=${process.env.TOTAL_USERS}`);
                                    }}
                                />
                            </div>
                        </div>
                        <div  id='taskProgress' className='member-chart-wrapper project-progress-slid'>
                            <TaskProgress labels={labels} progress_in_percent={progress_in_percent} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default task_progress;

