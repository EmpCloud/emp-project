/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { ToolTip } from '@COMPONENTS/ToolTip';
import { priorityList } from '@HELPER/exportData';
import { filterMembers, formatedDate } from '@HELPER/function';
import { getAllSubTask, getAllTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { data } from '../graph/PolarAreaCharts';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { getAllUsers } from '@WORKFORCE_MODULES/members/api/get';
import { getPermisssionGroup } from '@WORKFORCE_MODULES/permission/api/get';

const permission_members_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {

    const [permissionPriority, setPermissionPriority] = useState(null);
    const [membersDetail, setMemberDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [subtaskDetails, setSubtaskDetails] = useState(null);
    const [permissionsDetails, setPermissionsDetails] = useState(null);
    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.users);
            }
        });
    };
    useEffect(() => {
        handleGetAllUser('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1&suspensionStatus=false');
    }, []);

    const handleGetAllPermission = () => {
        getPermisssionGroup().then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(response.data.body.data.Permissions);
            }
        });
    };

    useEffect(() => {
        handleGetAllPermission();
    }, []);

    const dropDownPermission = permissionsDetails?.map(data => {
        return {
            text: data.permissionName,
            value: data.permissionName
        }
    })

    const filterPriority = permission => {
        if (!membersDetail && !permission) return false;
        let tempTasks = membersDetail?.filter(d => {
            return d.permission == permission;
        });
        setPermissionPriority(tempTasks);
    };

    useEffect(() => {
        filterPriority(dropDownPermission && dropDownPermission[0].value);
    }, [membersDetail]);
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
                    <div className={`card-d project-stage w-full inline-block align-top`}>
                        <div className='flex justify-between items-center'>
                            <h1 className='heading-medium text-base mb-0 sm:text-xl font-semibold'>Permission Members</h1>
                            <div className='max-w-xs md:w-[8rem]'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={dropDownPermission}
                                    // optionsGroup={permissionsDetails}
                                    name={'dropDownPermission'}
                                    className={`!mb-0`}
                                    value={selectedOption ?? ''}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterPriority(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='mt-2 overflow-x-auto relative shadow-md h-[260px] overflow-y-auto'>
                            <table className='table-style w-full'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th className=''>Name</th>
                                        <th className=''> Email</th>
                                        <th className=''>Role</th>
                                        {/* <th className=' '>Assigned To</th> */}
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {permissionPriority && permissionPriority.length === 0 && (
                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>
                                    )}

                                    {permissionPriority &&
                                        permissionPriority.map(function (item, index) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize break-words'>{item.firstName + ' ' + item.lastName}</h5>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize break-words'>{item.email}</h5>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize'>{item.role}</h5>
                                                        </div>
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

export default permission_members_grid;