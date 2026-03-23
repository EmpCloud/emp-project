import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
   plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
    },
  // plugins: {
  //   position: "down",
  // },
  responsive: true,
  scales: {
    x: {
      stacked: true,
     
        display:false
    
    },
    y: {
      stacked: true,
   
      ticks: {
        callback: function (value, index, ticks) {
          return value;
        },
      },
        display:false,
    },
  },
  
};
export const productivityColor= '#66CDDA';
export const unProductivityColor= '#F5997B';
export const netralColor= '#e0e0d1';
export const barPercentage= 0.2;
export default function VerticalBarCharts({ data }) {
 const labels = ['PHP Development','Software Testing','Web Designing', 'Android', 'Digital Marketing', 'Node.js', 'Data Science', 'Data Science'];
 /* @ts-ignore  */
 return <Bar height={70} options={options} 
  data={ {
    labels,
    datasets: [
      {
        label: "Productivity",
        data: [1,2,3,4,5,6,7,8],
        
        backgroundColor: productivityColor,
        barPercentage:barPercentage,
      },
      {
        label: "Unproductivity",
        data: [1,2,3,4,5,6,7,8],
        backgroundColor: unProductivityColor,
        barPercentage: barPercentage,
      },
      {
        label: "Neutral",
        data:[1,2,3,4,5,6,7,8],
        backgroundColor: netralColor,
        barPercentage: barPercentage,
      },
    ],
    
  }} />;
}
