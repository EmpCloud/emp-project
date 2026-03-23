/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import MemberModal from '@COMPONENTS/MemberModal';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllSubTask, searchSubTask, searchTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import toast from '../../../../../../components/Toster/index';
import { getAllStatus, getAllUsers } from '../../api/get';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { Tooltip } from '@material-tailwind/react';

const subtask_grid_XL = ({ clickConfig, subtaskCount, projectList, Id }) => {
    const [subtaskDetails, setSubtaskDetails] = useState(null);
    const [users, setUsers] = useState([]);
    const [memberId,setMemberId] = useState(null)
    const [memberName,setMemberName] = useState(null)
    const [statusDetails, setStatusDetails] = useState([]);
    const [apiData,setApiData]= useState(null);
    const [subTaskCount, setSubTaskCount] = useState(null)
    const [status,setStatus] = useState(null);
    const [tinyLoader,setTinyLoader] = useState(false);

    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });

    useEffect(() => {
        if (memberId !== null&&apiData===null) {
        handleGetAllSubtask('?limit=' + sortTable.limit+ '&projectId=' + Id );
        }else{
        handleGetAllSubtask('?limit=' + sortTable.limit+ '&projectId=' + Id +apiData);

        }
    }, [sortTable.limit,memberId,apiData]);

    const handleGetAllSubtask = (condition = '?limit=' + sortTable.limit) => {
        setTinyLoader(true);
        getAllSubTask(condition)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setSubtaskDetails(response.data.body.data.subTasks);
                    setSubTaskCount(response.data?.body?.data?.subTaskCount);
                    setTinyLoader(false);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.message : 'Error',
                    });
                    setTinyLoader(false);
                }
            })
            .catch(function (e) {
                setTinyLoader(false);
                toast({
                    type: 'error',
                    message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
                });
            });
    };

    const handleSearchSubTask = event => {
        searchSubTask('keyword=' + event.target.value + '&limit=' + sortTable.limit).then(response => {
            if (response.data.body.status === 'success') {
                setSubtaskDetails(response.data.body.data);
            }
        });
    };

    const handlePaginationSubTasks = condition => {
        if(apiData!==null){
            handleGetAllSubtask('?' +condition+ '&projectId=' + Id +apiData);

        }else{
            handleGetAllSubtask('?' +condition+ '&projectId=' + Id );

        }
        
    };
    const handleGetAllUsers = (condition = '') => {
        getAllUsers(condition).then(response => {
            if (response.data?.body.status === 'success') {
                setUsers(
                    response.data?.body.data.users.map(data => {
                        return {
                            id: data._id,
                            role: data.role,
                            key: data.firstName + ' ' + data.lastName,
                            value: data,
                        };
                    })
                );
                setMemberId(response?.data?.body?.data?.users[0]?._id)
                setApiData(`&userId=${response?.data?.body?.data?.users[0]?._id}`)
                setMemberName(response?.data?.body?.data?.users[0]?.firstName)
            }else {
                return null
                // toast({
                //     type: 'error',
                //     message: response ? response.data.body.message : 'Error',
                // });
            }
        })
        .catch(function (e) {
            return null
            // toast({
            //     type: 'error',
            //     message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
            // });
        });
    };
    const handleGetAllStatus = () => {
        getAllStatus().then(response => {
            if (response.data?.body.status === 'success') {
                setStatusDetails(response.data?.body.data.data);
            }else {
            return null
                // toast({
                //     type: 'error',
                //     message: response ? response.data.body.message : 'Error',
                // });
            }
        })
        .catch(function (e) {
            return null
            // toast({
            //     type: 'error',
            //     message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
            // });
        });
    };
    useEffect(()=>{
        if(Id!==null){
            handleGetAllUsers(`?projectId=${Id}`);
            handleGetAllStatus();
        }
    },[Id]);
    const handleChange = (event,type)=>{
        event.preventDefault();
        if(type ==="assignedTo"){
            const user = users.find(user => user.key === event .target.value);
            setMemberName(user.key);
        setApiData(`&userId=${user.id}`)
        
        
        }else
        {
        setApiData(`&status=${event.target.value}`)
        setStatus(event.target.value);

        }
        
    }
    return (
        <>
            <div className={`${clickConfig ? 'outline' : ''} shadow-md`}>
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
                    <div className='card p-7 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium font-semibold'>Subtask</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value,pageNo: 1 });
                                    }}
                                    className='border py-1 rounded-md outline-none w-15 h-6 text-sm px-2 mx-1'>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                    <option value={25}>25</option>
                                </select>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Entries</p>
                            </div>
                        </div>
                        <div className='flex justify-between flex-wrap gap-2 items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center relative text-darkTextColor px-2 py-1'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    Total Subtask
                                    <span className='absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-base text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]'>
                                        {subTaskCount?subTaskCount:0}
                                    </span>
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                    <FloatingOnlySelectfield
                                        type='text'
                                        optionsGroup={users?.map(d => {
                                            return { text: d.value.firstName + ' ' + d.value.lastName, value: d.value.firstName + ' ' + d.value.lastName,};
                                        })}
                                        name={'assignedTo'}
                                        value={memberName?memberName:''}
                                        onChange={event => {
                                            handleChange(event, 'assignedTo');
                                            setSortTable( {skip: 5,
                                                limit: 5,
                                                pageNo: 1,})
                                        }}
                                    />
                                <FloatingOnlySelectfield
                                            type='text'
                                            optionsGroup={
                                                statusDetails &&
                                                statusDetails.map(d => {
                                                    return { text: d.taskStatus, value: d.taskStatus };
                                                })
                                            }
                                            name={'taskStatus'}
                                            value={status?status:''}
                                            onChange={event => {
                                                handleChange(event, 'status');
                                                setSortTable( {skip: 5,
                                                    limit: 5,
                                                    pageNo: 1,})
                                            }}
                                        />
                                
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchSubTask} placeholder={'Search a task'} />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='overflow-x-auto relative shadow-md max-h-[250px] overflow-y-auto'>
                                <table className='table-style w-full table-auto min-w-[1200px]'>
                                    <thead className='!border-b-0 sticky top-0 z-40'>
                                        <tr className='text-gray-700 uppercase bg-blue-300  border-0 dark:bg-gray-700 dark:text-gray-400'>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Subtask Title </div>
                                            </th>

                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Created By</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Due date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex justify-center items-center'>Assigned to</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Task type</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Category</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Status</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Stages</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Priority</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {/* {subtaskDetails && subtaskDetails.length === 0 && (
                                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                <th colSpan={10} scope='row' className='col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                    No data
                                                </th>
                                            </tr>
                                        )} */}
                                         {tinyLoader===true &&  (
                                            <tr>
                                                <th colSpan={10}>
                                                    <TinnySpinner />
                                                </th>
                                            </tr>
                                        )}
                                        {subtaskDetails && subtaskDetails.length?
                                            subtaskDetails.map(function (data) {
                                                return (
                                                    <>
                                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className=' flex justify-start'>
                                                                {data.subTaskTitle}
                                                                </div>
                                                            </td>

                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center'>
                                                                <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={data.subTaskCreator.firstName} >
                                                                <img onClick={()=>handleUserClick(data.subTaskCreator?.isAdmin ,data.subTaskCreator?.id ,data.subTaskCreator?.isSuspended)} style={{ cursor: 'pointer' }}
                                                                        src={ USER_AVTAR_URL + data.subTaskCreator.firstName + '.svg'}
                                                                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center'>
                                                                {formatedDate(data.dueDate)}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center -space-x-4'>
                                                                    {filterMembers(data.subTaskAssignedTo).length == 0 ? <>Not Assigned</>:

                                                                    <>

                                                                    {filterMembers(data.subTaskAssignedTo).length <= 1 ? 
                                                                    
                                                                    filterMembers(data.subTaskAssignedTo).map((d) =>{
                                                                        return (
                                                                             <ToolTip className='relative w-[38px] bg-white h-[38px] shadow-md rounded-full' message={d.firstName} key={d.firstName}  userId={d._id}>
                                                                                <img onClick={()=>handleUserClick(d.isAdmin ,d?._id,d.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                     src={USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                     className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                     alt='-'
                                                                                 />
                                                                             </ToolTip>
                                                                         )
                                                                     
                                                                     })
                                                                    :
                                                                        (
                                                                            <div>
                                                                                 <div className='flex items-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 cursor-pointer -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src="https://avatars.dicebear.com/api/bottts/ydhd.svg"
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src="https://avatars.dicebear.com/api/bottts/ydhd.svg"
                                                                                        alt=''
                                                                                    />
                                                                                </div> */}
                                                                                <MemberModal members={data.subTaskAssignedTo ? filterMembers(data.subTaskAssignedTo) : ""} remainingCount={filterMembers(data.subTaskAssignedTo)?.length - 1}  />
                                                                            </div>
                                                                            </div>
                                                                        )
                                                                        }
                                                                    </>
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className='flex justify-center'>{data.subTaskType}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className='flex justify-center'>{data.subTaskCategory}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className='flex justify-center'>{data.subTaskStageName}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className='flex justify-center'>{data.subTaskStatus}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-sm text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <b className='flex justify-center'>
                                                                    {data.priority === 'High' ? (
                                                                        <ToolTip message={data.priority}>
                                                                            <p className='priority-with-bg text-priority1Color bg-priority1bg'>{data.priority}</p>
                                                                        </ToolTip>
                                                                    ) : data.priority === 'Medium' ? (
                                                                        <ToolTip message={data.priority}>
                                                                            <p className='priority-with-bg text-priority2Color bg-priority2bg'>{data.priority}</p>
                                                                        </ToolTip>
                                                                    ) : (
                                                                        <ToolTip message={data.priority}>
                                                                            <p className='priority-with-bg text-priority3Color bg-priority3bg'>{data.priority}</p>
                                                                        </ToolTip>
                                                                    )}
                                                                </b>
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            }): <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <td colSpan={10} scope='row' className='col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                            {subtaskDetails && subtaskDetails.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                        {sortTable.limit * sortTable.pageNo < subTaskCount ? sortTable.limit * sortTable.pageNo : subTaskCount} of {subTaskCount}{' '}
                                    </p>
                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({
                                                    ...sortTable,
                                                    pageNo: sortTable.pageNo - 1,
                                                });
                                                handlePaginationSubTasks('skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
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
                                            disabled={sortTable.pageNo === Math.ceil(subTaskCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({
                                                    ...sortTable,
                                                    pageNo: sortTable.pageNo + 1,
                                                    skip: sortTable.pageNo * sortTable.limit,
                                                });
                                                handlePaginationSubTasks('skip=' + sortTable.pageNo * sortTable.limit + '&limit=' + sortTable.limit);
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
            </div>
        </>
    );
};

export default subtask_grid_XL;
