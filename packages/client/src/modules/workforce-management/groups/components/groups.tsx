/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BsDownload, BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import NewToolTip from '../../../../components/NewToolTip';
import DropDown from '../../../../components/DropDown';
import EditTableCol from '../../../../components/EditTableCol';
import { getAllGroups, searchGroups } from '../api/get';
import TinnySpinner from '../../../../components/TinnySpinner';
import { deleteAllGroup, deleteGroupById } from '../api/delete';
import DeleteConformation from '../../../../components/DeleteConformation';
import toast from '../../../../components/Toster/index';
import SearchInput from '../../../../components/SearchInput';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import CreateOrEditGroup from './createOrEditGroup';
import GroupDetails from './groupDetailsView';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import ToolTip from '../../../../components/ToolTip';
import Filter from '../../projects/components/filter';
import { getAllUsers } from '@WORKFORCE_MODULES/members/api/get';
import GroupFilter from './groupFilter';
import { filterGroupApi } from '../api/post';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { downloadFiles } from '@HELPER/download';
import { getDefaultConfig } from '@WORKFORCE_MODULES/projects/api/get';
import { updateScreenConfig } from '@WORKFORCE_MODULES/projects/api/put';
import MemberModal from '@COMPONENTS/MemberModal';
import { Tooltip } from '@material-tailwind/react';
import { handleUserClick } from '@HELPER/function';

function Groups({}) {
    const [groupDetail, setGroupDetails] = useState(null);

    const [users, setUsers] = useState([]);

    const [deleteGroupId, setDeleteGroupId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDeleteModel, setOpenDeleteModel] = useState(false);
    const [openDeleteAllModel, setOpenDeleteAllModel] = useState(false);
    const [groupCount, setGroupCount] = useState(0);
    const [types, setType] = useState(null)
    const [filterData, setFilterData] = useState(null);
    const [searchKeyword,setSearchKeyword] = useState('')
    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const [groupTableList, setGroupTableList] = useState(null);

    useEffect(()=>{
        handleGroupFilterTask("?limit=10" + '&invitationStatus=1');
    },[filterData])

    const handleGetAllUser = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data.body.status === 'success') {
                setUsers(
                    response.data?.body.data.users.map(data => {
                        return { id: data._id, role: data.role, key: data.firstName + ' ' + data.lastName+ " "+ "("+ data.role + ")", value: data };
                    })
                );
            }
            else if  (response.data.body.status === 'failed'){
                setUsers([])
            }
        });
    };
    const handleReset = () => {
        for (const item of groupTableList) {
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
        handleGetGroupConfig();
    };
    const checkVisibility = function (type) {
        if(!groupTableList) return false;
        return groupTableList.some(obj => {
            if (obj.value === type) {
                return obj.isVisible;
            }
        });
    };
    const handleSelectCol = (data) => {
        const item = {
            group: [
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
                    handleGetGroupConfig();
                    // toast({
                    //     type: 'success',
                    //     message: result ? result.data.body.message : 'Try again !',
                    // });
                } else {
                    // toast({
                    //     type: 'error',
                    //     message: result ? result.data.body.error : 'Try again !',
                    // });
                    handleGetGroupConfig();
                }
            })
            .catch(function (response) {
                toast({
                    type: 'error',
                    message: response.data ? response.data.body.error : 'Something went wrong, Try again !',
                });
            });
              
      };
    const handleShorting = (type, colName, colValue) => {
        setGroupTableList(current =>
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
            searchGroups('keyword='+searchKeyword+'&orderBy=' + colValue + '&sort=asc').then(response => {
                if (response.data.body.status === 'success') {
                    setGroupDetails(response.data.body.data.groupData);
                    setGroupCount(response?.data?.body?.data?.groupCount);
                } else {
                    setGroupDetails([]);
                    setGroupCount(0);
                }
            });
        } else {
            searchGroups('keyword='+searchKeyword+'&orderBy=' + colValue + '&sort=desc').then(response => {
                if (response.data.body.status === 'success') {
                    setGroupDetails(response.data.body.data.groupData);
                    setGroupCount(response?.data?.body?.data?.groupCount);
                } else {
                    setGroupDetails([]);
                    setGroupCount(0);
                }
            });
        }
    }else if(types === "filter"){
        if (type === 'asc') {
            handleGroupFilterTask('?limit=' + sortTable.limit + '&invitationStatus=1&orderBy=' + colValue + '&sort=asc')
            }else{
            handleGroupFilterTask('?limit=' + sortTable.limit + '&invitationStatus=1&orderBy=' + colValue + '&sort=desc')
            }
    }else{
        if (type === 'asc') {
            getAllGroups('?limit=' + sortTable.limit+ '&invitationStatus=1&order=' + colValue + '&sort=asc').then(response => {
                if (response?.data?.body?.status === 'success') {
                    setGroupDetails(response?.data?.body?.data?.groupDetails);
                    setGroupCount(response?.data?.body?.data?.groupCount);
                }
            });
        } else {
            getAllGroups('?limit=' + sortTable.limit+ '&invitationStatus=1&order=' + colValue + '&sort=desc').then(response => {
                if (response?.data?.body?.status === 'success') {
                    setGroupDetails(response?.data?.body?.data?.groupDetails);
                    setGroupCount(response?.data?.body?.data?.groupCount);
                }
            });
        } 
    }
    };
    const handleGetGroupConfig = () => {
        getDefaultConfig().then(response => {
            if (response.data?.body.status === 'success') {
                setGroupTableList(response.data?.body.data.group);
            }
        });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    };
    const handleGroupFilterTask = (ApiData) => {
        // event.preventDefault();
        if(!filterData) return false;
        filterGroupApi(ApiData,filterData)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setGroupDetails(response?.data?.body?.data);
                }
                else if(response.data.body.status === 'failed'){
                    setGroupDetails([])
                }
            })
            .catch(function (e) {
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };
    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');

    });
    const handleCloseDeleteModel = () => {
        setOpenDeleteModel(!openDeleteModel);
    };
    useEffect(() => {
        handleGetGroupConfig();
        handleGetAllUser('?limit=' +process.env.TOTAL_USERS+ '&invitationStatus=1&suspensionStatus=false');
        if(types === "search"){
            searchGroups('limit=' + sortTable.limit+'&keyword=' + searchKeyword + '&invitationStatus=1')

        }else if(types === "filter"){
            handleGroupFilterTask('?limit=' + sortTable.limit + '&invitationStatus=1');
        }else
            getAllGroups('?limit=' + sortTable.limit+ '&invitationStatus=1').then(response => {
                if (response?.data?.body?.status === 'success') {
                    setGroupDetails(response?.data?.body?.data?.groupDetails);
                    setGroupCount(response?.data?.body?.data?.groupCount);
                }
            });

    }, [sortTable.limit]);
    
    const handleGetAllGroups = (condition = '?limit=' + sortTable.limit) => {
        getAllGroups(condition).then(response => {
            if (response?.data?.body?.status === 'success') {
                setGroupDetails(response?.data?.body?.data?.groupDetails);
                setGroupCount(response?.data?.body?.data?.groupCount);
            }
        });
    };
    useEffect(() => {
        handleGetAllUser('?limit='+process.env.TOTAL_USERS+'&invitationStatus=1&suspensionStatus=false');
    }, []);
    const handleSearchGroups = (event: { target: { value: string } }) => {
        searchGroups('keyword=' + event.target.value).then(response => {
            if (response.data.body.status === 'success' && response.data.body.data.groupData) {
                setGroupDetails(response.data.body.data.groupData);
                setGroupCount(response?.data?.body?.data?.groupCount);

            } else {
                setGroupDetails([]);
                setGroupCount(0);
            }
        });
    };
    const handlePaginationGroup = condition => {
        if(types === "search"){
            let totalCondition = condition + "&keyword=" +searchKeyword
            searchGroups(totalCondition).then(response => {
                if (response.data.body.status === 'success') {
                    setGroupDetails(response.data.body.data.groupData);
                }
            });
        }else if(types === "filter"){
            handleGroupFilterTask(condition + '&invitationStatus=1');
        }else{
            handleGetAllUser(condition + '&invitationStatus=1');
        } 
    };
 
    const handleDeleteGroupById = () => {
        deleteGroupById(deleteGroupId)
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllGroups();
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
        deleteAllGroup()
            .then(function (result) {
                if (result.data.body.status == 'success') {
                    handleGetAllGroups();
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

    const GroupFilterData = groupDetail?.map((item) => {
        const { adminId, createdBy, groupCreatedBy, groupDescription, groupLogo, groupUpdatedBy, updatedAt, _id, ...rest } = item;
        return rest;
      });
 
             let FinalDownloadData =GroupFilterData?.map(data =>{
                const groupName=data.groupName
                let Assignmembers=data?.assignedMembers?.map(dataItem=>{
                    return   dataItem.firstName + ' ' + dataItem.lastName
                     
                })
                if (!Assignmembers || Assignmembers.length === 0) {
                    Assignmembers = ['Not Assigned'];
                }
               return{
               " Group Name " : groupName ,
                "Assign Members" :Assignmembers.join(',  ')
               }
             })

             const bulkAction = [
                {
                  text: "Delete all",
                  value: 2,
                  onClick: (event, value, data, name) => {
                    if (groupDetail.length === 0) {
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
                        if (groupDetail.length === 0) {
                            toast({
                                type: "error",
                                message: "Please add data before downloading.",
                              });
                        } else {
                            downloadFiles('excel', 'Groups', FinalDownloadData);
                        }
                    },
                },
                {
                    text: 'Download PDF file',
                    value: 'pdf',
                    onClick: () => {
                        if (groupDetail.length === 0) {
                            toast({
                                type: "error",
                                message: "Please add data before downloading.",
                              });
            
                        } else {
                            downloadFiles('pdf', 'Gropus', FinalDownloadData);
                        }
                    },
                },
            ];
    return (
        <>
            <div className='font-inter'>
                <div className='flex items-center justify-between my-2 mb-4 flex-wrap'>
                    <div className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1 '>Groups<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{groupCount}</span></div>
                    <div className='flex items-center'>
                        <div className='relative mr-3'>
                            <CreateOrEditGroup
                                data={undefined}
                                type={'add'}
                                {...{
                                    handleGetAllGroups,
                                    users,
                                }}
                            />
                        </div>
                        {groupDetail && groupDetail.length > 0 && (
                        <div className='relative mr-3'>
                            <NewToolTip direction='top' message={'Download'}>
                                <DropDown
                                    data={download_data}
                                    defaultValue={''}
                                    name={'groupList'}
                                    downloadData={FinalDownloadData}
                                    icon={
                                        <span className='text-2xl grey-link bg-white p-2 rounded-lg'>
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
                <div className='card groups-card-wrapper pt-14'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center '>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                            <select
                                value={sortTable.limit}
                                onChange={event => {
                                    setSortTable({ ...sortTable, limit: event.target.value ,pageNo:1});
                                    // setType(null);
                                }}
                                className='border py-1  rounded-md outline-none w-15 dark:bg-gray-900 text-base px-2 mx-1'>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={500}>500</option>
                            </select>
                            <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center gap-1'>
                                    <SearchInput onChange={(e)=>{handleSearchGroups(e)
                                   setType("search")
                                   setSortTable({skip:10, limit:10, pageNo: 1})
                                   setSearchKeyword(e.target.value)}} placeholder={'Search Group'} />
                                    <GroupFilter type={'reset'} {...{ handleGroupFilterTask,handleGetAllGroups,setFilterData,setType }} />
                                    {/* <GroupFilter type={'reset'} {...{ handleGroupFilterTask ,handleGetAllGroups,setType}} /> */}
                                <EditTableCol handleReset={handleReset} data={groupTableList} checkVisibility={checkVisibility} {...{handleSelectCol}} />
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
                    <div className='mt-2 overflow-x-scroll relative shadow-md sm:rounded-lg 2xl:max-h-[650px] xl:max-h-[420px] lg:max-h-[500px]'>
                        <table className='table-style min-w-[500px] '>
                            <thead className='groups-table-head'>
                                <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                    {groupTableList &&
                                        groupTableList.map(function (data) {
                                            return (
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
                                                    <Tooltip className='max-w-[16rem] bg-gray-600 dark:text-gray-50 before:absolute before:top-[120%] before:-translate-y-[120%] before:-translate-x-[50%] before:left-[50%] before:transform before:rotate-45 before:border-gray-600 before: before:border-t before:border-[5px]' content={data?.sortingOrder ?? 'Aa->Zz'}>
                                                    <div className={`flex items-center gap-2 ${data.name==="Group Name" ? "justify-start ps-4" : "justify-center"} `}>
                                                        {data.name}
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
                                            );
                                        })}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {groupDetail && groupDetail.length === 0 && (
                                    <tr>
                                        <tr>
                                             <h1 style={{ margin: '30px 0px 0px 500px' }}>No data</h1>
                                        </tr>
                                    </tr>
                                )}
                                {!groupDetail && (
                                    <tr>
                                        <th colSpan={2}>
                                            <TinnySpinner />
                                        </th>
                                    </tr>
                                )}
                                {groupDetail &&
                                    groupDetail.map(function (data, key) {
                                        return (
                                            <tr key={key}>
                                                {checkVisibility('groupName') && (
                                                    <td className=' !pt-1 !pb-1 flex items-center justify-start w-full'>
                                                        <div className=' flex items-center gap-2 justify-start max-w-full'>
                                                                <span className='example-emoji w-max-[50px]' role='img' aria-label='duck emoji'>
                                                                    <div className='user-img-group'>
                                                                    <img src={data.groupLogo ? data.groupLogo: '/imgs/default.png'} className='user-img-sm' alt='user' />
                                                                    </div>
                                                                </span>
                                                                <span className='pb-1 font-bold break-all max-w-[80%]'>{data.groupName}</span>
                                                        </div>
                                                    </td>
                                                )}

                                        {checkVisibility('assignedMembers') && (
                                        <td className=' !pt-1 !pb-1'>
                                            <div className='flex justify-center -space-x-4'>
                                                { data.assignedMembers && data.assignedMembers.length > 1 ? 
                                                    <>
                                                        <div className='flex items-center -space-x-4'>
                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                <img
                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                    src={data.assignedMembers === undefined ? [] : data.assignedMembers[0].profilePic ?? USER_AVTAR_URL + `${data.assignedMembers[0].firstName}.svg`}
                                                                    alt=''
                                                                />
                                                            </div>
                                                            {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                <img
                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                    src={data.assignedMembers === undefined ? [] : data.assignedMembers[1].profilePic ?? USER_AVTAR_URL + `${data.assignedMembers[1].firstName}.svg`}
                                                                    alt=''
                                                                />
                                                            </div> */}
                                                            <MemberModal members={data.assignedMembers ? data.assignedMembers : ""} remainingCount={data.assignedMembers?.length - 1}  />
                                                        </div>
                                                    </>:
                                                    (
                                                        data.assignedMembers.map((d)=>{
                                                            return  (
                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' message={d.firstName}
                                                                userId={d._id} 
                                                                >
                                                                 <img onClick={()=>handleUserClick(d.isAdmin ,d._id ,d.isSuspended)} style={{ cursor: 'pointer' }}
                                                                        src={USER_AVTAR_URL + d.firstName + '.svg'}
                                                                        className='ring-2 ring-gray-300 dark:ring-gray-500 w-full h-full rounded-full border-2 border-white dark:border-gray-800'
                                                                        alt='-'
                                                                    />
                                                                </ToolTip>
                                                            )
                                                        })
                                                    )  
                                                }
                                            </div>
                                        </td>
                                    )}
                                         <td className='!pt-1 !pb-1 cursor-pointer'>
                                                    <div className='flex items-center gap-3 justify-center'>
                                                        <GroupDetails data={data} />
                                                        <NewToolTip direction={'top'} message={'Edit'}>
                                                            <CreateOrEditGroup
                                                                users={undefined}
                                                                type={'edit'}
                                                                data={data}
                                                                {...{
                                                                    handleGetAllGroups,
                                                                    users,
                                                                }}
                                                            />
                                                        </NewToolTip>
                                                        <NewToolTip direction='top' message={'Delete'}>
                                                            <button
                                                                className='red-link text-[16px]'
                                                                onClick={() => {
                                                                    setDeleteMessage('Delete Group' + '"' + data.groupName + '"');
                                                                    setDeleteGroupId(data._id);
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
                    {groupDetail && groupDetail.length != 0 && (
                        <div className='flex justify-between items-center'>
                            <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to {sortTable.limit * sortTable.pageNo < groupCount ? sortTable.limit * sortTable.pageNo : groupCount} of{' '}
                                {groupCount}{' '}
                            </p>
                            <div className='flex items-center '>
                                <button
                                    disabled={sortTable.pageNo == 1}
                                    onClick={() => {
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                        handlePaginationGroup('skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
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
                                    disabled={sortTable.pageNo === Math.ceil(groupCount / sortTable.limit)}
                                    onClick={() => {
                                        setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                        handlePaginationGroup('skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
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
                message={'Delete All Groups'}
                onClick={handleDeleteAllGroup}
            />
            <DeleteConformation open={openDeleteModel} close={handleCloseDeleteModel} message={deleteMessage} onClick={handleDeleteGroupById} />
        </>
    );
}
export default Groups;
