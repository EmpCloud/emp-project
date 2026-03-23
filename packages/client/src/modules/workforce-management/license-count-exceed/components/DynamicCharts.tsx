import dynamic from "next/dynamic";
import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DynamicChart = ({ title, data, chartType, colors, redirectPath }) => {
    const router= useRouter()
    const isDataAvailable = data && data.length > 0;

    const options = {
        chart: {
            width: 480,
            type: chartType,
        },
         labels : colors === '' 
        ? data.map(item => item.name.includes('Actual') ? item.name : item.name + 'Existing') 
        : data.map(item => item.name.includes('Actual') ? item.name : item.name + 'Delete'),
      
        colors: colors, // Use the colors prop
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
            fontFamily: '"Inter", sans-serif',
        },
    };

    const series = data.map(item => item.value);

    return (
        <div>
            {isDataAvailable ? (
                <div className="bg-white rounded-2xl border dark:border-gray-600 p-2 flex justify-center items-center flex-col">
                    <h1 className="xl:text-2xl text-lg ps-4 pt-2 font-medium mr-auto dark:text-gray-50">{title}</h1>
                    <Chart options={options} series={series} type={chartType} className="w-full" />
                    <div className="flex justify-center py-4">
                       {colors === '' ?'': <button className="py-2 px-4 border shadow-lg rounded-md border-[#2d53ac] lg:text-md text-xs dark:text-gray-50 hover:bg-blue-600 hover:shadow-transparent hover:text-white">View {title}</button>}
                    </div>
                </div>
            ) : (
                <p className="text-center fs-5 mt-4 dark:text-gray-50">No data available</p>
            )}
        </div>
    );
};

DynamicChart.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
    chartType: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string), // Add colors prop type
};

DynamicChart.defaultProps = {
    chartType: 'pie',
    colors: ['#00E396', '#0090FF'], // Default colors if not provided
};

export default DynamicChart;
