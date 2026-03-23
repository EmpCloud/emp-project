import swaggerAutogen from 'swagger-autogen';
const swagger = swaggerAutogen();
import config from 'config';

const doc = {
    info: {
        version: '1.0', // by default: "1.0.0"
        title: 'EmpMonitor Task Management APIs', // by default: "REST API"
        description: 'Documentation', // by default: ""
    },
    host: config.get('swagger_host_url'), // by default: "localhost:3000"
    basePath: '/', // by default: "/"
    schemes: ['http', 'https'], // by default: ['http']
    consumes: ['application/json', 'application/x-www-form-urlencoded'],
    produces: ['application/json'],
    tags: [
        // by default: empty Array
        {
            name: 'Task', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'Task comment',
            description: 'Endpoints',
        },
        {
            name: 'Task Type', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'Task Status', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'Task Stage', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'Task Category', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'SubTask', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'SubTask comment',
            description: 'Endpoints',
        },
        {
            name: 'subTaskType', // Tag name
            description: 'Endpoints', // Tag description
        },
        {
            name: 'Sub Task Status', // Tag name
            description: 'Endpoints', // Tag description
        },
        
    ],
    securityDefinitions: {
        AccessToken: {
            type: 'apiKey',
            in: 'header',
            name: 'x-access-token',
            description: 'Please provide the valid access token, if you dont have please login and get the token as response!',
        },
    }, // by default: empty object
    definitions: {
        CreateTask: {
            projectId: '62fe6ea87ab5913e391f055c',
            taskTitle: "Create API's for project",
            stageName: 'development',
            taskType: 'Development',
            taskStatus: 'To do',
            taskDetails: 'some description  about task',
            dueDate: '2022-07-23',
            estimationDate: '2023-01-23',
            estimationTime: '05:00',
            actualHours: '02:30',
            reason: 'I am working on another task',
            completedDate:'2022-07-23',
            assignedTo: [
                {
                    id: 'user object id from users collection',
                },
                {
                    id: 'user object id from users collection',
                },
            ],
            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
            priority: 'Medium',
        },

        UpdateTask: {
            taskDetails: 'some updation in task details',
            taskStatus: 'In Progress',
            priority: 'High',
            actualHours: '02:00',
            reason: 'I am working on another task',
            completedDate:'2022-07-23',
        },
        deleteMultipleTask: {
            TaskId: [
                {
                    id: 'Task object id from Task collection',
                },
                {
                    id: 'Task object id from Task collection',
                },
            ],
        },
        FilterByKeyTask: {
            projectName: 'EMPMonitor',
            projectId: '63be5e886dbc758a2fe4c965',
            taskTitle: 'Create API for project',
            taskCreator: '63be5e886dbc758a2fe4c965',
            taskStatus: 'To do',
            assignedTo: [{ id: '6434fe9b125098fa361ef3cb' }],
            standAloneTask: false,
            taskCategory: 'Bug',
            taskStage: 'Default',
            taskType: 'Default',
            createdAt: {
                startDate: '2023-01-13',
                endDate: '2023-01-14',
            },
            updatedAt: {
                startDate: '2023-01-13',
                endDate: '2023-01-14',
            },
        },

        CreateTaskType: {
            taskType: 'New feature',
        },

        UpdateTaskType: {
            taskType: 'Bug Fix',
        },

        CreateTaskStatus: {
            taskStatus: 'To do',
        },

        UpdateTaskStatus: {
            taskStatus: 'Done',
        },

        CreateTaskStage: {
            taskStage: 'development',
        },

        UpdateTaskStage: {
            taskStage: 'development',
        },
        CreateTaskCategory: {
            taskCategory: 'Bugfix',
        },

        UpdateTaskCategory: {
            taskCategory: 'Bugfix',
        },
        CommentTask: {
            comment: 'some comment for the task',
            userName: ['@Jagadeesha_Globussoft',"@abcxyz_globussoft"]
        },
        alluserIds:[
            {
            userId:'user object id from users collection'
            },
            {
                userId:'user object id from users collection'
            },
            {
                userId:'user object id from users collection'
            },
        ],
        CreateSubTask: {
            taskId: '1234',
            subTaskStageName: 'development',
            subTaskTitle: "Create API's for project",
            subTaskType: 'New feature',
            subTaskStatus: 'ToDo',
            subTaskDetails: 'some description  about task',
            dueDate: '2022-07-23',
            estimationDate: '2023-01-23',
            estimationTime: '19:01',
            actualHours: '05:00',
            reason: 'I am working on another task',
            completedDate:'2022-07-23',
            subTaskAssignedTo: [
                {
                    id: 'user object id from users collection',
                },
                {
                    id: 'user object id from users collection',
                },
            ],
            // group: [
            //     {
            //         groupId: 'group object id from userGroup collection',
            //     },
            // ],
            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
            priority: 'Medium',
        },

        UpdateSubTask: {
            subTaskDetails: 'some updation in task details',
            subTaskType: 'New feature',
            priority: 'High',
            actualHours: '02:00',
            reason: 'I am working on another task',
            completedDate:'2022-07-23',
        },
        deleteMultipleSubTask: {
            SubTaskId: [
                {
                    id: 'SubTask object id from SubTask collection',
                },
                {
                    id: 'SubTask object id from SubTask collection',
                },
            ],
        },

        CreateSubTaskStatus: {
            subTaskStatus: 'Testing',
        },

        UpdateSubTaskStatus: {
            subTaskStatus: 'Testing',
        },

        CreateSubTaskType: {
            subTaskType: 'New feature',
        },

        UpdateSubTaskType: {
            subTaskType: 'New feature',
        },
        CommentSubTask: {
            comment: 'some comment for the subtask',
            userName: ['@Jagadeesha_Globussoft',"@abcxyz_globussoft"]
        },
        //sample responses for all module
        // 1. subTask
        createSubTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Sub-Task created successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b3cfe770a997e8da1cdbda',
                },
            },
        },
        createSubTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'SubTask adding limit is reached, please upgrade your plan || SubTask already present.|| Failed to create sub-task.',
            },
        },
        getSubTasksSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Sub-Tasks fetched successfully',
                data: [
                    {
                        _id: '63b3cfe770a997e8da1cdbda',
                        projectId: '62fe6ea87ab5913e391f055c',
                        taskId: '1234',
                        subTaskStageName: 'development',
                        subTaskTitle: "Create API's for project",
                        subTaskType: 'New feature',
                        subTaskStatus: 'Bug fix',
                        subTaskDetails: 'some description  about task',
                        subTaskCreator: {
                            orgId: 'GLB-BAN-001',
                            firstName: 'Neetu',
                            lastName: 'Kanaujia',
                            email: 'neetu@empmonitor.com',
                            role: 'Software Developer',
                            verified: true,
                            profilePic: 'neetu.pneg',
                            id: '63b2ac211854e1e39d25b359',
                        },
                        dueDate: '2022-07-22T18:30:00.000Z',
                        estimationHours: 8,
                        subTaskAssignedTo: [
                            {
                                id: 'GLB-104',
                                orgId: 'GLB-BAN-001',
                                firstName: 'Ram',
                                lastName: 'Singh',
                                email: 'ram@empmonitor.com',
                                role: 'Software Developer',
                                verified: true,
                                profilePic: 'ram.pneg',
                            },
                        ],
                        attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                        epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                        priority: 'Medium',
                        createdAt: '2023-01-03T06:49:11.060Z',
                        updatedAt: '2023-01-03T06:49:11.060Z',
                    },
                ],
            },
        },
        getSubTasksFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the subtasks.',
            },
        },
        getSubTaskIdSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Sub-Task fetched successfully',
                data: {
                    _id: '63b3cfe770a997e8da1cdbda',
                    projectId: '62fe6ea87ab5913e391f055c',
                    taskId: '1234',
                    subTaskStageName: 'development',
                    subTaskTitle: "Create API's for project",
                    subTaskType: 'New feature',
                    subTaskStatus: 'Bug fix',
                    subTaskDetails: 'some description  about task',
                    subTaskCreator: {
                        orgId: 'GLB-BAN-001',
                        firstName: 'Neetu',
                        lastName: 'Kanaujia',
                        email: 'neetu@empmonitor.com',
                        role: 'Software Developer',
                        verified: true,
                        profilePic: 'neetu.pneg',
                        id: '63b2ac211854e1e39d25b359',
                    },
                    dueDate: '2022-07-22T18:30:00.000Z',
                    estimationHours: 8,
                    subTaskAssignedTo: [
                        {
                            id: 'GLB-104',
                            orgId: 'GLB-BAN-001',
                            firstName: 'Ram',
                            lastName: 'Singh',
                            email: 'ram@empmonitor.com',
                            role: 'Software Developer',
                            verified: true,
                            profilePic: 'ram.pneg',
                        },
                    ],
                    attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                    epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                    priority: 'Medium',
                    createdAt: '2023-01-03T06:49:11.060Z',
                    updatedAt: '2023-01-03T06:49:11.060Z',
                },
            },
        },
        getSubTaskIdFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch. Invalid sub-task Id',
            },
        },
        updSubTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Sub-Task updated successfully',
                data: {
                    _id: '63b3cfe770a997e8da1cdbda',
                    projectId: '62fe6ea87ab5913e391f055c',
                    taskId: '1234',
                    subTaskStageName: 'development',
                    subTaskTitle: "Create API's for project",
                    subTaskType: 'New feature',
                    subTaskStatus: 'Bug fix',
                    subTaskDetails: 'some updation in task details',
                    subTaskCreator: {
                        orgId: 'GLB-BAN-001',
                        firstName: 'Neetu',
                        lastName: 'Kanaujia',
                        email: 'neetu@empmonitor.com',
                        role: 'Software Developer',
                        verified: true,
                        profilePic: 'neetu.pneg',
                        id: '63b2ac211854e1e39d25b359',
                    },
                    dueDate: '2022-07-22T18:30:00.000Z',
                    estimationHours: 8,
                    subTaskAssignedTo: [
                        {
                            id: 'GLB-104',
                            orgId: 'GLB-BAN-001',
                            firstName: 'Ram',
                            lastName: 'Singh',
                            email: 'ram@empmonitor.com',
                            role: 'Software Developer',
                            verified: true,
                            profilePic: 'ram.pneg',
                        },
                    ],
                    attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                    epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                    priority: 'High',
                    createdAt: '2023-01-03T06:49:11.060Z',
                    updatedAt: '2023-01-03T07:12:49.960Z',
                },
            },
        },
        updSubTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update. Invalid sub-task Id',
            },
        },
        dltSubTaskIdSuc: {},
        dltSubTaskIdFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete, Invalid sub-task Id',
            },
        },
        dltSubTasksSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: {
                    en: 'Sub-Tasks deleted successfully',
                },
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltSubTasksFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete, Invalid sub-task Id',
            },
        },
        srchSubTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result',
                data: [
                    {
                        _id: '63b3d78cd906a88ee2f17232',
                        projectId: '62fe6ea87ab5913e391f055c',
                        taskId: '1234',
                        subTaskStageName: 'development',
                        subTaskTitle: "Create API's for project",
                        subTaskType: 'New feature',
                        subTaskStatus: 'Bug fix',
                        subTaskDetails: 'some description  about task',
                        subTaskCreator: {
                            orgId: 'GLB-BAN-001',
                            firstName: 'Neetu',
                            lastName: 'Kanaujia',
                            email: 'neetu@empmonitor.com',
                            role: 'Software Developer',
                            verified: true,
                            profilePic: 'neetu.pneg',
                            id: '63b2ac211854e1e39d25b359',
                        },
                        dueDate: '2022-07-22T18:30:00.000Z',
                        estimationHours: 8,
                        subTaskAssignedTo: [
                            {
                                id: 'GLB-104',
                                orgId: 'GLB-BAN-001',
                                firstName: 'Ram',
                                lastName: 'Singh',
                                email: 'ram@empmonitor.com',
                                role: 'Software Developer',
                                verified: true,
                                profilePic: 'ram.pneg',
                            },
                        ],
                        attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                        epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                        priority: 'Medium',
                        createdAt: '2023-01-03T07:21:48.800Z',
                        updatedAt: '2023-01-03T07:21:48.800Z',
                    },
                ],
            },
        },
        srchSubTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search',
            },
        },
        getSubTaskActSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'SubTask Activity fetched successfully',
                data: [
                    {
                        _id: '63b3d78cd906a88ee2f17233',
                        task_id: '1234',
                        subtask_id: '63b3d78cd906a88ee2f17232',
                        activity: " Jagadeesha created subtask Create API's for project",
                        createdAt: '2023-01-03T07:21:48.846Z',
                        __v: 0,
                    },
                ],
            },
        },
        getSubTaskActFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch Activity, Invalid subtask Id',
            },
        },
        dltSubTaskActSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'SubTask Activity deleted successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltSubTaskActFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete activity. Invalid subtask Id or activity Id',
            },
        },

        addSubTaskCommentSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment added successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b66ca39f05f2ebee52024b',
                },
            },
        },
        addSubTaskCommentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to add the comment, invalid subtask id',
            },
        },
        updSubTaskCommentSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment updated successfully',
            },
        },
        updSubTaskCommentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update the comment, invalid comment id',
            },
        },
        getSubTaskCommentsSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment fetched successfully',
                data: {
                    _id: '63b683c557fbb64cfc1ce0f1',
                    task_id: '63b286f42a1bbf0f08ee48a7',
                    subtask_id: '63b3b81a80ab43917836d7bd',
                    comment: 'some comment for the subtask',
                    commentCreator: {
                        creatorId: '63ac3ae9c1ab45e06cf1d13e',
                        creatorName: 'Jagadeesha Ravibabu',
                        creatorProfilePic: 'https://rb.gy/ksmsxg',
                    },
                    createdAt: '2023-01-05T08:01:09.320Z',
                    is_edited: false,
                },
            },
        },
        getSubTaskCommentsFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the comment, invalid subtask id',
            },
        },
        dltSubTaskCommentSuc: {},
        dltSubTaskCommentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete the comment, invalid comment id or subtask id',
            },
        },

        // 2. subTaskType
        createSubTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Subtask Type created successfully.',
                data: {
                    acknowledged: true,
                    insertedId: '63ae855daf4b034e0405894c',
                },
            },
        },
        createSubTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'SubTask Type adding limit is reached, please upgrade your plan || SubTask Type already present.|| Failed to create sub-task Type.',
            },
        },
        getSubTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'SubTask Type fetched successfully',
                data: [
                    {
                        _id: '63ae82073be3c7371356bdac',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskType: 'Feature',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdeb',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskType: 'Improvement',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bded',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskType: 'Bug',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdef',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskType: 'Security',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdf1',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskType: 'Deployment',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                ],
            },
        },
        getSubTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the subtask Type.',
            },
        },
        updSubTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: {
                    en: 'SubTask Type updated successfully',
                    fr: 'Type de sous-tâche mis à jour avec succès',
                },
                data: {
                    _id: '63ae82073be3c7371356bdac',
                    adminId: '63ae81e73be3c7371356bd95',
                    taskType: 'Feature',
                    isDefault: true,
                    isOverwrite: false,
                    createdAt: '2022-12-30T05:08:25.225Z',
                    updatedAt: '2022-12-30T06:34:25.784Z',
                    __v: 0,
                    subTaskType: 'New feature',
                },
            },
        },
        updSubTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update subtask Type. Invalid subtask Type Id || ',
            },
        },
        dltSubTaskTypeIdSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  Sub successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltSubTaskTypeIdFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete subtask Type. Invalid subtask Type Id',
            },
        },
        dltSubTaskTypesSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  SubTask Type successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 4,
                },
            },
        },
        dltSubTaskTypesFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Subtask Type not added or deleted already. || Failed to delete subtask Type.',
            },
        },

        // 3. subTaskStatus
        createSubTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Subtask status created successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b3c3a81f224d66e53f5878',
                },
            },
        },
        createSubTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'SubTask Status adding limit is reached, please upgrade your plan || SubTask Status already present.|| Failed to create sub-task status.',
            },
        },
        getSubTaskStatusIdSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'SubTask Status fetched successfully',
                data: {
                    _id: '63ae82073be3c7371356bdad',
                    adminId: '63ae81e73be3c7371356bd95',
                    taskStatus: 'Todo',
                    isDefault: true,
                    isOverwrite: false,
                    createdAt: '2022-12-30T05:08:25.225Z',
                    updatedAt: '2022-12-30T05:08:25.225Z',
                    __v: 0,
                },
            },
        },
        getSubTaskStatusIdFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the subtask status. Invalid subtask status Id',
            },
        },
        getSubTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'SubTask Status fetched successfully',
                data: [
                    {
                        _id: '63ae82073be3c7371356bdad',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskStatus: 'Todo',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdf3',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskStatus: 'Inprogress',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdf5',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskStatus: 'Done',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdf7',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskStatus: 'Onhold',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63ae820b3be3c7371356bdf9',
                        adminId: '63ae81e73be3c7371356bd95',
                        taskStatus: 'Inreview',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2022-12-30T05:08:25.225Z',
                        updatedAt: '2022-12-30T05:08:25.225Z',
                        __v: 0,
                    },
                    {
                        _id: '63b3c3a81f224d66e53f5878',
                        subTaskStatus: 'Testing',
                        isDefault: false,
                        createdAt: '2023-01-03T05:56:56.264Z',
                        updatedAt: '2023-01-03T05:56:56.264Z',
                        adminId: '63b2ac211854e1e39d25b359',
                    },
                    {
                        _id: '63aeb6fd4d556e3529eec243',
                        subTaskStatus: 'Test',
                        isDefault: false,
                        createdAt: '2022-12-30T10:01:33.737Z',
                        updatedAt: '2022-12-30T10:01:33.737Z',
                        adminId: '63ae81e73be3c7371356bd95',
                    },
                ],
            },
        },
        getSubTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the subtask Status.',
            },
        },
        updSubTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'SubTask Status updated successfully',
                data: {
                    _id: '63aeb6fd4d556e3529eec243',
                    subTaskStatus: 'Testing',
                    isDefault: false,
                    createdAt: '2022-12-30T10:01:33.737Z',
                    updatedAt: '2022-12-30T12:25:31.934Z',
                    adminId: '63ae81e73be3c7371356bd95',
                },
            },
        },
        updSubTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update subtask status. Invalid subtask status Id',
            },
        },
        dltSubTaskStatusIdSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  Task status successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltSubTaskStatusIdFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete subtask Type. Invalid subtask Type Id',
            },
        },
        dltSubTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  SubTask Status successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 7,
                },
            },
        },
        dltSubTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Subtask Status not added or deleted already. || Failed to delete subtask status.',
            },
        },
        // 4. task
        createTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task created successfully',
                data: {
                    _id: '63b3e783256104bdaaa3292b',
                    projectId: '63b3e71d75aa3d47d2bcf2cf',
                    projectName: 'Demo Project',
                    taskTitle: 'Add apis',
                    stageName: 'new-development',
                    taskType: 'Development',
                    taskStatus: 'To do',
                    taskDetails: 'some description  about task',
                    dueDate: '2022-07-22T18:30:00.000Z',
                    estimationHours: 8,
                    assignedTo: [
                        {
                            id: '63b2c5d11854e1e39d25b41c',
                        },
                    ],
                    attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                    epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                    priority: 'Medium',
                    standAloneTask: false,
                    createdAt: '2023-01-03T08:29:54.987Z',
                    updatedAt: '2023-01-03T08:29:54.987Z',
                    taskCreator: {
                        id: '63b2ac211854e1e39d25b359',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        profilePic: 'https://rb.gy/ksmsxg',
                    },
                    projectCode: 'E-102',
                },
            },
        },
        createTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Project id not present. || Task already created for the project || Task adding limit is reached, please upgrade your plan || Task already present.|| Failed to create task. ',
            },
        },
        getTasksSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Tasks fetched successfully',
                data: {
                    taskCount: 4,
                    skip: 0,
                    tasks: [
                        {
                            _id: '63b3e783256104bdaaa3292b',
                            projectId: '63b3e71d75aa3d47d2bcf2cf',
                            projectName: 'Demo Project',
                            taskTitle: 'Add apis',
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [
                                {
                                    _id: '63b2c5d11854e1e39d25b41c',
                                    firstName: 'Jagadeesha',
                                    lastName: 'Ravibabu',
                                    email: 'jagadeesha@empmonitor.com',
                                    role: 'Member',
                                    permission: 'write',
                                    profilePic: 'globus.pneg',
                                    isAdmin: false,
                                    verified: false,
                                    createdAt: '2023-01-02T11:53:53.427Z',
                                    orgId: 'GLB-BAN-001',
                                },
                            ],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: false,
                            createdAt: '2023-01-03T08:29:54.987Z',
                            updatedAt: '2023-01-03T08:29:54.987Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            projectCode: 'E-102',
                            taskId: '63b3e783256104bdaaa3292b',
                            subTasks: [],
                        },
                        {
                            _id: '63b3e622256104bdaaa32929',
                            projectName: 'EMPMonitor-New',
                            taskTitle: 'Add new apis',
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [
                                {
                                    _id: '63b2c5d11854e1e39d25b41c',
                                    firstName: 'Jagadeesha',
                                    lastName: 'Ravibabu',
                                    email: 'jagadeesha@empmonitor.com',
                                    role: 'Member',
                                    permission: 'write',
                                    profilePic: 'globus.pneg',
                                    isAdmin: false,
                                    verified: false,
                                    createdAt: '2023-01-02T11:53:53.427Z',
                                    orgId: 'GLB-BAN-001',
                                },
                            ],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: true,
                            createdAt: '2023-01-03T08:24:02.840Z',
                            updatedAt: '2023-01-03T08:24:02.840Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            taskId: '63b3e622256104bdaaa32929',
                            subTasks: [],
                        },
                        {
                            _id: '63b2c6bd9ff0340c3dbb0087',
                            projectName: 'EMPMonitor',
                            taskTitle: "Create API's for 12",
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: true,
                            createdAt: '2023-01-02T11:57:49.092Z',
                            updatedAt: '2023-01-02T11:57:49.092Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            taskId: '63b2c6bd9ff0340c3dbb0087',
                            subTasks: [],
                        },
                        {
                            _id: '63b2c6219ff0340c3dbb0085',
                            projectName: 'EMPMonitor',
                            taskTitle: "Create API's for project",
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [
                                {
                                    _id: '63b2c5d11854e1e39d25b41c',
                                    firstName: 'Jagadeesha',
                                    lastName: 'Ravibabu',
                                    email: 'jagadeesha@empmonitor.com',
                                    role: 'Member',
                                    permission: 'write',
                                    profilePic: 'globus.pneg',
                                    isAdmin: false,
                                    verified: false,
                                    createdAt: '2023-01-02T11:53:53.427Z',
                                    orgId: 'GLB-BAN-001',
                                },
                            ],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: true,
                            createdAt: '2023-01-02T11:55:13.470Z',
                            updatedAt: '2023-01-02T11:55:13.470Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            taskId: '63b2c6219ff0340c3dbb0085',
                            subTasks: [],
                        },
                    ],
                },
            },
        },
        getTasksFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch tasks.',
            },
        },
        updateTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task updated',
                data: {
                    _id: '63b3e783256104bdaaa3292b',
                    projectId: '63b3e71d75aa3d47d2bcf2cf',
                    projectName: 'Demo Project',
                    taskTitle: 'Add apis',
                    stageName: 'development',
                    taskType: 'Development',
                    taskStatus: 'In Progress',
                    taskDetails: 'some updation in task details',
                    dueDate: '2022-07-22T18:30:00.000Z',
                    estimationHours: 8,
                    assignedTo: [
                        {
                            id: '63b2c5d11854e1e39d25b41c',
                        },
                    ],
                    attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                    epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                    priority: 'High',
                    standAloneTask: false,
                    createdAt: '2023-01-03T08:29:54.987Z',
                    updatedAt: '2023-01-03T08:33:40.254Z',
                    taskCreator: {
                        id: '63b2ac211854e1e39d25b359',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        profilePic: 'https://rb.gy/ksmsxg',
                    },
                    projectCode: 'E-102',
                },
            },
        },
        updateTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update tasks.',
            },
        },
        deleteTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Tasks deleted successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        deleteTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete Invalid Task Id',
            },
        },
        searchTaskSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result',
                data: {
                    taskCount: 4,
                    skip: 0,
                    resp: [
                        {
                            _id: '63b3e783256104bdaaa3292b',
                            projectId: '63b3e71d75aa3d47d2bcf2cf',
                            projectName: 'Demo Project',
                            taskTitle: 'Add apis',
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'In Progress',
                            taskDetails: 'some updation in task details',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [
                                {
                                    id: '63b2c5d11854e1e39d25b41c',
                                },
                            ],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'High',
                            standAloneTask: false,
                            createdAt: '2023-01-03T08:29:54.987Z',
                            updatedAt: '2023-01-03T08:33:40.254Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            projectCode: 'E-102',
                            taskId: '63b3e783256104bdaaa3292b',
                            subTasks: [],
                        },
                        {
                            _id: '63b3e622256104bdaaa32929',
                            projectName: 'EMPMonitor-New',
                            taskTitle: 'Add new apis',
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [
                                {
                                    id: '63b2c5d11854e1e39d25b41c',
                                },
                            ],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: true,
                            createdAt: '2023-01-03T08:24:02.840Z',
                            updatedAt: '2023-01-03T08:24:02.840Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            taskId: '63b3e622256104bdaaa32929',
                            subTasks: [],
                        },
                        {
                            _id: '63b2c6bd9ff0340c3dbb0087',
                            projectName: 'EMPMonitor',
                            taskTitle: "Create API's for 12",
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: true,
                            createdAt: '2023-01-02T11:57:49.092Z',
                            updatedAt: '2023-01-02T11:57:49.092Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            taskId: '63b2c6bd9ff0340c3dbb0087',
                            subTasks: [],
                        },
                        {
                            _id: '63b2c6219ff0340c3dbb0085',
                            projectName: 'EMPMonitor',
                            taskTitle: "Create API's for project",
                            stageName: 'development',
                            taskType: 'Development',
                            taskStatus: 'To do',
                            taskDetails: 'some description  about task',
                            dueDate: '2022-07-22T18:30:00.000Z',
                            estimationHours: 8,
                            assignedTo: [
                                {
                                    id: '63b2c5d11854e1e39d25b41c',
                                },
                            ],
                            attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
                            epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
                            priority: 'Medium',
                            standAloneTask: true,
                            createdAt: '2023-01-02T11:55:13.470Z',
                            updatedAt: '2023-01-02T11:55:13.470Z',
                            taskCreator: {
                                id: '63b2ac211854e1e39d25b359',
                                firstName: 'Jagadeesha',
                                lastName: 'Ravibabu',
                                profilePic: 'https://rb.gy/ksmsxg',
                            },
                            taskId: '63b2c6219ff0340c3dbb0085',
                            subTasks: [],
                        },
                    ],
                },
            },
        },
        searchTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search',
            },
        },
        filterKeyTaskSuc: {},
        filterKeyTaskFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task not found',
            },
        },
        getTaskActSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity not found',
                data: null,
            },
        },
        getTaskActFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch tasks-activity, Id is invalid',
            },
        },
        dltTaskActSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task Activity deleted successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltTaskActFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete activity. Invalid subtask Id or activity Id',
            },
        },
        addTaskCommentSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment added successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b6899638e516dcd47dab5b',
                },
            },
        },
        addTaskCommentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to add the comment,invalid task id',
            },
        },
        updTaskCommentSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment updated successfully',
            },
        },
        updTaskCommentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update the comment',
            },
        },
        getTaskCommentsSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comments fetched successfully.',
                data: [
                    {
                        _id: '63b6899638e516dcd47dab5b',
                        task_id: '63b28b597e594bdbc213795b',
                        project_id: null,
                        comment: 'some comment for the task',
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        commentCreator: {
                            creatorId: '63ac3ae9c1ab45e06cf1d13e',
                            creatorName: 'Jagadeesha',
                            creatorProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        createdAt: '2023-01-05T08:25:58.825Z',
                        updatedAt: '2023-01-05T08:25:58.825Z',
                        is_edited: false,
                    },
                ],
            },
        },
        getTaskCommentsFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to add the comment,invalid task id',
            },
        },
        dltTaskCommentSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment deleted successfully',
            },
        },

        dltTaskCommentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Validation failed',
                error: '"comment_id" length must be at least 24 characters long',
            },
        },

        // 5. taskCategory
        createTaskCategorySuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task category created successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b3bf3951fbcbc29d13e4d5',
                },
            },
        },
        createTaskCategoryFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task category adding limit is reached, please upgrade your plan || Task category already present.|| Failed to create task category.',
            },
        },
        getTaskCategorySuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task category fetched successfully',
                data: {
                    category: [
                        {
                            _id: '63b2ac461854e1e39d25b36c',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Task',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b39b',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Bug',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b39d',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Epic',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b39f',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Service',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b3a1',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Incident',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b3a3',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Problem',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b3a5',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskCategory: 'Change',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b3bf3951fbcbc29d13e4d5',
                            taskCategory: 'Bugfix',
                            adminId: '63b2ac211854e1e39d25b359',
                            isDefault: false,
                            createdAt: '2023-01-03T05:38:01.074Z',
                            updatedAt: '2023-01-03T05:38:01.074Z',
                        },
                    ],
                    total_count: 8,
                    custom_count: 1,
                    default_count: 7,
                },
            },
        },
        getTaskCategoryFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the task category. Invalid task stage Id',
            },
        },
        updTaskCategorySuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task category updated successfully',
                data: {
                    _id: '63b3bf3951fbcbc29d13e4d5',
                    taskCategory: 'Latest',
                    adminId: '63b2ac211854e1e39d25b359',
                    isDefault: false,
                    createdAt: '2023-01-03T05:38:01.074Z',
                    updatedAt: '2023-01-03T05:47:41.354Z',
                },
            },
        },
        updTaskCategoryFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task category already present.|| Cannot update/delete default category.|| Failed to update task category. Invalid task category Id',
            },
        },
        dltTaskCategorySuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  Task category successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltTaskCategoryFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete the task category. Invalid task category Id',
            },
        },
        // 6. taskStage
        createTaskStageSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task stage created successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b3bbe3d5a4a26eee5be52a',
                },
            },
        },
        createTaskStageFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task stage adding limit is reached, please upgrade your plan || Task stage already present.|| Failed to create task stage.',
            },
        },
        getTaskStageSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task stage fetched successfully',
                data: {
                    stage: [
                        {
                            _id: '63b2ac461854e1e39d25b36b',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStage: 'Initiation',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b389',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStage: 'Planning',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b38b',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStage: 'Execution',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b38d',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStage: 'Production',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b38f',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStage: 'Development',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b391',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStage: 'Closure',
                            isDefault: true,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b3bbe3d5a4a26eee5be52a',
                            taskStage: 'development',
                            adminId: '63b2ac211854e1e39d25b359',
                            isDefault: false,
                            createdAt: '2023-01-03T05:23:47.056Z',
                            updatedAt: '2023-01-03T05:23:47.056Z',
                        },
                    ],
                    total_count: 6,
                    custom_count: 0,
                    default_count: 6,
                },
            },
        },
        getTaskStageFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the task stage. Invalid task stage Id',
            },
        },
        updTaskStageSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task stage updated successfully',
                data: {
                    _id: '63b3bbe3d5a4a26eee5be52a',
                    taskStage: 'Completed',
                    adminId: '63b2ac211854e1e39d25b359',
                    isDefault: false,
                    createdAt: '2023-01-03T05:23:47.056Z',
                    updatedAt: '2023-01-03T05:36:27.179Z',
                },
            },
        },
        updTaskStageFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task stage already present.|| Cannot update/delete default stages.|| Failed to update task type. Invalid task stage Id',
            },
        },
        dltTaskStageSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  Task stage successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 2,
                },
            },
        },
        dltTaskStageFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete the task stage. Invalid task stage Id',
            },
        },

        // 7. taskStatus
        createTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task status created successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b2b83643917b1523e86d56',
                },
            },
        },
        createTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task status adding limit is reached, please upgrade your plan || Task status already present.|| Failed to create task status.',
            },
        },
        getTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task status fetched successfully',
                data: [
                    {
                        _id: '63b2ac461854e1e39d25b36a',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskStatus: 'Todo',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4b1854e1e39d25b3af',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskStatus: 'Inprogress',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4b1854e1e39d25b3b1',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskStatus: 'Done',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4b1854e1e39d25b3b3',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskStatus: 'Onhold',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4b1854e1e39d25b3b5',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskStatus: 'Inreview',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2b83643917b1523e86d56',
                        taskStatus: 'To do',
                        isDefault: false,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:55:50.889Z',
                        updatedAt: '2023-01-02T10:55:50.889Z',
                        adminId: '63b2ac211854e1e39d25b359',
                    },
                ],
            },
        },
        getTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the task status. Invalid task status Id',
            },
        },
        updTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task status updated successfully',
                data: {
                    _id: '63b3b7e41a4ef0b7ceb3429e',
                    taskStatus: 'Done',
                    isDefault: false,
                    isOverwrite: false,
                    createdAt: '2023-01-03T05:06:44.771Z',
                    updatedAt: '2023-01-03T05:07:26.639Z',
                    adminId: '63b2ac211854e1e39d25b359',
                },
            },
        },
        updTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Cannot update/delete default status.|| Failed to update task status. Invalid task status Id',
            },
        },
        dltTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  Task status successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Cannot update/delete default taskStatus.',
            },
        },
        srchTaskStatusSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result',
                data: {
                    taskStatusCount: 6,
                    skip: 0,
                    resp: [
                        {
                            _id: '63b2ac4b1854e1e39d25b3b1',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStatus: 'Done',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4b1854e1e39d25b3af',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStatus: 'Inprogress',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4b1854e1e39d25b3b5',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStatus: 'Inreview',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4b1854e1e39d25b3b3',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStatus: 'Onhold',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2b83643917b1523e86d56',
                            taskStatus: 'To do',
                            isDefault: false,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:55:50.889Z',
                            updatedAt: '2023-01-02T10:55:50.889Z',
                            adminId: '63b2ac211854e1e39d25b359',
                        },
                        {
                            _id: '63b2ac461854e1e39d25b36a',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskStatus: 'Todo',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                    ],
                },
            },
        },
        srchTaskStatusFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search',
            },
        },
        // 8. taskType
        createTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task type created successfully',
                data: {
                    acknowledged: true,
                    insertedId: '63b2b0ce425a66d02c3062c6',
                },
            },
        },
        createTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Task Type adding limit is reached, please upgrade your plan || Task Type already present.|| Failed to create task type.',
            },
        },
        getTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task type fetched successfully',
                data: [
                    {
                        _id: '63b2ac461854e1e39d25b369',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskType: 'Feature',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4a1854e1e39d25b393',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskType: 'Improvement',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4a1854e1e39d25b395',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskType: 'Bug',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4a1854e1e39d25b397',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskType: 'Security',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b2ac4a1854e1e39d25b399',
                        adminId: '63b2ac211854e1e39d25b359',
                        taskType: 'Deployment',
                        isDefault: true,
                        isOverwrite: false,
                        createdAt: '2023-01-02T10:03:14.513Z',
                        updatedAt: '2023-01-02T10:03:14.513Z',
                        __v: 0,
                    },
                    {
                        _id: '63b3b7e41a4ef0b7ceb3429e',
                        taskStatus: 'Progress',
                        isDefault: false,
                        isOverwrite: false,
                        createdAt: '2023-01-03T05:02:09.107Z',
                        updatedAt: '2023-01-03T05:02:09.107Z',
                        adminId: '63b2ac211854e1e39d25b359',
                    },
                    {
                        _id: '63b3b8501a4ef0b7ceb3429f',
                        taskType: 'New feature',
                        adminId: '63b2ac211854e1e39d25b359',
                        isDefault: false,
                        isOverwrite: false,
                        createdAt: '2023-01-03T05:08:32.683Z',
                        updatedAt: '2023-01-03T05:08:32.683Z',
                    },
                ],
            },
        },
        getTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the task type. Invalid task type Id',
            },
        },
        updTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Task type updated successfully',
                data: {
                    _id: '63b3b8501a4ef0b7ceb3429f',
                    taskType: 'Bug Fix',
                    adminId: '63b2ac211854e1e39d25b359',
                    isDefault: false,
                    isOverwrite: false,
                    createdAt: '2023-01-03T05:08:32.683Z',
                    updatedAt: '2023-01-03T05:09:50.491Z',
                },
            },
        },
        updTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Cannot update/delete default types.|| Failed to update task type. Invalid task type Id',
            },
        },
        dltTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted  Task type successfully',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        dltTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Cannot update/delete default types.',
            },
        },
        srchTaskTypeSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result',
                data: {
                    taskTypeCount: 5,
                    skip: 0,
                    resp: [
                        {
                            _id: '63b2ac4a1854e1e39d25b395',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskType: 'Bug',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b399',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskType: 'Deployment',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac461854e1e39d25b369',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskType: 'Feature',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b393',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskType: 'Improvement',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                        {
                            _id: '63b2ac4a1854e1e39d25b397',
                            adminId: '63b2ac211854e1e39d25b359',
                            taskType: 'Security',
                            isDefault: true,
                            isOverwrite: false,
                            createdAt: '2023-01-02T10:03:14.513Z',
                            updatedAt: '2023-01-02T10:03:14.513Z',
                            __v: 0,
                        },
                    ],
                },
            },
        },
        categoryIds:{
            categoryIds:[
                "60d0fe4f5311236168a109ca",
                "60d0fe4f5311236168a109cb",
                "60d0fe4f5311236168a109cc"
            ]},
        statusIds:{
            statusIds:[
                "60d0fe4f5311236168a109ca",
                "60d0fe4f5311236168a109cb",
                "60d0fe4f5311236168a109cc"
            ]},
        taskTypeIds:{
            taskTypeIds:[
                "60d0fe4f5311236168a109ca",
                "60d0fe4f5311236168a109cb",
                "60d0fe4f5311236168a109cc"
            ]},   
        taskStagesIds:{
            taskStagesIds:[
                "60d0fe4f5311236168a109ca",
                "60d0fe4f5311236168a109cb",
                "60d0fe4f5311236168a109cc"
            ]},         
        srchTaskTypeFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search',
            },
        },
    },
};

const outputFile = './resources/views/swagger-api-view.json';
const endpointsFiles = ['./resources/routes/public.routes.js'];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

await swagger(outputFile, endpointsFiles, doc);
