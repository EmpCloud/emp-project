import React, { useEffect, useState} from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getTaskStatusDetails } from '../../api/get';
import toast from '../../../../../../components/Toster/index'

am4core.useTheme(am4themes_animated);

const subtask_status = ({projectSelected}) => {
    const [taskStatusDetails, setTaskStatusDetails] = useState(null);

    useEffect(() => {
      const projectId = projectSelected?.item?._id;
  
      const handleDeleteTaskTypeById = async (projectId) => {
        try {
          const result = await getTaskStatusDetails(projectId);
          if (result.data.body.status === 'success') {
            setTaskStatusDetails(result?.data?.body?.data);
          } else {
            toast({
              type: 'error',
              message: result ? result.data.body.message : 'Error',
            });
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

    
    let chart = am4core.create("subtask_status", am4charts.RadarChart);
    chart.logo.disabled = true;

    if (taskStatusDetails) {
        const statusData = taskStatusDetails?.subtaskStatusData ?? 0;
        const progressData = taskStatusDetails?.subTaskProgress ?? 0;
      
        const chartData = Object.keys(progressData).map((category) => ({
          category: category + `-(${statusData[category]})`,
          value: progressData[category],
          full: 100
        }));
        chart.data = chartData;

      } else{
        chart.data = [
        {
            "category": "task 1",
            "value": 80,
            "full": 100
        },
        {
            "category": "task 2",
            "value": 35,
            "full": 100
        },
        {
            "category": "task 3",
            "value": 92,
            "full": 100
        },
        {
            "category": "task 4",
            "value": 68,
            "full": 100
        }
     ];
    }
          
    chart.startAngle = -90;
    chart.endAngle = 180;
    chart.innerRadius = am4core.percent(20);

    chart.numberFormatter.numberFormat = "#.#'%'";
    
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.fontWeight = "500";
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.adapter.add("fill", function(fill, target) {
      return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
    });
    categoryAxis.renderer.minGridDistance = 10;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;

    let series1 = chart.series.push(new am4charts.RadarColumnSeries());
    series1.dataFields.valueX = "full";
    series1.dataFields.categoryY = "category";
    series1.clustered = false;
    series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1.columns.template.fillOpacity = 0.08;
    series1.columns.template.cornerRadiusTopLeft = 20;
    series1.columns.template.strokeWidth = 0;
    series1.columns.template.radarColumn.cornerRadius = 20;

    let series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.dataFields.valueX = "value";
    series2.dataFields.categoryY = "category";
    series2.clustered = false;
    series2.columns.template.strokeWidth = 0;
    series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2.columns.template.radarColumn.cornerRadius = 20;

    series2.columns.template.adapter.add("fill", function(fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Add cursor
    chart.cursor = new am4charts.RadarCursor();

    return () => {
      chart.dispose();
    };
  }, [taskStatusDetails]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="xl:text-xl font-semibold text-left dark:text-[#fff] mb-4  relative">Subtask Status<span className="absolute top-0 -ml-4 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{taskStatusDetails?.TotalSubtask ?? 0}</span></h1>
        <div id="subtask_status" className=" h-[400px] md:h-[300px] lg:h-[400px] xl:h-[300px]"></div>
    </div>
  );
};

export default subtask_status;
