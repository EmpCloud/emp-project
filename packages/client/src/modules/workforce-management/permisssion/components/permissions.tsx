/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { BsDownload, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
import DropDown from '../../../../components/DropDown';
import { downloadFiles } from '@HELPER/download';
import EditTableCol from '../../../../components/EditTableCol';
import TinnySpinner from '../../../../components/TinnySpinner';
import DeleteConformation from '../../../../components/DeleteConformation';
import toast from '../../../../components/Toster/index';
import SearchInput from '../../../../components/SearchInput';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { permissionTableListCookies } from '../../../../helper/tableList';
import Filter from '../../projects/components/filter';
import { formatedDate } from '@HELPER/function';
import { getPermissionSearch, getPermisssionGroup } from '../api/get';
import UserPermissionView from './userPermissionView';
import AddOrEditPermission from './addOrEditPermission';
import { deleteAllPermissions, deletePermissionById } from '../api/delete';
import { getDefaultConfig } from '@WORKFORCE_MODULES/projects/api/get';
import { updateScreenConfig } from '@WORKFORCE_MODULES/projects/api/put';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import { Tooltip } from '@material-tailwind/react';
function index({}) {
    const [showModal, setShowModal] = useState(false);
    const [permissionsDetails, setPermissionsDetails] = useState(null);
    const [deletePermissionId, setDeletePermissionId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [permissionsCount, setPermissionsCount] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState(null)
    const [permission, setPermission] = useState(null)
    const [type, setType] = useState(null);

    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const [permissionTableList, setPermissionTableList] = useState(null);
    
    const handleReset = () => {
        for (const item of permissionTableList) {
            let data = {
                member: [
                    {
                        name: item.name,
                        value: item.value,
                        sort: 'ASC',
                        isDisabled: item.isDisabled,
                        isVisible: true,
                    },
                ],
            };
            updateScreenConfig(data)
                .then(function (result) {
                    if (result.data && result.data.body.status === 'success') {
                    } else {
                        toast({
                            type: 'error',
                            message: result ? result.data.body.error : 'Try again !',
                        });
                    }
                })
                .catch(function (response) {
                    toast({
                        type: 'error',
                        message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                    });
                });
        }
        handleGetPermissionConfig();
    };
    const checkVisibility = function (type) {
        if(!permissionTableList) return false;
        return permissionTableList.some(obj => {
            if (obj.value === type) {
                return obj.isVisible;
            }
        });
    };
    const handleSelectCol = (data) => {
        const item = {
            permission: [
                {
                    name: data.name,
                    value: data.value,
                    sort: data.sort,
                    isDisabled: data.isDisabled,
                    isVisible: data.isVisible === false ? true : false,
                },
            ],
        } 
        updateScreenConfig(item)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    handleGetPermissionConfig();
                    // toast({
                    //     type: 'success',
                    //     message: result ? result.data.body.message : 'Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: result ? result.data.body.error : 'Try again !',
                    // });
                    handleGetPermissionConfig();
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                });
            });
              
    };
    const handleGetPermissionConfig = () => {
        getDefaultConfig().then(response => {
            if (response.data?.body.status === 'success') {
                setPermissionTableList(response.data?.body.data.permission);
            }
        });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    };
    const handleShorting = (types, colName, colValue) => {
        setPermissionTableList(current =>
            current.map(obj => {
                if (obj.name === colName && obj.sort === 'DESC') {
                    return { ...obj, sort: obj.sort === 'DESC' ? 'ASC' : 'DESC' };
                }
                if (obj.name === colName && obj.sort === 'ASC') {
                    return { ...obj, sort: 'DESC' };
                }
                return obj;
            })
        );
            
        if(type==='search'){
            if (types === 'asc') {
                handleSearchPermission('?orderBy=' + colValue + '&sort=asc&limit=' + sortTable.limit+'&keyword=' + searchKeyword)
            } else {
                handleSearchPermission('?orderBy=' + colValue + '&sort=desc'+'?limit=' + sortTable.limit+'&keyword=' + searchKeyword)
            }
        }else{

        if (types === 'asc') {
            handleGetAllPermission('orderBy=' + colValue + '&sort=asc&limit=' + sortTable.limit)
        } else {
            handleGetAllPermission('orderBy=' + colValue + '&sort=desc&limit=' + sortTable.limit)
        }
    }
    };
    useEffect(() => {
        handleProfileData();
        // document.querySelector('body').classList.add('bodyBg');
    },[]);
    const handleCloseDeleteModel = () => {
        setOpenDeleteModel(!openDeleteModel);
    };

    useEffect(() => {
        handleGetPermissionConfig();
        if(type==='search'){
            handleSearchPermission('?limit=' + sortTable.limit+'&keyword=' + searchKeyword )
        }else
        handleGetAllPermission('limit=' + sortTable.limit );
    }, [sortTable.limit,searchKeyword]);
    
    const handleGetAllPermission = (condition = 'limit=' + sortTable.limit) => {
        getPermisssionGroup(condition).then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(response.data.body.data.Permissions);
                setPermissionsCount(response.data.body.data.TotalCount);
            }
        });
    };
    const handleSearchPermission = (condition ="") => {
        
        getPermissionSearch(condition).then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(response.data.body.data.totalPermissionData);
                setPermissionsCount(response.data.body.data.TotalPermissionCount);
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
    
    const handleDeletePermissionById = () => {
        deletePermissionById(deletePermissionId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllPermission();
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
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
        setOpenDeleteModel(false);
    };
    const handleDeleteAllGroup = () => {
        deleteAllPermissions()
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllPermission();
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
        setOpenDeleteAllModel(false);
    };

const PermissionFilterData = permissionsDetails?.map((item) => {
    const { is_fixed,orgId,permissionConfig,__v,_id, ...rest } = item;
    return rest;
});

let FinalDownloadData = PermissionFilterData?.map(data => {
  
    return {
        "Permission Name": data.permissionName,
        "Is Default": data.is_default ? 'Yes' : 'No',
        " Created At": formatedDate(data.createdAt),
        "Updated At": formatedDate(data.updatedAt),
       
    }
})
const handleProfileData = () => {
    fetchProfile().then(response => {
        if (response.data?.body.status === 'success') {
            setPermission(response.data.body.data);
        }
    });
};
const bulkAction = [
    {
      text: "Delete all",
      value: 2,
      onClick: (event, value, data, name) => {
        if (permissionsDetails.length === 0) {
          toast({
            type: "error",
            message: "Please add data before deleting.",
          });
        } else {
          setOpenDeleteAllModel(!openDeleteAllModel);
        }
      },
    },
  ];
  const download_data = [
    {
        text: 'Download CSV file',
        value: 'excel',
        onClick: () => {
            if (permissionsDetails.length === 0) {
                toast({
                    type: "error",
                    message: "Please add data before downloading.",
                  });
            } else {
                downloadFiles('excel', 'Permission', FinalDownloadData);
            }
        },
    },
    {
        text: 'Download PDF file',
        value: 'pdf',
        onClick: () => {
            if (permissionsDetails.length === 0) {
                toast({
                    type: "error",
                    message: "Please add data before downloading.",
                  });

            } else {
                downloadFiles('pdf', 'Permission', FinalDownloadData);
            }
        },
    },
];

    return (
        <>
            <div className='font-inter -mt-6'>
                <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                    <div className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1'>
                        Permissions<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{permissionsCount}</span>{/* -({permissionsDetails ? permissionsDetails.length : 0}) */}
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='relative'>
                            <AddOrEditPermission data={[]} type='add' {...{ showModal, setShowModal, handleGetAllPermission }} />
                        </div>
                        {FinalDownloadData && FinalDownloadData.length > 0 && (
                        <div className='relative'>
                            <NewToolTip direction='top' message={'Download'}>
                                <DropDown
                                    data={download_data}
                                    defaultValue={''}
                                    name={'permission'}
                                    downloadData={FinalDownloadData}
                                    icon={
                                        <span className='text-xl grey-link bg-white p-2 rounded-lg'>
                                            <BsDownload />
                                        </span>
                                    }
                                    getData={undefined}
                                />
                            </NewToolTip>
                        </div>
                        )}
                    </div>
                </div>
                <div className='card groups-card-wrapper pt-10 px-[30px]'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center '>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                            <select
                                value={sortTable.limit}
                                onChange={event => {
                                    setSortTable({ ...sortTable, limit: event.target.value ,pageNo: 1});
                                }}
                                className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1'>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                {/* <option value={100}>100</option>
                                <option value={500}>500</option> */}
                            </select>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center'>
                                <div className='relative mr-3'>
                                    <SearchInput onChange={(event)=>{
                                        setType("search")
                                        setSearchKeyword(event.target.value)
                                        setSortTable({skip:10, limit:10, pageNo: 1})
                                    }} placeholder={'Search Permission'} />
                                </div>
                                <EditTableCol handleReset={handleReset} data={permissionTableList} checkVisibility={checkVisibility} {...{handleSelectCol}} />
                            </div>
                            <DropDown
                                data={bulkAction}
                                defaultValue={''}
                                icon={
                                    <span className='text-xl grey-link'>
                                        <BsThreeDotsVertical />
                                    </span>
                                }
                                getData={undefined}
                            />
                        </div>
                    </div>
                    <div className='overflow-x-auto mt-5'>
                        <table className='table-style min-w-[900px] '>
                            <thead className='groups-table-head'>
                                <tr className='text-gray-700 uppercase bg-blue-300 dark:bg-gray-700 dark:text-gray-400 rounded-t-lg'>
                                    {permissionTableList &&
                                        permissionTableList.map(function (data) {
                                            return (
                                                <>
                                                    {data.isVisible && (
                                                        <th
                                                            key={data.name}
                                                            className={data.sort !== null ? 'cursor-pointer' : ''}
                                                            onClick={() => {
                                                                if (data.sort !== null) {
                                                                    if (data.sort === 'ASC') {
                                                                        handleShorting('desc', data.name, data.value);
                                                                    } else {
                                                                        handleShorting('asc', data.name, data.value);
                                                                    }
                                                                }
                                                            }}>
                                                            {data.name  !== 'Created At' && data.name  !== 'Updated At' && data.name  !== 'Action' ? (
                                                                <Tooltip className='max-w-[16rem] bg-gray-600 before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={data?.sortingOrder ?? 'Aa->Zz'}>
                                                                    <div className='flex items-center gap-2 justify-center'>
                                                                        {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
                                                                        {data.sort && data.sort !== null && (
                                                                            data.sort === 'ASC' ? (
                                                                                <FaArrowDown />
                                                                            ) : (
                                                                                <FaArrowUp />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                                
                                                                
                                                            ):
                                                            <div className='flex items-center gap-2 justify-center'>
                                                            {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
                                                            {data.sort && data.sort !== null && (
                                                                data.sort === 'ASC' ? (
                                                                    <FaArrowDown />
                                                                ) : (
                                                                    <FaArrowUp />
                                                                )
                                                            )}
                                                        </div>}
                                                            
                                                        </th>
                                                    )}
                                                </>
                                            );
                                        })}
                                </tr>
                            </thead>
                            <tbody className='max-h-[calc(100vh-250px)]'>
                                {permissionsDetails && permissionsDetails.length === 0 && (
                                    <tr>
                                        <th colSpan={2}>No data</th>{' '}
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
                                                <td className='!pt-1 !pb-1 text-center'>{data.permissionName}</td>
                                                {checkVisibility('isDefault') && <td className='!pt-1 !pb-1 text-center'>{data.is_default ? 'Yes' : 'No'}</td>}
                                                {checkVisibility('createdAt') && <td className='!pt-1 !pb-1 text-center'>{formatedDate(data.createdAt)}</td>}
                                                {checkVisibility('updatedAt') && <td className='!pt-1 !pb-1 text-center'>{formatedDate(data.updatedAt)}</td>}
                                                <td className='!pt-1 !pb-1 cursor-pointer'>
                                                    <div className='flex items-center gap-3 justify-center'>
                                                        <UserPermissionView data={data} />
                                                        {data.is_default ? <></> : <AddOrEditPermission data={data} type='edit' {...{ showModal, setShowModal, handleGetAllPermission }} />}
                                                        
                                                        
                                                        {/* <NewToolTip direction={'left'} message={'Edit'}> */}
                                                        {/* <AddNewGroup type={"edit"} data={data} {...{ */}
                                                        {/* handleGetAllPermission */}
                                                        {/* }} /> */}
                                                        {/* </NewToolTip> */}
                                                        {/* <NewToolTip direction='left' message={'Delete'}> */}
                                                        {data.is_default ? <></> :
                                                        <button
                                                            className='red-link text-[16px]'
                                                            onClick={() => {
                                                                setDeleteMessage('Delete Permission' + '"' + data.permissionName + '"');
                                                                setDeletePermissionId(data._id);
                                                                setOpenDeleteModel(true);
                                                            }}>
                                                            <AiOutlineDelete />
                                                        </button>}
                                                        {/* </NewToolTip> */}
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
                                        handlePaginationGroup('skip=' + 0 + '&limit=' + sortTable.limit);
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
                                        handlePaginationGroup('skip=' + sortTable.skip + '&limit=' + sortTable.limit);
                                    }}
                                    className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <DeleteConformation
                open={openDeleteAllModel}
                close={() => {
                    setOpenDeleteAllModel(!openDeleteAllModel);
                }}
                message={'Delete All Permission'}
                onClick={handleDeleteAllGroup}
            />
            <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeletePermissionById} />
        </>
    );
}
export default index;
