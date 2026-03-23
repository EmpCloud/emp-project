import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import toast from '@COMPONENTS/Toster/index';
import { getProjectDetails } from '../../api/get';
import { USER_AVTAR_URL } from '@HELPER/avtar';

const project_by_status = ({ projectSelected }) => {
    const Id=projectSelected?.item?._id;
    const [projectDetails, setProjectDetails] = useState([]);
    const [chartHeight, setChartHeight] = useState(400);

        const isCorsSafe = (url: string) =>
        url.includes('dicebear.com') || url.includes('storage.googleapis.com');
          const toBase64 = async (url: string): Promise<string> => {
            try {
              const response = await fetch(url, { mode: 'cors' });
              const blob = await response.blob();
              return await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } catch (e) {console.warn(`Base64 conversion failed for ${url}`, e)}
          };
            const handleGetAllProject = async (condition: string) => {
              try {
                const response = await getProjectDetails(condition);
                if (response?.data?.body?.status === 'success') {
                const data: any[] = response.data.body.data;
                const projectList = await Promise.all(
                  data.map(async (item: any) => {
                    let avatar = item?.profilePic;
                    if (avatar && isCorsSafe(avatar)) avatar = await toBase64(avatar);
                    if (!avatar) avatar = await toBase64(`https://api.dicebear.com/7.x/initials/svg?seed=${item?.Name}`);
                        return {
                            name: item?.Name,
                            steps: item?.performance ? item?.performance : [],
                            href: avatar,
                            role: item?.role,
                            totalTask: item?.totalTaskCount,
                            completedTask: item?.allCompletedTask,
                            pendingTask: item?.pendingTask,
                            overDueTask: item?.overDueTasks,
                            completedSubtask: item?.completedSubtask,
                            remainingSubTask: item?.remainingSubtask,
                        };
                    })
                  );
                    setProjectDetails(projectList);
                } else {
                    toast({
                        type: 'error',
                        message: response ? response.data.body.error : 'Try again !',
                    });
                }
            }catch (response) {
                toast({
                    type: 'error',
                    message: response ? response.data?.body.error : 'Try again !',
                });
            }
    };

    useEffect(() => {
        if (Id !== undefined && Id !== null) {
            handleGetAllProject(`?projectId=${Id}`);
        }
    }, [Id]);
    am4core.useTheme(am4themes_animated);

    useEffect(() => {

            let chart = am4core.create('memberChart', am4charts.XYChart);
            chart.logo.disabled = true;
            chart.hiddenState.properties.opacity = 0;
            chart.paddingLeft = 5;
            chart.data = projectDetails;
            chart.height = am4core.percent(100);

            let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = 'name';
            categoryAxis.renderer.grid.template.strokeOpacity = 0;
            categoryAxis.renderer.labels.template.disabled = false;
            categoryAxis.renderer.labels.template.maxWidth = 100;
            categoryAxis.renderer.labels.template.wrap = true;
            categoryAxis.renderer.labels.template.align = 'left';
            categoryAxis.renderer.labels.template.dx = 0;
            categoryAxis.renderer.labels.template.dy = 0;
            categoryAxis.renderer.labels.template.marginRight = 20;
            categoryAxis.renderer.labels.template.fontSize = 12;
            // categoryAxis.renderer.minGridDistance = 100;
            // categoryAxis.renderer.minWidth = 120;
            categoryAxis.tooltip.disabled = true;
            // categoryAxis.renderer.tooltip.dx = 0;
            // categoryAxis.renderer.tooltip.fill = am4core.color('#FF0000');
            // categoryAxis.renderer.tooltip.fontSize = 12;
            // categoryAxis.renderer.tooltip.label.maxWidth = 100;
            // categoryAxis.renderer.tooltip.label.wrap = true;

            let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.inside = true;
            valueAxis.renderer.labels.template.fillOpacity = 0.3;
            valueAxis.renderer.grid.template.strokeOpacity = 0;
            valueAxis.min = 0;
            
            // Set the maximum value of the x-axis to 100
            // valueAxis.max = 100;

            valueAxis.cursorTooltipEnabled = false;
            valueAxis.renderer.baseGrid.strokeOpacity = 0;
            valueAxis.renderer.labels.template.dy = 20;

            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueX = 'steps';
            series.dataFields.categoryY = 'name';
            series.tooltipText =
                '[bold]Role:[/] {role}\n[bold]Total Tasks:[/] {totalTask}\n[bold]Completed Tasks:[/] {completedTask}\n[bold]Pending Tasks:[/] {pendingTask}\n[bold]OverDue Tasks:[/] {overDueTask}\n[bold]Completed SubTasks:[/] {completedSubtask}\n[bold]Remaining SubTasks:[/] {remainingSubTask}';
            series.tooltip.pointerOrientation = 'horizontal';
            series.tooltip.dx = 10;
            series.tooltip.dy = 0;
            series.tooltip.fontSize = 12;
            series.columnsContainer.zIndex = 100;

            let columnTemplate = series.columns.template;
            columnTemplate.height = am4core.percent(30);
            columnTemplate.maxHeight = 50;
            columnTemplate.column.cornerRadius(60, 10, 60, 10);
            columnTemplate.strokeOpacity = 0;

            series.heatRules.push({ target: columnTemplate, property: 'fill', dataField: 'valueX', min: am4core.color('#e5dc36'), max: am4core.color('#5faa46') });
            series.mainContainer.mask = undefined;

            let cursor = new am4charts.XYCursor();
            chart.cursor = cursor;
            cursor.lineX.disabled = true;
            cursor.lineY.disabled = true;
            cursor.behavior = 'none';

            let bullet = columnTemplate.createChild(am4charts.CircleBullet);
            bullet.circle.radius = 15;
            bullet.valign = 'middle';
            bullet.align = 'left';
            bullet.isMeasured = true;
            bullet.interactionsEnabled = false;
            bullet.horizontalCenter = 'right';
            bullet.interactionsEnabled = false;

            let hoverState = bullet.states.create('hover');
            let outlineCircle = bullet.createChild(am4core.Circle);
            outlineCircle.adapter.add('radius', function (radius, target) {
                let circleBullet = target.parent;
                return circleBullet.circle.pixelRadius + 10;
            });

            let image = bullet.createChild(am4core.Image);
            image.width = 30 ;
            image.height = 30 ;
            image.horizontalCenter = 'middle';
            image.verticalCenter = 'middle';
            image.propertyFields.href = 'href';

            image.adapter.add('mask', function (mask, target) {
                let circleBullet = target.parent;
                return circleBullet.circle;
            });

  
            let previousBullet;
            chart.cursor.events.on('cursorpositionchanged', function (event) {
                let dataItem = series.tooltipDataItem;

                if (dataItem) {
                    let bullet = dataItem?.column?.children?.getIndex(1);

                    if (previousBullet && previousBullet != bullet) {
                        previousBullet.isHover = false;
                    }

                    if (previousBullet != bullet) {
                        let hs = bullet.states.getKey('hover');
                        hs.properties.dx = dataItem.column.pixelWidth;
                        bullet.isHover = true;

                        previousBullet = bullet;
                    }
                }
            });
            return () => {
                chart.dispose();
            };
          
     
    }, [projectDetails]);

    useEffect(() => {
        // if (projectDetails.length) {
          const dataLength = projectDetails.length;
          const minHeight = 100;
          const calculatedHeight = Math.max(dataLength * 100, minHeight);
    
          setChartHeight(calculatedHeight);
        // }
      }, [projectDetails]);

      return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h1 className="xl:text-xl font-semibold text-left dark:text-[#fff] mb-4">Member Progress</h1>
            {projectDetails?.length!==0?
            <div className='overflow-x-auto h-[400px] md:h-[300px] lg:h-[400px] xl:h-[300px]'>
                <div id="memberChart" className="font-sm" style={{ height: `${chartHeight}px` }}></div>
            </div>
            :
            <div className='overflow-x-auto h-[400px] md:h-[300px] lg:h-[400px] xl:h-[300px]'>
                <p className='dark:text-gray-50' style={{marginTop:'110px', marginLeft:'80px'}}>No members assigned to the project</p>
            </div>}
        </div>
    );
};

export default project_by_status;
