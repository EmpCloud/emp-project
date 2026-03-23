/* eslint-disable react-hooks/rules-of-hooks */
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { getAllUsers, searchMember } from '@WORKFORCE_MODULES/members/api/get';
import React, { useEffect, useState } from 'react';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import router from 'next/router';

const member_grid_XL = ({ clickConfig, handleRemoveGrid, data, key }) => {
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
        { name: 'Task Count', value: 'taskCount', visible: true },
        { name: 'Assign Role', value: 'assignRole', visible: true },
        { name: 'Performance', value: 'performance', visible: true },
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
                setMemberDetails(response?.data?.body?.data?.user);
            }
        });
    };
    useEffect(() => {
        handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=1&suspensionStatus=false');
    }, [sortTable.limit]);

    const handlePaginationMember = condition => {
        handleGetAllUser(condition)
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
                    <div className='card-lg p-7 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium font-semibold'>Member</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value ,pageNo:1});
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

                        <div className='flex flex-wrap justify-between items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center relative text-darkTextColor px-2 py-1'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    Total Member<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-base text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{membersCount ? membersCount : 0}</span>
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchMember} placeholder={'Search a member'} />
                            </div>
                        </div>

                        <div className='overflow-x-auto mt-4 max-h-[300px]'>
                            <table className='table-style min-w-[200px] '>
                                <thead className='sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        {membersTableList &&
                                            membersTableList.map(function (data) {
                                                return (
                                                    <>
                                                        <th scope='col' className={`py-3 px-6 w-[200px]`}>
                                                            <div className={`flex items-center ${data.name==='Name'?'justify-start':'justify-center'}`}>
                                                                {data.name}
                                                            </div>
                                                        </th>
                                                    </>
                                                );
                                            })}
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {membersDetail && membersDetail?.length === 0 && (
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
                                                    <td className='w-[200px] !pt-1 !pb-1'>
                                                        <div className='flex gap-2 items-center w-full'>
                                                                <div className='example-emoji w-[20%]' role='img' aria-label='duck emoji'>
                                                                    <div className='user-img-group'>
                                                                        <img src={data.profilePic ? data.profilePic : '/imgs/default.png'} className='user-img-sm' alt='user' />
                                                                    </div>
                                                                </div>
                                                            <div className='flex flex-col w-[80%] text-left'>
                                                                <span className='pb-1 font-bold break-all'
                                                                  onClick={event => {
                                                                    router.push('/w-m/members/' + data._id);
                                                                }}
                                                                >{data.firstName + ' ' + data.lastName}</span>
                                                                <span className='text-base break-words'>{data.role}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className='flex justify-center'>
                                                            <span className='text-ellipsis overflow-hidden break-words whitespace-nowrap'>{data.email}</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className=' flex justify-center'>

                                                        <span className='rounded-sm bg-blue-700 text-white w-10 text-base px-4  overflow-hidden text-ellipsis whitespace-nowrap'>
                                                            {data.Project_details.TotalProjectCount}
                                                        </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className='flex justify-center'>

                                                        <span className='rounded-sm bg-blue-700 text-white w-10 text-base px-4  overflow-hidden text-ellipsis whitespace-nowrap'>
                                                            {data.task_details.TotalTaskCount}
                                                        </span>
                                                        </div>
                                                    </td>

                                                    <td className=''>
                                                        <div className='flex items-center justify-center gap-2'>{data.role}</div>
                                                    </td>

                                                    <td className=''>
                                                        {/* progressbar */}
                                                        <span className=' text-defaultTextColor text-base'>{data.progress ?? 0} %</span>
                                                        <div className='w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey overflow-hidden'>
                                                       <div className='bg-redColor h-2 rounded-full' style={{ width: `${data.progress ?? 0}%` }} ></div></div>
                                                    </td>
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
                                        handlePaginationMember('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit+ '&invitationStatus=1&suspensionStatus=false');
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 ,skip: (sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)});
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
                                        setSortTable({
                                            ...sortTable,
                                            pageNo: sortTable.pageNo + 1,
                                            skip: sortTable.pageNo * sortTable.limit,
                                        });
                                        handlePaginationMember('?skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit+ '&invitationStatus=1&suspensionStatus=false');
                                    }}
                                    className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default member_grid_XL;
