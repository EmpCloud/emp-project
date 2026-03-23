/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ImCross } from 'react-icons/im';
import { getAllSubTask, getStatusCount } from '@WORKFORCE_MODULES/task/api/get';
import { FloatingOnlySelectfield } from '@COMPONENTS/FloatingOnlySelectfield';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const subtask_status = ({ clickConfig, handleRemoveGrid, data, key, taskList }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [subtaskStatusCount, setSubtaskStatusCount] = useState('');
    const handleGetStatusCount = (condition = `?taskId=${selectedOption}&limit=${process.env.TOTAL_USERS}`) => {
        getStatusCount(condition).then(response => {
            if (response?.data?.body?.status === 'success') {
                setSubtaskStatusCount(response.data.body.data.statusData);
            }
        });
    };

    useEffect(() => {
        if (taskList && taskList.length != 0) {
        handleGetStatusCount('?taskId=' + taskList[0].value);}
    }, [taskList]);

    const optionsinstaoverview = {
        chart: {
            width: 500,
            type: 'pie',
        },
        labels: Object.keys(subtaskStatusCount) ?? [],

        dataLabels: {
            formatter: function (val, opts) {
                return opts.w.config.series[opts.seriesIndex];
            },
        },
        responsive: [
            {
                breakpoint: 2560,
                options: {
                    chart: {
                        width: 300,
                        height:300,
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
                        width: 300,
                        height:300,
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
                        width: 200,
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
    const seriesinstaoverview = Object.values(subtaskStatusCount) ?? [];
    const isDataAvailable = Object.values(subtaskStatusCount).some(count => count > 0);
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
                <div className={`card-set project-stage w-full align-top`}>
                    <div className='p-0 w-full'>
                        <div className='flex flex-wrap justify-between items-center mb-1'>
                            <h1 className='heading-medium text-base sm:text-xl font-semibold'>Subtask Status</h1>
                            <div className='w-full md:w-[8rem]'>
                                <FloatingOnlySelectfield
                                    label={undefined}
                                    optionsGroup={taskList }
                                    value={selectedOption ?? ''}
                                    // className={`!mb-0`}
                                    onChange={event => {
                                        setSelectedOption(event.target.value);
                                        handleGetStatusCount('?taskId=' + event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        {isDataAvailable ? (
                            <Chart options={optionsinstaoverview} series={seriesinstaoverview} type='pie' width={`100%`} />
                        ) : (
                            <p className="text-center fs-5 mt-4 dark:text-gray-50">No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default subtask_status;
