import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SubtaskProgressChart = ({labels,progress_in_percent}) => {
    const options = {
        chart: {
            type: 'bar',
            height: 380,
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
                colors: ['#000']
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ": " + val + "%";
            },
            offsetX: 3,
            dropShadow: {
                enabled: false
            }
        },
        legend: {
            show: false, // Hide legends
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: [...labels
            ],
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
        //     text: 'List of SubTask Progress',
        //     align: 'center',
        // },
        tooltip: {
            enabled: false, 
        }
    };

    const series = [{
        data: [...progress_in_percent]
    }];
    const chartHeight = Math.max(380, 50 * labels.length); // Assuming 40px per bar

    // Add a vertical scrollbar if there are more than 7 bars
    const chartContainerStyle = {
        height: labels.length > 7 ? '300px' : 'auto',
        overflowY: labels.length > 7 ? 'scroll' : 'hidden',
    };
    return (
        <div>
            {/* <h1>Custom DataLabels Chart</h1> */}
            {progress_in_percent.length > 0 ? (
                <div style={chartContainerStyle}>
                    <Chart options={options} series={series} type='bar' height={chartHeight} />
                </div>
            ) : (
                <p className='text-center fs-5 mt-4 dark:text-gray-50 dark:text-gray-50'>No data available</p>
            )}
        </div>
    );
};

export default SubtaskProgressChart;
