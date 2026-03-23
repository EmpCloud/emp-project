import { useRouter } from 'next/router';
import React from 'react';
export function index() {
    const router = useRouter();
    const FeatcherList = [
        //reset data
        { code: 80, featchName: 'Reset All Data', shortCutType: 'global', value: 'ctrl+o', fixed: true, isEditable: true },
        //dashboard
        { code: 90, featchName: 'View Dashboard', shortCutType: 'global', value: 'ctrl+d', fixed: true, isEditable: true },
        //project
        { code: 100, featchName: 'View All Project', shortCutType: 'global', value: 'ctrl+p', fixed: true, isEditable: true },
        { code: 101, featchName: 'Create Project Page', shortCutType: 'global', value: 'ctrl+c+p', fixed: true, isEditable: true },
        { code: 102, featchName: 'Create Project Modal', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 103, featchName: 'View Project Filter', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 104, featchName: 'View Project Table Filter', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 105, featchName: 'Delete All Project', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 106, featchName: 'Download All Project', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        //task
        { code: 200, featchName: 'View All Task', shortCutType: 'global', value: 'ctrl+t', fixed: true, isEditable: true },
        { code: 201, featchName: 'Create Task Page', shortCutType: 'global', value: 'ctrl+c+t', fixed: true, isEditable: true },
        { code: 202, featchName: 'Create Task Modal', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 203, featchName: 'Review  Task', shortCutType: 'global', value: 'ctrl+k', fixed: true, isEditable: true },
        { code: 204, featchName: 'View Task Filter', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 205, featchName: 'View Task Table Filter', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 206, featchName: 'Delete All Task', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 207, featchName: 'Download All Task', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        //member
        { code: 300, featchName: 'View All Member', shortCutType: 'global', value: 'ctrl+m', fixed: true, isEditable: true },
        { code: 301, featchName: 'Add Single Member', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 302, featchName: 'Add bulk Member', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 303, featchName: 'View Member Filter', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 304, featchName: 'View Member Table Filter', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 305, featchName: 'Delete All Member', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        { code: 306, featchName: 'Download All Member', shortCutType: 'page', value: 'ctrl+shift', fixed: true, isEditable: true },
        //role
        { code: 400, featchName: 'View All Roles', shortCutType: 'global', value: 'ctrl+r', fixed: true, isEditable: true },
        { code: 401, featchName: 'Delete All Roles', shortCutType: 'global', value: 'ctrl+d+r', fixed: true, isEditable: true },
        //config
        { code: 500, featchName: 'View Task Configuration', shortCutType: 'global', value: 'ctrl+c', fixed: true, isEditable: true },
        { code: 501, featchName: 'Download Task Catagory Configuration', shortCutType: 'global', value: 'ctrl+c+t', fixed: true, isEditable: true },
        { code: 502, featchName: 'Delete All Task Catagory Configuration', shortCutType: 'subPage', value: 'shift+ alt', fixed: true, isEditable: true },
        { code: 503, featchName: 'Download Task Status Configuration', shortCutType: 'global', value: 'ctrl+d+c', fixed: true, isEditable: true },
        { code: 504, featchName: 'Delete All  Task Status Configuration', shortCutType: 'subPage', value: 'shift+ alt', fixed: true, isEditable: true },
        { code: 505, featchName: 'Download Task type Configuration', shortCutType: 'global', value: 'ctrl+d+c', fixed: true, isEditable: true },
        { code: 506, featchName: 'Delete All  Task type Configuration', shortCutType: 'subPage', value: 'shift+ alt', fixed: true, isEditable: true },
        { code: 507, featchName: 'Download Task Stages Configuration', shortCutType: 'global', value: 'ctrl+t+s', fixed: true, isEditable: true },
        { code: 508, featchName: 'Delete All  Task Stages Configuration', shortCutType: 'subPage', value: 'shift+ alt', fixed: true, isEditable: true },
    ];
    const keydownHandler = e => {
        e.preventDefault();
        e.stopPropagation();

        if (e.keyCode === 84 && e.shiftKey && e.ctrlKey) return createTaskModal();
        if (e.keyCode === 84 && e.ctrlKey) return createTask();
        if (e.shiftKey && e.ctrlKey) showMessage();
    };
    const showMessage = () => {
        // alert("hi  neetu")
    };
    const createTask = () => {
        alert('createTask');
        router('/w-m/tasks/create');
    };
    const createTaskModal = () => {
        alert('createTask by modal');
        router.push('/w-m/tasks/all');
    };
    React.useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keypress', keydownHandler);
        document.addEventListener('keyup', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
            document.removeEventListener('keypress', keydownHandler);
            document.removeEventListener('keyup', keydownHandler);
        };
    }, []);
}
export default index;
