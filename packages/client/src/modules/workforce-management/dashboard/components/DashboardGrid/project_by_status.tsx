/* eslint-disable react-hooks/rules-of-hooks */
import FloatingDateTextfield from '@COMPONENTS/FloatingDateTextfield';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import MemberModal from '@COMPONENTS/MemberModal';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { filterMembers, formatedDate, handleUserClick } from '@HELPER/function';
import { getAllStatus } from '@WORKFORCE_MODULES/config/api/get';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import { Tooltip } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const project_by_status = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const statusDetails = [
        { text: 'Todo', value: 'Todo' },
        { text: 'Done', value: 'Done' },
        { text: 'Inprogress', value: 'Inprogress' },
        { text: 'Onhold', value: 'Onhold' },
        { text: 'Inreview', value: 'Inreview' },
    ];
    const [projectDetails, setProjectDetails] = useState(null);
    const [projectByStatus, setProjectByStatus] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllProject(`?limit=${process.env.TOTAL_USERS}`).then(response => {
            if (response && response.data?.body.status === 'success') {
                setProjectDetails(response.data?.body.data.project);
            }
        });
    }, []);

    const filterstatus = status => {
        if (!projectDetails && !status) return false;
        let tempProject = projectDetails?.filter(d => {
            return d.status == status;
        });
        setProjectByStatus(tempProject);
    };
    useEffect(() => {
        filterstatus(statusDetails[0].value);
    }, [projectDetails]);

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
                <div className={clickConfig ? 'opacity-30 ' : 'mt-5'}>
                    <div className={`card-d project-stage w-full inline-block align-top `}>
                        <div className='flex flex-wrap justify-between items-center mb-2'>
                            <h1 className='heading-medium text-lg sm:text-xl mb-0 font-semibold'>Project By Status</h1>
                            <div className='TaskManageLabel w-max-sm md:w-[8rem] py-2'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={statusDetails}
                                    name={'statusDetails'}
                                    value={selectedOption ?? ''}
                                    className={`!mb-0`}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterstatus(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='overflow-x-auto relative shadow-md min-h-[300px] max-h-[300px] overflow-y-auto'>
                            <table className='table-style w-full min-w-[500px] border-b'>
                                <thead className='!border-b-0 sticky top-0 z-40'>
                                    <tr className='text-gray-700 uppercase bg-blue-300  border-0 dark:bg-gray-700 dark:text-gray-400'>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center'>
                                                Project
                                                </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center justify-center'>
                                                Start Date
                                                </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center justify-center'>
                                                Created By
                                                </div>
                                            </th>
                                        <th scope='col' className='py-3 px-6 text-base'>
                                            <div className='flex items-center justify-center'>
                                                Assigned To
                                                </div>
                                            </th>
                                    </tr>
                                </thead>

                                <tbody className=''>
                                    {projectByStatus && projectByStatus.length === 0 && (
                                        <tr className='bg-white'>
                                            <th scope='row' className='col-span-3 text-center  pt-16 py-4 px-6 font-medium text-gray-900 text-xl  whitespace-nowrap dark:text-white'>
                                                No data
                                            </th>
                                        </tr>
                                    )}

                                    {!projectByStatus && (
                                        <tr>
                                            <th colSpan={2} className='h-[56.6px]'>
                                                Select Project
                                            </th>
                                        </tr>
                                    )}

                                    {projectByStatus &&
                                        projectByStatus.map(function (item, index) {
                                            return (
                                                <tr key={index} className=' !text-lg !font-semibold'>
                                                    <td>
                                                        <div className='items-center justify-start'>
                                                            <h5 className='capitalize break-words'>{item.projectName}</h5>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className=' flex justify-center'>

                                                        {formatedDate(item.startDate)}
                                                        </div>
                                                        </td>
                                                    <td className='!w-auto'>
                                                        <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer'>
                                                            <div className='relative'>
                                                                <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={item.projectCreatedBy.firstName} userId={item.projectCreatedBy.Id}>
                                                                <img onClick={()=>handleUserClick(item.projectCreatedBy?.isAdmin ,item.projectCreatedBy.Id,item.projectCreatedBy.isSuspended)} style={{ cursor: 'pointer' }}
                                                                        
                                                                        src={item.projectCreatedBy.profilePic ?? USER_AVTAR_URL +  item.projectCreatedBy.firstName + ".svg"}
                                                                        className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                        alt='user'
                                                                    />
                                                                </ToolTip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='user-profile-img flex justify-center user-img-group items-center cursor-pointer -space-x-4'>
                                                          
                                                            {filterMembers(item.userAssigned)?.length == 0 && <>Not Assigned</>}

                                                            {filterMembers(item.userAssigned)?.length <= 1 ? (
                                                                filterMembers(item.userAssigned).map(function (d1) {
                                                                    return d1 ? (
                                                                        <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName + ' ' + d1.lastName} userId={item.userAssigned._id}>
                                                                           <img onClick={()=>handleUserClick(item.userAssigned?.isAdmin ,item.userAssigned._id,item.userAssigned.isSuspended)} style={{ cursor: 'pointer' }}
                                                                                src={item.profilePic ?? USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                alt='-'
                                                                            />
                                                                        </ToolTip>
                                                                    ) : (
                                                                        ' '
                                                                    );
                                                                })
                                                                ) : (
                                                                    <div className='flex items-center -space-x-4'>
                                                                        <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group'>
                                                                            <img
                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                src={ filterMembers(item.userAssigned) === undefined ? [] : filterMembers(item.userAssigned)[0].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.userAssigned)[0].firstName}.svg`}
                                                                                alt=''
                                                                            />
                                                                        </div>
                                                                        {/* <div className='relative w-[30px] h-[30px] shadow-md rounded-full  flex flex-col items-center group' >
                                                                            <img
                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                src={filterMembers(item.userAssigned) === undefined ? [] : filterMembers(item.userAssigned)[1].profilePic ?? USER_AVTAR_URL + `${filterMembers(item.userAssigned)[1].firstName}.svg`}
                                                                                alt=''
                                                                            />
                                                                        </div> */}
                                                                        <MemberModal members={item.userAssigned ? filterMembers(item.userAssigned) : ""} remainingCount={filterMembers(item.userAssigned)?.length - 1}  />
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default project_by_status;
