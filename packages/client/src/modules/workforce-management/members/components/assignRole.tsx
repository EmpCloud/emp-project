/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import DeleteConformation from '../../../../components/DeleteConformation';
import DropDown from '../../../../components/DropDown';
import TinnySpinner from '../../../../components/TinnySpinner';
import ToolTip from '../../../../components/ToolTip';
import CheckBox from '../../../../components/CheckBox';
import DropDownWithTick from '../../../../components/DropDownWithTick';
import { roleList } from '../../../../helper/exportData';
import { AiOutlineEdit } from '@react-icons/all-files/ai/AiOutlineEdit';
import { apiIsNotWorking } from '../../../../helper/function';
import toast from '../../../../components/Toster/index';
import { getAllUsers } from '../api/get';
import { deleteUserById } from '../api/delete';
const data = [{ text: 'Delete all', value: 2 }];
const index = ({ stopLoading, startLoading }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [users, setUsers] = useState([]);
    const handleCloseDeleteModel = () => {
        setOpenDeleteModel(!openDeleteModel);
    };
    useEffect(() => {
        handleGetAllUser('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1&suspensionStatus=false');
    }, []);
    const handleGetAllUser = (condition='') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUserDetails(response.data?.body.data.users);
            }
        });
    };
    const handleDeleteUserById = () => {
        deleteUserById(deleteTaskId)
            .then(function (result) {
                stopLoading();
                if (result.data.body.status == 'success') {
                    handleGetAllUser();
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
                stopLoading();
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteModel(false);
    };
    const handlePerformBulkAction = (event, actionID) => {
        event.preventDefault();
    };
    return (
        <>
            <div className='flex justify-between mb-2'>
                <h2 className='heading-big'>All Users</h2>
                <button className='small-button items-center xs:w-full py-2 flex h-9'>Add</button>
            </div>
            <div className='card'>
                <div className='flex justify-between items-center'>
                    <h3 className='heading-medium'>Total Users - {userDetails ? userDetails.length : 0}</h3>
                    <div className='flex items-center'>
                        <div className='wrapper relative'>
                            <div className='absolute left-4 bottom-3 text-placeholderGrey '>
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                                </svg>
                            </div>
                            <input className='rounded-search md:w-80 py-2' type='text' placeholder='Search a user' />
                        </div>
                        {/* <span className="text-2xl grey-link"><BsThreeDotsVertical/></span> */}
                        <DropDown
                            data={data}
                            defaultValue={''}
                            onClick={handlePerformBulkAction}
                            icon={
                                <span className='text-2xl grey-link'>
                                    <BsThreeDotsVertical />
                                </span>
                            }
                        />
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className='table-style min-w-[900px]'>
                        <thead>
                            <tr>
                                <td className='w-[30px]'>
                                    <CheckBox />
                                </td>
                                <th>OrgId</th>
                                <th>First Name </th>
                                <th>Last Name </th>
                                <th>Email </th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='max-h-[calc(100vh-330px)] min-h-[calc(100vh-330px)]'>
                            {userDetails && userDetails.length === 0 && (
                                <tr>
                                    <th colSpan={2}>No data</th>{' '}
                                </tr>
                            )}
                            {!userDetails && (
                                <tr>
                                    <th colSpan={2}>
                                        <TinnySpinner />
                                    </th>
                                </tr>
                            )}
                            {!userDetails && (
                                <tr>
                                    <th colSpan={2}>
                                        <TinnySpinner />
                                    </th>
                                </tr>
                            )}
                            {userDetails &&
                                userDetails.map(function (data,key) {
                                    return (
                                        <tr key={key}>
                                            <td className='w-[30px]'>
                                                <CheckBox checked={undefined} />
                                            </td>
                                            <td>{data.orgId}</td>
                                            <td>{data.firstName}</td>
                                            <td>{data.lastName}</td>
                                            <td>{data.email}</td>
                                            <td>
                                                <DropDownWithTick paddingForDropdown={"py-2"} data={roleList} value={data.role} handle={undefined} onChangeValue={undefined} selectedData={undefined} className={'relative text-center'} type={undefined} />
                                            </td>
                                            <td>
                                                <div className='flex text-xl'>
                                                    <ToolTip message={'Edit/View'}>
                                                        <button className='grey-link mr-4' onClick={() => {}}>
                                                            <AiOutlineEdit />
                                                        </button>
                                                    </ToolTip>
                                                    <ToolTip message={'Delete'}>
                                                        <button
                                                            className='red-link'
                                                            onClick={() => {
                                                                setDeleteMessage('Delete Task ' + '"' + data.firstName + ' ' + data.lastName + '"');
                                                                setDeleteTaskId(data._id);
                                                                setOpenDeleteModel(true);
                                                            }}>
                                                            <AiOutlineDelete />
                                                        </button>
                                                    </ToolTip>{' '}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
            <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeleteUserById} />
        </>
    );
};
export default index;
