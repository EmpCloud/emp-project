/* eslint-disable react-hooks/rules-of-hooks */
import { getAllSubTask } from '@WORKFORCE_MODULES/task/api/get';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { GiConsoleController } from 'react-icons/gi';
import { ImCross } from 'react-icons/im';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
const SubtaskProgress = dynamic(() => import('../graph/SubtaskProgressChart'), { ssr: false });
const subtask_progress = ({ clickConfig, handleRemoveGrid, data, key, taskList }) => {
    const [subtaskData, setSubtaskData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        if (taskList && taskList.length != 0) {
            handleGetAllSubtask(`?limit=${process.env.TOTAL_USERS}&taskId=${taskList[0]?.value}`);
        }
    }, [taskList]);
    const handleGetAllSubtask = condition => {
        getAllSubTask(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setSubtaskData(response.data?.body.data.subTasks);
            }
        });
    };
    const labels = [];
    const progress_in_percent = [];
    subtaskData &&
        subtaskData.map(subtask => {
            labels.push(subtask.subTaskTitle ?? 'Subtask Name');
            progress_in_percent.push(subtask.progress ?? 0);
        });
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
            <div className={clickConfig ? 'opacity-30  w-full' : 'mt-5'}>
                <div className={`card-set !pl-0 project-stage w-full inline-block align-top `}>
                    <div className='flex justify-between items-center mb-1'>
                        <h1 className='heading-medium text-base mb-0 pl-7 sm:text-xl font-semibold'>SubTask Progress</h1>
                        <div className='sm:text-xl rounded w-full md:w-[8rem]'>
                            <FloatingOnlySelectfield
                                label={undefined}
                                optionsGroup={taskList}
                                value={selectedOption ?? ''}
                                // className={`!mb-0`}
                                onChange={event => {
                                    setSelectedOption(event.target.value);
                                    handleGetAllSubtask(`?taskId=${event.target.value}&limit=${process.env.TOTAL_USERS}`);
                                }}
                            />
                        </div>
                    </div>
                    <div id='subTaskProgress' className='member-chart-wrapper project-progress-slid overflow-hidden text-ellipsis w-full whitespace-nowrap overflow-x-hidden max-h-[300px] overflow-y-auto'>
                        <SubtaskProgress labels={labels} progress_in_percent={progress_in_percent} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default subtask_progress;
