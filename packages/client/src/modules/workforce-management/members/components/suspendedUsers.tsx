/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { BiUnlink } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
import Cookies from 'js-cookie';
import { searchMember, getAllSuspendedUsers } from '../api/get';
import TinnySpinner from '../../../../components/TinnySpinner';
import { forceDeleteAllUser, forceDeleteUserById } from '../api/delete';
import DeleteConformation from '../../../../components/DeleteConformation';
import toast from '../../../../components/Toster/index';
import { unblockMemberById } from '../api/put';
import SearchInput from '../../../../components/SearchInput';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { formatedDate } from "@HELPER/function";

import UnblockConfirmation from '@COMPONENTS/UnblockConfirmation';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
const restoreUsers = ({ startLoading, stopLoading }) => {
    const [membersDetail, setMemberDetails] = useState(null);
    const [membersCount, setMembersCount] = useState(0);

    const [deleteUserId, setDeleteUserId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);

    const [recoverUserId, setRecoverUserId] = useState(null);
    const [restoreMessage, setRestoreMessage] = useState(null);
    const [openRestoreModel, setOpenRestoreModel] = useState(false);

    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [permission, setPermission] = useState(null);
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    }
    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const membersTableList = [
        { name: 'Name', value: 'firstName', visible: true },
        { name: 'Email', value: 'email', visible: true },
        { name: 'Suspended At', value: 'suspendedAt', visible: true },
        { name: 'Role', value: 'assignRole', visible: true },
        { name: 'Permission', value: 'performance', visible: true },
        { name: 'Action', value: 'action', visible: true },
    ];
    const isEmpAdmin = Cookies.get('isEmpAdmin');

    useEffect(() => {
        handleProfileData();
        // document.querySelector('body').classList.add('bodyBg');
    }, []);
    const handleCloseDeleteModel = () => {
        setOpenDeleteModel(!openDeleteModel);
    };
    const handleCloseRestoreModel = () => {
        setOpenRestoreModel(!openRestoreModel);
    };


    const handleGetAllDeletedUser = (condition = "") => {
        getAllSuspendedUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body.data.fetchusers);
                setMembersCount(response.data?.body.data.count);
            }
        });
    };
    useEffect(() => {
        if(permission?.roles.delete === true || Cookies.get("isAdmin") === "true"){
            handleGetAllDeletedUser();
        }
    }, [permission]);

    const handleDeleteUserById = () => {
        forceDeleteUserById(deleteUserId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllDeletedUser('?limit=' + sortTable.limit);
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteModel(false);
    };
    const handleDeleteAllProject = () => {
        forceDeleteAllUser()
            .then(function (result) {
                // stopLoading();
                if (result.data.body.status == 'success') {
                    handleGetAllDeletedUser();
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                // stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.messagee : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteAllModel(false);
    };

    const handleRecoverUserById = () => {
        const requestBody = {
            isSuspended: false,
        };
    
        unblockMemberById(recoverUserId, requestBody)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllDeletedUser('?limit=' + sortTable.limit);
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                } else {
                    toast({
                        type: 'error',
                        message: result ? result.data.body.message : 'Error',
                    });
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    
        setOpenRestoreModel(false);
    };
    
    const handleSearchMember = event => {
        // searchMember().then(response => {
        //     if (response.data.body.status === 'success') {
        //         setMemberDetails(response.data?.body?.data?.user);
        //     }
        // });
    };

    const handlePaginationMember = condition => {
        searchMember(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.user);
            }
        });
    };

    return (
        <>
            {permission && permission.user.delete === false ? <NoAccessCard /> : <>
                <div className='font-inter'>
                    <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                        <div className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1'>Suspended Users<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{membersCount}</span></div>
                        <div className='flex items-center'>
                            <div className='relative mr-3'></div>

                            {membersDetail && membersDetail.length > 0 && (
                                <div className='relative mr-3'>
                                    {/* <NewToolTip direction='left' message={'Download'}>
                                    <DropDown
                                        data={download_data}
                                        defaultValue={''}
                                        name={'memberList'}
                                        downloadData={}
                                        icon={
                                            <span className='text-2xl grey-link bg-white p-2 rounded-lg'>
                                                <BsDownload />
                                            </span>
                                        }
                                        getData={undefined}
                                    />
                                </NewToolTip> */}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='card'>
                        <div className='flex justify-between items-center mt-2'>
                            <div className='flex items-center '>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value });
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
                            {/* <div className='flex items-center'>
                                <button onClick={() => { setOpenDeleteAllModel(true) }} className='delete-button items-center py-2 flex h-9'>
                                    <div className='flex items-center'>
                                        <p className='m-0 p-0'>Delete All</p>
                                    </div>
                                </button>
                            </div> */}
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='table-style min-w-[1050px] mt-4'>
                                <thead>
                                <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        {membersTableList &&
                                            membersTableList.map(function (data) {
                                                return (
                                                    <>
                                                        <th className='w-[180px]'>
                                                            <div className='flex items-center justify-center'>
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
                                                    <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                        <div className='flex gap-2'>
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

                                                    <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                        <div className='flex flex-col'>
                                                            <span className='text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                        <div className='flex flex-col'>
                                                            <span className='text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data?.suspendedAt? formatedDate(data?.suspendedAt): "No Data"}</span>
                                                        </div>
                                                    </td>

                                                    <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                        <div className='flex flex-col'>
                                                            <span className='text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data.role}</span>
                                                        </div>
                                                    </td>

                                                    <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                        <div className='flex flex-col'>
                                                            <span className='text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data.permission}</span>
                                                        </div>
                                                    </td>
                                                    <td className='w-[15%] !pt-1 !pb-1'>
                                                        <div className='flex items-center gap-4 text-[17.5px] justify-center'>
                                                            <NewToolTip direction='left' message={'Unblock'}>
                                                                <button
                                                                    className='green-link'
                                                                    onClick={() => {
                                                                        setRestoreMessage('Unblock Member ' + '"' + data.firstName + ' ' + data.lastName + '"');
                                                                        setRecoverUserId(data._id);
                                                                        setOpenRestoreModel(true);
                                                                    }}>
                                                                    <BiUnlink/>
                                                                </button>
                                                            </NewToolTip>
                                                            <NewToolTip direction='left' message={'Delete'}>
                                                                <button
                                                                    className='red-link'
                                                                    onClick={() => {
                                                                        setDeleteMessage('Delete Member ' + '"' + data.firstName + ' ' + data.lastName + '"' + 'permanently?');
                                                                        setDeleteUserId(data._id);
                                                                        setOpenDeleteModel(true);
                                                                    }}>
                                                                    <AiOutlineDelete />
                                                                </button>
                                                            </NewToolTip>
                                                        </div>
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
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: +(sortTable.pageNo * sortTable.limit) + +sortTable.limit });
                                        handlePaginationMember('?skip=' + sortTable.skip + '&limit=' + sortTable.limit);
                                    }}
                                    className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteConformation
                    open={openDeleteAllModel}
                    close={() => {
                        setOpenDeleteAllModel(!openDeleteAllModel);
                    }}
                    message={'Delete All Member'}
                    onClick={handleDeleteAllProject}
                />
                <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeleteUserById} />
                <UnblockConfirmation open={openRestoreModel} close={handleCloseRestoreModel} message={restoreMessage} onClick={handleRecoverUserById} />
                {/* <UserDetailsWithProjects open={addRemoveUserModel} close={() => { setAddRemoveUserModel(false); } } onClick={() => { } } data={undefined} /> */}
            </>}
        </>
    );
};

export default restoreUsers;
