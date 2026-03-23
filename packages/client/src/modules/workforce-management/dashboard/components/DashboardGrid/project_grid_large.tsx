/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-undef */
import DropDown from '@COMPONENTS/DropDown';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { apiIsNotWorking, formatedDate } from '@HELPER/function';

import { getAllProject, searchProject } from '@WORKFORCE_MODULES/projects/api/get';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineClipboardCheck, HiOutlineUser, HiCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const project_grid_large = ({ key, projectCount, data, clickConfig, handleRemoveGrid, dropdownData, handleSelectStatus }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });

    const handleGetAllProject = (condition = '') => {
        getAllProject(condition).then(response => {
            if (response && response.data?.body.status === 'success') {
                setProjectDetails(response.data?.body.data.project);
            }
        });
    };

    useEffect(() => {
        handleGetAllProject('?limit=' + sortTable.limit);
    }, [sortTable.limit]);
    const handleSearchProject = event => {
        searchProject('keyword=' + event.target.value + '&limit=' + sortTable.limit).then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response.data.body.status === 'success') {
                setProjectDetails(response.data.body.data.project);
            }
          
        });
    };
    const handlePaginationProject = condition => {
        searchProject(condition).then(response => {
            if (response.data.body.status === 'success') {
                setProjectDetails(response.data.body.data.project);
            }
        });
    };

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
                    <div className='card p-4 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium'>Projects</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value });
                                    }}
                                    className='border py-1  rounded-md outline-none w-15 text-base px-2 mx-1'>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={25}>25</option>
                                </select>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                                {/* <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                /> */}
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center pl-0 pr-4'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    Total Project(s) — {projectCount ? projectCount : 0}
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchProject} placeholder={'Search a project'} />
                            </div>
                        </div>
                        <div className=' mt-4 gap_5'>
                            <div className='overflow-x-auto relative shadow-md sm:rounded-lg w-full'>
                                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                    <thead className='text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                        <tr>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Project Name</div>
                                            </th>

                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>start Date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>End Date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Owner</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Manager</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Plan budget</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Tasks</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    {projectDetails && projectDetails.length === 0 && (
                                         <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                         <th
                                           colSpan={10}
                                           scope="row"
                                           className="col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                         >
                                           No data
                                         </th>
                                       </tr>
                                    )}
                                    {!projectDetails && (
                                        <tr>
                                            <th colSpan={10}>
                                                <TinnySpinner />
                                            </th>
                                        </tr>
                                    )}
                                    <tbody>
                                        {projectDetails &&
                                            projectDetails.map(function (project) {
                                                return (
                                                    <>
                                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {project.projectName}
                                                            </th>

                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {formatedDate(project.startDate)}
                                                            </th>
                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {formatedDate(project.endDate)}
                                                            </th>
                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex -space-x-4'>
                                                                    {project.userAssigned?.filter(function ({ role }) {
                                                                        return role === 'owner';
                                                                    }).length == 0 && <>Not Assigned</>}

                                                                    {project.userAssigned
                                                                        ?.filter(function (d) {
                                                                            return d ? d.role === 'owner' : [];
                                                                        })
                                                                        .map(function (d1) {
                                                                            return d1 ? (
                                                                                <ToolTip className='relative w-[38px] bg-white h-[38px] shadow-md rounded-full' message={d1.firstName}>
                                                                                    <img
                                                                                        src={d1.profilePic ?? USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </ToolTip>
                                                                            ) : (
                                                                                ' '
                                                                            );
                                                                        })}
                                                                </div>
                                                            </th>
                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex  -space-x-4'>
                                                                    {project.userAssigned?.filter(function ({ role }) {
                                                                        return role === 'manager';
                                                                    }).length == 0 && <>Not Assigned</>}

                                                                    {project.userAssigned?.filter(function (d) {
                                                                            return d ? d.role === 'manager' : [];
                                                                        })
                                                                        .map(function (d1) {
                                                                            return d1 ? (
                                                                                <ToolTip className='relative w-[38px] bg-white h-[38px] shadow-md rounded-full' message={d1.firstName}>
                                                                                    <img
                                                                                        src={d1.profilePic ?? USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </ToolTip>
                                                                            ) : (
                                                                                ' '
                                                                            );
                                                                        })}
                                                                </div>
                                                            </th>

                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                {project.plannedBudget} {project.currencyType}
                                                            </th>
                                                            <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <label className=' bg-blue-700 text-white text-center rounded-[12px] pt-2 pb-2 text-base px-4 inline-block mr-2 max-w-[50px] overflow-hidden w-full text-ellipsis whitespace-nowrap'>
                                                                    {project.taskCount ? project.taskCount : 0}
                                                                </label>
                                                            </th>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            {projectDetails && projectDetails.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                        {sortTable.limit * sortTable.pageNo < projectCount ? sortTable.limit * sortTable.pageNo : projectCount} of {projectCount}{' '}
                                    </p>
                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                                handlePaginationProject('skip=' + 0 + '&limit=' + sortTable.limit);
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
                                            disabled={sortTable.pageNo === Math.ceil(projectCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                                handlePaginationProject('skip=' + sortTable.skip + '&limit=' + sortTable.limit);
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
        </>
    );
};

export default project_grid_large;
