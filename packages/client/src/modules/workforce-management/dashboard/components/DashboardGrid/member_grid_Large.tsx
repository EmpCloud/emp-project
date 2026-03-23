/* eslint-disable react-hooks/rules-of-hooks */
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { getAllUsers, searchMember } from '@WORKFORCE_MODULES/members/api/get';
import React, { useEffect, useState } from 'react';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const member_grid_Large = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [membersDetail, setMemberDetails] = useState(null);
    const [membersCount, setMemberCount] = useState(0);
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });
    const membersTableList = [
        { name: 'Name', value: 'firstName', visible: true },
        { name: 'Email', value: 'email', visible: true },
        { name: 'Project Count', value: 'projectCount', visible: true },
        { name: 'Assign Role', value: 'role', visible: true },
    ];

    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberCount(response.data?.body.data.InvitationCount.acceptedInvitationCount);
                setMemberDetails(response.data?.body?.data.users);
            }
        });
    };

    const handleSearchMember = event => {
        searchMember('keyword=' + event.target.value + '&invitationStatus=1').then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.user);
            }
        });
    };
    useEffect(() => {
        handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=1&suspensionStatus=false');
    }, [sortTable.limit]);

    const handlePaginationMember = condition => {
        searchMember(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.user);
            }
        });
    };
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
                        <h3 className='heading-medium'>Members</h3>
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
                        </div>
                    </div>

                    <div className='flex justify-between items-center mt-4'>
                        <div className='flex'>
                            <p className='project-details flex items-center pl-0 pr-4'>
                                <span className='mr-1'>
                                    <HiOutlineClipboardCheck />
                                </span>
                                Total Member(s) — {membersCount ? membersCount : 0}
                            </p>
                        </div>
                        <div className='wrapper relative'>
                            <SearchInput onChange={handleSearchMember} placeholder={'Search a member'} />
                        </div>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='table-style min-w-[1050px] '>
                            <thead>
                                <tr>
                                    {membersTableList &&
                                        membersTableList.map(function (data) {
                                            return (
                                                <>
                                                    <th className='w-[180px]'>
                                                        <div className='flex items-center'>
                                                            <div>{data.name}</div>
                                                        </div>
                                                    </th>
                                                </>
                                            );
                                        })}
                                </tr>
                            </thead>
                            <tbody className='max-h-[calc(100vh-250px)]'>
                                {membersDetail && membersDetail.length === 0 && (
                                    <tr>
                                        <th colSpan={2}>No data</th>{' '}
                                    </tr>
                                )}
                                {!membersDetail && (
                                    <tr>
                                        <th colSpan={2}>
                                            <TinnySpinner />
                                        </th>
                                    </tr>
                                )}
                                {membersDetail &&
                                    membersDetail.map(function (data, key) {
                                        return (
                                            <tr key={key}>
                                                <td className='w-[180px] !pt-1 !pb-1'>
                                                    <div className='flex gap-2 items-center'>
                                                        <div>
                                                            <span className='example-emoji' role='img' aria-label='duck emoji'>
                                                                <div className='user-img-group'>
                                                                    <img src={data.profilePic ? data.profilePic : '/imgs/default.png'} className='user-img-sm' alt='user' />
                                                                </div>
                                                            </span>
                                                        </div>
                                                        <div className='flex flex-col  text-left'>
                                                            <span className='pb-1 font-bold'>{data.firstName + ' ' + data.lastName}</span>
                                                            <span className='text-base'>{data.role}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className='!pt-1 !pb-1 w-[180px] '>
                                                    <div className='flex flex-col'>
                                                        <span className='text-ellipsis overflow-hidden whitespace-nowrap'>{data.email}</span>
                                                    </div>
                                                </td>

                                                <td className='!pt-1 !pb-1 w-[180px] '>
                                                    <label className='rounded-sm bg-blue-700 text-white text-center rounded-[12px] pt-2 pb-2 text-base px-4 inline-block mr-2 max-w-[50px] overflow-hidden w-full text-ellipsis whitespace-nowrap'>
                                                        {data?.Project_details?.TotalProjectCount}
                                                    </label>
                                                </td>

                                                {/* <td className='w-[180px] !pt-1 !pb-1 text-center'>
                                                    <label className='rounded-sm bg-blue-700 text-white text-center rounded-[12px] pt-2 pb-2 text-base px-4 inline-block mr-2 max-w-[50px] overflow-hidden w-full text-ellipsis whitespace-nowrap'>
                                                        {data.task_details.TotalTaskCount}
                                                    </label>
                                                </td> */}

                                                <td className='!pt-1 !pb-1 w-[180px]'>
                                                    <div className='flex items-center gap-2'>{data.role}</div>
                                                </td>

                                                {/* <td className='!pt-1 !pb-1 w-[180px]'>
                                            <span className=' text-defaultTextColor text-base'>0%</span>
                                            <div className='w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey'>
                                                <div
                                                    className='bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
                                                    style={{ width: '0%' }}></div>
                                            </div>
                                        </td> */}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                            Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to {sortTable.limit * sortTable.pageNo < membersCount ? sortTable.limit * sortTable.pageNo : membersCount} of{' '}
                            {membersCount}{' '}
                        </p>
                        <div className='flex items-center '>
                            <button
                                disabled={sortTable.pageNo == 1}
                                onClick={() => {
                                    setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                    handlePaginationMember('skip=' + 0 + '&limit=' + sortTable.limit);
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
                                disabled={sortTable.pageNo === Math.ceil(membersCount / sortTable.limit)}
                                onClick={() => {
                                    setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                    handlePaginationMember('skip=' + sortTable.skip + '&limit=' + sortTable.limit);
                                }}
                                className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                <MdKeyboardArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default member_grid_Large;
