/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import SelectDropDown from './SelectDropDown';
import ProjectAndTaskDashboard from './projectAndTaskDashboard';
import AllDashboard from './allDashboard';
import TaskandMemberDashboard from './taskandMemberDashboard';
import Cookies from 'js-cookie';
import { createDashboardConfig } from '../api/post';
import { getDashboardConfig } from '../api/get';
import { updateDashboardConfig } from '../api/put';
import toast from '../../../../components/Toster/index';
import MemberManagement from './memberManagement';
import SubtaskManagement from './subtaskManagement';
import { MdHourglassTop, MdPendingActions, MdWork } from 'react-icons/md';
import { BiTask } from 'react-icons/bi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { GiProgression } from 'react-icons/gi';
import { FaTasks } from 'react-icons/fa';
import { fetchProfile } from '@WORKFORCE_MODULES/admin/api/get';
import UserInfo from '@COMPONENTS/UserInfoModal/UserInfo.jsx';

export const index = ({ startLoading, stopLoading }) => {
    const [selectDashboardType, setSelectDashboardType] = useState("1");
    const [clickConfig, setClickConfig] = useState(false);
    const [dashboardConfigDetails, setDashboardConfigDetails] = useState([]);
    const [dashboardConfigDropdown, setDashboardConfigDropdown] = useState([]);
    const [adminDetails, setAdminDetails] = useState([]);
    const [sidebar, setSidebar] = useState(false);
    const handleChange = event => {
        setDashboardConfigDetails(dashboardConfigDetails.map(item => (item.name === event.name ? { ...item, value: item.value === 1 ? 0 : 1 } : item)));
        let data = (dashboardConfigDetails.map(item => (item.name === event.name ? { ...item, value: item.value === 1 ? 0 : 1 } : item)));
        handleUpdateDashboardConfig(selectDashboardType, data);

    };

    // sidebar hadling 
    useEffect(() => {
        const checkSidebarState = () => {
            const sidebarState = document.body.classList.contains('open-sidebar');
            setSidebar(sidebarState);
        };

        // Check initial state
        checkSidebarState();

        // Set up a MutationObserver to check for class changes
        const observer = new MutationObserver(checkSidebarState);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Clean up observer on unmount
        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        handleGetDashboard(selectDashboardType);
    }, []);

    useEffect(() => {
        fetchProfile().then(response => {
            if (response.data?.body.status === 'success') {
                setAdminDetails(response.data.body.data);
            }
        });
    }, []);
    const handleGetDashboard = selectDashboardType => {
        getDashboardConfig(selectDashboardType).then(response => {
            if (response.data?.statusCode == 200) {
                let dummyResponse = response.data.body.data.dashboardConfigData.filter((d) => { return d.dashboardConfig_id === selectDashboardType })
                let dashboardConfig = dummyResponse[0].dashboardConfig
                //     dummyResponse = {
                // project_grid_XL: 1,
                // project_grid_Large: 1,
                // project_grid_small: 1,
                // project_status: 1,
                // project_task: 1,
                // project_budget_grid: 1,
                // project_subtask: 1,
                // project_by_status: 1,
                // project_recent: 1,
                // project_member_grid: 1,
                // project_progress: 1,
                // task_grid_XL: 1,
                // task_grid_Large: 1,
                // task_grid_small: 1,
                // task_status: 1,
                // task_subtasks: 1,
                // task_priority: 1,
                // task_recent: 1,
                // task_member_grid: 1,
                // task_progress: 1,
                // task_type: 1,
                // task_category: 1,
                // subtask_grid_XL: 1,
                // subtask_grid_Large: 1,
                // subtask_grid_small: 1,
                // subtask_status: 1,
                // subtask_recent: 1,
                //subtask_member_grid: 1,
                // subtask_progress: 1,
                // subtask_priority: 1,
                // subtask_type: 1,
                // subtask_category: 1,
                // status: 1,
                // project_roles_grid: 1,
                // task_roles_grid: 1,
                // subtask_roles_grid: 1,
                // member_roles_grid: 1,
                // custom_roles_grid: 1,
                // roles_progress_grid: 1,
                // member_grid_XL: 1,
                // member_grid_Large: 1,
                // roles_grid: 1,
                // member_grid_small: 1,
                // roles_member_grid: 1,
                // project_members_grid: 1,
                // task_members_grid: 1,
                // subtask_members_grid: 1,
                // role_wise_members: 1,
                // permission_members_grid: 1,
                // members_progress_grid: 1,
                // permission_grid: 1,
                // project_permission_grid: 1,
                // task_permission_grid: 1,
                // subtask_permission_grid: 1,
                // member_permission_grid: 1,
                // custom_permission_grid: 1,
                // permission_progress_grid: 1,
                // activity_grid: 1,
                // project_Activity_grid: 1,
                // task_activity_grid: 1,
                // subtask_activity_grid: 1,
                // activity_progress_grid: 1,
                // activity_Main_categories_grid: 1,
                // activity_filter: 1,
                // comments_grid: 1,
                // project_comments_grid: 1,
                // task_comments_grid: 1,
                // subtask_comments_grid: 1,
                // member_comments_grid: 1,
                // comments_progress_grid: 1,
                // files_grid: 1,
                // categories_files: 1,
                // project_files_grid: 1,
                // task_files_grid: 1,
                // subtask_files_grid: 1,
                // links_grid: 1,
                // project_links_grid: 1,
                // task_links_grid: 1,
                // subtask_links_grid: 1,
                // members_links_grid: 1,
                
                if (dashboardConfig != null) {
                    for (const [key, value] of Object.entries(dashboardConfig)) {
                        setDashboardConfigDropdown(oldArray => [
                            ...oldArray,
                            {
                                name: key,
                                value: value,
                                onChange: handleChange,
                            },
                        ]);
                        setDashboardConfigDetails(oldArray => [
                            ...oldArray,
                            {
                                name: key,
                                value: value,
                                onChange: handleChange,
                            },
                        ]);
                    }
                }
            }
        });
    };

    const handleUpdateDashboardConfig = (id, data) => {
        let obj = {};
        data.map((d) => {
            obj[d.name] = d.value;
            return obj;
        })
        updateDashboardConfig(id, obj)
            .then(function (response) {
                if (response.data?.statusCode == 200) {
                    setDashboardConfigDropdown([]);
                    setDashboardConfigDetails([]);
                    handleGetDashboard(selectDashboardType)
                } 
            })
            .catch(function (result) {
                toast({
                    type: 'error',
                    message: result ? result.data.body.message : 'Something went wrong, Try again !',
                });
            });
    };

    useEffect(() => {
        // document.querySelector('body').classList.add('bodyBg');
        setDashboardConfigDropdown(
            dashboardConfigDetails?.map(d => {
                return {
                    name: d.name,
                    value: d.value,
                    onChange: handleChange,
                };
            })
        );

        // =============================================
        let api_data = dashboardConfigDropdown.reduce((obj, item) => {
            obj[item.name] = item.value;
            return obj;
        }, {});


        // =============================================
    }, [selectDashboardType, dashboardConfigDetails, clickConfig]);
    const dashboardType = [
        {
            name: 'Project Management',
            value: "1",
            onChange: e => {
                setSelectDashboardType(e.value);
                setDashboardConfigDetails([]);
                handleGetDashboard(e.value);
            },
        },
        {
            name: 'Task Mangement',
            value: "2",
            onChange: e => {
                setSelectDashboardType(e.value);
                setDashboardConfigDetails([]);
                handleGetDashboard(e.value);
            },
        },
        {
            name: 'Sub Task Management',
            value: "3",
            onChange: e => {
                setSelectDashboardType(e.value);
                setDashboardConfigDetails([]);
                handleGetDashboard(e.value);
            },
        },
        {
            name: 'Permissions Management',
            value: "4",
            onChange: e => {
                setSelectDashboardType(e.value);
                setDashboardConfigDetails([]);
                handleGetDashboard(e.value);
            },
        },
        {
            name: 'Activity Overview',
            value: "5",
            onChange: e => {
                setSelectDashboardType(e.value);
                setDashboardConfigDetails([]);
                handleGetDashboard(e.value);
            },
        },
    ];
    return (
        <>
        {/* <UserInfo /> */}
            <div className=''>
                <div className={`static md:flex justify-between items-center md:sticky top-[54px] md:-mt-8 py-4 px-2 z-50 bodyBg`}>
                    <div>
                        <h2 className='text-2xl text-black dark:text-[#fff] text-center font-medium'>Admin Dashboard</h2>
                    </div>
                    <div className='flex flex-row flex-wrap sm:flex-nowrap gap-4 relative'>
                        <SelectDropDown
                            paddingDash={"py-2"}
                            width={'w-full z-[45]'}
                            data={dashboardType}
                            maxWidth={undefined}
                            dropdownData={undefined}
                            displayLabel={selectDashboardType !== null && selectDashboardType !== undefined ? dashboardType.find(item => item.value == selectDashboardType)?.name : 'Select Dashboard'}
                            item={false}
                        />
                        <SelectDropDown paddingDash={"py-2"} width={'w-full'} dropdownData={'dropdownData'} data={dashboardConfigDropdown} displayLabel={'Select Dashboard Config'} maxWidth={undefined} item={true} />
                    </div>
                </div>
                {/* data progress report*/}
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-7 md:grid-rows-2 lg:grid-rows-1 gap-4 rounded-xl px-2 text-white">
                    <div className="progress-container col-span-1 md:col-span-1 dark:text-[#fff]  bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FF7B02] to-[#FFCB52]  items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Total projects</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <MdWork className="" />
                            <p className="font-bold">{adminDetails ? adminDetails.totalProject : ""}</p>
                        </div>
                    </div>
                    <div className="progress-container col-span-1 md:col-span-1 dark:text-[#fff] bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#5C27FE] to-[#C165DD]  items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Total tasks</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <BiTask />
                            <p className="font-bold">{adminDetails ? adminDetails.totalTask : ""}</p>
                        </div>
                    </div>
                    <div className="progress-container col-span-1 md:col-span-1 dark:text-[#fff] bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1153FC] to-[#5581F1] items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Ongoing tasks</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <FaTasks />
                            <p className="font-bold">{adminDetails ? adminDetails.ongoingTasks : ""}</p>
                        </div>
                    </div>
                    <div className="progress-container col-span-1 md:col-span-1 dark:text-[#fff] bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FC76B3] to-[#FACD68] items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Pending tasks</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <MdPendingActions />
                            <p className="font-bold">{adminDetails ? adminDetails.pendingTasks : ""}</p>
                        </div>
                    </div>
                    <div className="progress-container col-span-1 md:col-span-1 dark:text-[#fff] bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#FFB533] to-[#FFE324]  items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Onhold tasks</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <MdHourglassTop />
                            <p className="font-bold">{adminDetails ? adminDetails.onHoldTasks : ""}</p>
                        </div>
                    </div>
                    <div className="progress-container col-span-1 md:col-span-2 lg:col-span-1 dark:text-[#fff] bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#B588F7] to-[#1DE5E2]  items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Completed tasks</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <AiOutlineFileDone />
                            <p className="font-bold">{adminDetails ? adminDetails.completedTasks : ""}</p>
                        </div>
                    </div>
                    <div className="progress-container col-span-2 md:col-span-3 lg:col-span-1 dark:text-[#fff] bg-white px-4 lg:px-0 text-center w-full flex flex-col justify-center gap-1  bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#08C792] to-[#2AFEB7] items-center py-4 rounded-lg shadow-lg shadow-grey-300">
                        <h2 className="text-base font-semibold">Progress</h2>
                        <div className="flex justify-center items-center text-xl gap-2">
                            <GiProgression />
                            <p className="font-bold">{adminDetails.progress === null ? "0" : adminDetails.progress}%</p>
                        </div>
                    </div>
                </div>


                <div className=''>
                    {selectDashboardType == "1" && (
                        <ProjectAndTaskDashboard
                            {...{
                                selectDashboardType,
                                clickConfig,
                                setClickConfig,
                                setDashboardConfigDetails,
                                dashboardConfigDetails,
                            }}
                        />)}
                </div>
                {selectDashboardType == "2" && (
                    <TaskandMemberDashboard
                        {...{
                            clickConfig,
                            setClickConfig,
                            setDashboardConfigDetails,
                            dashboardConfigDetails,
                        }}
                    />
                )}
                {selectDashboardType == "3" && (
                    <SubtaskManagement
                        {...{
                            clickConfig,
                            setClickConfig,
                            setDashboardConfigDetails,
                            dashboardConfigDetails,
                        }}
                    />
                )}
                {selectDashboardType == "4" && (
                    <MemberManagement
                        {...{
                            clickConfig,
                            setClickConfig,
                            setDashboardConfigDetails,
                            dashboardConfigDetails,
                        }}
                    />
                )}
                {selectDashboardType == "5" && (
                    <AllDashboard
                        {...{
                            clickConfig,
                            setClickConfig,
                            setDashboardConfigDetails,
                            dashboardConfigDetails,
                        }}
                    />
                )}
            </div>
        </>
    );
};
export default index;
