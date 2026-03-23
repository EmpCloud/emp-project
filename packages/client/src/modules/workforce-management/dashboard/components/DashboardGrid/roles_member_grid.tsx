/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { getAllRoles, getMembersByRole } from '@WORKFORCE_MODULES/members/api/get';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import router from 'next/router';

const roles_member_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [roleList, setRoleList] = useState(null);
    const [memberDetails, setMemberDetails] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    const membersTableList = [
        { name: 'Name', value: 'firstName', visible: true },
        { name: 'Email', value: 'email', visible: true },
    ];
    const handleGetAllRoles = () => {
        getAllRoles(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data.body.status === 'success') {
                setRoleList(
                    response.data.body.data.totalRolesData.map(item => {
                        return {
                            text: item.roles,
                            value: item.roles,
                            item,
                        };
                    })
                );
            }
        });
    };

    const filterMembers = (condition = '') => {
        getMembersByRole(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body.data.data);
            }
        });
    };
    useEffect(() => {
        handleGetAllRoles();
    }, []);

    useEffect(() => {
        if (roleList) {
            filterMembers(`?role=${roleList[0].value}&limit=${process.env.TOTAL_USERS}`);
        }
    }, [roleList]);

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
                <div className='card-d px-7 py-4 w-full d-flex'>
                    <div className='flex justify-between items-center'>
                        <h3 className='heading-medium font-semibold'>Members In Roles</h3>
                        <div className='w-full md:w-[8rem]'>
                            <FloatingOnlySelectfield
                                label={undefined}
                                optionsGroup={roleList}
                                value={selectedOption ?? ''}
                                className={`!mb-0`}
                                onChange={event => {
                                    setSelectedOption(event.target.value);
                                    filterMembers('?role=' + event.target.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className='mt-2 overflow-auto min-h-[320px] max-h-[320px] overflow-y-auto'>
                        <table className=' table-style min-w-[100px]'>
                            <thead className=' bg-blue-100 dark:bg-gray-700 sticky z-40 top-0'>
                                <tr>
                                    {membersTableList &&
                                        membersTableList.map(function (data) {
                                            return (
                                                <>
                                                    <th className='w-[200px]'>
                                                        <div className='flex items-center'>
                                                            <div>{data.name}</div>
                                                        </div>
                                                    </th>
                                                </>
                                            );
                                        })}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {memberDetails && memberDetails.length === 0 && (
                                    <tr>
                                        <th colSpan={2}>No data</th>{' '}
                                    </tr>
                                )}
                                {!memberDetails && (
                                    <tr>
                                        <th colSpan={2}>
                                            <TinnySpinner />
                                        </th>
                                    </tr>
                                )}
                                {memberDetails &&
                                    memberDetails.map(function (data, key) {
                                        return (
                                            <tr key={key}>
                                                <td className='w-[200px] !pt-1 !pb-1'>
                                                    <div className='flex gap-2 items-center'>
                                                            <div className='example-emoji w-[20%]' role='img' aria-label='duck emoji'>
                                                                <div className='user-img-group w-full'>
                                                                    <img src={data.profilePic ? data.profilePic : '/imgs/default.png'} className='user-img-sm' alt='user' />
                                                                </div>
                                                            </div>
                                                        <div className='flex flex-col  text-left w-[80%]'>
                                                            <span className='pb-1 font-bold break-words'>{data.firstName + ' ' + data.lastName}</span>
                                                            <span className='text-base'
                                                              onClick={event => {
                                                                router.push('/w-m/members/' + data._id);
                                                            }}
                                                            >{data.role}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className='!pt-1 !pb-1 w-[180px] '>
                                                    <div className='flex flex-col'>
                                                        <span className='text-ellipsis overflow-hidden whitespace-nowrap'>{data.email}</span>
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
    );
};

export default roles_member_grid;
