/* eslint-disable react-hooks/rules-of-hooks */
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';

const ChartComponent = dynamic(() => import('../graph/projectMemberChart'), { ssr: false });

const project_member_grid = ({ clickConfig, handleRemoveGrid, data, key }) => {
    const [projectDetails, setProjectDetails] = useState({
        short: null,
        name: null,
        y: null,
        x: null,
        value: null,
    });
    const [projectList, setProjectList] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getAllProject().then(response => {
            if (response.data?.body.status === 'success') {
                let projectList = response.data?.body.data.project.map((project ) => {
                    return {
                        text: project.projectName,
                        value: project._id ? project._id : [],
                        project,
                    };
                });
                setProjectList(projectList);
            }
        });
    }, []);

    const filterMember = _id => {
        if (!projectList) return false;
        let taskTemp = projectList.filter(project => project.value == _id);
        if (taskTemp.length != 0) {
            let a = -2;
            setProjectDetails(
                taskTemp[0]?.project?.userAssigned.map(function (d, index) {
                    return {
                        category: `${d.firstName} ${d.lastName}`,
                    };
                })
            );
        }
    };
    useEffect(() => {
        if(projectList && projectList.length != 0)
        filterMember(projectList && projectList[0].value);
    }, [projectList]);

    return (
        <>
            <div className={` ${clickConfig ? 'outline ' : 'outline-0'} mt-5 `}>
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
                <div className={`${clickConfig ? "opacity-30 w-full  " : " w-full "} card project-stage w-full inline-block align-top `}>
                    <div className='grid grid-cols-2 justify-between items-center mb-1'>
                        <h1 className='heading-medium text-base mb-0 sm:text-xl'>Project Member Grid</h1>
                        <div className='flex justify-center items-center text-sm pl-1 sm:text-xl rounded'>
                            <div className='TaskManageLabel max-w-xs md:w-full py-2'>
                                <FloatingOnlySelectfield
                                    label={''}
                                    optionsGroup={projectList}
                                    name={'projectList'}
                                    className={`!mb-0`}
                                    value={selectedOption ?? ''}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        filterMember(event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='member-chart-wrapper'>
                        <ChartComponent Data={projectDetails} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default project_member_grid;
