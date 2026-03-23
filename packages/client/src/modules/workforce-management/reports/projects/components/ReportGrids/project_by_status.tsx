import React, { useEffect,useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { getAllTaskAnalytics } from '../../api/get';
import toast from '../../../../../../components/Toster/index'
import { format } from 'date-fns';

am4core.useTheme(am4themes_animated);


const ProjectRangeChart = ({projectSelected}) => {
    
  const progress = projectSelected?.item?.progress
  const startDate = projectSelected?.item?.createdAt
  const endDate = projectSelected?.item?.endDate
  const formattedStartDate = startDate ? format(new Date(startDate), 'yyyy-LLL-dd') : null;
  const formattedEndDate = endDate ? format(new Date(endDate), 'yyyy-LLL-dd') : null;
  const todayDate = format(new Date(), 'yyyy-LLL-dd');
  
    const [projectTime, setProjectTime] = useState(null);
    
    useEffect(() => {
        const projectId = projectSelected?.item?._id;
    
        const handleDeleteTaskTypeById = async (projectId) => {
          try {
            const result = await getAllTaskAnalytics(`${projectId}&basedOn=daywise`);
            if (result?.data.body.status === 'success') {
                setProjectTime(result?.data.body.data);
            } else {
                return null;
            //   toast({
            //     type: 'error',
            //     message: result ? result.data.body.message : 'Error',
            //   });
            }
          } catch (e) {
            toast({
                type: 'error',
                message: e.response ? e.response.data.body.message : 'Something went wrong, Try again!',
            });
        }
    };
    
    handleDeleteTaskTypeById(projectId);
}, [projectSelected]);

  useEffect(() => {
    const chart = am4core.create('projectBars', am4charts.XYChart);
    chart.logo.disabled = true;
    chart.responsive.enabled = true;

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.labels.template.rotation = 0; 
    categoryAxis.renderer.labels.template.wrap = true;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.minGridDistance = 1;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = -2;
    valueAxis.max = 102;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minGridDistance = 5;
    valueAxis.renderer.fontSize = 12;
    // valueAxis.renderer.grid.template.disabled = true;

    valueAxis.renderer.labels.template.adapter.add('text', (labelText) => {
        return `${labelText}%`;
      });

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = 'category';
    series.dataFields.openValueX = 'open';
    series.dataFields.valueX = 'close';
    series.columns.template.height = 1;

    const bullet1 = series.bullets.push(new am4charts.Bullet());
    bullet1.locationX = 0;

    const circleBullet1 = bullet1.createChild(am4core.Circle);
    circleBullet1.radius = 8;
    circleBullet1.fill = am4core.color('#009dd9');

    const bullet2 = series.bullets.push(new am4charts.Bullet());
    bullet2.locationX = 1;

    const circleBullet2 = bullet2.createChild(am4core.Circle);
    circleBullet2.radius = 8;
    circleBullet2.fill = am4core.color('#009dd9');

    const lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = 'Current Project Progress';
    lineSeries.xAxis = valueAxis;
    lineSeries.yAxis = categoryAxis;
    lineSeries.dataFields.categoryY = 'category';
    lineSeries.dataFields.valueX = 'average';
    lineSeries.tooltipText = 'Average Score: {valueX.value}';
    
    const triangleBullet = lineSeries.bullets.push(new am4core.Triangle());
    triangleBullet.width = 15;
    triangleBullet.height = 15;
    triangleBullet.rotation = 180;
    triangleBullet.fill = am4core.color('#70b603');
    let todayDateFormatted = `[bold font-size:12px text-align:center]${todayDate}[/]`;
    triangleBullet.tooltipText = `[font-size:12px text-align:center]Project Progress On: [/]${todayDateFormatted}\n[font-size:12px text-align:center]Current Progress: [/]${progress}%`;


    chart.appear(1000, 100);

    return () => {
      chart.dispose();
    };
  }, [projectTime]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <h1 className="xl:text-xl font-semibold text-left mb-4 dark:text-[#fff]"> {(projectSelected?.name ?? 'Project Name').slice(0, 20)} </h1>
        {(!projectTime) ? (
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[200px] flex items-center justify-center">
                <p className=' dark:text-gray-50'>No project time data found</p>
            </div>
        ) : (
          <div className='flex flex-col justify-center items-start p-3'>
            <div className='flex flex-col gap-3'>
              <span className='text-[#3C61F7] font-bold'>Start Date: {formattedStartDate !== null ? formattedStartDate : todayDate}</span>
              <span className='text-[#ff5757] font-bold'>End Date: {formattedEndDate !== null ? formattedEndDate: todayDate}</span>
            </div>
              <div id="projectBars" className="w-full h-[300px] md:h-[400px] lg:h-[500px] xl:h-[250px] font-xs"></div>
        </div>
        )}
   </div>
  );
};

export default ProjectRangeChart;

