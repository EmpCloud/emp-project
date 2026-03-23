import Cookies from 'js-cookie';
import { IBoard } from '../Interfaces/Kanban';
import { getAllProject, getAllTask, getAllUserTasks, getTaskStatus, searchTask ,getAllDummyTask} from './api/get';
const LocalStorageKeyName = 'kanban-boards';
//Data Layer
export class BoardAPI {
    // async fetchBoardList(ProjectId,members) {
    //     const apiData = getAllTask();
    //     const getTaskStatuss = getTaskStatus();
    //     let getProjectId = getAllProject();
    //     let BoardList = [];
    //     let limit = 100;
    //     let taskStatusList = [];
    //     let statusOfResponse = null;
    //     let valueOfAssignedMembers = [{"id": ""}];
            
            
    //     if(members?.length>0){
    //         valueOfAssignedMembers = members;
    //     }

    //     const apiProjectIdResponse = await getProjectId;
    //     let Ids = apiProjectIdResponse?.data?.body?.data?.project[0]?._id;
    //     if (ProjectId === 'all') {
    //         const apiResponse = await apiData; 
    //         limit = apiResponse?.data?.body?.data?.taskCount;
           
    //         const actualApiResponses = await getAllDummyTask({standAloneTask:false,assignedTo:valueOfAssignedMembers});
    //         BoardList = actualApiResponses?.data?.body?.data?.resp;
    //         console.log(actualApiResponses,'actualApiResponses');
            

    //         statusOfResponse = actualApiResponses?.data?.statusCode;
    //     } else if (ProjectId !== 'all' && ProjectId !== '' && ProjectId !== null) {
    //         // let valueOfAssignedMembers = [{"id": ""}];
    //         // if(members?.length>0){
    //         //     valueOfAssignedMembers = members;
    //         // }

    //         const actualApiResponse = await getAllDummyTask({projectId:ProjectId ? ProjectId : Ids,assignedTo:valueOfAssignedMembers}); 
    //         console.log(actualApiResponse,'actualApiResponses When Project!!!');

    //         BoardList = actualApiResponse?.data?.body?.data?.resp;

    //         statusOfResponse = actualApiResponse?.data?.statusCode;
    //     } else if (ProjectId === null || ProjectId === '' || ProjectId !== 'all') {
    //         // let valueOfAssignedMembers = [{"id": ""}];
    //         // if(members?.length>0){
    //         //     valueOfAssignedMembers = members;
    //         // }

    //         const apiResponse = await apiData; 
    //         limit = apiResponse?.data?.body?.data?.taskCount;
    //         const actualApiResponses = await getAllDummyTask({standAloneTask:true,assignedTo:valueOfAssignedMembers});
    //         BoardList = actualApiResponses?.data?.body?.data?.resp;
    //         console.log(actualApiResponses,'actualApiResponses When True');

            
    //     } 
    //     const taskStatusApiResponse = await getTaskStatuss; 
    //     taskStatusList = taskStatusApiResponse?.data?.body?.data?.data;

    //     const organizedTasksByStatus = {};
    //     taskStatusList?.forEach(statusItem => {
    //         statusItem.tasks = [];
    //         organizedTasksByStatus[statusItem.taskStatus] = statusItem;
    //     });

    //     BoardList?.forEach(task => {
    //         const { taskStatus } = task;
    //         if (organizedTasksByStatus[taskStatus]) {
    //             organizedTasksByStatus[taskStatus].tasks.push(task);
    //         }
    //     });

    //     const updatedTaskStatusList = Object.values(organizedTasksByStatus);

    //     updateLocalStorageBoards(updatedTaskStatusList);

    //     return updatedTaskStatusList;
       
    // }

    async fetchUpdatedBoardList(data) {
        const getTaskStatuss = getTaskStatus();
        let BoardList = [];
        let taskStatusList = [];
            if(data!==null&&data!==undefined&&data!==''){
            const actualApiResponses = await getAllDummyTask(data);
            BoardList = actualApiResponses?.data?.body?.data?.resp;
            }
            
        
        const taskStatusApiResponse = await getTaskStatuss; 
        taskStatusList = taskStatusApiResponse?.data?.body?.data?.data;

        const organizedTasksByStatus = {};
        taskStatusList?.forEach(statusItem => {
            statusItem.tasks = [];
            organizedTasksByStatus[statusItem.taskStatus] = statusItem;
        });

        BoardList?.forEach(task => {
            const { taskStatus } = task;
            if (organizedTasksByStatus[taskStatus]) {
                organizedTasksByStatus[taskStatus].tasks.push(task);
            }
        });

        const updatedTaskStatusList = Object.values(organizedTasksByStatus);

        updateLocalStorageBoards(updatedTaskStatusList);

        return updatedTaskStatusList;
       
    }

    async fetchBoardListByTask(value) {
        const apiData = searchTask('&keyword=' + value);
        const getTaskStatuss = getTaskStatus();
        let BoardList = [];
        let taskStatusList = [];

        const taskStatusApiResponse = await getTaskStatuss; 
        taskStatusList = taskStatusApiResponse?.data?.body?.data?.data;

        const actualApiResponse = await apiData;
        BoardList = actualApiResponse?.data?.body?.data?.resp;
        const statusOfResponse = actualApiResponse?.data?.statusCode;

        const organizedTasksByStatus = {};
        taskStatusList?.forEach(statusItem => {
            statusItem.tasks = [];
            organizedTasksByStatus[statusItem.taskStatus] = statusItem;
        });

        BoardList?.forEach(task => {
            const { taskStatus } = task;
            if (organizedTasksByStatus[taskStatus]) {
                organizedTasksByStatus[taskStatus].tasks.push(task);
            }
        });

        const updatedTaskStatusList = Object.values(organizedTasksByStatus);

    
            updateLocalStorageBoards(updatedTaskStatusList);

            return updatedTaskStatusList;
    

    }
    async fetchBoardListBymemberId(value) {
        // console.log(value , 'MemberId');
        
        
        // const apiData = value
        // const getTaskStatuss = getTaskStatus();
        // let BoardList = [];
        // let taskStatusList = [];

        // const taskStatusApiResponse = await getTaskStatuss; // Wait for the first API call
        // taskStatusList = taskStatusApiResponse?.data?.body?.data?.data;

        // const actualApiResponse =  apiData; // Wait for the second API call
        // BoardList = actualApiResponse?.data?.body?.data?.tasks;
        // const statusOfResponse = actualApiResponse?.data?.statusCode;

        // const organizedTasksByStatus = {};
        // taskStatusList?.forEach(statusItem => {
        //     statusItem.tasks = [];
        //     organizedTasksByStatus[statusItem.taskStatus] = statusItem;
        // });

        // BoardList?.forEach(task => {
        //     const { taskStatus } = task;
        //     if (organizedTasksByStatus[taskStatus]) {
        //         organizedTasksByStatus[taskStatus].tasks.push(task);
        //     }
        // });

        // let updatedTaskStatusList = Object.values(organizedTasksByStatus);
        // // if (statusOfResponse === 200) {
        //     updateLocalStorageBoards(updatedTaskStatusList);
            
        //     return updatedTaskStatusList;


        // } else {
        //     updateLocalStorageBoards([]);

        //     return [];
        // }
    }
}


export async function fetchBoardList(id,value): Promise<IBoard[]> {
    const api = new BoardAPI();
    return api.fetchBoardList(id,value);
}
export function updateLocalStorageBoards(boards) {
    localStorage.setItem(LocalStorageKeyName, JSON.stringify(boards));
}
export async function fetchUpdatedBoardList(value): Promise<IBoard[]> {
    const api = new BoardAPI();
    return api.fetchUpdatedBoardList(value);
}

export async function fetchBoardListByTaskName(value): Promise<IBoard[]> {
    const api = new BoardAPI();
    return api.fetchBoardListByTask(value);
}

export async function fetchBoardListByMemberId(value): Promise<IBoard[]> {
    const api = new BoardAPI();
    return api.fetchBoardListBymemberId(value);
}