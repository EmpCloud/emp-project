import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const UserActivityChart = ({ Todo, Inprogress, Onhold, Inreview, Done, projectCount }) => {
    const seriesinstaoverview = [
        Todo, Inprogress, Onhold, Inreview, Done
    ];
    const optionsinstaoverview = {  
        chart: {
            height: 360,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    },
                },
            },
        },
        colors: ['#e3d96e', '#6e9be3', '#e3936e', '#e36eb2', '#84e36e'],
        labels: ['Todo', 'Inprogress', 'Onhold', 'Inreview', 'Done'],
        legend: {
            show: true,
            floating: true,
            fontSize: '12px',
            position: 'left',
            fontFamily:'"Inter", sans-serif',
            offsetX: 0,
            offsetY: -16,
            labels: {
                useSeriesColors: false,
            },
            markers: {
                size: 0,
            },
            formatter: function (seriesName, opts) {
                const calculatedValue = Math.floor((opts?.w?.globals?.series[opts.seriesIndex]) * projectCount / 100);
                const formattedValue = isNaN(calculatedValue) ? 0 : calculatedValue;
                return `${seriesName}: ${formattedValue}`;
            },

            itemMargin: {
                vertical: 3,
            },
        },
        responsive: [
            {
                breakpoint: 4560,
                options: {
                    chart: {
                        // width: "400",
                        height:"300"
                    },
                },
            },
            {
                breakpoint: 2560,
                options: {
                    chart: {
                        // width: "400",
                        height:"300"
                    },
                },
            },
            {
                breakpoint: 1440,
                options: {
                    chart: {
                        // width: "400",
                        height:"300"
                    },
                },
            },
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        // width: "500",
                        height:"320"
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    chart: {
                        // width: "500",
                        height:"400"
                    },
                },
            },
            {
                breakpoint: 425,
                options: {
                    chart: {
                        // width: "500",
                        height:"300"
                    },
                    legend: {
                        show: false,
                    },
                },
            },
            {
                breakpoint: 375,
                options: {
                    chart: {
                        // width: "500",
                        height:"280"
                    },
                    legend: {
                        show: false,
                    },
                },
            },
            {
                breakpoint: 320,
                options: {
                    chart: {
                        // width: "500",
                        height:"200"
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };
    return <Chart options={optionsinstaoverview} series={seriesinstaoverview} type='radialBar' width='100%' />;
};

export default UserActivityChart;
