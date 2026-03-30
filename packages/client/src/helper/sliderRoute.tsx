import { AiTwotoneSetting } from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { FaUserLock, FaUsers, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { HiPresentationChartLine } from 'react-icons/hi';
import { MdTask } from 'react-icons/md';

export const logoSelectColor = '#3d83ed';

export const size = 16;

export const routes1 = [
    [
        {
            pathContains: ['/w-m/projects/create', '/w-m/projects/all'],
            name: 'Projects',
            logo: <HiPresentationChartLine size={size} />,
            selectedLogo: <BsFillBagCheckFill color={logoSelectColor} size={size} />,
            path: [
                {
                    name: 'All Projects',
                    path: '/w-m/projects/all',
                },
                {
                    name: 'Create Project',
                    path: '/w-m/projects/create',
                },
            ],
        },
    ],
    [
        {
            pathContains: ['/w-m/tasks/all', '/w-m/tasks/create', '/w-m/tasks/review'],
            name: 'Task Management',
            logo: <MdTask size={size} />,
            selectedLogo: <MdTask color={logoSelectColor} size={size} />,
            path: [
                {
                    name: 'Create Task',
                    path: '/w-m/tasks/create',
                },
                {
                    name: 'All Tasks',
                    path: '/w-m/tasks/all',
                },
                {
                    name: 'Workflow Boards',
                    path: '/w-m/tasks/review',
                },
            ],
        },
    ],
    [
        {
            pathContains: ['/w-m/config/roles', '/w-m/config/task', '/w-m/config/shortcuts'],
            name: 'Task Config',
            logo: <AiTwotoneSetting size={size} />,
            selectedLogo: <AiTwotoneSetting color={logoSelectColor} size={size} />,
            path: [
                {
                    name: 'Task',
                    path: '/w-m/config/task',
                },
                // {
                //     name: 'ShortCuts',
                //     path: '/w-m/config/shortcuts',
                // },
            ],
        },
    ],
    [
        {
            pathContains: ['/w-m/timeline/global', '/w-m/timeline/projects', '/w-m/timeline/user'],
            name: 'TimeLine',
            logo: <FaChartBar size={size} />,
            selectedLogo: <FaChartBar color={logoSelectColor} size={size} />,
            path: [
                {
                    name: 'Global',
                    path: '/w-m/timeline/global',
                },
                // {
                //     name: 'Projects',
                //     path: '/w-m/timeline/projects',
                // },
                // {
                //     name: 'User',
                //     path: '/w-m/timeline/user',
                // },
            ],
        },
    ],
];
export const routes3 = [
    [
        {
            pathContains: ['/w-m/reports/projects', '/w-m/reports/auto-email',],
            name: 'Reports',
            logo: <FaFileAlt size={size} />,
            selectedLogo: <FaFileAlt color={logoSelectColor} size={size} />,
            path: [
                {
                    name: 'Project Wise Reports',
                    path: '/w-m/reports/projects',
                },
                //  {
                //   name: "Auto Email Reports",
                //   path: "/w-m/reports/auto-email",
                // },
            ],
        },
    ],
];
export const routes2 = [
   
    // [
    //     {
    //         pathContains: ['/w-m/permissions/all'],
    //         name: 'Permission',
    //         logo: <FaUserLock size={size} />,
    //         selectedLogo: <FaUserLock color={logoSelectColor} size={size} />,
    //         path: [
    //             {
    //                 name: 'All',
    //                 path: '/w-m/permissions/all',
    //             },
    //         ],
    //     },
    // ],
    [
        {
            pathContains: ['/w-m/members/assign-role', '/w-m/members/all', '/w-m/members/timesheet', '/w-m/members/groups'],
            name: 'Members',
            logo: <FaUsers size={size} />,
            selectedLogo: <FaUsers color={logoSelectColor} size={size} />,
            path: [
                {
                    name: 'All Users',
                    path: '/w-m/members/all',
                },
                //  {
                //   name: "Clients",
                //   path: "/w-m/members/client",
                // },
                {
                    name: 'Roles',
                    path: '/w-m/members/roles',
                },
                {
                    name: 'Groups',
                    path: '/w-m/members/groups',
                },
                {
                    name: 'Restore Users',
                    path: '/w-m/members/restoreUsers',
                },
                {
                    name: 'Suspended Users',
                    path: '/w-m/members/suspendedusers',
                },
            ],
        },
    ],
];