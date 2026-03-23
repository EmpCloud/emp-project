/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { apiIsNotWorking, filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllTask, searchTask } from '@WORKFORCE_MODULES/task/api/get';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import toast from '../../../../../../components/Toster/index';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { getAllStatus, getAllUsers } from '../../api/get';
import { filterTaskApi } from '../../api/post';
import MemberModal from '@COMPONENTS/MemberModal';

const task_grid_xl = ({ clickConfig, handleRemoveGrid, Id, key ,projectSelected}) => {
    const [taskDetails, setTaskDetails] = useState([]);
    const [memberId,setMemberId] = useState(null);
    const [memberName,setMemberName] = useState(null);
    const [member,setMemberOrStatus] = useState(`{"taskStatus":"Todo","projectId":${Id}}`);
    const [status,setStatus] = useState(null);
    const [statusDetails, setStatusDetails] = useState([]);
    const [users, setUsers] = useState([]);
    const [taskCount, setTaskCount] = useState(null);
    const [tinyLoader,setTinyLoader] = useState(false);
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });

    const initialState = {
        isValid: false,
        values: {
            projectName: projectSelected?projectSelected?.name:null,
            assignedTo: [],
            taskStatus: 'Todo',
           
        },
        touched: {},
        errors: {
            projectName: null,
            assignedTo: [],
            taskStatus: 'Todo',
        },
    };

    const [formState, setFormState] = useState({ ...initialState });

    const hasError = field => !!(formState.touched[field] && formState.errors[field]);


    const handleChanges = (event) => {
        if(event.target.name==='assignedTo'){
            setMemberName(event.target.value);

            const user = users.find(user => user.key === event.target.value);
            setFormState(formState => ({
                ...formState,
                values: {
                    ...formState.values,
                    assignedTo: [user],

                },
            }));
        }else
        setStatus(event.target.value);
        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
               taskStatus: event.target.value,
            },
        }));
    };
    useEffect(() => {
        handleGetAllTask('?limit=' + sortTable.limit ,formState.values);
    }, [formState.values,sortTable.limit]);



   
    const handleGetAllTask = (pagination, data) => {
        setTinyLoader(true);
        filterTaskApi(pagination,data)
            .then(response => {
                if (response.data.body.status === 'success') {
                    setTaskDetails(response.data?.body.data.resp);
                    setTaskCount(response.data?.body?.data?.totalCount);
                }else{
                    setTaskDetails([]);
                    setTaskCount(0);
                    console.log(response ? response.data.body.message : 'Something went wrong, Try again !');
                    
                }
            setTinyLoader(false);

            })
            .catch(function (e) {
                console.log("Something went wrong, Try again !");
            setTinyLoader(false);

            });
    };

    const handleSearchTask = event => {
        // setTinyLoader(true);
        searchTask('keyword=' + event.target.value + '&limit=' + sortTable.limit).then(response => {
            // if (response.isAxiosError) {
            //     return apiIsNotWorking(response);
            // }
            if (response?.data?.body?.status === 'success') {
                setTinyLoader(false);

                setTaskDetails(response?.data?.body?.data?.resp);
            } else if (response?.data?.body?.status === 'failed') {
                setTaskDetails([]);
                // setTinyLoader(false);

            }
            // setTinyLoader(false);
        });
    };

    const handlePaginationTasks = condition => {
        
        handleGetAllTask(condition,formState.values)
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
            handleGetAllUsers(`?projectId=${Id}&invitationStatus=1&suspensionStatus=false`);
            handleGetAllStatus();
        }
        if(Id!==null||Id!==undefined){
            setFormState({ ...initialState });
        }
    },[Id]);

   

    const handleGetAllStatus = () => {
        getAllStatus().then(response => {
            if (response.data?.body.status === 'success') {
                setStatusDetails(response.data?.body.data.data);
            }else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.message : 'Error',
                });
            }
        })
        .catch(function (e) {
            toast({
                type: 'error',
                message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
            });
        });
    };
        
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
                            <h3 className='heading-medium font-semibold'>Task</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value,pageNo: 1 });
                                    }}
                                    className='border py-1  rounded-md outline-none w-15 h-6 text-sm px-2 mx-1'>
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
                                    Total Task
                                    <span className='absolute top-0 -right-2 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]'>
                                        {taskCount ? taskCount : 0}
                                    </span>
                                </p>
                            </div>
                            <div className='flex gap-2'>
                                    <FloatingOnlySelectfield
                                        type='text'
                                        optionsGroup={users?.map(d => {
                                            return { text: d.value.firstName + ' ' + d.value.lastName, value: d.value.firstName + ' ' + d.value.lastName };
                                        })}
                                        value={memberName?memberName:''}
                                        name={'assignedTo'}
                                        onChange={event => {
                                            handleChanges(event);
                                            setSortTable( {skip: 5,
                                                limit: 5,
                                                pageNo: 1,})
                                        }}
                                    />
                                <FloatingOnlySelectfield
                                            type='text'
                                            optionsGroup={
                                                statusDetails &&
                                                statusDetails?.map(d => {
                                                    return { text: d?.taskStatus, value: d?.taskStatus };
                                                })
                                            }
                                            value={formState.values.taskStatus}
                                            name={'taskStatus'}
                                            onChange={event => {
                                                handleChanges(event);
                                                setSortTable( {skip: 5,
                                                    limit: 5,
                                                    pageNo: 1,})
                                            }}
                                        />
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchTask} placeholder={'Search a task'} />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='overflow-x-auto relative shadow-md max-h-[300px] overflow-y-auto'>
                                <table className='table-style w-full min-w-[1200px]'>
                                    <thead className='!border-b-0 sticky top-0 z-40'>
                                        <tr className='text-gray-700 uppercase bg-blue-300  border-0 dark:bg-gray-700 dark:text-gray-400'>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Task</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 '>
                                                <div className='flex items-center justify-start w-[200px]'>Description</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Status</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Assigned to</div>
                                            </th>

                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Progress</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Estimation date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Worked Hours</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {taskDetails&&taskDetails?.length === 0 && (
                                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                <th colSpan={10} scope='row' className='col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                    No data
                                                </th>
                                            </tr>
                                        )}
                                        {tinyLoader===true &&  (
                                            <tr>
                                                <th colSpan={10}>
                                                    <TinnySpinner />
                                                </th>
                                            </tr>
                                        )}

                                        {taskDetails &&taskDetails?.length
                                            ?taskDetails?.map(function (data) {
                                                return (
                                                    <>
                                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <td scope='row' className=' w-auto font-medium text-gray-900 dark:text-white'>
                                                                <span className={` break-words`}>
                                                                    {data.taskTitle}
                                                                </span>
                                                            </td>
                                                            <td scope='row' className=' py-4 px-6 font-medium text-gray-900 dark:text-white'>
                                                                <span className={`break-words w-[200px]` }>
                                                                   
                                                                    <div dangerouslySetInnerHTML={{ __html: data.taskDetails}} />
                        
                                                                </span>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className="flex justify-center">{data.taskStatus}</div>
                                                            </td>

                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='user-profile-img user-img-group flex justify-center items-center cursor-pointer -space-x-4'>
                                                                
                                             {filterMembers(data.assignedTo)?.length == 0 && <>Not Assigned</>}

                                                {filterMembers(data.assignedTo)?.length <= 1 ? (
                                                    filterMembers(data.assignedTo).map(function (d1) {
                                                        return d1 ? (
                                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName}
                                                            
                                                            >
                                                                <img onClick={()=>handleUserClick(d1?.isAdmin ,d1?._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                    src={ USER_AVTAR_URL + d1.firstName + '.svg'}
                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                    alt='-'
                                                                />
                                                            </ToolTip>
                                                        ) : (
                                                            ' '
                                                        );
                                                    })
                                                ) : 
                                                    // <ToolTip
                                                    //     paddingfortooltip={'w-[30vw]'}
                                                    //     message={
                                                    //         project.userAssigned != null
                                                    //             ? project.userAssigned.map(function (d) {
                                                    //                 return ' ' + d.firstName + ' ' + d.lastName;
                                                    //             })
                                                    //             : ''
                                                    //     }>
                                                            <div className='flex items-center -space-x-4'>
                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                <img
                                                                    className='w-10 h-10 border-2 border-white rounded-full dark:border-gray-800'
                                                                    src='https://api.dicebear.com/7.x/initials/svg?seed=Sony Bro.svg'
                                                                    alt=''
                                                                                                        />
                                                                </div>
                                                                {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                            
                                                                                                        <img
                                                                                                            className='w-7 h-7 border-2 border-white rounded-full dark:border-gray-800'
                                                                                                            src='https://avatars.dicebear.com/api/bottts/fhfhd.svg'
                                                                                                            alt=''
                                                                                                        />
                                                                </div> */}
                                                                <MemberModal members={data.assignedTo? filterMembers(data.assignedTo) : ""} remainingCount={filterMembers(data.assignedTo)?.length - 1} />
                                                            </div>
                                                            }
                                                                                            
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className="flex justify-center">{formatedDate(data.progress) + '%'}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className="flex justify-center">{formatedDate(data.estimationDate)}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className="flex justify-center">{formatedDate(data.actualHours)}</div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            }): <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            {/* <td colSpan={10} scope='row' className='col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </td> */}
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                            {taskDetails && taskDetails?.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to {sortTable.limit * sortTable.pageNo < taskCount ? sortTable.limit * sortTable.pageNo : taskCount} of{' '}
                                        {taskCount}{' '}
                                    </p>
                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({
                                                    ...sortTable,
                                                    pageNo: sortTable.pageNo - 1,
                                                });
                                                handlePaginationTasks('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit );
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
                                            disabled={sortTable.pageNo === Math.ceil(taskCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({
                                                    ...sortTable,
                                                    pageNo: sortTable.pageNo + 1,
                                                    skip: sortTable.pageNo * sortTable.limit,
                                                });
                                                handlePaginationTasks('?skip=' + sortTable.pageNo * sortTable.limit + '&limit=' + sortTable.limit);
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

export default task_grid_xl;
