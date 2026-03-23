/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import ToolTip from '@COMPONENTS/ToolTip';
import { formattedDateTime, handleUserClick } from '@HELPER/function';
import { getAllActivity, getAllActivitySearching } from '@WORKFORCE_MODULES/dashboard/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import SearchInput from '@COMPONENTS/SearchInput';
import toast from '../../../../../../components/Toster/index';

const activity_grid = ({ clickConfig, handleRemoveGrid, data, key, Id }) => {
    const [activity, setActivity] = useState([]);
    const [activityCount, setActivityCount] = useState(0);
    const [searchKeyword,setKeyword] = useState('');
    const [type, setType] = useState(null);
    const [filterData, setFilterData] = useState({});
    const [projectId, setProjectId] = useState('');
    const [tinyLoader,setTinyLoader] = useState(false);
    const [sortTable, setSortTable] = useState({
        skip: 10,
        limit: 10,
        pageNo: 1,
    });
    const [selectedOption, setSelectedOption] = useState('');
    const activityList = [
        // { text: "Project", value: "Project" },
        { text: 'Task', value: 'Task' },
        { text: 'SubTask', value: 'SubTask' },
        { text: 'User', value: 'User' },
        { text: 'Permission', value: 'Permission' },
        { text: 'Config', value: 'Config' },
        { text: 'Plan', value: 'Plan' },
        // {text: "Admin", value: "Admin"},
        { text: 'Roles', value: 'Roles' },
        { text: 'Group', value: 'Group' },
    ];
    useEffect(() => {
        if (Id !== undefined || Id !== null) {
            setProjectId(Id);
        }
    }, [Id]);
   
    const handleGetActivity = activityType => {
        setTinyLoader(true);
        getAllActivity('?ActivityType=' + activityType + '&limit=' + sortTable.limit).then(response => {
            if (response.data.body.status === 'success') {
                setActivity(response.data.body.data.activity);
                setActivityCount(response.data.body.data.totalActivityCount);
                setTinyLoader(false);
            } else {
                setActivity(null);
                setTinyLoader(false);
            }
        });
    };

    useEffect(() => {
        if (projectId !== '') {
            handleGetActivity((activityList ? activityList[0].value : null));
            setSelectedOption(activityList ? activityList[0].value : null);
        }
    }, [projectId]);
    const handleGetlimitActivity = (condition) => {

        getAllActivity(condition).then(response => {
            if (response.data.body.status === 'success') {
                setActivity(response.data.body.data.activity);
                setActivityCount(response.data.body.data.totalActivityCount);
            } else {
                setActivity(null);
            }
        });
    };
    useEffect(() => {

        if(type === "search"){
            handleSearchActivity('keyword=' + searchKeyword + '&limit=' + sortTable.limit+'&ActivityType=' + (selectedOption ? selectedOption : null))
          }else{
          handleGetlimitActivity('?limit=' + sortTable.limit+'&ActivityType=' + (selectedOption ? selectedOption : null))
          }
    }, [sortTable.limit,searchKeyword]);
    const handlePaginationGroupActivity = condition => {
            if(type === "search"){
                handleSearchActivity(condition.replace("?", "")+`&keyword=${searchKeyword}`)
              }else{
              handleGetlimitActivity(condition)
              }
    };
    const handleSearchActivity = (condition='') => {
        
    if(searchKeyword == null) return false;
        getAllActivitySearching(condition).then(response => {
            
            if (response.data.body.status === 'success') {
                setActivity(response?.data?.body?.data?.fetchActivity);
                setActivityCount(response?.data?.body?.data?.count)
            }
            if (response.data.body.status === 'failed' && event.target.value !== '') {
                setActivity([]);
                setActivityCount(0)
            }
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
                            <h3 className='heading-medium font-semibold'>Activity</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value,pageNo: 1 });
                                    }}
                                    className='border py-1  rounded-md outline-none w-15 h-6 text-sm px-2 mx-1'>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
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
                                    Total Activity
                                    <span className='absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-base text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]'>
                                        {activityCount ? activityCount : 0}
                                    </span>
                                </p>
                            </div>
                            <div className='flex'>
                                <p className='project-details flex items-center '>
                                    <FloatingOnlySelectfield
                                        label={''}
                                        optionsGroup={activityList}
                                        name={'activityList'}
                                        value={selectedOption ?? ''}
                                        onChange={event => {
                                            setSelectedOption(event.target.value);
                                            handleGetActivity(event.target.value);
                                            setSortTable( {skip: 10,
                                                limit: 10,
                                                pageNo: 1,})
                                        }}
                                    />
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={(event)=>
                                    {setKeyword(event.target.value);
                                    setType("search")
                                    setSortTable( { skip: 0, limit: 10, pageNo: 1})
                                    }} placeholder={'Search a Activity'} />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <div className='overflow-x-auto relative shadow-md max-h-[250px] overflow-y-auto'>
                                <table className='table-style w-full min-w-[1200px]'>
                                    <thead className='!border-b-0 sticky top-0 z-40'>
                                        <tr className='text-gray-700 uppercase bg-blue-300  border-0 dark:bg-gray-700 dark:text-gray-400'>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center'>Activity</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Category</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Activity Creator</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Updated At</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6'>
                                                <div className='flex items-center justify-center'>Deleted At</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {/* {
                                            (activity && activity.length === 0 && (
                                                <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                    <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                        No data
                                                    </th>
                                                </tr>
                                            ))} */}
                                        {tinyLoader===true  && (
                                            <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                <th colSpan={2} scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                    <TinnySpinner />
                                                </th>
                                            </tr>
                                        )}
                                        {activity && activity.length ?
                                            activity.map(function (data, key) {
                                                return (
                                                    <>
                                                        <tr key={key} className='bg-white border-b-0 dark:bg-gray-800 dark:border-gray-700'>
                                                            <td scope='row' className='max-w-[250px] w-auto py-4 px-6 font-medium text-gray-900 dark:text-white'>
                                                                <span className=' break-words'>
                                                                    {data.activity}
                                                                </span>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className=' flex justify-center'>{data.category}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex mb-5 justify-center -space-x-4'>
                                                                    <ToolTip className='relative w-[30px] h-[30px] bg-white shadow-md rounded-full' message={data.userDetails?.name} >
                                                                    <img onClick={()=>handleUserClick(data.userDetails?.isAdmin ,data.userDetails?.id ,data.userDetails?.id)} style={{ cursor: 'pointer' }}
                                                                            src={USER_AVTAR_URL + data?.userDetails?.name + '.svg'}
                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                            alt='user'
                                                                        />
                                                                    </ToolTip>
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className=' flex justify-center'>{formattedDateTime(data?.updatedAt)}</div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                            <div className=' flex justify-center'>{formattedDateTime(data?.updatedAt)}</div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            }
                                            ):<tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                            <th scope='row' className='col-span-3 text-center  py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                            {activity && activity.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                        {sortTable.limit * sortTable.pageNo < activityCount ? sortTable.limit * sortTable.pageNo : activityCount} of {activityCount}
                                    </p>

                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({
                                                    ...sortTable,
                                                    pageNo: sortTable.pageNo - 1,
                                                });
                                                handlePaginationGroupActivity(
                                                    '?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit + '&ActivityType=' + (selectedOption ? selectedOption : null) 
                                                );
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
                                            disabled={sortTable.pageNo === Math.ceil(activityCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({
                                                    ...sortTable,
                                                    pageNo: sortTable.pageNo + 1,
                                                    skip: sortTable.pageNo * sortTable.limit,
                                                });
                                                handlePaginationGroupActivity(
                                                    '?skip=' +
                                                    sortTable.pageNo * sortTable.limit +
                                                        '&limit=' +
                                                        sortTable.limit +
                                                        '&ActivityType=' +
                                                        (selectedOption ? selectedOption : null)
                                                );
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

export default activity_grid;
