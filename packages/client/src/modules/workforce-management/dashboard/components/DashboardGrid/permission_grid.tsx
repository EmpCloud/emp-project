/* eslint-disable react-hooks/rules-of-hooks */
import DeleteConformation from '@COMPONENTS/DeleteConformation';
import DropDown from '@COMPONENTS/DropDown';
import EditTableCol from '@COMPONENTS/EditTableCol';
import NewToolTip from '@COMPONENTS/NewToolTip';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { download_data } from '@HELPER/exportData';
import { formatedDate } from '@HELPER/function';
import { permisssionTableListCookies } from '@HELPER/tableList';
import { getPermissionSearch, getPermisssionGroup } from '@WORKFORCE_MODULES/permisssion/api/get';
import AddOrEditPermission from '@WORKFORCE_MODULES/permisssion/components/addOrEditPermission';
import UserPermissionView from '@WORKFORCE_MODULES/permisssion/components/userPermissionView';
import React, { useEffect, useState } from 'react';
import { Filter } from 'react-feather';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsDownload, BsThreeDotsVertical } from 'react-icons/bs';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const permission_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [permissionsDetails, setPermissionsDetails] = useState(null);
    const [permissionsCount, setPermissionsCount] = useState(0);
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });
    const [groupTableList, setGroupTableList] = useState([
        { name: 'Group Name', value: 'groupName ' },
        { name: 'Is Default', value: 'isDefault'},
        { name: 'Created At', value: 'createdAt'},
        { name: 'Updated At', value: 'updatedAt'},
        { name: 'Action', value: 'action'},
    ]);

   
    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    });
    useEffect(() => {
        handleGetAllPermission('?limit=' + sortTable.limit);
    }, [sortTable.limit]);

    const handleGetAllPermission = (condition = '?limit=' + sortTable.limit) => {
        getPermisssionGroup(condition).then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(response.data.body.data.Permissions);
                setPermissionsCount(response.data.body.data.TotalCount);
            }
        });
    };
    const handleSearchPermission = (event: { target: { value: string } }) => {
       getPermissionSearch('?keyword=' + event.target.value).then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(response.data.body.data.totalPermissionData);
            }
        });
    };
    const handlePaginationGroup = condition => {
        getPermisssionGroup(condition).then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(response.data.body.data.Permissions);
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
            <div className={clickConfig ? 'opacity-30 ' : 'mt-4'}>
                <div className='card-d p-7 w-full d-flex'>
                    <div className='flex justify-between items-center'>
                        <h3 className='heading-medium'>Permissions</h3>
                        <div className='flex items-center '>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                            <select
                                value={sortTable.limit}
                                onChange={event => {
                                    setSortTable({ ...sortTable, limit: event.target.value });
                                }}
                                className='border py-1 rounded-md outline-none w-15 text-base px-2 mx-1'>
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
                                Total Permission<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-base text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{permissionsCount ? permissionsCount : 0}</span>
                            </p>
                        </div>
                        <div className='wrapper relative'>
                            <SearchInput onChange={handleSearchPermission} placeholder={'Search Permission'} />
                        </div>
                    </div>
                    <div className='mt-2 overflow-x-auto max-h-[250px]'>
                        <table className='table-style min-w-[1050px] '>
                            <thead className='groups-table-head sticky top-0 z-40 bg-blue-100 dark:bg-gray-700'>
                                <tr>
                                    {groupTableList &&
                                        groupTableList.map(function (data) {
                                            return (
                                                <>
                                                    <th className=''>
                                                        <div className='flex items-center gap-2 justify-start'>
                                                            
                                                            <div>{data.name}</div>
                                                        </div>
                                                    </th>
                                                </>
                                            );
                                        })}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {permissionsDetails && permissionsDetails.length === 0 && (
                                      <tr className='bg-white dark:bg-gray-800 '>
                                      <th scope='row' className='col-span-3 text-center pt-16 py-4 px-6 font-medium text-xl text-gray-900 whitespace-nowrap dark:text-white'>
                                          No data
                                      </th>
                                  </tr>
                                )}
                                {!permissionsDetails && (
                                    <tr>
                                        <th colSpan={2}>
                                            <TinnySpinner />
                                        </th>
                                    </tr>
                                )}
                                {permissionsDetails &&
                                    permissionsDetails.map(function (data, key) {
                                        return (
                                            <tr key={key}>
                                                <td className='!pt-1 !pb-1 break-words'>{data.permissionName}</td>
                                                <td className='!pt-1 !pb-1'>{data.is_default ? 'Yes' : 'No'}</td>
                                                <td className='!pt-1 !pb-1'>{formatedDate(data.createdAt)}</td>
                                                <td className='!pt-1 !pb-1'>{data.updatedAt?formatedDate(data.updatedAt) : "Not Updated"}</td>
                                                <td className='!pt-1 !pb-1'>
                                                    <div className='flex items-center gap-3 justify-center'>
                                                        <UserPermissionView data={data} />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    {permissionsDetails && permissionsDetails.length != 0 && (
                        <div className='flex justify-between items-center'>
                            <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                {sortTable.limit * sortTable.pageNo < permissionsCount ? sortTable.limit * sortTable.pageNo : permissionsCount} of {permissionsCount}
                            </p>

                            <div className='flex items-center '>
                                <button
                                    disabled={sortTable.pageNo == 1}
                                    onClick={() => {
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                        handlePaginationGroup('?skip=' + 0 + '&limit=' + sortTable.limit);
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
                                    disabled={sortTable.pageNo === Math.ceil(permissionsCount / sortTable.limit)}
                                    onClick={() => {
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                        handlePaginationGroup('?skip=' + sortTable.skip + '&limit=' + sortTable.limit);
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
    );
};

export default permission_grid;