'use client'
import React, { useEffect,useState } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getAllTaskAnalytics } from '../../api/get';
import toast from '../../../../../../components/Toster/index'



am4core.useTheme(am4themes_animated);



const project_grid_xl = ({projectSelected}) => {
    const [taskActivity, setTaskActivity] = useState(null);
    
    
    useEffect(() => {
        const projectId = projectSelected?.item?._id;
    
        const handleDeleteTaskTypeById = async (projectId) => {
          try {
            const result = await getAllTaskAnalytics(`${projectId}&basedOn=daywise`);
            if (result.data.body.status === 'success') {
                setTaskActivity(result.data.body.data.analytics);
            } else {
                return null;
            //   toast({
            //     type: 'error',
            //     message: result ? result.data.body.message : 'Error',
            //   });
            }
          } catch (e) {
            return null;
            // toast({
            //     type: 'error',
            //     message: e.response ? e.response.data.body.message : 'Something went wrong, Try again!',
            // });
        }
    };
    
    handleDeleteTaskTypeById(projectId);
}, [projectSelected]);

useEffect(() => {
    let chart = am4core.create("taskCharts", am4charts.XYChart);
    chart.logo.disabled = true;
    chart.fontSize = 12;
    if (taskActivity && taskActivity.length > 0) {
        const chartData = taskActivity.map(item => ({
            date: item.date,                     
            market1: item.totalTaskcreated,     
            market2: item.totalTaskPending,     
            sales1: item.totalTaskOverdue       
        }));
         chart.data = chartData;

     } 
    //  else {
    //         chart.data = [{
    //             "date": "2013-01-16",
    //             "market1": 71,
    //             "market2": 75,
    //             "sales1": 5,
    //         }, {
    //             "date": "2013-01-17",
    //             "market1": 74,
    //             "market2": 78,
    //             "sales1": 4,
    //         }, {
    //             "date": "2013-01-18",
    //             "market1": 78,
    //             "market2": 88,
    //             "sales1": 5,
    //         }, {
    //             "date": "2013-01-19",
    //             "market1": 85,
    //             "market2": 89,
    //             "sales1": 8,
    //         }, {
    //             "date": "2013-01-20",
    //             "market1": 82,
    //             "market2": 89,
    //             "sales1": 9,
    //         }];
    //   }

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = "Tasks";

    let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.title.text = "Over All Range";
    valueAxis2.renderer.opposite = true;
    valueAxis2.renderer.grid.template.disabled = true;

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "market1";
    series3.dataFields.dateX = "date";
    series3.name = "Total Created Task";
    series3.strokeWidth = 2;
    series3.tensionX = 0.7;
    series3.yAxis = valueAxis2;
    series3.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";

    let bullet3 = series3.bullets.push(new am4charts.CircleBullet());
    bullet3.circle.radius = 3;
    bullet3.circle.strokeWidth = 2;
    bullet3.circle.fill = am4core.color("#fff");

    let series4 = chart.series.push(new am4charts.LineSeries());
    series4.dataFields.valueY = "market2";
    series4.dataFields.dateX = "date";
    series4.name = "Total Pending Task";
    series4.strokeWidth = 2;
    series4.tensionX = 0.7;
    series4.yAxis = valueAxis2;
    series4.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
    series4.stroke = am4core.color("#f1c40f");
    series4.strokeDasharray = "3,3";

    let bullet4 = series4.bullets.push(new am4charts.CircleBullet());
    bullet4.circle.radius = 3;
    bullet4.circle.strokeWidth = 2;
    bullet4.circle.fill = am4core.color("#fff");

    let series5 = chart.series.push(new am4charts.LineSeries());
    series5.dataFields.valueY = "sales1";
    series5.dataFields.dateX = "date";
    series5.name = "Total Overdue Task";
    series5.renderer
    series5.strokeWidth = 2;
    series5.tensionX = 0.7;
    series5.yAxis = valueAxis2;
    series5.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
    series5.stroke = am4core.color("#FF0000");

    let bullet5 = series5.bullets.push(new am4charts.CircleBullet());
    bullet5.circle.radius = 3;
    bullet5.circle.strokeWidth = 2;
    bullet5.circle.fill = am4core.color("#FF0000");

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";

    // Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series3);
    chart.scrollbarX.series.push(series5);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    return () => {
        chart.dispose();
      };
    
  }, [taskActivity]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <h1 className="xl:text-xl font-semibold text-left dark:text-[#fff] mb-4">Tasks Reports</h1>
        {(!taskActivity || taskActivity.length === 0) ? (
            <div className="w-full h-[400px] md:h-[300px] lg:h-[400px] xl:h-[250px] flex items-center justify-center">
                <p className=' dark:text-gray-50'>No tasks data found</p>
            </div>
        ) : (
            <div id="taskCharts" className="w-full h-[400px] 2xl:h-[500px]"></div>
        )}
   </div>
  
  );
};

export default project_grid_xl;
