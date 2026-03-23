import { useRouter } from 'next/router';
import React from 'react';
export function index() {
    const FeatcherList = [
        //reset data
        { code: 80, featchName: 'Reset All Data', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        //dashboard
        { code: 90, featchName: 'View Dashboard', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        //project
        { code: 100, featchName: 'View All Project', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 101, featchName: 'Create Project Page', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 102, featchName: 'Create Project Modal', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 103, featchName: 'View Project Filter', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 104, featchName: 'View Project Table Filter', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 105, featchName: 'Delete All Project', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 106, featchName: 'Download All Project', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        //task
        { code: 200, featchName: 'View All Task', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 201, featchName: 'Create Task Page', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 202, featchName: 'Create Task Modal', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 203, featchName: 'Review  Task', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 204, featchName: 'View Task Filter', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 205, featchName: 'View Task Table Filter', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 206, featchName: 'Delete All Task', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 207, featchName: 'Download All Task', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        //member
        { code: 300, featchName: 'View All Member', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 301, featchName: 'Add Single Member', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 302, featchName: 'Add bulk Member', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 303, featchName: 'View Member Filter', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 304, featchName: 'View Member Table Filter', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 305, featchName: 'Delete All Member', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 306, featchName: 'Download All Member', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        //role
        { code: 400, featchName: 'View All Roles', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 401, featchName: 'Delete All Roles', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        //config
        { code: 500, featchName: 'View Task Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 501, featchName: 'Download Task Catagory Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 502, featchName: 'Delete All Task Catagory Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 503, featchName: 'Download Task Status Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 504, featchName: 'Delete All  Task Status Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 505, featchName: 'Download Task type Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 506, featchName: 'Delete All  Task type Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 507, featchName: 'Download Task Stages Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
        { code: 508, featchName: 'Delete All  Task Stages Configuration', shortCutType: 'global', value: null, fixed: true, isEditable: true },
    ];
    const dummyData = [
        {
            id: 1,
            featchName: 'Create Project',
            shortCutType: 'global',
            deafult: true,
            fixed: true,
            isEdited: false,
            value: 'Ctrl + P',
        },
        {
            id: 1,
            code: 200,
            featchName: 'Create Task',
            shortCutType: 'global',
            deafult: true,
            value: 'Ctrl + T',
        },
    ];
    const router = useRouter();
    const showMessage = () => {
        alert('hi  neetu');
    };
    const projectCreate = () => {
        router.push('/w-m/projects/create');
    };
    ('cntrl + m'); // global
    ('cntrl + shift + m'); //page wise
    ('cntrl + alt + m'); //sub page wise
    const getProject = () => {
        router.push('/w-m/projects/all');
    };
    const keydownHandler = e => {
        if (e.keyCode === 77 && e.ctrlKey) projectCreate();
    };
    React.useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        };
    }, []);
}
