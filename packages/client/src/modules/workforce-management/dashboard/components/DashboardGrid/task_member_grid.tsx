/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { ImCross } from 'react-icons/im';

const ChartComponent = dynamic(() => import('../graph/MembersChart'), { ssr: false });
const task_member_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [memberDetails, setMemberDetails] = useState(null);
    const [taskList, setTaskList] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllTask().then(response => {
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
    }, []);

    const filterMembers = _id => {
        if (!taskList) return false;
        let tempMembers = taskList.filter(data => data.value == _id);
        setMemberDetails(
            tempMembers[0]?.item?.assignedTo.map(d => {
                return { category: `${d.firstName} ${d.lastName}` };
            })
        );
    };

    useEffect(() => {
        if(taskList && taskList.length != 0)
        filterMembers(taskList && taskList[0].value);
    }, [taskList]);

    useEffect(() => {}, [memberDetails]);
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
                    <div className={`card project-stage w-full inline-block align-top mt-4 `}>
                        <div className='grid grid-cols-2 justify-between items-center mb-1 '>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl '>Members in a Task</h1>
                            <div className='flex justify-center items-center text-sm pl-1 sm:text-xl rounded'>
                                <FloatingOnlySelectfield
                                    label={undefined}
                                    optionsGroup={taskList}
                                    value={selectedOption ?? ''}
                                    className={`!mb-0`}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterMembers(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='member-chart-wrapper'>
                            <ChartComponent Data={memberDetails} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default task_member_grid;
