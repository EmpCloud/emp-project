import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler);
const footer = tooltipItems => {
    let sum = 0;

    tooltipItems.forEach(function (tooltipItem) {
        sum += tooltipItem.parsed.y;
    });
    return 'Sum: ' + sum;
};
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        position: 'right',
        tooltip: {
            callbacks: {
                footer: footer,
            },
        },
    },
    responsive: true,
};

function LineCharts({ data }) {
    /* @ts-ignore  */
    return (
            <Line data={data} option={options} />
        )
}

export default LineCharts;
