/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import toast from '../../../../components/Toster/index';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { addMemberApi } from '../api/post';
import SearchInput from '@COMPONENTS/SearchInput';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { getEmpUsers } from '../api/get';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
const addEmpUsers = ({  handleGetAllUser, type, empUserModel, setEmpUserModel }) => {
    let defaultValue = [];
    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const [empUserDetail, setEmpUserDetails] = useState(null);
    const [empUserCount, setEmpUserCount] = useState(0);

    useEffect(() => {
        handleGetEmpUsers('?limit=' + sortTable.limit);
    }, [sortTable.limit]);

    const handleGetEmpUsers = (condition = '') => {
        getEmpUsers(condition).then(response => {
            setEmpUserDetails(response.data.body?.data?.user_data);
            setEmpUserCount(response.data.body?.data?.total_remaining_empUser_count);
        });
    };
    const [checkedState, setCheckedState] = useState(new Array(empUserCount).fill(false));
    const handleOnChange = (data, checked) => {
        if (checked === true) {
            defaultValue.push(data);
        } else if (checked === false) {
            var index = defaultValue.indexOf(data);
            defaultValue.splice(index, 1);
        }
    };
    const handleAddUser = () => {
        addMemberApi(defaultValue)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    // && result.data.statusCode === 200
                    handleGetAllUser();
                    handleGetEmpUsers();
                    setEmpUserModel(false);
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                    setEmpUserModel(false);
                }
            })
            .catch(function (e) {
                setEmpUserModel(false);
                toast({
                    type: 'error',
                    message: e.response ? (e.response.data.body.message == 'Validation failed.' ? e.response.data.body.error : e.response.data.body.message) : 'Something went wrong, Try again !',
                });
            });
    };

    const handlePaginationEmpMember = condition => {
        getEmpUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setEmpUserDetails(response.data.body?.data?.user_data);
            }
        });
    };
    const handleSearchMember = event => {
        getEmpUsers('?search=' + event.target.value).then(response => {
            if (response.data.body.status === 'success') {
                setEmpUserDetails(response.data?.body?.data?.user_data);
            }
        });
    };
    return (
        <>
            <button
                onClick={() => {
                    setEmpUserModel(true);
                }}
                className='small-button items-center py-2 flex h-9'>
                <div className='flex items-center'>
                    <p className='m-0 p-0'>Add EmpMonitor Members</p>
                </div>
            </button>
            {empUserModel && (
                <>
                    <div className='justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none'>
                        <div className='relative my-2 mx-auto w-11/12 z-50'>
                            {/*content*/}
                            <div className='border-0 mb-7 sm:mt-8 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                                {/*header*/}
                                {/*body*/}
                                <div className='relative py-5 sm:px-3 p-3 md:px-10 flex-auto'>
                                    <button
                                        className='text-lightGrey hover:text-darkTextColor absolute -right-2 -top-2 rounded-full bg-veryLightGrey  uppercase  text-sm outline-none focus:outline-none p-1 ease-linear transition-all duration-150'
                                        type='button'
                                        onClick={() => setEmpUserModel(false)}>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
                                            <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
                                        </svg>
                                    </button>
                                    <div className='rounded-lg bg-white'>
                                        {/* body task popup start here */}
                                        <>
                                            <div className='flex justify-between'>
                                                <h2 className='heading-big'>Add EmpMonitor Employees</h2>
                                                <button
                                                    // disabled={existingUser.length !== 0}
                                                    className='small-button items-center xs:w-full py-2 flex h-9 mb-2'
                                                    onClick={handleAddUser}>
                                                    Add Member
                                                    <svg xmlns='http://www.w3.org/500/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7'></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <p className='project-details flex items-center pl-0 pr-4'>
                                                <span className='mr-1'>
                                                    <HiOutlineClipboardCheck />
                                                </span>
                                                Total Member(s) — {empUserCount ? empUserCount : 0}
                                            </p>

                                            {/* empUserDetail */}
                                            <div className='relative overflow-x-auto mt-8'>
                                                <div className='flex justify-between items-center my-4'>
                                                    <h3 className='heading-medium'>
                                                        <div className='flex items-center '>
                                                            <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                                            <select
                                                                value={sortTable.limit}
                                                                onChange={event => {
                                                                    setSortTable({ ...sortTable, limit: event.target.value ,skip: event.target.value, pageNo: 1});
                                                                }}
                                                                className='border py-1  rounded-md outline-none w-15 text-base px-2 mx-1'>
                                                                <option value={10}>10</option>
                                                                <option value={25}>25</option>
                                                                <option value={50}>50</option>
                                                                <option value={100}>100</option>
                                                                <option value={500}>500</option>
                                                            </select>
                                                            <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                                                        </div>
                                                    </h3>
                                                    <div className='flex items-center'>
                                                        <div className='flex items-center' id='step2'>
                                                            <SearchInput  onChange={handleSearchMember} placeholder={'Search a member'} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                                                    <thead className='text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                                        <tr>
                                                            <th scope='col' className='px-6 py-3'>
                                                                sno
                                                            </th>
                                                            <th scope='col' className='px-6 py-3'>
                                                                Email
                                                            </th>
                                                            <th scope='col' className='px-6 py-3'>
                                                                First Name
                                                            </th>
                                                            <th scope='col' className='px-6 py-3'>
                                                                Last Name
                                                            </th>
                                                            <th scope='col' className='px-6 py-3'>
                                                                Role
                                                            </th>
                                                            <th scope='col' className='px-6 py-3'>
                                                                Permission
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {empUserDetail && empUserDetail.length === 0 && (
                                                            <tr>
                                                                <th colSpan={2}>No data</th>{' '}
                                                            </tr>
                                                        )}
                                                        {!empUserDetail && (
                                                            <tr>
                                                                <th colSpan={2}>
                                                                    <TinnySpinner />
                                                                </th>
                                                            </tr>
                                                        )}
                                                        {empUserDetail &&
                                                            empUserDetail.map(function (data, key, index) {
                                                                return (
                                                                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700' key={key}>
                                                                        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                            <input
                                                                                checked={checkedState[index]}
                                                                                id='checked-checkbox'
                                                                                type='checkbox'
                                                                                value=''
                                                                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                                                                                onChange={e => handleOnChange(data, e.target.checked)}
                                                                            />
                                                                        </th>
                                                                        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                            {data.email}
                                                                        </th>
                                                                        <td className='px-6 py-4'>{data.firstName}</td>
                                                                        <td className='px-6 py-4'>{data.lastName}</td>
                                                                        <td className='px-6 py-4'>{data.role}</td>
                                                                        <td className='px-6 py-4'>read</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className='flex justify-between items-center'>
                                                <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                                    Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                                    {sortTable.limit * sortTable.pageNo < empUserCount ? sortTable.limit * sortTable.pageNo : empUserCount} of {empUserCount?empUserCount: 0}{' '}
                                                </p>
                                                <div className='flex items-center '>
                                                    <button
                                                        disabled={sortTable.pageNo == 1}
                                                        onClick={() => {
                                                            setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                                            handlePaginationEmpMember('?skip=' + 0 + '&limit=' + sortTable.limit);
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
                                                        disabled={sortTable.pageNo === Math.ceil(empUserCount / sortTable.limit)}
                                                        onClick={() => {
                                                            setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: +(sortTable.pageNo * sortTable.limit) + +sortTable.limit });
                                                            handlePaginationEmpMember('?skip=' + sortTable.skip + '&limit=' + sortTable.limit);
                                                        }}
                                                        className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                                        <MdKeyboardArrowRight />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                        {/* body task popup end here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='opacity-25 fixed inset-0 z-100 bg-black' onClick={() => setEmpUserModel(false)}></div>
                    </div>
                </>
            )}
        </>
    );
};
export default addEmpUsers;
