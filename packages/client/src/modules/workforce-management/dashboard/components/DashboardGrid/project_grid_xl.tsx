/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import DropDown from '@COMPONENTS/DropDown';
import SearchInput from '@COMPONENTS/SearchInput';
import TinnySpinner from '@COMPONENTS/TinnySpinner';
import ToolTip from '@COMPONENTS/ToolTip';
import { apiIsNotWorking, filterManager, filterMembers, filterOwner, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllProject, searchProject } from '@WORKFORCE_MODULES/projects/api/get';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineClipboardCheck, HiOutlineUser, HiCheck } from 'react-icons/hi';
import { ImCross } from 'react-icons/im';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Style from '../../../../../../styles/ProjectGridXL.module.css';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import MemberModal from '@COMPONENTS/MemberModal';

const project_grid_xl = ({ key, data, clickConfig, handleRemoveGrid }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [projectCount,setProjectCount] = useState(null)
    const [searchKeyword,setSearchKeyword] = useState('')
    const [sortTable, setSortTable] = useState({
        skip: 5,
        limit: 5,
        pageNo: 1,
    });

    const handleGetAllProject = (condition = '') => {
        getAllProject(condition).then(response => {
            if (response && response.data?.body.status === 'success') {
                setProjectDetails(response.data?.body.data.project);
                setProjectCount(response.data?.body?.data.projectCount)
            }
        });
    };
    const handleSearchProject = (event) => {
        searchProject('?keyword=' + event.target.value + '&limit=' + sortTable.limit).then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response.data.body.status === 'success' ) {
                setProjectDetails(response.data.body.data.project);
                setProjectCount(response.data?.body?.data.projectCount)

            }
        });
    };
    useEffect(() => {
        handleGetAllProject('?limit=' + sortTable.limit);
    }, [sortTable.limit]);

    const handlePaginationProject = condition => {
        let totalCondition = condition + "&keyword=" +searchKeyword
        searchProject(totalCondition).then(response => {
            if (response.data?.body.status === 'success') {
                setProjectDetails(response.data?.body.data.project);
                setProjectCount(response.data?.body?.data.projectCount)

            }
        });
    };
    function makeHttpLinksClickable(description, maxURLLength = 20) {
        const urlRegex = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;
        const convertedDescription = description?.replace(urlRegex, (url) => {
            let truncatedURL = url;
            if (url.length > maxURLLength) {
                truncatedURL = url.substring(0, maxURLLength) + '...';
                const nextCharIndex = maxURLLength + 3;     
                if (nextCharIndex < url.length && url.charAt(nextCharIndex) !== ' ') {
                    truncatedURL += ' ';
                }
            }
            return `<a href="${url}" target="_blank" style="color: blue">${truncatedURL}</a>`;
        });
    
        return convertedDescription;
    }
    return (
        <>
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
                <div className={clickConfig ? 'opacity-30 ' : 'mt-5 mb-16'}>
                    <div className='bg-white rounded-xl px-7 py-4 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium font-semibold'>Projects</h3>
                            <div className='flex items-center'>
                                <p className='p-0 m-0 text-lightTextColor text-base'>Show</p>
                                <select
                                    value={sortTable.limit}
                                    onChange={event => {
                                        setSortTable({ ...sortTable, limit: event.target.value ,pageNo: 1});
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
                                    Total Project<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-1 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{projectCount ? projectCount : 0}</span>
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={(e) => {handleSearchProject(e)
                                     setSearchKeyword(e.target.value)}} placeholder={'Search a project'} />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <div className='relative overflow-x-auto shadow-md max-h-[250px] overflow-y-auto'>
                                <table className='table-style w-full'>
                                    <thead className='!border-b-0 sticky top-0 z-40'>
                                        <tr className='text-gray-700 uppercase bg-blue-300 border-0 dark:bg-gray-700 dark:text-gray-400'>
                                            <th scope='col' className='py-3 px-6 text-base w-[140px]'>
                                                <div className='flex items-center'>Project Name</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[300px]'>
                                                <div className='flex items-center'>Description</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>start Date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>End Date</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>Owner</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='flex items-center justify-center'>Manager</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='whitespace-nowrap text-ellipsis w-full'>Actual Budget</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='whitespace-nowrap text-ellipsis w-full'>Plan budget</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[70px]'>
                                                <div className='flex items-center'>Tasks</div>
                                            </th>
                                            <th scope='col' className='py-3 px-6 text-base w-[150px]'>
                                                <div className='whitespace-nowrap flex justify-center text-ellipsis w-[140px]'>Assigned To</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    {projectDetails && projectDetails.length === 0 && (
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
                                    {!projectDetails && (
                                        <tr>
                                            <th colSpan={10} className='items-center'>
                                                <TinnySpinner />
                                            </th>
                                        </tr>
                                    )}
                                    <tbody className=''>
                                        {projectDetails &&
                                            projectDetails.map(function (project) {
                                                return (
                                                    <>
                                                        <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                                            <td scope='row' className='py-3 px-6 w-[140px] font-medium text-gray-900 break-words dark:text-white'>
                                                                {project.projectName}
                                                            </td>
                                                          <td className={'w-[300px] '}>
                                                            <div dangerouslySetInnerHTML={{ __html: makeHttpLinksClickable(project.description),  }} className="break-words" /> 
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className="flex justify-center">
                                                                {formatedDate(project.startDate)}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className="flex justify-center">
                                                                {formatedDate(project.endDate)}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center  -space-x-4'>
                                                                {filterOwner(project.userAssigned)?.length == 0 ? 
                                                                <>
                                                                <div>
                                                                    Not Assigned
                                                                </div>
                                                                </>
                                                                :
                                                                <>
                                                                    {filterOwner(project.userAssigned)?.length <= 1 ?
                                                                        
                                                                            filterOwner(project.userAssigned).map((d) =>{
                                                                               return (
                                                                                    <ToolTip className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full' message={d.firstName} key={d.firstName}>
                                                                                        <img onClick={()=>handleUserClick(d?.isAdmin ,d._id,d.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                            src={d.profilePic ?? USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                            alt='-'
                                                                                        />
                                                                                    </ToolTip>
                                                                                )
                                                                            
                                                                            })
                                                                        
                                                                        : (
                                                                            <div className='flex items-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white absolute top-1/2 left-1/2 cursor-pointer -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={ project.userAssigned === undefined ? [] : filterOwner(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterOwner(project.userAssigned)[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={project.userAssigned === undefined ? [] : filterOwner(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterOwner(project.userAssigned)[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div> */}
                                                                                <MemberModal members={project.userAssigned ? filterOwner(project.userAssigned) : ""} remainingCount={filterOwner(project.userAssigned)?.length - 1}  />
                                                                            </div>
                                                                            )
                                                                        }
                                                                </>
                                                            }
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center -space-x-4'>
                                                                {filterManager(project.userAssigned)?.length == 0 ? <>Not Assigned</>
                                                                : 
                                                                <>
                                                                    {filterManager(project.userAssigned)?.length <= 1 ?
                                                                        (filterManager(project.userAssigned)?.map((d) =>{
                                                                            return (
                                                                                <ToolTip className='relative w-[30px] bg-white h-[30px] shadow-md rounded-full' message={d.firstName} key={d.firstName} userId={d._id}>
                                                                                    <img onClick={()=>handleUserClick(d?.isAdmin ,d._id,d.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                        src={d.profilePic ?? USER_AVTAR_URL + d.firstName + ".svg"}
                                                                                        className='absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        alt='-'
                                                                                    />
                                                                                </ToolTip>
                                                                            )
                                                                        }))
                                                                        : (
                                                                            <div className='flex items-center -space-x-4'>
                                                                                <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                    <img
                                                                                        className='bg-white cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={ project.userAssigned === undefined ? [] : filterManager(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterManager(project.userAssigned)[0].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div>
                                                                                {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                    <img
                                                                                        className='bg-white absolute cursor-pointer top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                        src={project.userAssigned === undefined ? [] : filterManager(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterManager(project.userAssigned)[1].firstName}.svg`}
                                                                                        alt=''
                                                                                    />
                                                                                </div> */}
                                                                                <MemberModal members={project.userAssigned ? filterManager(project.userAssigned) : ""} remainingCount={filterManager(project.userAssigned)?.length - 1}  />
                                                                            </div>
                                                                        )
                                                                    }
                                                                </>
                                                            }
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center'>
                                                                {project.actualBudget} {project.currencyType}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center'>
                                                                {project.plannedBudget} {project.currencyType}
                                                                </div>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 w-[70px] font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <label className='bg-blue-700 text-white text-center rounded-[5px] py-1 text-base inline-block mr-2 overflow-hidden w-full text-ellipsis whitespace-nowrap'>
                                                                    {project.taskCount ? project.taskCount : 0}
                                                                </label>
                                                            </td>
                                                            <td scope='row' className='py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                                                                <div className='flex justify-center -space-x-4'>
                                                                {filterMembers(project.userAssigned)?.length == 0 && <>Not Assigned</>}
                                                                {filterMembers(project.userAssigned)?.length <= 1 ? (
                                                                    filterMembers(project.userAssigned).map(function (d1) {
                                                                        return d1 ? (
                                                                            <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} >
                                                                                <img onClick={()=>handleUserClick(d1?.isAdmin ,d1?.id,d1.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                    src={project.profilePic ?? USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    alt='-'
                                                                                />
                                                                            </ToolTip>
                                                                        ) : (
                                                                            ' '
                                                                        );
                                                                    })
                                                                    ) : (
                                                                        <div className='flex justify-center items-center -space-x-4'>
                                                                            <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={ filterMembers(project.userAssigned) === undefined ? [] : filterMembers(project.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(project.userAssigned)[0].firstName}.svg`}
                                                                                    alt=''
                                                                                />
                                                                            </div>
                                                                            {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                                <img
                                                                                    className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                    src={filterMembers(project.userAssigned) === undefined ? [] : filterMembers(project.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(project.userAssigned)[1].firstName}.svg`}
                                                                                    alt=''
                                                                                />
                                                                            </div> */}
                                                                            <MemberModal members={project.userAssigned ? filterMembers(project.userAssigned) : ""} remainingCount={filterMembers(project.userAssigned)?.length - 1}  />
                                                                        </div>
                                                                )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            {projectDetails && projectDetails.length != 0 && (
                                <div className='flex justify-between items-center'>
                                    <p className='p-0 m-0 text-lightTextColor text-base sm:my-4 my-2'>
                                        Showing {sortTable.limit * (sortTable.pageNo - 1) + 1} to{' '}
                                        {sortTable.limit * sortTable.pageNo < projectCount ? sortTable.limit * sortTable.pageNo : projectCount} of {projectCount}{' '}
                                    </p>
                                    <div className='flex items-center '>
                                        <button
                                            disabled={sortTable.pageNo == 1}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo - 1 });
                                                handlePaginationProject('?skip=' + ((sortTable.limit*sortTable.pageNo)-(sortTable.limit*2)) + '&limit=' + sortTable.limit);
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
                                            disabled={sortTable.pageNo === Math.ceil(projectCount / sortTable.limit)}
                                            onClick={() => {
                                                setSortTable({ ...sortTable, pageNo: sortTable.pageNo + 1, skip: sortTable.pageNo * sortTable.limit });
                                                handlePaginationProject('?skip=' + sortTable.limit*sortTable.pageNo + '&limit=' + sortTable.limit);
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

export default project_grid_xl;
