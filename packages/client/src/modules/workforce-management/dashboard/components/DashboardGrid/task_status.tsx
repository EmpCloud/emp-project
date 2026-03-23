/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ImCross } from 'react-icons/im';
import { getStatusCount } from '@WORKFORCE_MODULES/task/api/get';
import { FloatingSelectfield } from '@COMPONENTS/FloatingSelectfield';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
import { getAllProject } from '@WORKFORCE_MODULES/projects/api/get';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const task_status = ({ clickConfig, handleRemoveGrid, data, key,projectList }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [taskStatusCount, setTaskStatusCount] = useState('');

    const handleGetStatusCount = (condition) => {
        getStatusCount(condition).then(response => {
            if (response.data.body.status === 'success') {
                setTaskStatusCount(response.data.body.data.statusData);
            }
        });
    };
    
    useEffect(() => {
        if (projectList && projectList.length != 0) {
            handleGetStatusCount(`?projectId=${projectList[0].value}&limit=${process.env.TOTAL_USERS}` );
        }
    }, [projectList]);
    const optionsinstaoverview = {
        chart: {
            width: 480,
            type: 'pie',
        },
        labels: Object.keys(taskStatusCount) ?? [],
        dataLabels: {
            formatter: function (val, opts) {
                return opts.w.config.series[opts.seriesIndex];
            },
        },
        responsive: [
            {
                breakpoint: 4250,
                options: {
                    chart: {
                        height: 340,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
            {
                breakpoint: 2560,
                options: {
                    chart: {
                        height: 340,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
            {
                breakpoint: 1440,
                options: {
                    chart: {
                        height: 340,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 300,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 380,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 260,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
        legend: {
            
            fontFamily:'"Inter", sans-serif',
           
        },
    };
    const seriesinstaoverview = Object.values(taskStatusCount) ?? [];
    const isDataAvailable = Object.values(taskStatusCount).some(count => count > 0);

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
                <div className={`card-set project-stage w-full inline-block align-top`}>
                    <div className='p-0 w-full d-flex'>
                        <div className='flex justify-between flex-wrap md:flex-nowrap items-center mb-1'>
                            <h1 className='heading-medium text-lg md:w-2/4 sm:text-xl font-semibold'>Task Status</h1>
                            <div className='md:w-[8rem]'>
                                <FloatingOnlySelectfield
                                    label={undefined}
                                    optionsGroup={projectList}
                                    value={selectedOption ?? ''}
                                    // className={`!mb-0`}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        handleGetStatusCount('?projectId=' + event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        {isDataAvailable ? (
                                <Chart options={optionsinstaoverview} series={seriesinstaoverview} type='pie' width={'100%'} />
                            ) : (
                                <p className="text-center fs-5 mt-4 dark:text-gray-50">No data available</p>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default task_status;
