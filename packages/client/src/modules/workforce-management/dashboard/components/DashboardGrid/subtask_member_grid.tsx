/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { getAllSubTask } from '@WORKFORCE_MODULES/task/api/get';
import { ImCross } from 'react-icons/im';

const ChartComponent = dynamic(() => import('../graph/SubtaskMemberChart'), { ssr: false });
const subtask_member_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [memberDetails, setMemberDetails] = useState(null);
    const [subtaskList, setSubtaskList] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllSubTask().then(response => {
            if (response.data?.body.status === 'success') {
                let subtaskList = response.data?.body.data.subTasks.map(item => {
                    return {
                        text: item.subTaskTitle,
                        value: item._id ? item._id : [],
                        item,
                    };
                });
                setSubtaskList(subtaskList);
            }
        });
    }, []);

    const filterMembers = _id => {
        if (!subtaskList) return false;
        let tempMembers = subtaskList.filter(data => data.value == _id);
        setMemberDetails(
            tempMembers[0]?.item?.subTaskAssignedTo.map(d => {
                return { category: `${d.firstName} ${d.lastName}` };
            })
        );
    };

    useEffect(() => {
        if(!subtaskList)
        filterMembers(subtaskList && subtaskList[0].value);
    }, [subtaskList]);

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
                            <h1 className='heading-medium text-base mb-0 sm:text-xl '>Members in a Subtask</h1>
                            <div className='flex justify-center items-center text-sm pl-1 sm:text-xl rounded'>
                                <FloatingOnlySelectfield
                                    label={undefined}
                                    optionsGroup={subtaskList}
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

export default subtask_member_grid;
