import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected';

am4core.useTheme(am4themes_animated);

const budget_bubble = ({projectSelected}) => {
  const plannedBudget = projectSelected?.item?.plannedBudget ?? 0;
  const actualBudget = projectSelected?.item?.actualBudget ?? 0;
  const currencyType = projectSelected?.item?.currencyType ?? 'INR'
  const projectName = projectSelected?.item?.projectName ?? 'Project Name';


  useEffect(() => {
    let chart = am4core.create("bubble", am4plugins_forceDirected.ForceDirectedTree);
    chart.logo.disabled = true;

    let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());

    const chartData = [];

    if (plannedBudget !== undefined) {
      chartData.push({
        name: `[bold]Planned Budget :[/] ${plannedBudget} ${currencyType || ''}`, 
        value:150,
      });
    }

    chartData.push({
      name: `[bold]Actual Budget :[/] ${actualBudget} ${currencyType || ''}`,
      value:150,
    });

    chart.data = chartData;

    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.children = "children";
    networkSeries.nodes.template.tooltipText = "{name}";
    networkSeries.nodes.template.fillOpacity = 1;
    networkSeries.dataFields.id = "name";
    networkSeries.dataFields.linkWith = "linkWith";

    networkSeries.nodes.template.label.text = "[bold]{name}[/]";
    networkSeries.nodes.template.adapter.add("scale", (scale, target) => {
      return 2.5;
    });
    networkSeries.fontSize = 10;

    let selectedNode;

    let label = chart.createChild(am4core.Label);
    label.text = projectName.length > 35 ? `${projectName.substring(0, 20)}...` : projectName;
    label.x = 50;
    label.y = 50;
    label.isMeasured = false;

    networkSeries.nodes.template.events.on("up", function (event) {
      let node = event.target;
      if (!selectedNode) {
        node.outerCircle.disabled = false;
        node.outerCircle.strokeDasharray = "3,3";
        selectedNode = node;
      } else if (selectedNode == node) {
        node.outerCircle.disabled = true;
        node.outerCircle.strokeDasharray = "";
        selectedNode = undefined;
      } else {
        let node = event.target;
        let link = node.linksWith.getKey(selectedNode.uid);
        if (link) {
          node.unlinkWith(selectedNode);
        } else {
          node.linkWith(selectedNode, 0.4);
        }
      }
    });

    return () => {
      chart.dispose();
    };
  }, [plannedBudget, actualBudget, currencyType, projectName]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <h1 className="xl:text-xl font-semibold text-left dark:text-[#fff] mb-4">Project Budget</h1>
        <div id="bubble" className="w-full h-[400px] md:h-[300px] lg:h-[400px] xl:h-[300px]"></div>
    </div>
  );
};

export default budget_bubble;
