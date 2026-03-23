import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_timeline from '@amcharts/amcharts4/plugins/timeline';
import * as am4plugins_bullets from '@amcharts/amcharts4/plugins/bullets';
import { apiIsNotWorking } from '../../../../helper/function';
import { getAllProjectDetails } from '../api/get';
import { getAllTaskDetails } from '../api/get';
import TinnySpinner from '../../../../components/TinnySpinner';
import toast from '@COMPONENTS/Toster/index';
import moment from 'moment';

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

const Global = ({ startLoading, stopLoading }) => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [totalProjectCount, setTotalProjectCount] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTaskStatus, setSelectedTaskStatus] = useState(null);
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    const handleDateSelection = (type, date) => {
        if (type === 'createdAt') {
            setCreatedAt(date);
        } else if (type === 'updatedAt') {
            setUpdatedAt(date);
        }
    };

    const handleGetAllProject = (condition='?limit=100') => {
        getAllProjectDetails(condition).then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response?.data?.body?.status === 'success') {
                setProjectDetails(response?.data.body.data.project);
                setTotalProjectCount(response?.data.body.data.projectCount);
                setSelectedProject(response?.data?.body?.data?.project.slice(-1)[0]?.projectName || "");
            }else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.error : 'Try again !',
                });
            }
        }).catch(function (e) {
            toast({
                type: 'error',
                message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
            });
        });
    };
    const handleGetAllTask = () => {
        getAllTaskDetails().then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response?.data?.body?.status === 'success') {
                setTaskStatus(response.data.body.data.data);
            }else {
                toast({
                    type: 'error',
                    message: response ? response.data.body.error : 'Try again !',
                });
            }
        }).catch(function (e) {
            toast({
                type: 'error',
                message: e.response ? e.response.data.message : 'Something went wrong, Try again !',
            });
        });
    };

    useEffect(() => {
        handleGetAllProject();
    }, []);

    useEffect(() => {
        handleGetAllTask();
    }, []);

    const getColorByTaskStatus = status => {
        // Define a mapping of task status to colors based on the API data
        const statusColorMap = {
            Todo: colorSet.getIndex(12), // yellow
            Done: colorSet.getIndex(15), // green
            Inprogress: colorSet.getIndex(1), // blue
            Onhold: colorSet.getIndex(10), // orange
            Inreview: colorSet.getIndex(7), // purple
        };

        // Check if the task status exists in the statusColorMap
        if (status in statusColorMap) {
            return statusColorMap[status];
        } else {
            return colorSet.getIndex([20, 30, 40][Math.floor(Math.random() * 3)]); // Default color: light blue
        }
    };


    useEffect(() => {
        if (projectDetails) {
            // Create the chart instances
            projectDetails?.forEach((project, index) => {
                if (selectedProject && project.projectName === selectedProject) {
                let chart = am4core.create(`timeline${index}`, am4plugins_timeline.CurveChart);
                chart.svgContainer.width = 90;
                chart.curveContainer.padding(75, 40, 50, 10);
                chart.maskBullets = false;
                chart.responsive.enabled = true;

                // Hide the watermark
                chart.logo.disabled = true;

                let colorSet = new am4core.ColorSet();

                chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm';
                chart.dateFormatter.dateFormat = 'HH';

                let data = [];
                if (project?.taskDetails.length) {
                    project?.taskDetails?.forEach(task => {
                        const taskCreatedAt = moment(task.createdAt).format('YYYY-MM-DD');
                        const taskUpdatedAt = moment(task.updatedAt).format('YYYY-MM-DD');
        
                        if (
                            (!selectedTaskStatus || task.taskStatus === selectedTaskStatus) &&
                            (!createdAt || taskCreatedAt >= createdAt) &&
                            (!updatedAt || taskUpdatedAt <= updatedAt)
                        ) {
                            data.push({
                            category: '',
                            start: moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                            end: moment(task.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
                            color: getColorByTaskStatus(task?.taskStatus) ?? colorSet.getIndex(3),
                            // color: colorSet.getIndex([14, 15][Math.floor(Math.random() * 2)]),
                            icon: task?.taskCreator?.profilePic ?? `https://avatars.dicebear.com/api/bottts/${task?.taskTitle}.svg`,
                            taskCreatorName: task?.taskCreator?.firstName ?? project.projectName,
                            text: task?.taskTitle ?? project.projectName,
                            taskProgress: task?.progress ?? project.projectName,
                        });
                     }
                    });
                } 
                // else {
                //     // Create data
                //     data = [
                //         {
                //             category: '',
                //             start: '2019-01-10 08:00',
                //             end: '2019-01-10 08:15',
                //             color: colorSet.getIndex(15),
                //             icon: 'https://avatars.dicebear.com/api/bottts/madhu.svg',
                //             taskCreatorName: 'Hero',
                //             text: 'Wake up!',
                //         },
                //         {
                //             category: '',
                //             start: '2019-01-10 08:15',
                //             end: '2019-01-10 08:30',
                //             color: colorSet.getIndex(14),
                //             icon: 'https://avatars.dicebear.com/api/bottts/madhu.svg',
                //             taskCreatorName: 'Hero',
                //             text: 'Drink water',
                //         },
                //     ];
                // }

                chart.data = data;

                let label = chart.createChild(am4core.Label);
                label.text = `[bold] ${project.projectName.length > 16 ? project.projectName.substring(0, 16) + '...' : project.projectName}[/]`;
                label.isMeasured = false;
                label.y = am4core.percent(0);
                label.x = am4core.percent(35);
                label.horizontalCenter = 'middle';
                label.fontSize = 16;

                chart.fontSize = 10;
                chart.tooltipContainer.fontSize = 10;

                let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = 'category';
                categoryAxis.renderer.grid.template.disabled = true;
                categoryAxis.renderer.labels.template.paddingRight = 25;
                categoryAxis.renderer.minGridDistance = 10;
                categoryAxis.renderer.innerRadius = 10;
                categoryAxis.renderer.radius = 30;

                let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

                dateAxis.renderer.points = getPoints();

                dateAxis.renderer.autoScale = false;
                dateAxis.renderer.autoCenter = false;
                dateAxis.renderer.minGridDistance = 70;
                dateAxis.baseInterval = { count: 10, timeUnit: 'minute' };
                dateAxis.renderer.tooltipLocation = 0;
                dateAxis.renderer.line.strokeDasharray = '1,4';
                dateAxis.renderer.line.strokeOpacity = 1;
                dateAxis.tooltip.background.fillOpacity = 0.2;
                dateAxis.tooltip.background.cornerRadius = 5;
                dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor('alternativeBackground');
                dateAxis.tooltip.label.paddingTop = 7;
                dateAxis.endLocation = 0;
                dateAxis.startLocation = -1.5;
                dateAxis.min = new Date(project?.createdAt).getTime();
                dateAxis.max = new Date(project?.endDate).getTime();

                let labelTemplate = dateAxis.renderer.labels.template;
                labelTemplate.verticalCenter = 'middle';
                labelTemplate.fillOpacity = 0.6;
                labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor('background');
                labelTemplate.background.fillOpacity = 1;
                labelTemplate.fill = new am4core.InterfaceColorSet().getFor('text');
                labelTemplate.padding(7, 7, 7, 7);

                let series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
                series.columns.template.height = am4core.percent(30);

                series.dataFields.openDateX = 'start';
                series.dataFields.dateX = 'end';
                series.dataFields.categoryY = 'category';
                series.baseAxis = categoryAxis;
                series.columns.template.propertyFields.fill = 'color'; // get color from data
                series.columns.template.propertyFields.stroke = 'color';
                series.columns.template.strokeOpacity = 0;
                series.columns.template.fillOpacity = 0.6;

                let imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
                imageBullet1.background.radius = 18;
                imageBullet1.locationX = 1;
                imageBullet1.propertyFields.stroke = 'color';
                imageBullet1.background.propertyFields.fill = 'color';
                imageBullet1.image = new am4core.Image();
                imageBullet1.image.propertyFields.href = 'icon';
                imageBullet1.image.scale = 0.7;
                imageBullet1.circle.radius = am4core.percent(100);
                imageBullet1.background.fillOpacity = 0.8;
                imageBullet1.background.strokeOpacity = 0;
                imageBullet1.dy = -2;
                imageBullet1.background.pointerBaseWidth = 10;
                imageBullet1.background.pointerLength = 10;
                imageBullet1.tooltipText = '[bold]Task Title:[/] {text}\n[bold]Task Progress:[/] {taskProgress}%\n[bold]Task Creator:[/] {taskCreatorName}';

                series.tooltip.pointerOrientation = 'up';

                imageBullet1.background.adapter.add('pointerAngle', (value, target) => {
                    if (target.dataItem) {
                        let position = dateAxis.valueToPosition(target.dataItem.openDateX.getTime());
                        return dateAxis.renderer.positionToAngle(position);
                    }
                    return value;
                });

                let hs = imageBullet1.states.create('hover');
                hs.properties.scale = 1.3;
                hs.properties.opacity = 1;

                let textBullet = series.bullets.push(new am4charts.LabelBullet());
                textBullet.label.propertyFields.text = 'text';
                textBullet.disabled = true;
                textBullet.propertyFields.disabled = 'textDisabled';
                textBullet.label.strokeOpacity = 0;
                textBullet.locationX = 1;
                textBullet.dy = -100;
                textBullet.label.textAlign = 'middle';

                chart.scrollbarX = new am4core.Scrollbar();
                chart.scrollbarX.align = 'center';
                chart.scrollbarX.width = am4core.percent(75);
                chart.scrollbarX.parent = chart.curveContainer;
                chart.scrollbarX.height = 300;
                chart.scrollbarX.orientation = 'vertical';
                chart.scrollbarX.x = 128;
                chart.scrollbarX.y = -140;
                chart.scrollbarX.isMeasured = false;
                chart.scrollbarX.opacity = 0.5;

                let cursor = new am4plugins_timeline.CurveCursor();
                chart.cursor = cursor;
                cursor.xAxis = dateAxis;
                cursor.yAxis = categoryAxis;
                cursor.lineY.disabled = true;
                cursor.lineX.disabled = true;

                dateAxis.renderer.tooltipLocation2 = 0;
                categoryAxis.cursorTooltipEnabled = false;

                chart.zoomOutButton.disabled = true;

                let previousBullet;

                chart.events.on('inited', function () {
                    setTimeout(function () {
                        hoverItem(series.dataItems.getIndex(0));
                    }, 2000);
                });

                function hoverItem(dataItem) {
                    if (dataItem && dataItem.bullets && dataItem.bullets.getKey) {
                        let bullet = dataItem.bullets.getKey(imageBullet1.uid);
                        let index = dataItem.index;

                        if (index >= series.dataItems.length - 1) {
                            index = -1;
                        }

                        if (bullet) {
                            if (previousBullet) {
                                previousBullet.isHover = false;
                            }

                            bullet.isHover = true;

                            previousBullet = bullet;
                        }
                        setTimeout(function () {
                            hoverItem(series.dataItems.getIndex(index + 1));
                        }, 5000);
                    }
                }

                function getPoints() {
                    let points = [
                        { x: -1300, y: 200 },
                        { x: 0, y: 200 },
                    ];

                    let w = 400;
                    let h = 400;
                    let levelCount = 4;

                    let radius = am4core.math.min(w / (levelCount - 1) / 2, h / 2);
                    let startX = radius;

                    for (var i = 0; i < 25; i++) {
                        let angle = 0 + (i / 25) * 90;
                        let centerPoint = { y: 200 - radius, x: 0 };
                        points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                    }

                    for (var i = 0; i < levelCount; i++) {
                        if (i % 2 != 0) {
                            points.push({ y: -h / 2 + radius, x: startX + (w / (levelCount - 1)) * i });
                            points.push({ y: h / 2 - radius, x: startX + (w / (levelCount - 1)) * i });

                            let centerPoint = { y: h / 2 - radius, x: startX + (w / (levelCount - 1)) * (i + 0.5) };
                            if (i < levelCount - 1) {
                                for (var k = 0; k < 50; k++) {
                                    let angle = -90 + (k / 50) * 180;
                                    points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                                }
                            }

                            if (i == levelCount - 1) {
                                points.pop();
                                points.push({ y: -radius, x: startX + (w / (levelCount - 1)) * i });
                                let centerPoint = { y: -radius, x: startX + (w / (levelCount - 1)) * (i + 0.5) };
                                for (var k = 0; k < 25; k++) {
                                    let angle = -90 + (k / 25) * 90;
                                    points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                                }
                                points.push({ y: 0, x: 1300 });
                            }
                        } else {
                            points.push({ y: h / 2 - radius, x: startX + (w / (levelCount - 1)) * i });
                            points.push({ y: -h / 2 + radius, x: startX + (w / (levelCount - 1)) * i });
                            let centerPoint = { y: -h / 2 + radius, x: startX + (w / (levelCount - 1)) * (i + 0.5) };
                            if (i < levelCount - 1) {
                                for (var k = 0; k < 50; k++) {
                                    let angle = -90 - (k / 50) * 180;
                                    points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                                }
                            }
                        }
                    }

                    return points;
                }

                // Clean up the chart on component unmount
                return () => {
                    chart.dispose();
                };
            }
            });
        }
    }, [projectDetails, selectedTaskStatus, selectedProject, createdAt, updatedAt]);

    let colorSet = new am4core.ColorSet();

    return (
        <div>
            <div className='flex items-center justify-start md:-mt-6'>
                <h2 id='step1' className='heading-big relative font-bold mb-0 heading-big text-darkTextColor px-2 py-1 text-2xl'>
                    Projects<span className="absolute top-0 -right-3 inline-flex items-center justify-center mr-2 font-bold leading-none transform translate-x-1/2 -translate-y-1/2 bg-[#0685D7] text-indigo-100 text-sm text-center ml-2 px-2 py-1 rounded-full dark:bg-[#0685D7] border border-[#0685D7]">{totalProjectCount}</span>
                </h2>

                <div className='flex items-center space-x-4 mx-auto'>
                    <select className='p-2 border rounded-xl outline-none cursor-pointer text-base dark:bg-gray-800' value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                    {projectDetails && projectDetails.length > 0 ? (
                        projectDetails.map((project, index) => (
                            <option key={index} value={project.projectName} className="hover:cursor-pointer text-base">
                                {project.projectName.length > 10 ? project.projectName.substring(0, 10) + '...' : project.projectName}
                                </option>
                        ))
                    ) : (
                        <option value="">No Projects</option>
                    )}
                    </select>
                </div>
            </div>
            <div className='project-charts'>
                {projectDetails === null ? (
                    <div className='bg-white p-4 w-full h-screen flex items-center justify-center rounded-lg'>
                        <TinnySpinner />
                    </div>
                ) : projectDetails.length > 0 ? (
                    projectDetails.map((project, index) => {
                        const isCurrentProjectSelected = project.projectName === selectedProject;

                        return (
                            isCurrentProjectSelected && (
                        <div key={`main-${index}`} className='project-chart shadow-xl dark:text-[#fff] shadow-gray-400 dark:shadow-gray-950 flex'>
                            {/* User Manual Legend */}
                            <div className='legend 2xl:w-[300px] xl:w-[200px] lg:w-[200px] md:w-[150px] sm:w-[150px] z-50'>
                                <h2 className='text-xl mb-5'>Task Status</h2>
                                <div className='flex'>
                                {/* Loop through the task statuses from the API and create the legend */}
                                <select className='p-2 rounded-xl outline-none border cursor-pointer mb-5 text-base dark:bg-gray-800' onChange={e => setSelectedTaskStatus(e.target.value)}>
                                        <option className='text-base' value=''>All Statuses</option>
                                        {taskStatus &&
                                            taskStatus.map(statusItem => (
                                                <option className='text-base' key={statusItem._id} value={statusItem.taskStatus}>
                                                    {/* {statusItem.taskStatus} */}
                                                    {statusItem.taskStatus.length > 10 ? statusItem.taskStatus.substring(0, 10) + '...' : statusItem.taskStatus}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="flex gap-2 mb-5 ml-10">
                                    <input
                                        type="date"
                                        id='createdAt'
                                        className="p-2 border rounded-xl outline-none text-base dark:bg-gray-800"
                                        min={moment(project?.createdAt).format('YYYY-MM-DD')}
                                        max={moment(project?.endDate).format('YYYY-MM-DD')}
                                        value={createdAt}
                                        onChange={e => handleDateSelection('createdAt', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        id='updatedAt'
                                        className="p-2 border rounded-xl outline-none text-base dark:bg-gray-800"
                                        min={moment(project?.createdAt).format('YYYY-MM-DD')}
                                        max={moment(project?.endDate).format('YYYY-MM-DD')}
                                        value={updatedAt}
                                        onChange={e => handleDateSelection('updatedAt', e.target.value)}
                                    />
                                    </div>
                                </div>

                                    <div className='flex flex-col h-60 overflow-auto w-full'>
                                {taskStatus?.map(taskStatusItem => {
                                    const tasksWithStatusCount = project.taskDetails.filter(task => task.taskStatus === taskStatusItem.taskStatus).length;

                                    return (
                                        <div key={taskStatusItem._id} className='legend-item w-full'>
                                            <div
                                                className='legend-item-color w-[20%]'
                                                style={{
                                                    backgroundColor: getColorByTaskStatus(taskStatusItem.taskStatus).brighten(0.2),
                                                }}></div>
                                            <span className='text-base text-start break-all w-[60%]'>{taskStatusItem.taskStatus}</span>
                                            <span className='text-base task-count w-[20%]'> - {tasksWithStatusCount}</span>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                            
                            <div key={index} id={`timeline${index}`} className='chart-container dark:bg-gray-800 dark:text-[#fff] p-6 2xl:h-[600px] xl:h-[480px] lg:h-[570px] h-[70vh]'></div>
                        </div>
                    ))
                    })
                ) : (
                    <div className='bg-white p-4 w-full h-screen flex items-center justify-center rounded-lg'>
                        <p className='text-2xl'>No projects data found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Global;
