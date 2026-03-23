/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { formatedDate } from '@HELPER/function';
import { getProjectActivity } from '@WORKFORCE_MODULES/projects/api/get';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const project_Activity_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [projectActivity, setProjectActivity] = useState(null);
    const [projectActivityCount, setProjectActivityCount] = useState(0);
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });
    const handleGetAllProject = (condition = '') => {
        getProjectActivity(condition).then(response => {
            if (response.data.body.status === 'success') {
                setProjectActivity(response.data.body.data);
            }
        });
    };

    useEffect(() => {
        handleGetAllProject('?limit=' + sortTable.limit);
    }, [sortTable.limit]);
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
            <div className={clickConfig ? 'opacity-30 ' : 'mt-5'}>
                <div className='card p-7 w-full d-flex'>
                    <div className='flex justify-between items-center'>
                        <h3 className='heading-medium'>Project Activity</h3>
                        <div className='flex items-center'>
                            <p className='p-0 m-0 text-lightTextColor text-sm'>Show</p>
                            <select
                                value={sortTable.limit}
                                onChange={event => {
                                    setSortTable({ ...sortTable, limit: event.target.value });
                                }}
                                className='border py-1  rounded-md outline-none w-15 h-8 text-base px-2 mx-1'>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                            </select>
                            <p className='p-0 m-0 text-lightTextColor text-sm'>Entries</p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mt-4'>
                        {/* <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchProject} placeholder={'Search a project'} />
                            </div> */}
                    </div>
                    <div className='mt-4'>
                        <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
                            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                <thead className='text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                    <tr>
                                        <th scope='col' className='py-3 px-6'>
                                            <div className='flex items-center'>Project Name</div>
                                        </th>
                                        <th scope='col' className='py-3 px-6'>
                                            <div className='flex items-center'>Activity</div>
                                        </th>
                                        <th scope='col' className='py-3 px-6'>
                                            <div className='flex items-center'>Category</div>
                                        </th>
                                        <th scope='col' className='py-3 px-6'>
                                            <div className='flex items-center'>Done By</div>
                                        </th>
                                        <th scope='col' className='py-3 px-6'>
                                            <div className='flex items-center'>Created At</div>
                                        </th>
                                        <th scope='col' className='py-3 px-6'>
                                            <div className='flex items-center'>Updated At</div>
                                        </th>
                                    </tr>
                                </thead>
                                {projectActivity && projectActivity.length === 0 && (
                                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                        <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                            No data
                                        </th>
                                    </tr>
                                )}
                                {!projectActivity && (
                                    <tr>
                                        <th colSpan={10} className='items-center'>
                                            <TinnySpinner />
                                        </th>
                                    </tr>
                                )}
                                <tbody>
                                    {projectActivity &&
                                        projectActivity.map(function (project) {
                                            return (
                                                <>
                                                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                        <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            {project.projectName}
                                                        </th>
                                                        <th scope='row' className='max-w-[250px] w-auto py-4 px-6 font-medium text-gray-900 dark:text-white'>
                                                            <span className='overflow-hidden text-ellipsis inline-block overflow-y-auto overflow-x-hidden max-h-[78px] whitespace-normal break-words w-full'>
                                                                {project.activity}
                                                            </span>
                                                        </th>
                                                        <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            {project.category}
                                                        </th>
                                                        <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className='flex mb-5 -space-x-4'>
                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={project.userDetails.name}>
                                                                    <img
                                                                        key={key}
                                                                        src={project.userDetails.profilePic}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='-'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </th>
                                                        <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            {formatedDate(project.createdAt)}
                                                        </th>

                                                        <th scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            {formatedDate(project.updatedAt)}
                                                        </th>
                                                    </tr>
                                                </>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        {projectActivity && projectActivity.length != 0 && (
                            <div className='flex justify-between items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                    Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                    {sortTable.limit * sortTable.pageNo < projectActivityCount ? sortTable.limit * sortTable.pageNo : projectActivityCount} of {projectActivityCount}{' '}
                                </p>
                                <div className='flex items-center '>
                                    <button
                                        disabled={sortTable.pageNo == 1}
                                        onClick={() => {
                                            setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                            handleGetAllProject('skip=' + 0 + '&limit=' + sortTable.limit);
                                        }}
                                        className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowLeft />
                                    </button>
                                    <div className='pages'>
                                        <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                            Page <span>{sortTable.pageNo}</span>
                                        </p>
                                    </div>
                                    <button
                                        disabled={sortTable.pageNo === Math.ceil(projectActivityCount / sortTable.limit)}
                                        onClick={() => {
                                            setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                            handleGetAllProject('?skip=' + sortTable.skip + '&limit=' + sortTable.limit);
                                        }}
                                        className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                        <MdKeyboardArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default project_Activity_grid;
