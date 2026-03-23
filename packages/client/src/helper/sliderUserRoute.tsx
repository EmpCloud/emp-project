import { AiTwotoneSetting } from 'react-icons/ai';
import { BsFillBagCheckFill } from 'react-icons/bs';
import { FaUserLock, FaUsers } from 'react-icons/fa';
import { MdTask } from 'react-icons/md';

export const logoSelectColorUser = '#473DED';

export const userSize = 21;

export const userRoutes = [
    [
        {
            pathContains: [ '/w-m/projects/all'],
            name: 'Projects',
            logo: <BsFillBagCheckFill size={userSize} />,
            selectedLogo: <BsFillBagCheckFill color={logoSelectColorUser} size={userSize} />,
            path: [
                {
                    name: 'All Projects',
                    path: '/w-m/projects/all',
                },
                // {
                //     name: 'Create Project',
                //     path: '/w-m/projects/create',
                // },
            ],
        },
    ],
    [
        {
            pathContains: ['/w-m/tasks/all', '/w-m/tasks/create'],
            name: 'Task Management',
            logo: <MdTask size={userSize} />,
            selectedLogo: <MdTask color={logoSelectColorUser} size={userSize} />,
            path: [
                // {
                //     name: 'Create Task',
                //     path: '/w-m/tasks/create',
                // },
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
];