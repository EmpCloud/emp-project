/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { formatedDate } from '@HELPER/function';
import ToolTip from '@COMPONENTS/ToolTip';
import NewToolTip from '@COMPONENTS/NewToolTip';

const project_subtask = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [subtaskDetails, setSubtaskDetails] = useState(null);
    const [projectList, setProjectList] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllProject().then(response => {
            if (response.data?.body.status === 'success') {
                let projectList = response.data?.body.data.project.map(project => {
                    return {
                        text: project.projectName,
                        value: project._id ? project._id : [],
                        project,
                    };
                });
                setProjectList(projectList);
            }
        });
    }, []);

    const filterSubTask = _id => {
        if (!projectList) return false;
        let subtaskTemp = projectList.filter(project => project.value == _id);
        setSubtaskDetails(subtaskTemp[0]?.project?.subTaskDetails);
    };

    useEffect(() => {
        filterSubTask(projectList && projectList[0]?.value);
    }, [projectList]);

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
                    <div className={`card project-by-status w-full inline-block align-top`}>
                        <div className='grid grid-cols-2 justify-between items-center mb-6'>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl'>Project SubTask</h1>
                            <div className={` filter-wrap  transition-all max-w-xs md:w-full py-2`}>
                                <form className=''>
                                    <FloatingOnlySelectfield
                                        label={undefined}
                                        optionsGroup={projectList}
                                        value={selectedOption ?? ''}
                                        onChange={event => {
                                            setSelectedOption(event.target.value);
                                            filterSubTask(event.target.value);
                                        }}
                                    />
                                </form>
                            </div>
                        </div>

                        <div className='table-wrapper'>
                            <table className='table-style employess-details-table scrollbar:!h-1.5'>
                                <thead className='text-gray-700 uppercase !border-b-0 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                    <tr>
                                        <th className=' '>Subtasks</th>
                                        <th className=' '>Category</th>
                                        <th className=' '>Due Date</th>
                                        <th className='!w-auto  '>Created By</th>
                                        <th className=''>Status</th>
                                    </tr>
                                </thead>
                                {subtaskDetails && subtaskDetails.length === 0 && (
                                    <tr className='bg-white dark:bg-gray-800 '>
                                        <th scope='row' className='col-span-3 text-center pt-16 py-4 px-6 font-medium text-xl text-gray-900 whitespace-nowrap dark:text-white'>
                                            No data
                                        </th>
                                    </tr>
                                )}
                                {!subtaskDetails && (
                                    <tr>
                                        <th colSpan={2} className='h-[56.6px]'>
                                            Select Project
                                        </th>
                                    </tr>
                                )}
                                <tbody className='max-h-[calc(100vh-330px)]'>
                                    {subtaskDetails &&
                                        subtaskDetails.map(function (subtask, index) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize'>{subtask.subTaskTitle}</h5>
                                                        </div>
                                                    </td>
                                                    <td>{subtask.category}</td>
                                                    <td>{formatedDate(subtask.dueDate)}</td>
                                                    <td className='!w-auto'>
                                                        <div className='user-profile-img user-img-group items-center cursor-pointer'>
                                                            <div className='relative w-[38px] bg-white h-[38px] shadow-md rounded-full relative flex flex-col items-center group'>
                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-fullrelative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={subtask.subTaskCreator.firstName}>
                                                                    <img
                                                                                       
                                                                        src={ subtask.subTaskCreator.profilePic ?? "https://avatars.dicebear.com/api/bottts/"+ subtask.subTaskCreator.firstName+".svg"}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='flex'>
                                                        <span className={` py-1 px-3 rounded font-bold transition-all hover:shadow-md `}>{subtask.subTaskStatus}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default project_subtask;
