import React, { useEffect, useState } from 'react';
import { BiEdit, BiMailSend , BiUnlink ,BiLink}  from 'react-icons/bi';
import { BsDownload, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
import DropDown from '../../../../components/DropDown';
import Filter from './filter';
import EditTableCol from '../../../../components/EditTableCol';
import Cookies from 'js-cookie';
import { getAllRoles, getAllUsers, getEmpUsers, searchMember } from '../api/get';
import TinnySpinner from '../../../../components/TinnySpinner';
import DropDownWithTick from '../../../../components/DropDownWithTick';
import { deleteAllUser, deleteUserById } from '../api/delete';
import DeleteConformation from '../../../../components/DeleteConformation';
import toast from '../../../../components/Toster/index';
import { updateMember } from '../api/put';
import SearchInput from '../../../../components/SearchInput';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight ,MdAppBlocking } from 'react-icons/md';
import EditMember from './editMember';
import AddBulkUser from './addBulkUser';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import UserDetails from './userDetails';
import { memberFilterApi, resendMailUser } from '../api/post';
import { getPermisssionGroup } from '@WORKFORCE_MODULES/permission/api/get';
import NoSsr from '@COMPONENTS/NoSsr';
import AddEmpUsers from './addEmpUsers';
import { downloadFiles } from '@HELPER/download';
import { download_data } from '@HELPER/exportData';
import { getDefaultConfig } from '@WORKFORCE_MODULES/projects/api/get';
import { updateScreenConfig } from '@WORKFORCE_MODULES/projects/api/put';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import NoAccessCard from '@COMPONENTS/NoAccessCard';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import router from 'next/router';
import { Tooltip } from '@material-tailwind/react';
import { data } from 'autoprefixer';
import { FastForward } from 'react-feather';
import { suspendedMember } from '../api/put';


function AllMember() {
    const [editModel, setEditModel] = useState(false);
    const [editUserData, setEditUserData] = useState(null);
    const [membersDetail, setMemberDetails] = useState(null);
    const [membersCount, setMembersCount] = useState(0);
    const [membersDetailDownload, setMemberDetailsDownload] = useState(null);
    const [roleDetail, setRoleDetails] = useState([]);
    const [permissionsDetails, setPermissionsDetails] = useState([]);
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [bulkUserModel, setbulkUserModel] = useState(false);
    const [empUserModel, setEmpUserModel] = useState(false);
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [permission, setPermission] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null)
    const [type, setType] = useState(null);
    const [filterData, setFilterData] = useState(null);

    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const [inviteStatus, setInviteStatus] = useState(1);
    const [membersTableList, setMembersTableList] = useState(null);
    const isEmpAdmin = Cookies.get('isEmpAdmin');

    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
        handleProfileData();
    }, []);
    
    const handleReset = () => {
        for (const item of membersTableList) {
            let data = {
                member: [
                    {
                        name: item.name,
                        value: item.value,
                        sort: item.sort,
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
        handleGetMemberConfig();
    };
    const checkVisibility = function (type) {
        if (!membersTableList) return false;
        return membersTableList.some(obj => {
            if (obj.value === type) {
                return obj.isVisible;
            }
        });
    };
    const handleSelectCol = (data) => {
        const item = {
            member: [
                {
                    name: data.name,
                    value: data.value,
                    sort: 'ASC',
                    isDisabled: data.isDisabled,
                    isVisible: data.isVisible === false ? true : false,
                },
            ],
        }
        updateScreenConfig(item)
            .then(function (result) {
                if (result.data && result.data.body.status === 'success') {
                    handleGetMemberConfig();
                    // toast({
                    //     type: 'success',
                    //     message: result ? result.data.body.message : 'Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: result ? result.data.body.error : 'Try again !',
                    // });
                    handleGetMemberConfig();
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                });
            });

    };

    const handleShorting = (types, colName, colValue) => {
        setMembersTableList(current =>
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

            handleSearchMember('?limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=' + inviteStatus+'&orderBy=' + colValue + '&sort=asc')
            }else{
            handleSearchMember('?limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=' + inviteStatus+'&orderBy=' + colValue + '&sort=desc')

            }
    }else if(type==="filter"){
        if (types === 'asc') {
        handleGetFilterMember('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus+'&orderBy=' + colValue + '&sort=asc')
        }else{
        handleGetFilterMember('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus+'&orderBy=' + colValue + '&sort=desc')
        }

    }else{
        if (types === 'asc') {
            let condition = '?orderBy=' + colValue + '&sort=asc' + '&invitationStatus=' + inviteStatus +'&suspensionStatus=false'
            getAllUsers(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setMemberDetails(response.data?.body?.data?.users);
                
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Error',
                    });
                }
            });
        } else {
            let condition = '?orderBy=' + colValue + '&sort=desc' + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false'
            getAllUsers(condition).then(response => {
                if (response.data.body.status === 'success') {
                    setMemberDetails(response.data?.body?.data?.users);
                }
            });
        }
    }
    }
    const handleGetMemberConfig = () => {
        getDefaultConfig().then(response => {
            if (response.data?.body.status === 'success') {
                setMembersTableList(response.data?.body.data.member);
                
            }
        });
    };

    const handleCloseDeleteModel = () => {
        setOpenDeleteModel(!openDeleteModel);
    };
    const handleDeleteAllProject = () => {
        deleteAllUser(inviteStatus)
            .then(function (result) {
                // stopLoading();
                if (result.data.body.status == 'success') {
                    handleGetAllUser('?invitationStatus=' + inviteStatus+'&suspensionStatus=false');
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
    const handleGetAllRoles = () => {
        getAllRoles(`limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data.body.status === 'success') {
                setRoleDetails(
                    response.data.body.data.totalRolesData.map(data => {
                        return { name: data.roles, text: data.roles, value: data.roles };
                    })
                );
            }
        });
    };
    const handleGetAllPermission = () => {
        getPermisssionGroup(`limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response.data.body.status === 'success') {
                setPermissionsDetails(
                    response.data.body.data.Permissions.map(data => {
                        return { name: data.permissionName, text: data.permissionName, value: data.permissionName };
                    })
                );
            }
        });
    };
    // Dropdown
    const member_data = [
        // { text: 'Settings', value: 1 },
        {
            text: 'Delete all',
            value: 2,
            onClick: (event, value, data, name) => {
                setOpenDeleteAllModel(!openDeleteAllModel);
            },
        },
    ];


    useEffect(() => {
        handleGetMemberConfig();
        handleGetAllRoles(); 
        handleGetAllPermission();
    }, [inviteStatus]);

    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body.data.users);
                if (inviteStatus == 0) {
                    setMembersCount(response.data?.body.data.InvitationCount.pendingInvitationCount);
                } else if (inviteStatus == 1) {
                    setMembersCount(response.data?.body.data.InvitationCount.acceptedInvitationCount);
                } else {
                    setMembersCount(response.data?.body.data.InvitationCount.rejectedInvitationCount);
                }
            }
        });
    };

    const handlePerformBulkAction = (event, actionID) => {
        event.preventDefault();
    };
    const handleDeleteUserById = () => {
        deleteUserById(deleteTaskId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false');
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
    const handleAssignRole = (e, id, selectedData, type) => {
                updateMember(selectedData._id, e.value, type).then(response => {
            if (response.data.body.status === 'success') {
                handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false');
                handleGetAllUserDownload('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus);
                toast({
                    type: 'success',
                    message: response.data.body.message,
                });
            }
        });
    };

    const handleGetFilterMember = (condition="") => {
        // event.preventDefault();
        if(!filterData) return false;
        memberFilterApi(condition,filterData)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setMemberDetails(response.data?.body?.data.users);
                    setMembersCount(response.data.body.data.count);
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    useEffect(()=>{
        handleGetFilterMember("?limit=10" + '&invitationStatus=' + inviteStatus)
    },[filterData])

    const handleSearchMember = (condition ="") => {
        searchMember(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetails(response.data?.body?.data?.user);
                setMembersCount(response.data?.body?.data.TotalUserCount);
            }
        });
    };
    useEffect(() => {
        if(type === "search"){
            handleSearchMember('?limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=' + inviteStatus)
        }else if(type === "filter"){
            handleGetFilterMember('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus)
        }else
            handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false');
    }, [sortTable.limit, inviteStatus,searchKeyword]);

    const handleGetData =() =>{
        if(type === "search"){
            handleSearchMember('?limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=' + inviteStatus)
        }else if(type === "filter"){
            handleGetFilterMember('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus)
        }else
            handleGetAllUser('?limit=' + sortTable.limit + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false');
    }

    const handlePaginationMember = condition => {
        if(type === "search"){
            handleSearchMember(condition +'&keyword=' + searchKeyword + '&invitationStatus=' + inviteStatus);
        }else if(type === "filter"){
            handleGetFilterMember(condition + '&invitationStatus=' + inviteStatus)
        }else{
            handleGetAllUser(condition + '&invitationStatus=' + inviteStatus+'&suspensionStatus=false');
        }
    };

    const GroupFilterData = membersDetailDownload?.map((item) => {
        const { PendingTasks, adminId, createdAt, emailTokenExpire, emailValidateToken, forgotPasswordToken, forgotTokenExpire, invitation, isAdmin, orgId, password, passwordEmailSentCount, profilePic, softDeleted, subTask_details, updatedAt, verificationEmailSentCount, verified, _id, ...rest } = item;
        return rest;
    });

    let FinalDownloadData = GroupFilterData?.map(data => {

        return {
            " Name ": data.firstName + ' ' + data.lastName,
            "Email": data.email,
            "Project Count": data.Project_details.TotalProjectCount,
            "Task Count": data.task_details.TotalTaskCount,
            "Assign Role ": data.role,
            "Permission": data.permission,
            "Performance": data.progress + '%',
        }
    })
    const handleProfileData = () => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setPermission(response.data.body.data.permissionConfig);
            }
        });
    }
    const handleResendMail = (id) =>{
        resendMailUser(id)
            .then(function (result) {
                if (result.data.body.status == 'success') {
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
    }
    const handleGetAllUserDownload = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setMemberDetailsDownload(response.data?.body.data.users);
                if (inviteStatus == 0) {
                    setMembersCount(response.data?.body.data.InvitationCount.pendingInvitationCount);
                } else if (inviteStatus == 1) {
                    setMembersCount(response.data?.body.data.InvitationCount.acceptedInvitationCount);
                } else {
                    setMembersCount(response.data?.body.data.InvitationCount.rejectedInvitationCount);
                }
            }
        });
    };
    useEffect(() => {
        handleGetAllUserDownload('?limit='+process.env.TOTAL_USERS + '&invitationStatus=' + inviteStatus +'&suspensionStatus=false');
    }, []);
 




    
      const updateUserSuspension = (userId, isSuspended) => {
        
        
        setMemberDetails(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, isSuspended } : user
          )
        );
      };
    
      // Function to update specific user's suspension state
      const suspendUser = userId => {
        const  dilteddata =     {"isSuspended" :true }
        if(dilteddata !==null){
         suspendedMember(userId ,dilteddata).then(response => {
        if (response.data.body.status === 'success') {
               toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
        }
    });
     
        } else {
          console.error(`User with ID ${userId} not found.`);
        }
        updateUserSuspension(userId, true);
      };
    
      const unsuspendUser = userId => {
        const  dilteddata =     {"isSuspended" :  false}
        if(dilteddata !==null){
         suspendedMember(userId ,dilteddata).then(response => {
        if (response.data.body.status === 'success') {
               toast({
                        type: 'success',
                        message: response ? response.data.body.message : 'Try again !',
                    });
        }
        });
     
        } else {
          console.error(`User with ID ${userId} not found.`);
        }
        updateUserSuspension(userId, false);
      };

  


    return (
        <>
        {permission && permission.user.view === false ? <NoAccessCard /> : <>
        <div className='font-inter'>
                <div className='flex items-center justify-between my-2 mb-2 -mt-4 flex-wrap'>
                    <div className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1'>Members<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{membersCount ?? 0}</span></div>
                    <div className='flex items-center'>
                        <div className='relative mr-3'>
                            <AddBulkUser
                                roleDetail={roleDetail}
                                handleGetAllUser={handleGetAllUser}
                                type={'add'}
                                limit={sortTable.limit}
                                {...{
                                    setbulkUserModel,
                                    bulkUserModel,
                                    roleDetail,
                                    permissionsDetails,
                                    setInviteStatus,
                                }}
                            />
                        </div>
                        <NoSsr>
                            {isEmpAdmin === 'true' ? (
                                <div className='relative mr-3'>
                                    <AddEmpUsers
                                        handleGetAllUser={handleGetAllUser}
                                        type={'add'}
                                        {...{
                                            setEmpUserModel,
                                            empUserModel,
                                        }}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                        </NoSsr>
                        {membersDetail && membersDetail.length > 0 && (
                            <div className='relative mr-3'>
                                <NewToolTip direction='top' message={'Download'}>
                                {inviteStatus == 1 ?
                                    <DropDown
                                        data={download_data}
                                        defaultValue={''}
                                        name={'memberList'}
                                        downloadData={FinalDownloadData}
                                        icon={
                                            <span className='text-xl grey-link bg-white p-2 rounded-lg'>
                                                <BsDownload />
                                            </span>
                                        }
                                        getData={undefined}
                                    />
                                :' '}
                                </NewToolTip>
                            </div>
                        )}
                    </div>
                </div>
                <div className='card mb-3'>
                    <div className='flex justify-between items-center flex-wrap gap-4'>
                        <div className='flex items-center '>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                            <select
                                value={sortTable.limit}
                                onChange={event => {
                                    setSortTable({ ...sortTable, limit: event.target.value ,pageNo: 1});
                                    // setType(null);
                                }}
                                className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1'>
                                <option className="dark:bg-gray-900" value={10}>10</option>
                                <option className="dark:bg-gray-900" value={25}>25</option>
                                <option className="dark:bg-gray-900" value={50}>50</option>
                                <option className="dark:bg-gray-900" value={100}>100</option>
                                <option className="dark:bg-gray-900" value={500}>500</option>
                            </select>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                        </div>
                        <div className='flex items-center '>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Invitation</p>
                            <select
                                value={inviteStatus}
                                onChange={event => {
                                    setInviteStatus(event.target.value);
                                    setSortTable({skip: 10, limit: 10, pageNo: 1})
                                }}
                                className='border py-1  rounded-md outline-none w-15 text-sm px-2 mx-1 cursor-pointer dark:bg-transparent'>
                                <option className="dark:bg-gray-900" value={1}>Accepted</option>
                                <option className="dark:bg-gray-900" value={0}>Pending</option>
                                <option className="dark:bg-gray-900" value={2}>Rejected</option>
                            </select>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center'>
                                <div className='relative mr-3'>
                                    <SearchInput onChange={(event)=>{
                                        setType("search")
                                        setSearchKeyword(event.target.value)
                                        setSortTable({skip:10, limit:10, pageNo: 1})
                                    }} placeholder={'Search a member'} />
                                </div>
                                <div className='relative mr-3'>
                                    <Filter {...{ roleDetail, handleGetFilterMember,setType,handleGetAllUser, inviteStatus,setFilterData,setSortTable }} />
                                </div>
                                <EditTableCol handleReset={handleReset} data={membersTableList} checkVisibility={checkVisibility} {...{ handleSelectCol }} />
                            </div>
                        </div>
                    </div>
                    <div className='mt-2 overflow-x-scroll relative shadow-md sm:rounded-lg 2xl:max-h-[650px] xl:max-h-[480px] lg:max-h-[600px]'>
                        <table className='table-style w-full'>
                            <thead className='!border-b-0 sticky top-0 z-40'>
                                <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                    {membersTableList &&
                                        membersTableList.map(function (data, key) {
                                            return (
                                                <>
                                                    {data.isVisible && (
                                                        <th
                                                            key={key}
                                                            className={`${data.sort !== null ? 'cursor-pointer' : ''} ${data.name === "Name" ? '2xl:w-[200px] w-[300px]' : 'w-[200px]'}`}
                                                            onClick={() => {
                                                                if (data.sort !== null) {
                                                                    if (data.sort === 'ASC') {
                                                                        handleShorting('desc', data.name, data.value);
                                                                    } else {
                                                                        handleShorting('asc', data.name, data.value);
                                                                    }
                                                                }
                                                            }}>
                                                            <div className={`flex items-center ${((data.name === "Name" || data.name === "Email")) ? "justify-start" : "justify-center" }`}>
                                                            <Tooltip className='max-w-[16rem] dark:text-gray-50 bg-gray-600 before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={'Name. A -> Z'}>
                                                                <div className='flex'>

                                                                <div>{data.name}</div>
                                                                {data.sort &&
                                                                    (data.sort && data.sort === 'ASC' ? (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleShorting('asc', data.name, data.value);
                                                                            }}>
                                                                            <FaArrowDown className='cursor-pointer ml-1' />
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleShorting('desc', data.name, data.value);
                                                                            }}>
                                                                            <FaArrowUp className='cursor-pointer ml-1' />
                                                                        </button>
                                                                    ))}
                                                                    </div>
                                                                        </Tooltip>
                                                            </div>
                                                        </th>
                                                    )}
                                                </>
                                            );
                                        })}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {membersDetail && membersDetail.length === 0 && (
                                    <tr>
                                        <tr>
                                             <h1 style={{ margin: '30px 0px 0px 500px' }}>No data</h1>
                                        </tr>
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
                                                {checkVisibility('firstName') && (
                                                    <td className='2xl:w-[200px] w-[300px] !pt-1 !pb-1 text-center'>
                                                        <div className='flex justify-start gap-1 w-full'>
                                                                <div className='example-emoji w-[20%]' role='img' aria-label='duck emoji'>
                                                                    <div className='user-img-group '>
                                                                        <img src={data.profilePic?data.profilePic:USER_AVTAR_URL + data?.firstName+ '.svg'} className='user-img-sm' alt='user' />
                                                                    </div>
                                                                </div>
                                                            <div className='flex items-center justify-start cursor-pointer hover:text-brandBlue w-[80%]'>
                                                                {/* <span className='pb-1 font-bold'>{`${data.firstName.slice(0, 10)}${data.firstName.length > 10 ? '...' : ''} ${data.lastName.slice(0, 10)}${data.lastName.length > 10 ? '...' : ''}`}</span>
                                                                <span className='text-base'>{data.role}</span> */}
                                                                {inviteStatus == 1 ?
                                                                <a 
                                                                    onClick={event => {
                                                                        router.push('/w-m/members/' + data._id);
                                                                    }}
                                                                    className='break-all text-start text-sm font-bold'>
                                                                    {' '}
                                                                    {data.firstName + ' ' + data.lastName}
                                                                </a> :     <a 
                                                                    onClick={event => {
                                                                        // router.push('/w-m/members/' + data._id);
                                                                    }}
                                                                    className='break-all text-start text-sm font-bold'>
                                                                    {' '}
                                                                    {data.firstName + ' ' + data.lastName}
                                                                </a>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                {checkVisibility('email') && (
                                                    <td className='w-[200px] !pt-1 !pb-1 text-left'>
                                                            <span className='text-sm text-left text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data.email}</span>
                                                    </td>
                                                )}
                                                {checkVisibility('projectCount') && (
                                                    <td className='w-[200px] !pt-1 !pb-1 text-center'>

                                                        <label className='bg-blue-700 text-white text-center rounded py-1 text-sm px-4 inline-block max-w-[50px] overflow-hidden text-ellipsis whitespace-nowrap'>
                                                            {data.Project_details.TotalProjectCount}
                                                        </label>
                                                    </td>
                                                )}
                                                {checkVisibility('taskCount') && (
                                                    <td className='w-[200px]  !pt-1 !pb-1 text-center'>
                                                        <div className=' flex justify-center'>

                                                        <label className='bg-blue-700 text-white text-center rounded max-w-[50px] py-1 text-sm px-4 inline-block overflow-hidden text-ellipsis whitespace-nowrap'>
                                                            {data.task_details.TotalTaskCount}
                                                        </label>
                                                        </div>
                                                    </td>
                                                )}
                                                {checkVisibility('role') && (
                                                       Cookies.get('isAdmin') === 'true'?
                                                        <td className='w-[200px] !pt-1 !pb-1 '>
                                                            <div className='flex items-center gap-2'>
                                                                <DropDownWithTick paddingForDropdown={"py-1"} onChangeValue={handleAssignRole} selectedData={data} data={roleDetail} value={data.role} handle={undefined} type={"role"} className={'relative text-center'} />
                                                            </div>
                                                        </td>:
                                                        
                                                            <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                                <div className='flex flex-col'>
                                                                    <span className='text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data.role}</span>
                                                                </div>
                                                            </td>
                                                )}
                                                {checkVisibility('permission') && (
                                                     Cookies.get('isAdmin') === 'true' ?
                                                        <td className='w-[200px] !pt-1 !pb-1'>
                                                            <div className='flex flex-col text-center'>
                                                                <DropDownWithTick paddingForDropdown={"py-1"} onChangeValue={handleAssignRole} selectedData={data} data={permissionsDetails} value={data.permission} type={"permission"} handle={undefined} className={'relative text-center'} />
                                                            </div>
                                                        </td> :
                                                        <td className='w-[15%] !pt-1 !pb-1 text-center'>
                                                            <div className='flex flex-col'>
                                                                <span className='text-ellipsis overflow-hidden whitespace-nowrap font-bold'>{data.permission}</span>
                                                            </div>
                                                        </td>
                                                )}
                                                {checkVisibility('performance') && (
                                                    <td className='w-[200px] !pt-1 !pb-1'>
                                                        {/* progressbar */}
                                                        <div className='w-full mx-auto'>
                                                            <span className=' text-defaultTextColor text-sm'>{data.progress ?? 0}%</span>
                                                            <div className='w-full bg-veryLightGrey h-2 rounded-full dark:bg-veryLightGrey'>
                                                                <div
                                                                    className='bg-redColor text-[0.5rem] h-2 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
                                                                    style={{ width: `${data.progress ?? 0}%` }} ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                {checkVisibility('action') && (
                                                    <td className='w-[200px] !pt-1 !pb-1'>
                                                        <div className='flex items-center gap-2 text-[17.5px] justify-center cursor-pointer'>
                                                            {/* <UserDetails data={data} {...{handleGetAllUser}} /> */}
                                                            {permission && permission.user.edit === true || Cookies.get('isAdmin') === 'true' ?
                                                            <NewToolTip direction={'left'} message={'Edit'}>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditModel(true);
                                                                        setEditUserData(data);
                                                                    }}
                                                                    className=''>
                                                                    <BiEdit />
                                                                </button>
                                                            </NewToolTip>: <></>
                                                        }
                                                            {permission && permission.user.delete === true || Cookies.get('isAdmin') === 'true' ?
                                                            <NewToolTip direction='left' message={'Delete'}>
                                                                <button
                                                                    className='red-link'
                                                                    onClick={() => {
                                                                        setDeleteMessage('Delete Member ' + '"' + data.firstName + ' ' + data.lastName + '"');
                                                                        setDeleteTaskId(data._id);
                                                                        setOpenDeleteModel(true);
                                                                    }}>
                                                                    <AiOutlineDelete />
                                                                </button>
                                                            </NewToolTip>:<></>}
                                                            {inviteStatus == 2 || inviteStatus == 0 ? 
                                                                <NewToolTip direction='left' message={'Resend'}>
                                                                <button
                                                                    className='green-link'
                                                                    onClick={() => {
                                                                        handleResendMail(data._id)
                                                                    }}>
                                                                    <BiMailSend />
                                                                </button>
                                                            </NewToolTip>:<></>    
                                                            }
                                                               <div>
                                                             {data?.isSuspended && data?.isSuspended === true ?
                                                               <NewToolTip direction='left' message= "Un Block">
                                                                <button onClick={() => unsuspendUser(data._id)}>
                                                                   
                                                                    <BiUnlink  style={{ color: 'red' }}/>
                                                                </button>
                                                                </NewToolTip>
                                                              :                  
                                                            <NewToolTip direction='left' message={ "Block"}>
                                                                <button onClick={() =>suspendUser(data._id) }>
                                                                <BiLink style={{ color: 'green' }} />
                                                                </button>
                                                            </NewToolTip>
                                                             }
                                                                </div>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                      {membersDetail && membersDetail.length != 0 && (
                    <div className='flex justify-between items-center'>
                        <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                            Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to {sortTable.limit * sortTable.pageNo < membersCount ? sortTable.limit * sortTable.pageNo : membersCount} of{' '}
                            {membersCount}{' '}
                        </p>
                        <div className='flex items-center '>
                            <button
                                disabled={sortTable.pageNo == 1}
                                onClick={() => {
                                    handlePaginationMember('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
                                    setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1, skip: (sortTable.limit * sortTable.pageNo) - (sortTable.limit * 2) });
                                }}
                                className='disabled:opacity-25 dark:text-gray-50 disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
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
                                    handlePaginationMember('?skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
                                    setSortTable({
                                        ...sortTable, pageNo: sortTable.pageNo + 1,
                                        skip: sortTable.pageNo * sortTable.limit
                                    });
                                
                                }}
                                className='disabled:cursor-not-allowed dark:text-gray-50 arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white'>
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
                message={'Delete All Member'}
                onClick={handleDeleteAllProject}
            />
            <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeleteUserById} />
            <EditMember permissionsDetails={permissionsDetails} roleDetail={roleDetail} handleGetAllUser={handleGetAllUser} handleGetData={handleGetData} sortTable={sortTable} handleSearchMember={handleSearchMember} handleGetFilterMember={handleGetFilterMember} types={type}  searchKeyword={searchKeyword}  {...{ editUserData, setEditModel, editModel, inviteStatus }} />
            {/* <UserDetailsWithProjects open={addRemoveUserModel} close={() => { setAddRemoveUserModel(false); } } onClick={() => { } } data={undefined} /> */}
       
        </>}
             </>
    );
}
export default AllMember;
