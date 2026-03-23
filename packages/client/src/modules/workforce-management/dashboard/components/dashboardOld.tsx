import React, { useEffect, useState } from 'react';
import { HiCheck } from 'react-icons/hi';
import { HiOutlineClock } from 'react-icons/hi';
import { HiOutlineStatusOffline } from 'react-icons/hi';
import { HiOutlineUser } from 'react-icons/hi';
import { HiOutlineSortDescending } from 'react-icons/hi';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { HiSun } from 'react-icons/hi';
import { FiDownload } from '@react-icons/all-files/fi/FiDownload';
import { BsThreeDotsVertical } from '@react-icons/all-files/bs/BsThreeDotsVertical';
import ToggleTheme from './ToggleTheme';
import DashboardDate from './DashboardDate';
import SelectDropDown from './SelectDropDown';
import DoughtnutCharts from './graph/DoughtnutCharts';
import LineCharts from './graph/LineCharts';
import VerticalBarCharts from './graph/VerticalBarCharts';
import DropDown from '../../../../components/DropDown';
import { apiIsNotWorking } from '../../../../helper/function';
import { getAllProject, searchProject } from '../../projects/api/get';
import { getAllTask } from '../../task/api/get';
import SearchInput from '../../../../components/SearchInput';
import FloatingDateTextfield from '../../../../components/FloatingDateTextfield';
import { Responsive, WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';
const layout = [
    { i: 'tasks', x: 0, y: 0, w: 1, h: 1 },
    { i: 'projects', x: 1, y: 0, w: 8, h: 3 },
    { i: 'graph', x: 2, y: 0, w: 1, h: 1 },
    { i: 'roles', x: 3, y: 0, w: 1, h: 1 },
    { i: 'members', x: 4, y: 0, w: 1, h: 1 },
];
const GridItemWrapper = styled.div`
    background: #0283d9;
`;
const GridItemContent = styled.div`
    padding: 0px;
`;
const Root = styled.div`
    padding: 0px;
`;
const ResponsiveGridLayout = WidthProvider(Responsive);
const getLayouts = () => {
    if (typeof window !== 'undefined') {
        const savedLayouts = localStorage.getItem('grid-layout');
        return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout };
    }
};
export const index = () => {
    const [projectDetails, setProjectDetails] = useState(null);
    const [taskDetails, setTaskDetails] = useState(null);
    const handleLayoutChange = (layout, layouts) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('grid-layout', JSON.stringify(layouts));
        }
    };
    const handleGetAllProject = () => {
        getAllProject().then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response.data?.body.status === 'success') {
                setProjectDetails(response.data?.body.data.projectData);
            }
        });
    };
    const handleGetAllTask = () => {
        getAllTask().then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response.data?.body.status === 'success') {
                setTaskDetails(response.data?.body.data.task);
            }
        });
    };
    useEffect(() => {
        handleGetAllProject();
        handleGetAllTask();
    }, []);
    useEffect(() => {}, [projectDetails]);
    const liveScreen = [
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'riya', department: 'Next Developer' },
        { name: 'Deepu', department: 'Software Testing' },
        { name: 'Tipura', department: 'Node Developer' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'riya', department: 'Next Developer' },
        { name: 'Deepu', department: 'Software Testing' },
        { name: 'Tipura', department: 'Node Developer' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'riya', department: 'Next Developer' },
        { name: 'Deepu', department: 'Software Testing' },
        { name: 'Tipura', department: 'Node Developer' },
    ];
    const empDetails = [{ name: 'neetu', department: 'UI/UX Developer' }];
    const timeWorked = [
        { name: 'neetu', department: 'UI/UX Developer', time: '275:00 hr' },
        { name: 'Ritu', department: 'UI/UX Developer', time: '275:00 hr' },
        { name: 'neetu', department: 'UI/UX Developer', time: '275:00 hr' },
        { name: 'Priya', department: 'UI/UX Developer', time: '275:00 hr' },
    ];
    const activityRating = [
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'riya', department: 'Next Developer' },
        { name: 'Deepu', department: 'Software Testing' },
        { name: 'Tipura', department: 'Node Developer' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'riya', department: 'Next Developer' },
        { name: 'Deepu', department: 'Software Testing' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'neetu', department: 'UI/UX Developer' },
        { name: 'riya', department: 'Next Developer' },
        { name: 'Deepu', department: 'Software Testing' },
        { name: 'Tipura', department: 'Node Developer' },
        { name: 'Tipura', department: 'Node Developer' },
    ];
    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
    }, []);
    const data = [
        { text: 'My profile', value: 1 },
        { text: 'Account settings', value: 2 },
        { text: <ToggleTheme />, value: 3 },
        { text: 'Logout', value: 4 },
    ];
    const handleSelectStatus = (event, v: any) => {
        event.preventDefault;
    };
    // Dropdown
    const dropdownData = [
        { text: 'Import tasks', value: 1 },
        { text: 'Delete all', value: 2 },
    ];
    // Ongoing project Data
    const ongoingProject = [{ name: 'Ongoing Project' }, { name: 'Project 1' }, { name: 'Project 2' }, { name: 'Project 3' }];
    //date
    // Ongoing project Data
    const date = [{ name: 'Today' }, { name: 'Yesterday' }, { name: 'This Month' }, { name: 'Last Month' }];
    // Performance Data
    const highPerformance = [{ name: 'High Performance' }, { name: 'Performance 1' }, { name: 'Performance 2' }, { name: 'Performance 3' }];
    const lowPerformance = [{ name: 'Low Performance' }, { name: 'Performance 1' }, { name: 'Performance 2' }, { name: 'Performance 3' }];
    const data1 = {
        labels: ['01 may 2022', '07 may 2022', '14 may 2022', '21 may 2022', '28 may 2022'],
        datasets: [
            {
                label: 'Web Usage',
                data: [0, 53, 85, 65, 1],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
                showLine: true,
                pointStyle: 'circle',
                hoverBorderJoinStyle: 'round',
            },
        ],
    };
    const data2 = {
        labels: ['01 may 2022', '07 may 2022', '14 may 2022', '21 may 2022'],
        datasets: [
            {
                label: 'EmpCloud',
                data: [10, 15, 20, 15],
                fill: false,
                borderColor: '#F6C27B',
                tension: 0.1,
                showLine: true,
                pointStyle: 'circle',
                hoverBorderJoinStyle: 'round',
                legend: {
                    plugins: {
                        position: 'right',
                    },
                },
            },
            {
                label: 'PowerAdSpy',
                data: [40, 30, 35, 36],
                fill: false,
                borderColor: '#8993CA',
                tension: 0.1,
                showLine: true,
                pointStyle: 'circle',
                hoverBorderJoinStyle: 'round',
            },
            {
                label: 'EmpMonitor',
                data: [30, 53, 45, 65],
                fill: false,
                borderColor: '#91C794',
                tension: 0.1,
                showLine: true,
                pointStyle: 'circle',
                hoverBorderJoinStyle: 'round',
            },
            {
                label: 'EmpMonitor',
                data: [70, 50, 65, 80],
                fill: false,
                borderColor: '#66CDDA',
                tension: 0.1,
                showLine: true,
                pointStyle: 'circle',
                hoverBorderJoinStyle: 'round',
            },
        ],
    };
    const reduceText = function (total, num) {
        return total + num;
    };
    const dataAttendence = {
        labels: ['Present : 190', 'Absent : 18', 'Suspended : 12'],
        datasets: [
            {
                data: [190, 78, 15],
                backgroundColor: ['#66CDDA', '#F5997B', '#F4B968'],
                borderWidth: 0,
            },
        ],
        unitsText: '%',
        text() {
            return this.datasets[0].data.reduce(reduceText);
        },
    };
    const dataApplication = {
        labels: ['Google Chrome : 52:00 hr', 'Sublime Text : 32:30 hr', 'VS Code : 25:05 hr', 'Photoshop : 52:00 hr', 'Illustrator : 32:30 hr', 'Thunderbird : 25:05 hr'],
        datasets: [
            {
                label: 'Dogs Out',
                data: [90, 18, 12, 20, 13, 17, 30],
                backgroundColor: ['#66CDDA', '#8993CA', '#F6C27B', '#D9E287', '#91C794', '#CA89C7'],
                borderWidth: 0,
            },
        ],
        unitsText: 'hrs',
        text() {
            return this.datasets[0].data.reduce(reduceText);
        },
    };
    const dataWebsite = {
        labels: ['Youtube : 52:00 hr', 'W3 Schools: 32:30 hr', 'Freepik : 25:05 hr', 'Dribbble : 52:00 hr', 'Flaticon : 32:30 hr', 'IconShot : 25:05 hr'],
        datasets: [
            {
                label: 'Dogs Out',
                data: [90, 26, 12, 20, 13, 17, 30],
                backgroundColor: ['#66CDDA', '#8993CA', '#F6C27B', '#D9E287', '#91C794', '#CA89C7'],
                borderWidth: 0,
            },
        ],
        unitsText: 'hrs',
        text() {
            return this.datasets[0].data.reduce(reduceText);
        },
    };
    const dataLocation = {
        labels: ['Bangalore', 'Delhi', 'Chennai'],
        datasets: [
            {
                label: 'Dogs Out',
                data: [90, 26, 12],
                backgroundColor: ['#66CDDA', '#8993CA', '#F6C27B'],
                borderWidth: 0,
            },
        ],
        unitsText: 'hrs',
        text() {
            return this.datasets[0].data.reduce(reduceText);
        },
    };
    const handleSearchProject = event => {
        searchProject('keyword=' + event.target.value).then(response => {
            if (response.isAxiosError) {
                return apiIsNotWorking(response);
            }
            if (response.data.body.status === 'success') {
                setProjectDetails(response.data.body.data.projectData);
            }
        });
    };
    return (
        <>
            <div>
                <div className='flex justify-between mb-2'>
                    <h2 className='heading-big dark:text-white'>Admin dashboard</h2>
                    {/* <a href="#" className="small-button items-center xs:w-full py-2 flex h-9">Create</a> */}
                </div>
                <div className='mt-5'>
                    <div className='card p-4 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium'>Projects</h3>
                            <div className='flex items-center'>
                                {/* <SelectDropDown data={ongoingProject} /> */}
                                <FloatingDateTextfield name={'projectDate'} value={null} onChange={() => {}} dateRange={undefined} setDateRange={undefined} />
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center pl-0 pr-4'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    11 active projects
                                </p>
                                <p className='project-details flex items-center px-4'>
                                    <span className='mr-1'>
                                        <HiOutlineUser />
                                    </span>
                                    185 members
                                </p>
                                <p className='project-details flex items-center pr-0 pl-4'>
                                    <span className='mr-1'>
                                        <HiCheck />
                                    </span>
                                    179 Present
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <SearchInput onChange={handleSearchProject} placeholder={'Search a project'} />
                            </div>
                        </div>
                        <div className='flex flex-wrap mt-4 gap_5'>
                            {projectDetails &&
                                projectDetails.map(function ({ project }) {
                                    return (
                                        <>
                                            <div className='project-card bg-veryLightBlue rounded-lg p-5'>
                                                <div className='flex justify-between'>
                                                    <div className='flex'>
                                                        <div className='relative project-logos'>
                                                            <img src='/imgs/png/empcloud-logo.png' alt='EmpCloud' />
                                                        </div>
                                                        <h1 className='pl-2 text-darkTextColor text-lg font-bold'>{project.projectName}</h1>
                                                    </div>
                                                    <p className='text-base text-lightTextColor'>
                                                        Total tasks : <span className='font-bold text-defaultTextColor'>240</span>
                                                    </p>
                                                </div>
                                                <div className='flex items-center mt-4'>
                                                    <HiCheck />
                                                    <p className='text-base text-lightTextColor ml-2'>
                                                        Completed :<span className='font-bold text-defaultTextColor'> 189</span>
                                                    </p>
                                                </div>
                                                <div className='flex items-center mt-1'>
                                                    <HiOutlineClock />
                                                    <p className='text-base text-lightTextColor ml-2'>
                                                        Worked hours :<span className='font-bold text-defaultTextColor'> 293:00 hr </span>
                                                    </p>
                                                </div>
                                                <div className='mt-4 flex justify-between items-end'>
                                                    <div className='w-3/4'>
                                                        <div className='mb-1 text-base font-medium dark:text-white'>75%</div>
                                                        <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                                            <div className='bg-progressiveBar h-2.5 rounded-full w-9/12'></div>
                                                        </div>
                                                    </div>
                                                    <div className='user-img-group'>
                                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                                        <span className='user-img-sm bg-white text-base ml+3 progress-count'>+19</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='card p-4 w-full d-flex'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium'>Tasks</h3>
                            <div className='flex items-center'>
                                <SelectDropDown data={ongoingProject} />
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            <div className='flex'>
                                <p className='project-details flex items-center pl-0 pr-4'>
                                    <span className='mr-1'>
                                        <HiOutlineClipboardCheck />
                                    </span>
                                    11 active projects
                                </p>
                                <p className='project-details flex items-center px-4'>
                                    <span className='mr-1'>
                                        <HiOutlineUser />
                                    </span>
                                    185 members
                                </p>
                                <p className='project-details flex items-center pr-0 pl-4'>
                                    <span className='mr-1'>
                                        <HiCheck />
                                    </span>
                                    179 Present
                                </p>
                            </div>
                            <div className='wrapper relative'>
                                <div className='absolute left-4 bottom-3 cursor-pointer text-placeholderGrey '>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                    </svg>
                                </div>
                                <input
                                    className='md:w-96 border border-white focus:border-lightGrey  transition-all rounded-full pr-5 pl-12 py-3 w-full font-normal bg-[#F8F8F9] text-defaultTextColor outline-none'
                                    type='text'
                                    placeholder='Search Project...'
                                />
                            </div>
                        </div>
                        <div className='flex flex-wrap mt-4 gap_5'>
                            {taskDetails &&
                                taskDetails.map(function (item) {
                                    return (
                                        <>
                                            <div className='project-card bg-veryLightBlue rounded-lg p-5'>
                                                <div className='flex justify-between'>
                                                    <div className='flex'>
                                                        <div className='relative project-logos'>
                                                            <img src='/imgs/png/empcloud-logo.png' alt='EmpCloud' />
                                                        </div>
                                                        <h1 className='pl-2 text-darkTextColor text-lg font-bold'>{item.taskTitle}</h1>
                                                    </div>
                                                    <p className='text-base text-lightTextColor'>
                                                        Total tasks : <span className='font-bold text-defaultTextColor'>240</span>
                                                    </p>
                                                </div>
                                                <div className='flex items-center mt-4'>
                                                    <HiCheck />
                                                    <p className='text-base text-lightTextColor ml-2'>
                                                        Completed :<span className='font-bold text-defaultTextColor'> 189</span>
                                                    </p>
                                                </div>
                                                <div className='flex items-center mt-1'>
                                                    <HiOutlineClock />
                                                    <p className='text-base text-lightTextColor ml-2'>
                                                        Worked hours :<span className='font-bold text-defaultTextColor'> 293:00 hr </span>
                                                    </p>
                                                </div>
                                                <div className='mt-4 flex justify-between items-end'>
                                                    <div className='w-3/4'>
                                                        <div className='mb-1 text-base font-medium dark:text-white'>75%</div>
                                                        <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                                            <div className='bg-progressiveBar h-2.5 rounded-full w-9/12'></div>
                                                        </div>
                                                    </div>
                                                    <div className='user-img-group'>
                                                        <img src='/imgs/user/user1.png' className='user-img-sm' alt='user' />
                                                        <span className='user-img-sm bg-white text-base ml+3 progress-count'>+19</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className='task-col-wrapper mt-5'>
                    <div className='card p-4'>
                        <div className='flex justify-between items-center'>
                            <h3 className='heading-medium'>Employees</h3>
                            <div className='flex items-center'>
                                {/* <HiOutlineSortDescending /> */}
                                <SelectDropDown data={highPerformance} icon={<FiDownload className='h-5 w-5 mr-1' />} />
                                {/* <span className="text-2xl grey-link"><BsThreeDotsVertical/></span> */}
                                <DropDown
                                    data={data}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className=''>
                            <table className='table-style min-w-[1160px] employess-details-table scrollbar:!h-1.5'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Current task</th>
                                        <th>Current activity</th>
                                        <th>Latest screenshots</th>
                                        <th>Performance</th>
                                    </tr>
                                </thead>
                                <tbody className='max-h-[calc(100vh-330px)]'>
                                    {empDetails &&
                                        empDetails.map(function (emp, index) {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <div className='user-profile-img user-img-group items-center cursor-pointer'>
                                                            <div className='relative'>
                                                                <img src='/imgs/user/user1.png' className='rounded-full w-8 h-8' alt='user' />
                                                                <span className='online absolute'></span>
                                                            </div>
                                                            <h5 className='ml-3'>{emp.name}</h5>
                                                        </div>
                                                    </td>
                                                    <td>{emp.department}</td>
                                                    <td>
                                                        UI for website
                                                        <p className='text-lightGrey text-sm'>EMPCloud</p>
                                                    </td>
                                                    <td className='flex'>
                                                        <img src='/imgs/png/xd-logo.png' className='w-5 h-5 mr-1' alt='XD' />
                                                        Adobe XD
                                                    </td>
                                                    <td>
                                                        <div className='employees-screenshots flex'>
                                                            <img src='/imgs/png/screenshot1.png' className='mr-2' alt='screenshot' />
                                                            <img src='/imgs/png/screenshot1.png' className='mr-2' alt='screenshot' />
                                                            <img src='/imgs/png/screenshot1.png' className='' alt='screenshot' />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='mb-1 text-base font-medium dark:text-white'>91%</div>
                                                        <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                                            <div className='bg-progressiveBar h-2.5 rounded-full' style={{ width: '%' }}></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='card p-4'>
                        <div className='flex justify-between items-center  mb-5'>
                            <h3 className='heading-medium'>Live Screen</h3>
                            <div className='flex items-center'>
                                {/* <HiOutlineSortDescending /> */}
                                <SelectDropDown data={lowPerformance} icon={<FiDownload className='h-5 w-5 mr-1' />} />
                                {/* <span className="text-2xl grey-link"><BsThreeDotsVertical/></span> */}
                                <DropDown
                                    data={data}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex task-col-wrapper'>
                            {liveScreen &&
                                liveScreen.map(function (screen, index) {
                                    return (
                                        <div className='max-w-sm mr-5 live-screens' key={index}>
                                            <a href='#'>
                                                <img src='/imgs/png/live-screen1.png' alt='screenshot' />
                                                <div className='w-full h-1.5 bg-offlineColor rounded-full'></div>
                                            </a>
                                            <div className='mt-2'>
                                                <h5 className='text-defaultTextColor text-base'>{screen.name}</h5>
                                                <p className='text-lightGrey text-sm mb-1'>{screen.department}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='card p-4'>
                        <div className='flex justify-between items-start  mb-5'>
                            <h3 className='heading-medium'>Project Performance</h3>
                            <div className='flex items-center'>
                                {/* <HiOutlineSortDescending /> */}
                                <div className='flex items-start'>
                                    <div>
                                        <DashboardDate data={date} />
                                    </div>
                                    <DropDown
                                        data={dropdownData}
                                        defaultValue={''}
                                        onClick={handleSelectStatus}
                                        icon={
                                            <span className='text-2xl grey-link'>
                                                <BsThreeDotsVertical />
                                            </span>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center mb-2 h-fit line-chart-container'>
                            {/* @ts-ignore  */}
                            <LineCharts data={data2} />
                        </div>
                    </div>
                </div>
                <div className='mt-5 flex'>
                    <div className='card p-4 w-1/2 mr-5'>
                        <div className='flex justify-between items-start  mb-5'>
                            <h3 className='heading-medium'>Time Worked</h3>
                            <div className='flex items-start'>
                                <div>
                                    <DashboardDate data={ongoingProject} width='w-52' />
                                </div>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='task-card-wrapper'>
                            {timeWorked &&
                                timeWorked.map(function (timeData, index) {
                                    return (
                                        <div className='flex items-center border-b-2 border-veryveryLightGrey py-2.5' key={index}>
                                            <div className='w-1/5'>
                                                <h5 className='text-defaultTextColor text-base truncate'>{timeData.name}</h5>
                                                <p className='text-lightGrey text-sm mb-1 truncate'>{timeData.department}</p>
                                            </div>
                                            <div className='w-3/5 ml-6'>
                                                <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                                    <div className='bg-progressiveBar h-2.5 rounded-full w-11/12'></div>
                                                </div>
                                            </div>
                                            <div className='text-right text-base font-bold w-1/5'>{timeData.time}</div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className='card p-4 w-1/2'>
                        <div className='flex justify-between items-start  mb-5'>
                            <h3 className='heading-medium'>Activity Rating</h3>
                            <div className='flex items-start'>
                                <div>
                                    <DashboardDate data={ongoingProject} width='w-52' />
                                </div>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='task-card-wrapper'>
                            {activityRating &&
                                activityRating.map(function (activity, index) {
                                    return (
                                        <div className='flex items-center border-b-2 border-veryveryLightGrey py-2.5' key={index}>
                                            <div className='w-1/5'>
                                                <h5 className='text-defaultTextColor text-base truncate'>{activity.name}</h5>
                                                <p className='text-lightGrey text-sm mb-1 truncate'>{activity.department}</p>
                                            </div>
                                            <div className='w-3/5 ml-6'>
                                                <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
                                                    <div className='bg-progressiveBar h-2.5 rounded-full w-11/12'></div>
                                                </div>
                                            </div>
                                            <div className='text-right text-base font-bold w-1/5'>91%</div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                <div className='mt-5 flex'>
                    <div className='card p-4 w-1/2 mr-5'>
                        <div className='flex justify-between items-start  mb-5'>
                            <h3 className='heading-medium'>Application Usage</h3>
                            <div className='flex items-start'>
                                <div>
                                    <DashboardDate data={date} />
                                </div>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className=''>
                            <div className='flex justify-center mb-2'>
                                <DoughtnutCharts data={dataApplication} />
                            </div>
                        </div>
                    </div>
                    <div className='card p-4 w-1/2'>
                        <div className='flex justify-between items-start  mb-5'>
                            <h3 className='heading-medium'>Website Usage</h3>
                            <div className='flex items-start'>
                                <div>
                                    <DashboardDate data={ongoingProject} width='w-52' />
                                </div>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className=''>
                            <div className='flex justify-center mb-2'>
                                <DoughtnutCharts data={dataWebsite} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='card p-4 w-full'>
                        <div className='flex justify-between items-center  mb-5'>
                            <h3 className='heading-medium'>Department Performance</h3>
                            <div className='flex items-start'>
                                <div>
                                    <DashboardDate data={date} />
                                </div>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className=''>
                            <VerticalBarCharts data={[]} />
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='card p-4 w-1/2'>
                        <div className='flex justify-between items-center  mb-5'>
                            <h3 className='heading-medium'>Location Wise Performance</h3>
                            <div className='flex items-start'>
                                <div>
                                    <DashboardDate data={ongoingProject} width='w-52' />
                                </div>
                                <DropDown
                                    data={dropdownData}
                                    defaultValue={''}
                                    onClick={handleSelectStatus}
                                    icon={
                                        <span className='text-2xl grey-link'>
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                />
                            </div>
                        </div>
                        <div className='flex justify-center mb-2'>
                            <DoughtnutCharts data={dataLocation} />
                        </div>
                    </div>
                </div>
            </div>
            <ResponsiveGridLayout
                layouts={getLayouts()}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
                rowHeight={300}
                width={1000}
                onLayoutChange={handleLayoutChange}>
                <GridItemWrapper key='tasks'>
                    <GridItemContent></GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key='projects'>
                    <GridItemContent></GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key='members'>
                    <GridItemContent></GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key='roles'>
                    <GridItemContent>Roles</GridItemContent>
                </GridItemWrapper>
                <GridItemWrapper key='graph'>
                    <GridItemContent></GridItemContent>
                </GridItemWrapper>
            </ResponsiveGridLayout>
        </>
    );
};
export default index;
