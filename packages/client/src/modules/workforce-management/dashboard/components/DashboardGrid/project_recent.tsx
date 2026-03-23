import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { formatedDate } from '@HELPER/function';
import React from 'react';
import { AiOutlineFileText } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';
import { TfiAlarmClock } from 'react-icons/tfi';

const project_recent = ({ projectDetails, clickConfig, handleRemoveGrid, data, key }) => {
    return (
        <>
            <div className={` ${clickConfig ? 'outline mt-8 pb-2' : 'outline-0'} mt-5  `}>
                {clickConfig && (
                    <div className={`flex justify-between items-center ${clickConfig ? '' : 'card-set' } p-3 w-full`}>
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
                <div className={` ${clickConfig ? 'opacity-30 w-full  ' : ' w-full '} card-set project-stage w-full inline-block align-top`}>
                    <div className='flex justify-between items-center'>
                        <h1 className='heading-medium text-lg mb-0 font-semibold sm:text-xl'>Recent Five Projects</h1>
                    </div>
                    <div className='recent-projects-wrapper mt-1 relative flex flex-col gap-2 h-[300px] sm:h-full md:h-[300px] overflow-auto'>
                        {projectDetails && projectDetails.length === 0 && (
                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                    No data
                                </th>
                            </tr>
                        )}
                        {!projectDetails && (
                            <tr>
                                <th colSpan={2}>
                                    <TinnySpinner />
                                </th>
                            </tr>
                        )}
                        {projectDetails &&
                            projectDetails.reverse().slice(0, 5).map(function (project) {
                                return (
                                    <>
                                        <div className='bg-blue-100 dark:bg-gray-700 relative py-1 rounded-lg shadow-recent-card'>
                                            <div className='py-1 px-2'>
                                                {/* <div className='group'>
                                                    <div className={`priority`}></div>
                                                </div> */}

                                                <div className=''>
                                                    <h1 className='flex justify-start items-center'>
                                                        <span className='twolines-dot text-black dark:text-[#fff]'>
                                                            <span className='font-semibold flex text-base w-[100px] truncate'>{project.projectName}</span>
                                                        </span>
                                                    </h1>
                                                    <div
                                                        className={` text-sm ${project.status === 'Todo'
                                                                ? 'bg-[#ece37bbe] text-[#b4ac4c]'
                                                                : project.status === 'Onhold'
                                                                    ? 'bg-[#ffe0a8] text-[#dd8f00]'
                                                                    : project.status === 'Done'
                                                                        ? 'bg-[#ceffce] text-green-700'
                                                                        : project.status === 'Inprogress'
                                                                            ? 'bg-[#c4dbff] text-[#6e9be3]'
                                                                            : project.status === 'Pending'
                                                                                ? 'bg-[#ffd1c9] text-[#e3806e]'
                                                                                : project.status === 'Review'
                                                                                ? 'bg-[#ffcdea] text-[#e36eb2]'
                                                                        : 'bg-[#d5f9ff] text-[#17a2b8]'
                                                                        
                                                            }  max-w-[111px] ml-auto rounded-md absolute right-2 top-2 px-2 py-1  font-semibold`}>
                                                        {project.status}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between  text-sm flex-wrap py-2'>
                                                    <div className='flex gap-[2px] items-center justify-start text-gray-500 dark:text-gray-200'>
                                                        <span>
                                                            <AiOutlineFileText />
                                                        </span>
                                                        <span className='whitespace-nowrap'>Task Count : </span>
                                                        <span
                                                            className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px] w-fit text-sm bg-[#ffe9ce] text-[#ff0055] rounded px-[4px]
                                                                        border border-[#ffca89] leading-[10px]'>
                                                            {project.taskCount ? project.taskCount : 0}
                                                        </span>
                                                    </div>
                                                    <div className='flex gap-[2px] items-center justify-end text-gray-500 dark:text-gray-200'>
                                                        <span>
                                                            <TfiAlarmClock />
                                                        </span>
                                                        <span>Created at : </span>
                                                        <span>{formatedDate(project.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default project_recent;
