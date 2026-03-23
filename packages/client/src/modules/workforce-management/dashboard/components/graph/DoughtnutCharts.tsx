import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Title, Tooltip, Legend);
export const options = {
  responsive: true,
  cutout: "85%",
  plugins: {
    legend: {
      position: "right",
      align: "center",
      labels: {
        usePointStyle: true,
        pointStyle: "rectRounded",
      },
    },
  },
};
function DoughtnutCharts({ data }) {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  const plugin = {
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext("2d");
      let width = chart.width;
      let height = chart.height;
      ctx.font = "24px Arial";
      ctx.textBaseline = "middle";
      let text = data.text() + data.unitsText,
        textX = Math.round((width - ctx.measureText(text).width) / 4.5),
        textY = height / 2;
      ctx.fillText(text, textX, textY);
    },
  };
  useEffect(() => {
    setChartData(data);
    setChartOptions(options);
  }, []);
  return (
    <div>
      <Doughnut data={chartData} options={chartOptions} plugins={[plugin]} />
    </div>
  );
}
export default DoughtnutCharts;
