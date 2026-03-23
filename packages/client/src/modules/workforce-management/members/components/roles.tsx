import React, { useEffect, useState } from 'react';
import { BsDownload, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
import DropDown from '../../../../components/DropDown';
import RoleFilter from './roleFilter';
import EditTableCol from '../../../../components/EditTableCol';
import { getAllRoles, getAllUsers, searchRole, getAllRolesBySorting } from '../api/get';
import TinnySpinner from '../../../../components/TinnySpinner';
import { deleteAllRoles, deleteRoleById, deleteUserById } from '../api/delete';
import DeleteConformation from '../../../../components/DeleteConformation';
import toast from '../../../../components/Toster/index';
import { updateMember } from '../api/put';
import SearchInput from '../../../../components/SearchInput';
import AddRoles from './addRoles';
import UserDetailsWithProjects from './userDetailsWithProjects';
import ToolTip from '../../../../components/ToolTip';
import { roleFilterApi } from '../api/post';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { downloadFiles } from '@HELPER/download';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import { getDefaultConfig } from '@WORKFORCE_MODULES/projects/api/get';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import MemberModal from '@COMPONENTS/MemberModal';
import NoSsr from '@COMPONENTS/NoSsr';
import { Tooltip } from '@material-tailwind/react';
import { handleUserClick } from '@HELPER/function';

function AllRoles() {
    const [roleDetails, setRoleDetails] = useState(null);
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [role, setRole] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [rolesTableList, setRolesTableList] = useState([]);
    const [addRemoveUserModel, setAddRemoveUserModel] = useState(false);
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [permission, setPermission] = useState(null);
    const [roleCount, setRoleCount] = useState(0);
    const [searchKeyword,setSearchKeyword] = useState('')
    const [types, setType] = useState(null)
    const [filterData, setFilterData] = useState(null);


    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response?.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
                
            }
        }).catch(error =>{
            console.error(error);
        }) 
    };
    useEffect(()=>{
        handleGetFilterRole("?limit=10" + '&invitationStatus=1');
    },[filterData])
    const handleSearchRole = data => {
        searchRole(data).then(response => {
            if (response.data.body.status === 'success') {
                setRoleDetails(response.data?.body.data.totalRolesData);
                setRoleCount(response?.data.body?.data?.rolesCount);
                
            }
        });
    };
    const handlePaginationGroup = condition => {
        if(types === "search"){
            let totalCondition = condition + "&keyword=" +searchKeyword
        searchRole('?'+totalCondition).then(response => {
            if (response.data.body.status === 'success') {
                setRoleDetails(response.data?.body.data.totalRolesData);
            }
        });
        }else if(types === "filter"){
            handleGetFilterRole(condition + '&invitationStatus=1');
        }else{
            getAllRoles(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setRoleDetails(response.data?.body.data.totalRolesData);
                    setRoleCount(response?.data?.body?.data?.rolesCount);
                }
            });
        }
    };
    useEffect(() => {
        handleProfileData();
        // document.querySelector('body').classList.add('bodyBg');
    }, []);
    const handleCloseDeleteModel = () => {
        setOpenDeleteModel(!openDeleteModel);
    };
    const [userObject, setUserObject] = useState([]);
    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUserObject(response.data?.body.data.users);
            }
        });
    };
    useEffect(() => {
        handleGetAllUser('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1');
    }, []);
    // Dropdown
    const data = [
        // { text: 'Settings', value: 1 },
        { text: 'Delete All', value: 2 },
    ];
    const member_data = [
        {
            text: 'Delete this roles',
            value: 3,
            onClick: (event, value, data, name, getData) => {
                setDeleteMessage('Delete Role ' + '"' + getData.role + '"');
                setDeleteTaskId(getData._id);
                setOpenDeleteModel(true);
            },
        },
    ];
    useEffect(() => {
        if (permission?.roles.view === true || Cookies.get('isAdmin') === 'true') {
            //
            if(types === "search"){
                handleSearchRole('?limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=1')

            }else if(types === "filter"){
                handleGetFilterRole('?limit=' + sortTable.limit + '&invitationStatus=1');
            }else
                // getAllRoles('limit=' + sortTable.limit + '&invitationStatus=1'); 
                handleGetAllRoles('limit=' + sortTable.limit);
        }
    }, [permission, sortTable.limit]);
    const handleGetAllRoles = (condition) => {
        // handleGetAllUser('?limit='+process.env.TOTAL_USERS);
        getAllRoles(condition).then(response => {
            if (response.data.body.status === 'success') {
                setRoleDetails(response.data?.body.data.totalRolesData);
                setRoleCount(response?.data?.body?.data?.rolesCount);
            }
        });
    };
    const handlePerformBulkAction = (event, actionID) => {
        event.preventDefault();
    };

    const handleAssignRole = (e, id, selectedData) => {
        updateMember(selectedData._id, e.value).then(response => {
            if (response.data.body.status === 'success') {
                handleGetAllRoles('limit=' + sortTable.limit);
                toast({
                    type: 'success',
                    message: response.data.body.message,
                });
            }
        });
    };
    const handleRemoveMember = (user, role) => {
        setAddRemoveUserModel(true);
    };
    const handleGetFilterRole = (ApiData) => {
        // handleGetAllUser('?limit='+process.env.TOTAL_USERS);
        // event.preventDefault();
        if(!filterData) return false;
        roleFilterApi(ApiData,filterData)
            .then(response => {
                if (response.data.body.status === 'success') {
                    function removeDuplicatesByRole(dataArray) {
                    const uniqueRoles = {}; 
                    const uniqueDataArray = [];

                    for (const item of dataArray) {
                        const role = item.role;
                        if (!uniqueRoles[role]) {
                        uniqueRoles[role] = true; 
                        uniqueDataArray.push(item);
                        }
                    }

                    setRoleDetails(uniqueDataArray);
                }
                
                setRoleDetails(response.data?.body.data.roleData);
                setRoleCount(response?.data?.body?.data?.TotalCount?response?.data?.body?.data?.TotalCount:response.data?.body.data.rolesCount);
                
                // removeDuplicatesByRole(response.data?.body.data);
                }
            })
            .catch(function (e) {
                
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    const GroupFilterData = roleDetails?.map(item => {
        const { adminId, createdBy, groupCreatedBy, groupDescription, groupLogo, groupUpdatedBy, updatedAt, _id, ...rest } = item;
        return rest;
    });

    let FinalDownloadData = GroupFilterData?.map(data => {
        const roleName = data.roles;
        let newValue = userObject
            .filter(function (d) {
                return d ? d.role === (data.roles ?? data.role) : [];
            })
            .map(function (d1) {
                return d1.firstName + ' ' + d1.lastName;
            });
        return {
            ' Role Name ': roleName,
            'Assign Members': newValue?.join(',  '),
        };
    });

    const bulkAction = [
        {
            text: 'Delete all',
            value: 2,
            onClick: (event, value, data, name) => {
                if (roleDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before deleting.',
                    });
                } else {
                    deleteAllRoles()
                        .then(response => {
                            if (response?.data?.body?.status === 'success') {
                                toast({
                                    type: 'success',
                                    message: response ? response?.data?.body?.message : 'Something went wrong, Try again !',
                                });
                                setSortTable({skip:10, limit:10, pageNo: 1})
                                handleGetAllRoles();
                            } else {
                                toast({
                                    type: 'error',
                                    message: response ? response?.data?.body?.message : 'Something went wrong, Try again !',
                                });
                            }
                        })
                        .catch(function (e) {
                            toast({
                                type: 'error',
                                message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                            });
                        });
                }
            },
        },
    ];
    const download_data = [
        {
            text: 'Download CSV file',
            value: 'excel',
            onClick: () => {
                if (roleDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before downloading.',
                    });
                } else {
                    downloadFiles('excel', 'Roles', FinalDownloadData);
                }
            },
        },
        {
            text: 'Download PDF file',
            value: 'pdf',
            onClick: () => {
                if (roleDetails.length === 0) {
                    toast({
                        type: 'error',
                        message: 'Please add data before downloading.',
                    });
                } else {
                    downloadFiles('pdf', 'Roles', FinalDownloadData);
                }
            },
        },
    ];
    const handleGetTaskConfig = () => {
        getDefaultConfig().then(response => {
            if (response.data?.body.status === 'success') {
                setRolesTableList(response.data?.body.data.role);
            }
        });
    };
    const handleShorting = (type, colName, colValue) => {
        setRolesTableList(current =>
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

        if(types==='search'){
        if (type === 'asc') {
            handleSearchRole('?keyword='+searchKeyword+'&order=' + colValue + '&sort=asc')
        }else{
            handleSearchRole('?keyword='+searchKeyword+'&order=' + colValue + '&sort=desc')

        }
        
    }else if(types === "filter"){
        if (type === 'asc') {
            handleGetFilterRole('?limit=' + sortTable.limit + '&invitationStatus=1&orderBy=' + colValue + '&sort=asc')
            }else{
            handleGetFilterRole('?limit=' + sortTable.limit + '&invitationStatus=1&orderBy=' + colValue + '&sort=desc')
            }
    }else{
        if (type === 'asc') {
            getAllRoles('order=' + colValue + '&sort=asc').then(response => {

                if (response.data.body.status === 'success') {
                    setRoleDetails(response?.data?.body?.data?.totalRolesData);
                }
            });
        } else {
            getAllRoles('sort=desc&order=' + colValue).then(response => {
                if (response.data.body.status === 'success') {
                    setRoleDetails(response?.data?.body?.data?.totalRolesData);
                }
            });
        }
    }
    };
    useEffect(() => {
        handleGetTaskConfig();
    }, []); 
    const handleDeleteRolesById = () => {
        handleGetAllUser('?limit='+process.env.TOTAL_USERS);
        deleteRoleById(deleteTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllRoles('limit=' + sortTable.limit+'&skip='+sortTable.skip);
                    toast({
                        type: 'success',
                        message: result ? result.data.body.message : 'Try again !',
                    });
                    handleGetAllRoles('limit=10');
                    handleGetAllUser('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1');
                    handleGetTaskConfig
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
    return (
        <><NoSsr>
            {permission && permission.roles.view === false ? (
                <NoAccessCard />
            ) : (
                <>
                    <div className='font-inter'>
                        <div className='flex items-center justify-between flex-wrap'>
                            <div className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1 '>
                                All Roles
                                <span className='absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]'>
                                    {roleCount}
                                </span>
                            </div>
                            <div className='flex items-center'>
                                <div className='relative mr-3'>
                                {(permission && permission.roles.create === true) ||Cookies.get('isAdmin')==='true'? (
                                    <AddRoles
                                        handleGetAllRoles={handleGetAllRoles}
                                        type={'add'}
                                        {...{
                                            showModal,
                                            setShowModal,
                                            setSortTable
                                        }}
                                    />):('')}
                                </div>
                                {FinalDownloadData && FinalDownloadData.length > 0 && (
                                    <div className='relative mr-3'>
                                        <NewToolTip direction='top' message={'Download'}>
                                            <DropDown
                                                data={download_data}
                                                defaultValue={''}
                                                name={'Roles'}
                                                downloadData={FinalDownloadData}
                                                icon={
                                                    <span className='text-2xl grey-link bg-white p-2 rounded-lg'>
                                                        <BsDownload />
                                                    </span>
                                                }
                                            />
                                        </NewToolTip>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='card'>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center '>
                                    <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                    <select
                                        value={sortTable.limit}
                                        onChange={event => {
                                            setSortTable({ ...sortTable, limit: event.target.value ,pageNo:1});
                                            // setType(null);  
                                        }}
                                        className='border py-1 rounded-md outline-none w-15 text-sm px-2 mx-1'>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={500}>500</option>
                                    </select>
                                    <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                                </div>
                                <div className='flex items-center'>
                                    <div className='flex items-center'>
                                        <div className='relative mr-3'>
                                            <SearchInput onChange={(e)=>{handleSearchRole('?keyword=' + e.target.value)
                                            setType("search")
                                            setSortTable({skip:10, limit:10, pageNo: 1})
                                            setSearchKeyword(e.target.value)}} placeholder={'Search a role'} />
                                        </div>
                                        <div className='relative mr-3'>
                                            <RoleFilter type={'reset'} {...{ userObject, handleGetFilterRole, handleGetAllRoles, roleDetails, permission, setFilterData, setType }} />
                                        </div>
                                        <div className='relative mr-3'>
                                            {/* <RoleFilter type={'reset'} {...{ userObject, handleGetFilterRole, handleGetAllRoles, roleDetails, permission ,setType}} /> */}
                                        </div>
                                        {/* <EditTableCol /> */}
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
                            <div className='mt-2 overflow-x-scroll relative shadow-md sm:rounded-lg 2xl:max-h-[650px] xl:max-h-[450px] lg:max-h-[500px]'>
                                <table className='table-style min-w-[900px] '>
                                    <thead className=' sticky top-0 z-40'>
                                        {/* <tr>
                                            <th className='!pt-1 !pb-1 w-1/4'>Role Name</th>
                                            <th className='!pt-1 !pb-1 w-[650px]'>Role Assign Members</th>
                                            <th className='!pt-1 !pb-1 w-[80px]'>Action</th> */}
                                       <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400 '>
                                            {rolesTableList &&
                                                rolesTableList.map(function (data, key) {
                                                    return (
                                                        <>
                                                            {data.isVisible && (
                                                                // <th key={key} className={`${data.className}`}>
                                                                <th key={key} className={`w-[32%] ${data.sort !== null ? 'cursor-pointer' : ''}`}
                                                                onClick={() => {
                                                                    if (data.sort !== null) {
                                                                        if (data.sort === 'ASC') {
                                                                            handleShorting('desc', data.name, data.value);
                                                                        } else {
                                                                            handleShorting('asc', data.name, data.value);
                                                                        }
                                                                    }
                                                                }}
                                                                >
                                                            <Tooltip className='max-w-[16rem] bg-gray-600 dark:text-[#fff] before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={data?.sortingOrder ?? 'Aa->Zz'}>
                                                                    <div className='flex items-center justify-center'>
                                                                    <div>{data.name}</div>
                                                                    {data.sort && data.sort !== null && (
                                                                        data.sort === 'ASC' ? (
                                                                            <FaArrowDown />
                                                                        ) : (
                                                                            <FaArrowUp />
                                                                        )
                                                                        )}
                                                                    </div>
                                                            </Tooltip>
                                                                </th>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                            <th className='w-[32%]'><div className='flex justify-center'>Action</div></th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {roleDetails && roleDetails.length === 0 && (
                                            <tr>
                                                <th colSpan={2}>No data</th>{' '}
                                            </tr>
                                        )}
                                        {!roleDetails && (
                                            <tr>
                                                <th colSpan={2}>
                                                    <TinnySpinner />
                                                </th>
                                            </tr>
                                        )}
                                        {roleDetails &&
                                            roleDetails.map(function (data, key) {
                                                return (
                                                    <tr key={key}>
                                                        <td className='break-words text-center'>{data.roles ?? data.role}</td>
                                                        <td className=' '>
                                                            <div className='flex flex-row justify-center space-x-4'>
                                                                <div className='flex -space-x-4'>
                                                                {data.AssignedUserRole?.length == 0 && <>Not Assigned</>}
                                                                {data.AssignedUserRole?.length <= 1 ? (
                                                                    data.AssignedUserRole.map(function (d1) {
                                                                        return (
                                                                            <ToolTip 
                                                                            className='relative w-[30px] h-[30px] shadow-md rounded-full'
                                                                            message={d1.firstName + ' ' + d1.lastName}
                                                                            userId={d1._id} // Pass d1._id as a prop named d1Id
                                                                          >
                                                                            <img onClick={()=>handleUserClick(d1.isAdmin ,d1._id ,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                    src={ d1?.profilePic?d1?.profilePic: USER_AVTAR_URL + `${d1?.firstName}.svg`}
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    alt='-'
                                                                                />
                                                                            </ToolTip>
                                                                        )
                                                                    })
                                                                    ) : ( 
                                                                        <div className='flex items-center -space-x-4'>
                                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={ data.AssignedUserRole === undefined ? [] : data.AssignedUserRole[0].profilePic ?? USER_AVTAR_URL + data.AssignedUserRole[0].firstName}
                                                                                    alt=''
                                                                                />
                                                                            </div>
                                                                            {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={data.AssignedUserRole === undefined ? [] : data.AssignedUserRole[1].profilePic ?? USER_AVTAR_URL + data.AssignedUserRole[1].firstName}
                                                                                    alt=''
                                                                                />
                                                                            </div> */}
                                                                            <MemberModal members={data.AssignedUserRole ? data.AssignedUserRole : ""} remainingCount={data.AssignedUserRole?.length - 1}  />
                                                                        </div>
                                                                    )
                                                                }
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className=''>
                                                            <div className='flex items-center gap-2 justify-center'>
                                                                <button>
                                                                    {(permission && permission.roles.edit === true) || Cookies.get('isAdmin') === 'true' ? (
                                                                        <NewToolTip direction='top' message='Edit'>
                                                                            <AddRoles
                                                                                handleGetAllRoles={handleGetAllRoles}
                                                                                type='edit'
                                                                                showEditModal={showEditModal}
                                                                                setEditShowModal={setEditShowModal}
                                                                                rolesData={data}
                                                                                setRole={setRole}
                                                                                role={role}
                                                                                roleId={roleId}
                                                                                setRoleId={setRoleId}
                                                                                handleGetAllUser={handleGetAllUser}
                                                                                setSortTable={setSortTable}

                                                                            />
                                                                        </NewToolTip>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </button>
                                                                {/* <button >
                                                            <NewToolTip direction='left' message={"Add/Remove"}><AssignRemoveUserFromRole  {...{addRemoveUserModel,
                                                            setAddRemoveUserModel}}/></NewToolTip></button> */}
                                                                {(permission && permission.roles.delete === true) || Cookies.get('isAdmin') === 'true' ? (
                                                                    <NewToolTip direction='top' message={'Delete'}>
                                                                        <button
                                                                            className='red-link'
                                                                            onClick={() => {
                                                                                setDeleteMessage('Delete Role ' + '"' + data.roles + '"');
                                                                                setDeleteTaskId(data._id);
                                                                                setOpenDeleteModel(true);
                                                                            }}>
                                                                            <AiOutlineDelete size={16} />
                                                                        </button>
                                                                    </NewToolTip>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                                
                            </div>
                            {roleDetails && roleDetails.length != 0 && (
                                    <div className='flex justify-between items-center'>
                                        <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                            Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                            {sortTable.limit * sortTable.pageNo < roleCount ? sortTable.limit * sortTable.pageNo : roleCount} of {roleCount}{' '}
                                        </p>
                                        <div className='flex items-center '>
                                            <button
                                                disabled={sortTable.pageNo == 1}
                                                onClick={() => {
                                                    setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                                    handlePaginationGroup('skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2))  + '&limit=' + sortTable.limit);
                                                }}
                                                className='disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                                <MdKeyboardArrowLeft className='dark:text-[#fff]'/>
                                            </button>
                                            <div className='pages'>
                                                <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                                    Page <span>{sortTable.pageNo}</span>
                                                </p>
                                            </div>
                                            <button
                                                disabled={sortTable.pageNo === Math.ceil(roleCount / sortTable.limit)}
                                                onClick={() => {
                                                    setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                                    handlePaginationGroup('skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
                                                }}
                                                className='disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
                                                <MdKeyboardArrowRight className='dark:text-[#fff]'/>
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    <UserDetailsWithProjects
                        open={addRemoveUserModel}
                        close={() => {
                            setAddRemoveUserModel(false);
                        }}
                        onClick={() => {}}
                    />
                    <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeleteRolesById} />
                </>
            )}
            </NoSsr>
        </>
    );
}
export default AllRoles;
