import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ProjectProgressChart = ({ labels, progress_in_percent }) => {
    const options = {
        chart: {
            type: 'bar',
                        toolbar: {
                show: false 
            }
        },
        plotOptions: {
            bar: {
                barHeight: '100%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                    position: 'bottom'
                },
            }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
            '#f48024', '#69d2e7'
        ],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
                colors: ['#333333']
            },
                        formatter: function (val, opt) {
                                // return opt.w.globals.labels[opt.dataPointIndex] + ": " + val + "%";
                                var label = opt.w.globals.labels[opt.dataPointIndex];
                                var truncatedLabel = label && label?.length > 10 ? label?.substring(0, 10) + '...' : label;
                                return truncatedLabel + ": " + val + "%";
                            },
            offsetX: 3,
            dropShadow: {
                enabled: false
            }
        },
        legend: {
            show: false,
        },
        // stroke: {
            //     width: 1,
            //     colors: ['#fff']
        // },
        xaxis: {
            categories: [...labels],
            max: 100,
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        // title: {
        //     text: 'Total Projects',
        //     align: 'center',
        //     floating: true
        // },
        // subtitle: {
        //     text: 'List of Projects',
        //     align: 'center',
        // },
        tooltip: {
            enabled: false,
        },
    };

    const series = [
        {
            data: [...progress_in_percent],
        },
    ];
    const chartHeight = Math.max(290, 50 * labels.length); // Assuming 40px per bar

    // Add a vertical scrollbar if there are more than 7 bars
    const chartContainerStyle = {
        height: labels.length > 7 ? '300px' : 'auto',
        overflowY: labels.length > 7 ? 'scroll' : 'hidden',
    };
    return (
        <div>
                        {progress_in_percent.length > 0 ? (
                <div style={{...chartContainerStyle, overflowX: "hidden"}}>
                    <Chart options={options} series={series} width={'100%'} type='bar' height={chartHeight} />
                </div>
            ) : (
                <p className='text-center fs-5 mt-4 dark:text-gray-50'>No data available</p>
            )}
        </div>
    );
};

export default ProjectProgressChart;
