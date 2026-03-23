/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import ToolTip from '@COMPONENTS/ToolTip';
import { USER_AVTAR_URL } from '@HELPER/avtar';
import { formatedDate } from '@HELPER/function';
import { getAllStages } from '@WORKFORCE_MODULES/config/api/get';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const project_stage_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [stageList, setStageList] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [projectByStage, setProjectByStage] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    const handleGetAllStage = () => {
        getAllStages().then(response => {
            if (response.data.body.status === 'success') {
                setStageList(
                    response.data.body.data.stage.map(d => {
                        return { text: d.taskStage, value: d.taskStage };
                    })
                );
            }
        });
    };

    useEffect(() => {
        getAllProject().then(response => {
            if (response && response.data?.body.status === 'success') {
                setProjectDetails(response.data?.body.data.project);
            }
        });
    }, []);

    useEffect(() => {
        handleGetAllStage();
    }, []);

    const filterstage = status => {
        if (!projectDetails) return false;
        let tempProject = projectDetails.filter(d => {
            return d.status == status;
        });
        setProjectByStage(tempProject);
    };
    useEffect(() => {
        filterstage(stageList && stageList[0].value);
    }, [projectDetails, stageList]);

    return (
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
                <div className={`card project-stage w-full inline-block align-top `}>
                    <div className='grid grid-cols-2 justify-between items-center mb-3'>
                        <h1 className='heading-medium text-base mb-0 sm:text-xl'>Project Stage</h1>
                        <div className='TaskManageLabel max-w-xs md:w-full py-2'>
                            <FloatingOnlySelectfield
                                label={''}
                                optionsGroup={stageList}
                                name={'stageList'}
                                className={`!mb-0`}
                                value={selectedOption ?? ''}
                                onChange={event => {
                                    setSelectedOption(event.target.value);
                                    filterstage(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className='table-wrapper'>
                        <table className='table-style employess-details-table scrollbar:!h-1.5'>
                            <thead className='text-gray-700 uppercase !border-b-0 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                <tr>
                                    <th className=' '>Project</th>
                                    <th className=' '>Start Date</th>
                                    <th className='!w-auto '>Created By</th>
                                    <th className=''>Assigned To</th>
                                </tr>
                            </thead>

                            <tbody className='max-h-[calc(100vh-330px)]'>
                                {projectByStage && projectByStage.length === 0 && (
                                    <tr className='bg-white '>
                                        <th scope='row' className='col-span-3 text-center  pt-16 py-4 px-6 font-medium text-xl text-gray-900 whitespace-nowrap dark:text-white'>
                                            API is not there ^_^
                                        </th>
                                    </tr>
                                )}

                                {!projectByStage && (
                                    <tr>
                                        <th colSpan={2} className='h-[56.6px]'>
                                            API is not there
                                        </th>
                                    </tr>
                                )}

                                {projectByStage &&
                                    projectByStage.map(function (item, index) {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className='items-center justify-start'>
                                                        <h5 className='capitalize'>{item.project.projectName}</h5>
                                                    </div>
                                                </td>
                                                <td>{formatedDate(item.project.startDate)}</td>
                                                <td className='!w-auto'>
                                                    <div className='user-profile-img user-img-group items-center cursor-pointer'>
                                                        <div className='relative w-[30px] h-[30px] shadow-md rounded-full'>
                                                            <ToolTip message={item.project.projectCreatedBy.Name}>
                                                                <img
                                                                    src={item.project.projectCreatedBy.ProfilePic}
                                                                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                    alt='user'
                                                                />
                                                            </ToolTip>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='flex'>
                                                    <div className='user-profile-img user-img-group items-center cursor-pointer'>
                                                        {item.project.userAssigned &&
                                                            item.project.userAssigned
                                                                .filter(d => {
                                                                    return d.role === 'member';
                                                                })
                                                                .map(function (d1) {
                                                                    return d1 ? (
                                                                        <ToolTip className='relative w-[30px] h-[30px] shadow-md rounded-full' message={d1.firstName}>
                                                                            <img
                                                                                src={USER_AVTAR_URL + d1.firstName + ".svg"}
                                                                                className='bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-1 w-10 h-10 rounded-full'
                                                                                alt='-'
                                                                            />
                                                                        </ToolTip>
                                                                    ) : (
                                                                        ' '
                                                                    );
                                                                })}
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
    );
};

export default project_stage_grid;
