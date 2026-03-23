/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import MemberModal from '@COMPONENTS/MemberModal';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { apiIsNotWorking, filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import {getAllTask, searchTask} from '@WORKFORCE_MODULES/task/api/get';
import React, {useEffect, useState} from 'react';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {HiOutlineClipboardCheck} from 'react-icons/hi';
import {ImCross} from 'react-icons/im';
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md';

const task_grid_xl = ({
  clickConfig,
  handleRemoveGrid,
  data,
  key,
  // taskCount,
}) => {
  const [taskDetails, setTaskDetails] = useState(null);
  const [sortTable, setSortTable] = useState({
    skip: 5,
    limit: 5,
    pageNo: 1,
  });
const [taskCount,setTaskCount] = useState(null);
  useEffect(() => {
    handleGetAllTask('?limit=' + sortTable.limit);
  }, [sortTable.limit]);

  const handleGetAllTask = (condition = '?limit=' + sortTable.limit) => {
    getAllTask(condition).then(response => {
      if (response.data?.body.status === 'success') {
        setTaskDetails(response.data.body.data.tasks);
        setTaskCount(response.data?.body.data.taskCount);

      }
    });
  };

  // const handleSearchTask = event => {
  //   searchTask(
  //     'keyword=' + event.target.value + '&limit=' + sortTable.limit
  //   ).then(response => {
  //     if (response.isAxiosError) {
  //       return apiIsNotWorking(response);
  //   }
  //     if (response?.data?.body?.status === 'success') {
  //       setTaskDetails(response?.data?.body?.data?.resp);
  //       console.log(response?.data?.body?.data?.resp);
        
  //     }
  //      else if (response?.data?.body?.status === 'failed') {
  //       setTaskDetails([]);
  //   }
  //   });
  // };
  const[searchKeyword,setKeyword] = useState('');
  const handleSearchTask = (condition='') => {
    if(searchKeyword == null) return false;
    searchTask(condition).then(response => {
        if (response.data.body.status === 'success') {
            setTaskDetails(response.data.body.data.resp);
           
            setTaskCount(response.data.body.data.taskCount?response.data.body.data.taskCount:0)

        } else if (response.data.body.status === 'failed' && searchKeyword !== '') {
            setTaskDetails([]);
            setTaskCount(0)

        }
    });
};

  const handlePaginationTasks = condition => {
    getAllTask(condition).then(response => {
      if (response?.data?.body?.status === 'success') {
        setTaskDetails(response?.data?.body?.data?.tasks);
      }
    });
  };
  useEffect(()=>{
    if(searchKeyword!==''){
      handleSearchTask('?keyword=' + searchKeyword)
    }else{
      handleGetAllTask('?limit=' + sortTable.limit);
    }
  },[searchKeyword])
  return (
    <>
      <div className={clickConfig ? 'outline' : ''}>
        {clickConfig && (
          <div className="flex justify-between items-center mt-4 card p-4 w-full ">
            <div>
              <p className="project-details">{data.name}</p>
            </div>
            <div>
              <ImCross
                style={{color: 'red', cursor: 'pointer'}}
                onClick={event => {
                  handleRemoveGrid(event, data, key);
                }}
              />
            </div>
          </div>
        )}
        <div className={clickConfig ? 'opacity-30 ' : 'mt-5'}>
          <div className="py-6 rounded bg-white p-7 w-full d-flex">
            <div className="flex justify-between items-center">
              <h3 className="heading-medium font-semibold">Task Xl</h3>
              <div className="flex items-center">
                <p className="p-0 m-0 text-lightTextColor text-base">Show</p>
                <select
                  value={sortTable.limit}
                  onChange={event => {
                    setSortTable({...sortTable, limit: event.target.value});
                  }}
                  className="border py-1 rounded-md outline-none w-15 h-6 text-sm px-2 mx-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                </select>
                <p className="p-0 m-0 text-lightTextColor text-base">
                  Entries
                </p>
              </div>
            </div>
            <div className="flex justify-between flex-wrap gap-2 items-center mt-4">
              <div className="flex">
                <p className="project-details flex items-center relative text-darkTextColor px-2 py-1">
                  <span className="mr-1">
                    <HiOutlineClipboardCheck />
                  </span>
                  Total Task<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{taskCount ? taskCount : 0}</span>
                </p>
              </div>
              <div className="wrapper relative">
                <SearchInput
                  onChange={(event)=>
                    {   setKeyword(event.target.value);
                        setSortTable( { skip: 0, limit: 10, pageNo: 1})
                        }} 
                  placeholder={'Search a task'}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className=" overflow-x-auto relative shadow-md max-h-[360px] overflow-y-auto">
                <table className="table-style w-full min-w-[1200px]">
                  <thead className="!border-b-0 sticky top-0 z-40">
                    <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                      <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                        <div className="flex items-center ">Project</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center">Task</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Created By</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Due date</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="whitespace-nowrap text-ellipsis w-full  overflow-hidden block max-w-[117px]">
                          Assigned to
                        </div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Task type</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Category</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Status</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Stages</div>
                      </th>
                      <th scope="col" className="py-3 px-6 text-base">
                        <div className="flex items-center justify-center">Priority</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className=''>
                    {taskDetails && taskDetails?.length === 0 && (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th
                          colSpan={10}
                          scope="row"
                          className="col-span-3 text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          No data
                        </th>
                      </tr>
                    )}
                    {!taskDetails && (
                      <tr>
                        <th colSpan={10}>
                          <TinnySpinner />
                        </th>
                      </tr>
                    )}

                    {taskDetails &&
                      taskDetails?.map(function (data) {
                        return (
                          <>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium w-[150px] break-words text-gray-900 dark:text-white"
                              >
                                {data.projectName
                                  ? data.projectName
                                  : 'Not Assigned'}
                              </td>
                              <td
                                scope="row"
                                className="max-w-[250px] w-auto py-4 px-6 font-medium text-gray-900 dark:text-white"
                              >
                                <span
                                  className={`overflow-hidden break-words text-ellipsis`}
                                >
                                  {data.taskTitle}
                                </span>
                              </td>
                              <td
                              >
                                <div className=' flex justify-center'>

                                <ToolTip
                                  className="relative w-[30px] h-[30px] bg-white shadow-md rounded-full"
                                  message={data.taskCreator.firstName} 
                                >
                                 <img onClick={()=>handleUserClick(data.taskCreator.id,data.taskCreator.id,data.taskCreator.isSuspended)} style={{ cursor: 'pointer' }}
                                    src={data.taskCreator.profilePic ??
                                      USER_AVTAR_URL +
                                      data.taskCreator.firstName +
                                      '.svg'
                                    }
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full"
                                    alt="-"
                                  />
                                </ToolTip>
                                  </div>
                              </td>
                              <td
                              >
                                <div className=' flex justify-center'>

                                {formatedDate(data.dueDate)}
                                </div>
                              </td>
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                <div className="user-profile-img flex justify-center user-img-group items-center cursor-pointer -space-x-4">
                                {filterMembers(data.assignedTo).length == 0 && <>Not Assigned</>}
                                {filterMembers(data.assignedTo)?.length <= 1 ? (
                                    filterMembers(data.assignedTo).map(function (d1) {
                                        return (
                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} userId={d1._id}>
                                               <img onClick={()=>handleUserClick(d1?.isAdmin ,d1._id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                    src={d1.profilePic}
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
                                                    src={ filterMembers(data.assignedTo) === undefined ? [] : filterMembers(data.assignedTo)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(data.assignedTo)[0].firstName}.svg`}
                                                    alt=''
                                                />
                                            </div>
                                            {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                <img
                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                    src={filterMembers(data.assignedTo) === undefined ? [] : filterMembers(data.assignedTo)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(data.assignedTo)[1].firstName}.svg`}
                                                    alt=''
                                                />
                                            </div> */}
                                            <MemberModal members={data.assignedTo ? filterMembers(data.assignedTo) : ""} remainingCount={filterMembers(data.assignedTo)?.length - 1}  />
                                        </div>
                                )}
                                </div>
                              </td>
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                              <div className='flex justify-center'>
                                {data.taskType}
                              </div>
                              </td>
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                              <div className='flex justify-center'>
                                {data.category}
                              </div>
                              </td>
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                              <div className='flex justify-center'>
                                {data.stageName}
                              </div>
                              </td>
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                              <div className='flex justify-center'>
                                {data.taskStatus}
                              </div>
                              </td>
                              <td
                                scope="row"
                                className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                <b className=' flex justify-center'>
                                  {data.priority === 'High' ? (
                                    <ToolTip message={data.priority}>
                                      <p className="priority-with-bg text-priority1Color bg-priority1bg">
                                        {data.priority}
                                      </p>
                                    </ToolTip>
                                  ) : data.priority === 'Medium' ? (
                                    <ToolTip message={data.priority}>
                                      <p className="priority-with-bg text-priority2Color bg-priority2bg">
                                        {data.priority}
                                      </p>
                                    </ToolTip>
                                  ) : (
                                    <ToolTip message={data.priority}>
                                      <p className="priority-with-bg text-priority3Color bg-priority3bg">
                                        {data.priority}
                                      </p>
                                    </ToolTip>
                                  )}
                                </b>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {taskDetails && taskDetails?.length != 0 && (
                <div className="flex justify-between items-center">
                  <p className="p-0 m-0 text-lightTextColor text-base sm:my-4 my-2">
                    Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                    {sortTable.limit * sortTable.pageNo < taskCount
                      ? sortTable.limit * sortTable.pageNo
                      : taskCount}{' '}
                    of {taskCount}{' '}
                  </p>
                  <div className="flex items-center ">
                    <button
                      disabled={sortTable.pageNo == 1}
                      onClick={() => {
                        setSortTable({
                          ...sortTable,
                          pageNo: sortTable.pageNo - 1,
                        });
                        handlePaginationTasks(
                          '?skip=' + 0 + '&limit=' + sortTable.limit
                        );
                      }}
                      className="disabled:opacity-25  disabled:cursor-not-allowed  arrow_left border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                    >
                      <MdKeyboardArrowLeft />
                    </button>
                    <div className="pages">
                      <p className="p-0 m-0 text-lightTextColor text-base sm:my-4 my-2">
                        Page <span>{sortTable.pageNo}</span>
                      </p>
                    </div>
                    <button
                      disabled={
                        sortTable.pageNo ===
                        Math.ceil(taskCount / sortTable.limit)
                      }
                      onClick={() => {
                        setSortTable({
                          ...sortTable,
                          pageNo: sortTable.pageNo + 1,
                          skip: sortTable.pageNo * sortTable.limit,
                        });
                        handlePaginationTasks(
                          '?skip=' + sortTable.skip + '&limit=' + sortTable.limit
                        );
                      }}
                      className="disabled:cursor-not-allowed  arrow_right border mx-1 bg-veryveryLightGrey cursor-pointer hover:bg-defaultTextColor hover:text-white"
                    >
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
