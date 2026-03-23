import swaggerAutogen from 'swagger-autogen';
const swagger = swaggerAutogen();
import config from 'config';

const doc = {
    info: {
        version: '1.0', // by default: "1.0.0"
        title: 'EmpMonitor Project Management APIs', // by default: "REST API"
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
            name: 'Admin',
            description: 'Admin Endpoint(s)',
            summary: 'Open',
        },
        {
            name: 'Client',
            definitions: 'Client Endpoint(s)',
            summary: 'Secured'
        },
        {
            name: 'Password',
            description: 'Password Endpoint(s)',
            summary: 'Open',
        },
        {
            name: 'Social-login',
            description: 'SocialLogin Endpoint(s)',
            summary: 'Open',
        },
        {
            name: 'Open-User',
            description: 'User Session  Endpoint',
            summary: 'Open',
        },
        {
            name: 'Plan',
            description: 'Plan Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Config',
            description: 'Admin Configuration Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Custom-fields',
            description: 'Custom Fields Configuration Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Language',
            description: 'Language Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'DashboardConfig',
            description: 'Dashboard Configuration Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Activity',
            description: 'Activity Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Project', // Tag name
            description: 'Project Endpoint(s)', // Tag description
        },
        {
            name: 'Project-comment', // Tag name
            description: 'Project Comments Endpoint(s)', // Tag description
        },
        {
            name: 'Roles',
            description: 'Roles Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Permissions',
            description: 'Permission Endpoint(s)',
            summary: 'Secured',
        },
        // {
        //   name: 'Upload',
        //   description: 'Upload Endpoint',
        //   summary: 'Secured',
        // },
        {
            name: 'Users',
            description: 'User Endpoint(s)',
            summary: 'Secured',
        },

        {
            name: 'Shortcut-Keys',
            description: 'Shortcut Keys Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Chat-channel',
            description: 'Chat Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'User-Groups',
            description: 'User Groups Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Notifications',
            description: 'Notifications Endpoint(s)',
            summary: 'Secured',
        },
        {
            name: 'Calendar',
            description: 'Calendar Endpoint(s)',
            summary: 'Secured',
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
        createProject: {
            project: [
                {
                    projectName: 'EmpMonitor WM Module',
                    projectCode: 'E-101',
                    description: 'Employee Monitoring WM Module handles the Project and Task Modules',
                    startDate: '2023-04-11',
                    endDate: '2023-04-21',
                    clientCompany: [
                        {
                            id: "comapny Id",
                            key: "Globussoft"
                        },
                        {
                            id: "comapny Id",
                            key: "GLB GLOBUSSOFT"
                        },
                    ],
                    reason: 'I am working on another task',
                    completedDate: '2022-07-23',
                    userAssigned: [
                        {
                            id: 'user object id from users collection',
                        },
                    ],
                    plannedBudget: 20000,
                    actualBudget: 10000,
                    estimationDate: '2023-04-23',
                    adminProfilePic: 'admin.jpeg',
                    projectLogo: 'project.jpeg',
                    currencyType: 'INR',
                },
            ],
        },
        updateProject: {
            projectName: 'EmpMonitor WM Module update',
            description: 'Employee Monitoring WM Module handles the Project and Task Modules updates',
            endDate: '2023-04-22',
            clientCompany: [
                {
                    id: "comapny Id",
                    key: "Globussoft"
                },
                {
                    id: "comapny Id",
                    key: "GLB GLOBUSSOFT"
                },
            ],
            reason: 'I am working on another task',
            completedDate: '2022-07-23',
            userAssigned: [
                {
                    id: 'user object id from users collection',
                },
            ],
            plannedBudget: 20000,
            actualBudget: 10000,
            estimationDate: '2023-04-23',
            projectLogo: 'project.jpeg',
            currencyType: 'INR',
            status: 'Inprogress',
        },
        deleteMultipleProject: {
            ProjectId: [
                {
                    id: 'project object id from project collection',
                },
                {
                    id: 'project object id from project collection',
                },
            ],
        },
        multiDeleteRoles: {
            rolesIds: [
                {
                    id: 'role object id from role collection',
                },
                {
                    id: 'role object id from role collection',
                },
            ],
        },
        multiDeletePermission: {
            permissionsIds: [
                {
                    id: 'permission object id from permission collection',
                },
                {
                    id: 'permission object id from permission collection',
                },
            ],
        },
        multiDeleteGroup: {
            groupsIds: [
                {
                    id: 'permission object id from permission collection',
                },
                {
                    id: 'permission object id from permission collection',
                },
            ],
        },
        multiDeleteUsers: {
            usersIds: [
                {
                    id: 'permission object id from permission collection',
                },
                {
                    id: 'permission object id from permission collection',
                },
            ],
        },
        removeMember: {
            userAssigned: [
                {
                    id: 'user object id from users collection',
                },
            ],
        },
        CreateProjectPlan: {
            projectPlan: [
                {
                    planName: 'Basic',
                    planPrice: 100.0,
                    isPlanActive: true,
                    projectFeatureCount: 5,
                    taskFeatureCount: 20,
                    userFeatureCount: 50,
                    subTaskFeatureCount: 10,
                    customizeRoles: 2,
                    customizePermission: 1,
                    customizeTaskType: 2,
                    customizeTaskStatus: 2,
                    customizeSubTaskType: 2,
                    customizeSubTaskStatus: 2,
                    categoriesCount: 2,
                    currencyType: 'INR',
                    currencyLogo: '₹',
                },
            ],
        },
        UpdateProjectPlan: {
            planName: 'Basic',
            planPrice: 100.0,
            isPlanActive: true,
            projectFeatureCount: 5,
            taskFeatureCount: 20,
            userFeatureCount: 50,
            subTaskFeatureCount: 10,
            customizeRoles: 2,
            customizePermission: 1,
            customizeTaskType: 2,
            customizeTaskStatus: 2,
            customizeSubTaskType: 2,
            customizeSubTaskStatus: 2,
        },
        CreateRoles: {
            roles: ['manager', 'supervisor'],
        },
        UpdateUserPassword: {
            oldPassword: 'myoldPassword123',
            newPassword: 'myupdatedPassword123'
        },
        CreatePermissions: {
            permissionName: 'C1',
            permissionConfig: {
                project: { view: true, create: false, edit: false, delete: false },
                otherProject: { view: false, create: false, edit: false, delete: false },
                task: { view: true, create: false, edit: false, delete: false },
                otherTask: { view: false, create: false, edit: false, delete: false },
                subtask: { view: true, create: false, edit: false, delete: false },
                otherSubtask: { view: false, create: false, edit: false, delete: false },
                user: { view: true, create: false, edit: false, delete: false },
                roles: { view: true, create: false, edit: false, delete: false },
                comments: { view: true, create: false, edit: false, delete: false },
                upload: { view: true, create: false, edit: false, delete: false },
                links: { view: true, create: false, edit: false, delete: false },
                activity: { view: true, create: false, edit: false, delete: false },
            },
        },

        UpdateRoleName: {
            roleName: 'Manager',
        },
        UpdatePlan: {
            userFeatureCount: '100',
            projectFeatureCount: '10',
            taskFeatureCount: '20',
            subTaskFeatureCount: '30',
            durationType: 'Month',
            durationValue: '2'
        },
        deleteData: {
            selectProjectToDelete: [
                {
                    id: "6528cff5a8126a5a71bc1178",
                    projectName: "EmpMonitor WM Module",
                    delete: '1'
                }
            ],
            selectTasksToDelete: [
                {
                    id: "6528dce3a06824bf8fed0f8a",
                    taskTitle: "Create API's for project",
                    delete: '1'
                }
            ],
            selectSubTasksToDelete: [
                {
                    id: "6528e0ecc5bf3beccd5371b1",
                    subTaskTitle: "Create API's for project",
                    delete: '1'
                }
            ],
            selectUserToDelete: [
                {
                    id: "652ccadfc524159b2b2035b0",
                    firstName: "Jagadeesha",
                    lastName: "Ravibabu",
                    delete: '1'
                }
            ],
            selectRolesToDelete: [
                {
                    id: '652ccadfc524159b2b2035b0',
                    roles: 'Admin',
                    delete: '1'
                }
            ],
            selectPermissionsToDelete: [
                {
                    id: '652ccadfc524159b2b2035b0',
                    permissionName: 'Admin',
                    delete: '0'
                }
            ],
            selectGroupToDelete: [
                {
                    id: '652ccadfc524159b2b2035b0',
                    groupName: 'Admin',
                    delete: '1'
                }
            ],
            selectCategoriesToDelete: [
                {
                    id: "652e2d854da3ad5cf44f36f8",
                    taskCategory: "Bugfix",
                    delete: '1'
                }
            ],
            selectTaskTypesToDelete: [
                {
                    id: "652e2d854da3ad5cf44f36f8",
                    taskType: "Bugfix",
                    delete: '1'
                }
            ],
            selectTaskStatusToDelete: [
                {
                    id: "652e2d854da3ad5cf44f36f8",
                    taskStatus: "Bugfix",
                    delete: '1'
                }
            ],
            selectTaskStageToDelete: [
                {
                    id: "652e2d854da3ad5cf44f36f8",
                    taskStage: "Bugfix",
                    delete: '1'
                }
            ]
        },
        suspendUser: {
            isSuspended: true,
        },
        CreateUser: {
            users: [
                {
                    firstName: 'Jagadeesha',
                    lastName: 'Ravibabu',
                    email: 'jagadeesha@empmonitor.com',
                    role: 'Member',
                    permission: 'write',
                },
            ],
        },
        UpdateUser: {
            firstName: 'Jagadeesha',
            lastName: 'Ravibabu',
            role: 'Sponsor',
            permission: 'read',
        },
        updateProfile: {
            firstName: 'Jagadeesha',
            lastName: 'Ravibabu',
            profilePic: 'globus.pneg',
            countryCode: '+91',
            phoneNumber: '6787986543',
            address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            zipCode: '560036',
        },
        createShortcutKey: {
            keystroke: 'CTRL + P',
            feature: 'View All Project',
            code: 100,
            shortCutType: 'global',
            isDefault: true,
            isEditable: false,
        },
        updateShortcutKey: {
            keystroke: 'CTRL + P',
        },
        CreateAdminConfig: {
            projectFeature: true,
            taskFeature: true,
            subTaskFeature: true,
            shortcutKeyFeature: true,
            chatFeature: true,
            invitationFeature: false,
            calendar: false,
        },

        postComment: {
            comment: 'project is on hold for some days',
            userName: ['@Jagadeesha_Globussoft', "@abcxyz_globussoft"]
        },
        Updatecomment: {
            comment: 'project is on hold for some days',
            userName: ['@Jagadeesha_Globussoft', "@abcxyz_globussoft"]
        },
        AdminDetails: {
            firstName: 'Jagadeesha',
            lastName: 'Ravibabu',
            userName: 'JaganGlb',
            profilePic: 'https://rb.gy/ksmsxg',
            password: 'Jagan@wm123',
            countryCode: '+91',
            phoneNumber: '6787986543',
            email: 'jagadeeshar@globussoft.in',
            orgId: 'GLB-BAN-001',
            orgName: 'Globussoft Technologies',
            address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            zipCode: '560001',
        },
        AdminDetail: {
            email: 'jagadeeshar@globussoft.in',
            password: 'Jagan@wm123'
        },
        AdminResetPassword: {
            email: 'jagadeeshar@globussoft.in',
            token: 'Gasuidaskfdiff-sdklasnlkfnldf',
            newPassword: 'newPassWord',
        },
        UpdateAdmin: {
            firstName: 'Jagadeesha',
            lastName: 'Ravibabu',
            profilePic: 'https://rb.gy/ksmsxg',
            countryCode: '+91',
            phoneNumber: '6787986543',
            address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            zipCode: '560036',
            planData: {
                userFeatureCount: "2",
            }
        },
        AdminCreds: {
            email: 'jagadeeshar@globussoft.in',
            password: 'Jagan@wm123',
        },
        EncryptedMail: {
            token: '310e2e7c59307ebe856b118aa6c2196c:f3a2e3833b1ab1910aa9c2c6a256df775ce0c51cc7dbc33e070976666f88425642e03c8a4afb0f20bb1f2f47638a5166459b3ec25427e3b3d3541825aa719d5a13b195eec953ebd3357e99525b1485accf4845b2bb9a032ab2be631dabdc0a02dc699cbe46fe9b12250633cf9bab7dd530c1e056e092301bf9c6adce1ebabd2b39ecb79676ed3c8bb3b3c08db4d3417c53d37ace5880be13f13bd5482d305bf45f175327de1b35cafc073d9d4c9895268780ecdf384b9c1d58d28dc38139c7da',
        },
        UserVerification: {
            activationLink: '81bf3db0-759e-11ed-8264-5dabec18e576',
            userMail: 'jagadeeshar@globussoft.in',
            orgId: 'GLB-BAN-001',
            invitation: 1,
        },
        AdminVerification: {
            activationLink: '81bf3db0-759e-11ed-8264-5dabec18e576',
            adminMail: 'jagadeeshar@globussoft.in',
            orgId: 'GLB-BAN-001',
        },
        AdminEmail: {
            email: 'jagadeesha.softs@gmail.com',
        },
        AdminPassword: {
            oldPassword: 'myoldPassword123',
            newPassword: 'myupdatedPassword123',
        },
        UserCreds: {
            userMail: 'jagadeeshar@globussoft.in',
            password: 'Jagan@wm123',
            orgId: 'GLB-BAN-001',
        },
        createClient: {
            clientName: 'globusoft',
            projectIds: [
                {
                    id: "63a939653d73dc693f0ec96"
                }
            ]
        },
        createCompany: {
            clientCompany: 'Globussoft technology',
            clientName: [
                {
                    id: "63a939653d73dc693f0ec96"
                }
            ],
            projectIds: [
                {
                    id: "63a939653d73dc693f0ec96"
                }
            ]
        },
        updateCompany: {
            clientCompany: 'Globussoft technology',
            clientName: [
                {
                    id: "63a939653d73dc693f0ec96"
                }
            ],
            projectIds: [
                {
                    id: "63a939653d73dc693f0ec96"
                }
            ]
        },
        dashboardConfig: {
            updateConfig: [
                {
                    project_status: 1,
                    project_progress: 1,
                    project_recent: 1,
                    project_member: 1,
                    project_by_status: 1,
                    project_task: 1,
                    project_budget_grid: 1,
                    project_grid_XL: 1,
                },
            ],
        },
        permissionFilterDetails: {
            firstName: 'Jagadeesha',
            userId: '63a939653d73dc693f0ec96',
            category: 'Created',
            createdAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
            updatedAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
        },

        UserPasswordSet: {
            userMail: 'jagadeesha.softs@gmail.com',
            orgId: 'GLB-BAN-001',
            password: 'NeWpa$$word123',
        },

        dashboardConfig: {
            project_status: 1,
            project_progress: 1,
            project_recent: 1,
            project_member: 1,
            project_by_status: 1,
            project_task: 1,
            project_budget_grid: 1,
            project_grid_XL: 1,
        },

        UpdatePermission: {
            permissionName: 'Execute',
            permissionConfig: {
                project: { view: true, create: false, edit: false, delete: false },
                task: { view: true, create: false, edit: false, delete: false },
                subtask: { view: true, create: false, edit: false, delete: false },
                user: { view: true, create: false, edit: false, delete: false },
                roles: { view: true, create: false, edit: false, delete: false },
                comments: { view: true, create: false, edit: false, delete: false },
                upload: { view: true, create: false, edit: false, delete: false },
                links: { view: true, create: false, edit: false, delete: false },
                activity: { view: true, create: false, edit: false, delete: false },
            },
        },
        additionalPermission: {
            groups: { view: true, create: false, edit: false, delete: false },
            chatChannel: { view: true, create: true, edit: true, delete: true },
        },
        userFilterDetails: {
            firstName: 'Jagadeesha',
            lastName: 'Ravibabu',
            email: 'jagdeesha@empmonitor.in',
            role: 'member',
            projectCount: {
                min: 0,
                max: 100,
            },
            taskCount: {
                min: 0,
                max: 100,
            },
            empmonitor: '0',
            createdAt: { startDate: '2023-02-11', endDate: '2023-02-21' },
            updatedAt: { startDate: '2023-02-11', endDate: '2023-02-21' },
        },
        roleFilterDetails: {
            roleName: 'member',
            assignMember: [{ id: 'user ids' }],
            createdAt: { startDate: '2023-02-11', endDate: '2023-02-21' },
            updatedAt: { startDate: '2023-02-11', endDate: '2023-02-21' },
        },
        FilterDetails: {
            projectCode: 'E-101',
            projectName: 'EmpMonitor WM Module',
            clientCompany: 'Globussoft',
            user: [
                {
                    id: '63ad121fddb1243181626135',
                },
            ],
            sponsor: [
                {
                    id: '63ad121fddb1243181626135',
                },
            ],
            manager: [
                {
                    id: '63ad121fddb1243181626135',
                },
            ],
            owner: [
                {
                    id: '63ad121fddb1243181626136',
                },
            ],
            currencyType: 'INR',
            status: 'Todo',
            plannedBudget: {
                min: 10000,
                max: 20000,
            },
            actualBudget: {
                min: 5000,
                max: 20000,
            },
            createdAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
            updatedAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
        },
        activityFilterDetails: {
            firstName: 'Jagadeesha',
            userId: '63a939653d73dc693f0ec96',

            createdAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
            updatedAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
        },
        CreateGroup: {
            group: [
                {
                    groupName: 'Developers',
                    groupDescription: 'Group for developers who are very innovative',
                    groupLogo: 'shorturl.at/BHIZ3',
                    assignedMembers: [{ userId: '6434fe9b125098fa361ef3cb' }],
                },
            ],
        },
        planFilterDetails: {
            firstName: 'Jagadeesha',
            userId: '63a939653d73dc693f0ec96',
            category: 'created',
            createdAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
            updatedAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
        },
        notificationRead: {
            ids: ['63a939653d73dc693f0ec96', '63a939653d73dc693f0ec94']
        },

        allActivityFilterDetails: {
            firstName: 'Jagadeesha',
            activityUserId: '63a939653d73dc693f0ec96',
            projectId: '63a939653d73dc693f0ec94',
            taskId: '63a939653d73dc693f0ec92',
            subTaskId: '63a939653d73dc693f0ec93',
            configId: '63a939653d73dc693f0ec91',
            roleId: '63a939653d73dc693f0ec99',
            adminId: '63a939653d73dc693f0ec98',
            groupId: '63a939653d73dc693f0ec97',
            permissionId: '63a939653d73dc693f0ec96',
            planId: '63a939653d73dc693f0ec95',
            userId: '63a939653d73dc693f0ec55',
            subTaskStatusId: '63a939653d73dc693f0ec96',
            subTaskTypeId: '63a939653d73dc693f0ec96',
            taskTypeId: '63a939653d73dc693f0ec96',
            taskStatusId: '63a939653d73dc693f0ec96',
            taskStageId: '63a939653d73dc693f0ec96',
            taskCategoryId: '63a939653d73dc693f0ec96',
            activityType: 'Project',
            category: 'created',
            date: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
        },

        UpdateGroup: {
            groupName: 'Developers Updated ',
            groupDescription: 'Group for developers who are very innovative updated',
            groupLogo: 'shorturl.at/BHIZ3',
            assignedMembers: [
                {
                    userId: '63a939653d73dc693f0ec96f',
                },
            ],
        },
        groupFilterDetails: {
            userId: [{ id: '63a939653d73dc693f0ec96' }],
            groupName: 'Developers',
            createdAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
            updatedAt: {
                startDate: '2022-03-11',
                endDate: '2022-03-21',
            },
        },
        ScreenConfig: {
            project: [
                {
                    name: 'Project Name',
                    value: 'projectName',
                    sort: 'ASC',
                    isDisabled: false,
                    isVisible: true,
                }
            ],
            task: [{
                name: 'Task',
                value: 'taskTitle',
                sort: 'ASC',
                isDisabled: false,
                isVisible: true,
            }],
            member: [
                {
                    name: 'Name',
                    value: 'firstName',
                    sort: 'ASC',
                    isDisabled: true,
                    isVisible: true,
                }
            ],
            group: [
                {
                    name: 'Group Name',
                    value: 'groupName',
                    sort: 'ASC',
                    isDisabled: true,
                    isVisible: true,
                }
            ],
            permission: [
                {
                    name: 'Permission Name',
                    value: 'permissionName',
                    sort: 'ASC',
                    isDisabled: true,
                    isVisible: true,
                }
            ],

        },

        forgetPassword: {
            orgId: 'GLB-BAN-001',
            email: 'jagadeesha.softs@gmail.com',
        },
        resetPassword: {
            orgId: 'GLB-BAN-001',
            email: 'jagadeeshar@globussoft.in',
            verifyToken: '81bf3db0-759e-11ed-8264-5dabec18e576',
            newPassword: 'acsdshehfgdsj',
        },
        CreateDynamicFields: {
            createProjectField: {
                fieldName: 'addExtraInfo',
                type: 'string',
                conditions: {
                    min: 0,
                    max: 0,
                    valid: 0,
                },
            },
            createTaskField: {
                fieldName: 'addExtraInfo',
                type: 'string',
                conditions: {
                    min: 0,
                    max: 0,
                    valid: 0,
                },
            },
            createSubTaskField: {
                fieldName: 'addExtraInfo',
                type: 'string',
                conditions: {
                    min: 0,
                    max: 0,
                    valid: 0,
                },
            },

            orgId: 'GLB-BAN-001',
        },
        sendReport: {
            reportsTitle: "progress report",
            frequency: [{
                Daily: 1,
                Weekly: 0,
                Monthly: 0,
                Time: "12:00",
                Date: {
                    startDate: "2024-04-12",
                    endDate: "2024-05-12"
                }
            }],
            Recipients: ["adc@gmail.com", "xyz@gloubssoft.in"],
            Content: [{
                task: 1,
                project: 0,
                subTask: 0,
                progress: 0,
                group: 0,
                role: 0
            }],
            ReportsType: [{
                pdf: 1,
                csv: 0
            }],
            filter: {
                wholeOrganization: 1,
                specificEmployees: [
                    {
                        id: '63a939653d73dc693f0ec96',
                    },
                    {
                        id: '63a939653d73dc693f0ec96'
                    }
                ],
                specificGroups: [
                    {
                        groupId: "63a939653d73dc693f0ec96"
                    },
                    {
                        groupId: '63a939653d73dc693f0ec96'
                    }],
                specificRoles: [{
                    roleId: "63a939653d73dc693f0ec96"
                },
                {
                    roleId: "63a939653d73dc693f0ec96"
                }
                ]
            },
            sendTestMail: false
        },

        CreateFieldConfig: {
            projectFields: [
                {
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],

            taskFields: [
                {
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
            subTaskFields: [
                {
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
            userFields: [
                {
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
        },
        ViewFieldConfig: {
            projectViewFields: [
                {
                    projectName: 1,
                    actualBudget: 0,
                    actualHours: 0,
                    adminName: 0,
                    adminProfilePic: 0,
                    createdAt: 1,
                    updatedAt: 1,
                    currencyType: 0,
                    description: 1,
                    endDate: 0,
                    startDate: 1,
                    softDeleted: 0,
                    estimationDate: 0,
                    estimationTime: 0,
                    plannedBudget: 0,
                    projectCode: 1,
                    projectCreatedBy: 0,
                    projectLogo: 1,
                    remainingHours: 0,
                    status: 0,
                    progress: 0,
                    userAssigned: 0,
                    memberCount: 0,
                    taskCount: 0,
                    taskDetails: 0,
                    subTaskCount: 0,
                    subTaskDetails: 0,
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
            taskViewFields: [
                {
                    projectId: 0,
                    projectName: 1,
                    taskTitle: 1,
                    stageName: 1,
                    taskType: 1,
                    category: 0,
                    taskCreator: 0,
                    taskStatus: 0,
                    taskDetails: 1,
                    dueDate: 0,
                    createdAt: 1,
                    updatedAt: 0,
                    estimationTime: 0,
                    estimationDate: 0,
                    actualHours: 0,
                    remainingHours: 0,
                    assignedTo: 0,
                    attachment: 0,
                    epicLink: 0,
                    project: 1,
                    subTasks: 1,
                    standAloneTask: 1,
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
            subTaskViewFields: [
                {
                    projectName: 1,
                    projectId: 1,
                    taskId: 1,
                    subTaskStageName: 0,
                    subTaskCategory: 0,
                    subTaskTitle: 1,
                    subTaskType: 0,
                    subTaskDetails: 0,
                    dueDate: 0,
                    estimationDate: 0,
                    estimationTime: 0,
                    actualHours: 0,
                    remainingHours: 0,
                    attachment: 0,
                    epicLink: 0,
                    subTaskStatus: 0,
                    subTaskCreator: 0,
                    subTaskAssignedTo: 0,
                    progress: 1,
                    task: 1,
                    updatedAt: 1,
                    createdAt: 0,
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
            userViewFields: [
                {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: 1,
                    permission: 1,
                    profilePic: 1,
                    verified: 0,
                    verificationEmailSentCount: 0,
                    softDeleted: 0,
                    forgotPasswordToken: 0,
                    forgotTokenExpire: 0,
                    passwordEmailSentCount: 0,
                    orgId: 0,
                    adminId: 0,
                    password: 0,
                    Project_details: 0,
                    task_details: 0,
                    subTask_details: 0,
                    emailValidateToken: 0,
                    emailTokenExpire: 0,
                    isAdmin: 0,
                    createdAt: 1,
                    updatedAt: 0,
                    stringInput_64: 0,
                    stringInput_256: 0,
                    stringInput_1000: 0,
                    date_dd_mm_yyyy: 1,
                    date_mm_dd_yyyy: 0,
                    date_dd_mm_yyyy: 0,
                    date_dd_mon_yyyy: 0,
                    date_yy_mon_dd: 0,
                    dateTime_ddmmyyyy_hhmmss: 0,
                    dateTime_mmddyyyy_hhmmss: 0,
                    dateTime_yyyymmdd_hhmmss: 0,
                    dateTime_ddmonyyyy_hhmmss: 0,
                    dateTime_yymondd_hhmmss: 0,
                    dateTime_ddmmyyyy_hhmm: 0,
                    dateTime_mmddyyyy_hhmm: 0,
                    dateTime_yyyymmdd_hhmm: 0,
                    dateTime_ddmonyyyy_hhmm: 0,
                    numberInput_6: 0,
                    numberInput_10: 0,
                    checkBox: 0,
                    labels: 0,
                    url: 0,
                },
            ],
        },

        //sample responses for all module
        //1.Admin module
        SuccessMessage: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin stored successfully.',
                data: {
                    resultData: {
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jjagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-002',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560001',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: false,
                        dashboardConfig_id: null,
                        verified: false,
                        isAdmin: true,
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T10:46:58.874Z',
                        createdAt: '2022-12-28T10:46:58.874Z',
                        updatedAt: '2022-12-28T10:46:58.874Z',
                        _id: '63ac1ef6a61e1748162f08aa',
                        __v: 0,
                    },
                },
            },
        },
        FailMessage: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Admin ORGANIZATION_NAME already exist. || Admin EMAIL_NAME already exist. || Error while creating admin.',
            },
        },
        fetchSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'success.',
                data: {
                    userData: {
                        _id: '63abd0e1e66e104a39970185',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-001',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560001',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: true,
                        dashboardConfig_id: null,
                        verified: false,
                        isAdmin: true,
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T05:15:00.796Z',
                        emailValidateToken: 'add793c0-869c-11ed-8a10-da6297a1f0d1',
                        emailTokenExpire: '2022-12-26T05:15:00.796Z',
                        createdAt: '2022-12-28T05:15:00.796Z',
                        updatedAt: '2022-12-28T05:15:00.796Z',
                        __v: 0,
                    },
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJfaWQiOiI2M2FiZDBlMWU2NmUxMDRhMzk5NzAxODUiLCJmaXJzdE5hbWUiOiJKYWdhZGVlc2hhIiwibGFzdE5hbWUiOiJSYXZpYmFidSIsInVzZXJOYW1lIjoiSmFnYW5HbGIiLCJwcm9maWxlUGljIjoiaHR0cHM6Ly9yYi5neS9rc21zeGciLCJjb3VudHJ5Q29kZSI6Iis5MSIsInBob25lTnVtYmVyIjoiNjc4Nzk4NjU0MyIsImVtYWlsIjoiamFnYWRlZXNoYXJAZ2xvYnVzc29mdC5pbiIsIm9yZ0lkIjoiR0xCLUJBTi0wMDEiLCJvcmdOYW1lIjoiR2xvYnVzc29mdCBUZWNobm9sb2dpZXMiLCJhZGRyZXNzIjoiIzI5IEJISVZFIE1HIFJvYWQsIE1haGFsYWtzaG1pIENoYW1iZXJzLE1HIFJvYWQgTmV4dCB0byBUcmluaXR5IE1ldHJvIFN0YXRpb24iLCJjaXR5IjoiQmFuZ2Fsb3JlIiwic3RhdGUiOiJLYXJuYXRha2EiLCJjb3VudHJ5IjoiSW5kaWEiLCJ6aXBDb2RlIjoiNTYwMDAxIiwiaXNFbXBNb25pdG9yVXNlciI6ZmFsc2UsImxhc3RVc2VyRmV0Y2hlZCI6bnVsbCwiaXNDb25maWdTZXQiOnRydWUsImRhc2hib2FyZENvbmZpZ19pZCI6bnVsbCwidmVyaWZpZWQiOmZhbHNlLCJpc0FkbWluIjp0cnVlLCJsYW5ndWFnZSI6ImVuIiwicGxhbk5hbWUiOiJCYXNpYyIsInBsYW5JZCI6IjYzYTU5YzBhMmI3NjJhOTVjM2EzOTMxMyIsInBsYW5VcGRhdGVkQXQiOiIyMDIyLTEyLTI4VDA1OjE1OjAwLjc5NloiLCJlbWFpbFZhbGlkYXRlVG9rZW4iOiJhZGQ3OTNjMC04NjljLTExZWQtOGExMC1kYTYyOTdhMWYwZDEiLCJlbWFpbFRva2VuRXhwaXJlIjoiMjAyMi0xMi0yNlQwNToxNTowMC43OTZaIiwiY3JlYXRlZEF0IjoiMjAyMi0xMi0yOFQwNToxNTowMC43OTZaIiwidXBkYXRlZEF0IjoiMjAyMi0xMi0yOFQwNToxNTowMC43OTZaIiwiX192IjowfSwiaWF0IjoxNjcyMjI1NDIxLCJleHAiOjE2NzIzMTE4MjF9.rMYubAu1XagtAQnvdSlnfHObjBHPmJ-ANVAilVJSU_w',
                },
            },
        },
        fetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'User not exist. || Invalid the Password!!. || Error in fetch admin details.',
            },
        },
        empIsAdminFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'User not exist. || Invalid Access Token!!. || Error in fetch admin details.',
            },
        },
        existSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Email exist.',
            },
        },
        existFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Email not exist. || Error in fetch admin details.',
            },
        },
        existOrg: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Organization exist.',
            },
        },
        existOrgFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Organization not exist. || Error in fetch admin details. || OrgId should be less 12 characters.',
            },
        },
        forgotSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin password reset mail send successfully.',
            },
        },
        forgotFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Email does not exist. || Something went wrong.',
            },
        },
        resetSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin password reset successfully',
                data: {
                    _id: '63abd0e1e66e104a39970185',
                    firstName: 'Jagadeesha',
                    lastName: 'Ravibabu',
                    userName: 'JaganGlb',
                    profilePic: 'https://rb.gy/ksmsxg',
                    password: 'Jagan@wm123',
                    countryCode: '+91',
                    phoneNumber: '6787986543',
                    email: 'jagadeeshar@globussoft.in',
                    orgId: 'GLB-BAN-001',
                    orgName: 'Globussoft Technologies',
                    address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: 'India',
                    zipCode: '560001',
                    isEmpMonitorUser: false,
                    lastUserFetched: null,
                    isConfigSet: true,
                    dashboardConfig_id: null,
                    verified: false,
                    isAdmin: true,
                    forgotPasswordToken: '63dcb950-86d1-11ed-80bb-4b6406da8592',
                    forgotTokenExpire: '2022-12-26T11:32:20.005Z',
                    language: 'en',
                    planName: 'Basic',
                    planId: '63a59c0a2b762a95c3a39313',
                    planUpdatedAt: '2022-12-28T05:15:00.796Z',
                    emailValidateToken: 'add793c0-869c-11ed-8a10-da6297a1f0d1',
                    emailTokenExpire: '2022-12-26T05:15:00.796Z',
                    createdAt: '2022-12-28T05:15:00.796Z',
                    updatedAt: '2022-12-28T05:15:00.796Z',
                    __v: 0,
                },
            },
        },
        resetFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Token invalid. || Error while resetting password. || Email does not exist. ',
            },
        },
        adminUpdSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin stored successfully',
                data: {
                    resultData: {
                        _id: '63abd0e1e66e104a39970185',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-001',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560036',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: true,
                        dashboardConfig_id: null,
                        verified: false,
                        isAdmin: true,
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T05:15:00.796Z',
                        emailValidateToken: 'add793c0-869c-11ed-8a10-da6297a1f0d1',
                        emailTokenExpire: '2022-12-26T05:15:00.796Z',
                        createdAt: '2022-12-28T05:15:00.796Z',
                        updatedAt: '2022-12-28T05:15:00.796Z',
                        __v: 0,
                    },
                },
            },
        },
        adminUpdFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Error updating Admin.',
            },
        },
        adminVerify: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin activated successfully.!!',
            },
        },

        adminVerifyFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Validation failed. || Email not yet registered.!! || Email already activated.!! || Invalid Activation token.!!',
            },
        },
        //2.AdminConfig module
        adminConfigSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin config created successfully.',
                data: {
                    user: {
                        projectFeature: true,
                        taskFeature: true,
                        subTaskFeature: true,
                        shortcutKeyFeature: true,
                        invitationFeature: false,
                        orgId: 'GLB-BAN-001',
                    },
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJfaWQiOiI2M2FjM2FlOWMxYWI0NWUwNmNmMWQxM2UiLCJmaXJzdE5hbWUiOiJKYWdhZGVlc2hhIiwibGFzdE5hbWUiOiJSYXZpYmFidSIsInVzZXJOYW1lIjoiSmFnYW5HbGIiLCJwcm9maWxlUGljIjoiaHR0cHM6Ly9yYi5neS9rc21zeGciLCJwYXNzd29yZCI6IkphZ2FuQHdtMTIzIiwiY291bnRyeUNvZGUiOiIrOTEiLCJwaG9uZU51bWJlciI6IjY3ODc5ODY1NDMiLCJlbWFpbCI6ImphZ2FkZWVzaGFyQGdsb2J1c3NvZnQuaW4iLCJvcmdJZCI6IkdMQi1CQU4tMDAxIiwib3JnTmFtZSI6Ikdsb2J1c3NvZnQgVGVjaG5vbG9naWVzIiwiYWRkcmVzcyI6IiMyOSBCSElWRSBNRyBSb2FkLCBNYWhhbGFrc2htaSBDaGFtYmVycyxNRyBSb2FkIE5leHQgdG8gVHJpbml0eSBNZXRybyBTdGF0aW9uIiwiY2l0eSI6IkJhbmdhbG9yZSIsInN0YXRlIjoiS2FybmF0YWthIiwiY291bnRyeSI6IkluZGlhIiwiemlwQ29kZSI6IjU2MDAwMSIsImlzRW1wTW9uaXRvclVzZXIiOmZhbHNlLCJsYXN0VXNlckZldGNoZWQiOm51bGwsImlzQ29uZmlnU2V0Ijp0cnVlLCJkYXNoYm9hcmRDb25maWdfaWQiOm51bGwsInZlcmlmaWVkIjpmYWxzZSwiaXNBZG1pbiI6dHJ1ZSwiZm9yZ290UGFzc3dvcmRUb2tlbiI6ImUxOWYwYjkwLTg2ZGItMTFlZC04MWQ1LTNlNWMxMDJjMjBiZiIsImZvcmdvdFRva2VuRXhwaXJlIjoiMjAyMi0xMi0yNlQxMjo0NzoyNS45NjJaIiwibGFuZ3VhZ2UiOiJlbiIsInBsYW5OYW1lIjoiQmFzaWMiLCJwbGFuSWQiOiI2M2E1OWMwYTJiNzYyYTk1YzNhMzkzMTMiLCJwbGFuVXBkYXRlZEF0IjoiMjAyMi0xMi0yOFQxMjo0NzoyNS45NjNaIiwiZW1haWxWYWxpZGF0ZVRva2VuIjoiZTE5ZjU5YjAtODZkYi0xMWVkLThjNmMtZTk3MjM3YTg1MGEzIiwiZW1haWxUb2tlbkV4cGlyZSI6IjIwMjItMTItMjZUMTI6NDc6MjUuOTYzWiIsImNyZWF0ZWRBdCI6IjIwMjItMTItMjhUMTI6NDc6MjUuOTYzWiIsInVwZGF0ZWRBdCI6IjIwMjItMTItMjhUMTI6NDc6MjUuOTYzWiIsIl9fdiI6MH0sImlhdCI6MTY3MjIzMjQwOSwiZXhwIjoxNjcyMzE4ODA5fQ.-RItKSKbr-gvspxr5e4QrBaKrnwyBdV7wprqY6lMKmQ',
                },
            },
        },
        adminConfigFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Config is already updated with Organization. || Error creating Config. || Config is not created with Organization.',
            },
        },
        configFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Admin config fetched successfully.',
                data: {
                    isDataExist: {
                        _id: '63ac3dd9c1ab45e06cf1d143',
                        orgId: 'GLB-BAN-001',
                        projectFeature: true,
                        taskFeature: true,
                        subTaskFeature: true,
                        shortcutKeyFeature: true,
                        invitationFeature: false,
                        createdAt: '2022-12-28T12:47:26.051Z',
                        updatedAt: '2022-12-28T12:47:26.051Z',
                        __v: 0,
                    },
                },
            },
        },
        configFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Error in fetch admin details. || Fail to fetch admin config details..',
            },
        },
        configUpdate: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully enabled features.',
            },
        },
        configUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Admin config data not exist for the organization. || Project feature cannot be disabled. || Error while updating admin config.',
            },
        },
        configActivitySuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity fetched successfully.',
                data: [
                    {
                        _id: '63bbee78bf2757c48221e5f1',
                        configId: '63bbee77bf2757c48221e591',
                        activityDetails: 'Jagadeesha enabled projectFeature,taskFeature,subTaskFeature,shortcutKeyFeature ',
                        configCreatedBy: {
                            id: '63bbee59bf2757c48221e58c',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        createdAt: '2023-01-09T10:37:44.517Z',
                    },
                    {
                        _id: '63bbf6a3bf5982f0338bb8e8',
                        configId: '63bbee77bf2757c48221e591',
                        viewedCount: 2,
                        configViewedBy: {
                            id: '63bbee59bf2757c48221e58c',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        viewedAt: '2023-01-09T11:12:35.841Z',
                    },
                ],
            },
        },
        configActivityFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch Activity, please check Id',
            },
        },
        configActivityDeleteSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity details deleted successfully.',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        configActivityDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete Activity, please check Id' || 'Activity not found to delete, please check Id',
            },
        },
        configActivityFilterSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity search successfully.',
                data: [
                    {
                        _id: '63bbee78bf2757c48221e5f1',
                        configId: '63bbee77bf2757c48221e591',
                        activityDetails: 'Jagadeesha enabled projectFeature,taskFeature,subTaskFeature,shortcutKeyFeature ',
                        configCreatedBy: {
                            id: '63bbee59bf2757c48221e58c',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        createdAt: '2023-01-09T10:37:44.517Z',
                    },
                    {
                        _id: '63bcefca817a604311d821c7',
                        configId: '63bbee77bf2757c48221e591',
                        viewedCount: 2,
                        configViewedBy: {
                            id: '63bbee59bf2757c48221e58c',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        viewedAt: '2023-01-10T04:55:38.984Z',
                    },
                    {
                        _id: '63bd2167e8b0f5a840b7c0c2',
                        configId: '63bbee77bf2757c48221e591',
                        activityDetails: 'Jagadeesha updated  Invitation features ',
                        configUpdatedBy: {
                            id: '63bbee59bf2757c48221e58c',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        updatedAt: '2023-01-10T08:27:19.554Z',
                    },
                ],
            },
        },
        configActivityFilterFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Activity data not found.' || 'Failed to fetch Activity, please check provided data.',
            },
        },
        //language module
        languageUpdateSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Language updated successfully.',
                data: {
                    updateLang: {
                        _id: '63ac3ae9c1ab45e06cf1d13e',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        password: 'Jagan@wm123',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-001',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560001',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: true,
                        dashboardConfig_id: null,
                        verified: false,
                        isAdmin: true,
                        forgotPasswordToken: 'e19f0b90-86db-11ed-81d5-3e5c102c20bf',
                        forgotTokenExpire: '2022-12-26T12:47:25.962Z',
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T12:47:25.963Z',
                        emailValidateToken: 'e19f59b0-86db-11ed-8c6c-e97237a850a3',
                        emailTokenExpire: '2022-12-26T12:47:25.963Z',
                        createdAt: '2022-12-28T12:47:25.963Z',
                        updatedAt: '2022-12-28T12:47:25.963Z',
                        __v: 0,
                    },
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJfaWQiOiI2M2FjM2FlOWMxYWI0NWUwNmNmMWQxM2UiLCJmaXJzdE5hbWUiOiJKYWdhZGVlc2hhIiwibGFzdE5hbWUiOiJSYXZpYmFidSIsInVzZXJOYW1lIjoiSmFnYW5HbGIiLCJwcm9maWxlUGljIjoiaHR0cHM6Ly9yYi5neS9rc21zeGciLCJwYXNzd29yZCI6IkphZ2FuQHdtMTIzIiwiY291bnRyeUNvZGUiOiIrOTEiLCJwaG9uZU51bWJlciI6IjY3ODc5ODY1NDMiLCJlbWFpbCI6ImphZ2FkZWVzaGFyQGdsb2J1c3NvZnQuaW4iLCJvcmdJZCI6IkdMQi1CQU4tMDAxIiwib3JnTmFtZSI6Ikdsb2J1c3NvZnQgVGVjaG5vbG9naWVzIiwiYWRkcmVzcyI6IiMyOSBCSElWRSBNRyBSb2FkLCBNYWhhbGFrc2htaSBDaGFtYmVycyxNRyBSb2FkIE5leHQgdG8gVHJpbml0eSBNZXRybyBTdGF0aW9uIiwiY2l0eSI6IkJhbmdhbG9yZSIsInN0YXRlIjoiS2FybmF0YWthIiwiY291bnRyeSI6IkluZGlhIiwiemlwQ29kZSI6IjU2MDAwMSIsImlzRW1wTW9uaXRvclVzZXIiOmZhbHNlLCJsYXN0VXNlckZldGNoZWQiOm51bGwsImlzQ29uZmlnU2V0Ijp0cnVlLCJkYXNoYm9hcmRDb25maWdfaWQiOm51bGwsInZlcmlmaWVkIjpmYWxzZSwiaXNBZG1pbiI6dHJ1ZSwiZm9yZ290UGFzc3dvcmRUb2tlbiI6ImUxOWYwYjkwLTg2ZGItMTFlZC04MWQ1LTNlNWMxMDJjMjBiZiIsImZvcmdvdFRva2VuRXhwaXJlIjoiMjAyMi0xMi0yNlQxMjo0NzoyNS45NjJaIiwibGFuZ3VhZ2UiOiJlbiIsInBsYW5OYW1lIjoiQmFzaWMiLCJwbGFuSWQiOiI2M2E1OWMwYTJiNzYyYTk1YzNhMzkzMTMiLCJwbGFuVXBkYXRlZEF0IjoiMjAyMi0xMi0yOFQxMjo0NzoyNS45NjNaIiwiZW1haWxWYWxpZGF0ZVRva2VuIjoiZTE5ZjU5YjAtODZkYi0xMWVkLThjNmMtZTk3MjM3YTg1MGEzIiwiZW1haWxUb2tlbkV4cGlyZSI6IjIwMjItMTItMjZUMTI6NDc6MjUuOTYzWiIsImNyZWF0ZWRBdCI6IjIwMjItMTItMjhUMTI6NDc6MjUuOTYzWiIsInVwZGF0ZWRBdCI6IjIwMjItMTItMjhUMTI6NDc6MjUuOTYzWiIsIl9fdiI6MH0sImlhdCI6MTY3MjIzMzk1MywiZXhwIjoxNjcyMzIwMzUzfQ.SPIlEbmKPxz9XpMOioi2fom6hzucDIzxW5u5_51-k28',
                },
            },
        },
        languageFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Unable to update language.',
            },
        },
        //permission sample responses
        permissionSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'PERMISSION_NAME permission created.|| PERMISSION_NAME permissions created, PERMISSION_NAME This permission is already presented.',
            },
        },
        permissionFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message:
                    ' COLLECTION_NAME collection is not present in the database. || Plan exceeded for the Permission feature, please upgrade your plan. || Adding permissions capacity is already reached.',
            },
        },
        permissionPlan: {
            statusCode: 429,
            body: {
                status: 'failed',
                message: 'Plan exceeded for the Permission feature, please upgrade your plan.',
            },
        },
        permissionFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully fetched.',
                data: [
                    {
                        _id: '63ac424a0e894eaa62d5ef0e',
                        orgId: 'GLB-BAN-001',
                        permissionName: 'admin',
                        permissionConfig: {
                            project: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            task: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            subtasks: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            user: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            activity: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            roles: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            comments: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            upload: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            links: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                        },
                        is_default: true,
                        is_fixed: false,
                        createdAt: '2023-01-20T05:38:43.553Z',
                        updatedAt: '2023-01-20T05:38:43.553Z',
                        __v: 0,
                    },
                ],
            },
        },
        permissionFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Invalid Org ID. || Error.',
            },
        },
        updatePermissions: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Permission updated successfully.',
                data: [
                    {
                        _id: '63ac424a0e894eaa62d5ef0e',
                        orgId: 'GLB-BAN-001',
                        permissionName: 'admin',
                        permissionConfig: {
                            project: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },

                            task: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },

                            subtask: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },

                            user: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },

                            activity: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },

                            roles: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },

                            comments: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            upload: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                            links: {
                                view: true,
                                create: true,
                                edit: true,
                                delete: true,
                            },
                        },
                        is_default: true,
                        is_fixed: false,
                        createdAt: '2023-01-20T05:38:43.553Z',
                        updatedAt: '2023-01-20T05:38:43.553Z',
                        __v: 0,
                    },
                ],
            },
        },
        updatePermissionsFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: "Can't update default Permission. || Invalid permission Id. || Vaidation error.",
            },
        },
        deletePermissions: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Permissions deleted successfully.',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        deletePermissionsFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: "Can't update default Permission. || There is no permission present except default permissions. || Invalid permission Id.",
            },
        },
        permissionActivityFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity fetched successfully.',
                data: [
                    {
                        _id: '63cf7aa87237db216211cf18',
                        permissionId: '63cf7aa87237db216211cf17',
                        adminId: '63cf69572daf3a6040ee96ae',
                        activity: 'Jagadeesha created cerftgg permission',
                        permissionCreatedBy: {
                            id: '63cf69572daf3a6040ee96ae',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        createdAt: '2023-01-24T06:28:56.395Z',
                    },
                    {
                        _id: '63cf7b137237db216211cf21',
                        adminId: '63cf69572daf3a6040ee96ae',
                        permissionId: '63cf7aa87237db216211cf17',
                        activity: 'Jagadeesha deleted bgfrrf permission ',
                        permissionDeletedBy: {
                            id: '63cf69572daf3a6040ee96ae',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        deletedAt: '2023-01-24T06:30:43.903Z',
                    },
                    {
                        _id: '63cf7b097237db216211cf1f',
                        permissionId: '63cf7aa87237db216211cf17',
                        adminId: '63cf69572daf3a6040ee96ae',
                        activity: 'Jagadeesha updated permission name as bgfrrf',
                        permissionUpdatedBy: {
                            id: '63cf69572daf3a6040ee96ae',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        updatedAt: '2023-01-24T06:30:33.433Z',
                    },
                ],
            },
        },
        permissionFetchActivityFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch activity. || Invalid permission Id. || Vaidation error.',
            },
        },
        permissionFilterActivitySuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity search successfully.',
                data: [
                    {
                        _id: '63cf7aad7237db216211cf1a',
                        adminId: '63cf69572daf3a6040ee96ae',
                        activity: 'Jagadeesha viewed all permissions',
                        viewedCount: 4,
                        permissionViewedBy: {
                            id: '63cf69572daf3a6040ee96ae',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        viewedAt: '2023-01-24T06:35:13.277Z',
                    },
                ],
            },
        },
        permissionFilterActivityFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch Activity, please check provided data.',
            },
        },
        permissionActivityDelete: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity deleted successfully.',
                data: {
                    acknowledged: true,
                    deletedCount: 2,
                },
            },
        },
        permissionActivityDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete Activity, please check provided ID.',
            },
        },
        //plans module sample responses
        fetchPlan: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Plan fetch successFully.',
                data: [
                    {
                        _id: '63ac3adec1ab45e06cf1d137',
                        planName: 'Basic',
                        planPrice: 10000,
                        isPlanActive: true,
                        projectFeatureCount: 5,
                        taskFeatureCount: 20,
                        userFeatureCount: 50,
                        subTaskFeatureCount: 10,
                        customizeRoles: 2,
                        customizePermission: 1,
                        customizeTaskType: 2,
                        customizeTaskStage: 2,
                        customizeTaskStatus: 2,
                        customizeSubTaskType: 2,
                        customizeSubTaskStatus: 2,
                        categoriesCount: 2,
                        currencyType: 'INR',
                        currencyLogo: '₹',
                        createdAt: '2022-12-28T12:47:25.815Z',
                        updatedAt: '2022-12-28T12:47:25.815Z',
                        __v: 0,
                    },
                ],
            },
        },
        fetchPlanFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Fail to fetch plan. || Error while fetching plans.',
            },
        },
        assignPlanSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Plan added successfully.',
                data: {
                    resultData: {
                        _id: '63ac3ae9c1ab45e06cf1d13e',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        password: 'Jagan@wm123',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-001',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560001',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: true,
                        dashboardConfig_id: null,
                        verified: false,
                        isAdmin: true,
                        forgotPasswordToken: 'e19f0b90-86db-11ed-81d5-3e5c102c20bf',
                        forgotTokenExpire: '2022-12-26T12:47:25.962Z',
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T12:47:25.963Z',
                        emailValidateToken: 'e19f59b0-86db-11ed-8c6c-e97237a850a3',
                        emailTokenExpire: '2022-12-26T12:47:25.963Z',
                        createdAt: '2022-12-28T12:47:25.963Z',
                        updatedAt: '2022-12-28T12:47:25.963Z',
                        __v: 0,
                    },
                    accessToken:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJfaWQiOiI2M2FjM2FlOWMxYWI0NWUwNmNmMWQxM2UiLCJmaXJzdE5hbWUiOiJKYWdhZGVlc2hhIiwibGFzdE5hbWUiOiJSYXZpYmFidSIsInVzZXJOYW1lIjoiSmFnYW5HbGIiLCJwcm9maWxlUGljIjoiaHR0cHM6Ly9yYi5neS9rc21zeGciLCJwYXNzd29yZCI6IkphZ2FuQHdtMTIzIiwiY291bnRyeUNvZGUiOiIrOTEiLCJwaG9uZU51bWJlciI6IjY3ODc5ODY1NDMiLCJlbWFpbCI6ImphZ2FkZWVzaGFyQGdsb2J1c3NvZnQuaW4iLCJvcmdJZCI6IkdMQi1CQU4tMDAxIiwib3JnTmFtZSI6Ikdsb2J1c3NvZnQgVGVjaG5vbG9naWVzIiwiYWRkcmVzcyI6IiMyOSBCSElWRSBNRyBSb2FkLCBNYWhhbGFrc2htaSBDaGFtYmVycyxNRyBSb2FkIE5leHQgdG8gVHJpbml0eSBNZXRybyBTdGF0aW9uIiwiY2l0eSI6IkJhbmdhbG9yZSIsInN0YXRlIjoiS2FybmF0YWthIiwiY291bnRyeSI6IkluZGlhIiwiemlwQ29kZSI6IjU2MDAwMSIsImlzRW1wTW9uaXRvclVzZXIiOmZhbHNlLCJsYXN0VXNlckZldGNoZWQiOm51bGwsImlzQ29uZmlnU2V0Ijp0cnVlLCJkYXNoYm9hcmRDb25maWdfaWQiOm51bGwsInZlcmlmaWVkIjpmYWxzZSwiaXNBZG1pbiI6dHJ1ZSwiZm9yZ290UGFzc3dvcmRUb2tlbiI6ImUxOWYwYjkwLTg2ZGItMTFlZC04MWQ1LTNlNWMxMDJjMjBiZiIsImZvcmdvdFRva2VuRXhwaXJlIjoiMjAyMi0xMi0yNlQxMjo0NzoyNS45NjJaIiwibGFuZ3VhZ2UiOiJlbiIsInBsYW5OYW1lIjoiQmFzaWMiLCJwbGFuSWQiOiI2M2E1OWMwYTJiNzYyYTk1YzNhMzkzMTMiLCJwbGFuVXBkYXRlZEF0IjoiMjAyMi0xMi0yOFQxMjo0NzoyNS45NjNaIiwiZW1haWxWYWxpZGF0ZVRva2VuIjoiZTE5ZjU5YjAtODZkYi0xMWVkLThjNmMtZTk3MjM3YTg1MGEzIiwiZW1haWxUb2tlbkV4cGlyZSI6IjIwMjItMTItMjZUMTI6NDc6MjUuOTYzWiIsImNyZWF0ZWRBdCI6IjIwMjItMTItMjhUMTI6NDc6MjUuOTYzWiIsInVwZGF0ZWRBdCI6IjIwMjItMTItMjhUMTI6NDc6MjUuOTYzWiIsIl9fdiI6MH0sImlhdCI6MTY3MjI4NTQ0NywiZXhwIjoxNjcyMzcxODQ3fQ.EsNWhk_-_4UXJeDuIo6Yob-ZgZn9Wo1xCYORK4VKkMQ',
                },
            },
        },
        assignPlanFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Error while adding plan. || Please select valid Plan.',
            },
        },
        fetchPlanHistory: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Plan history fetched successfully.',
                data: [
                    {
                        _id: '63be8ab256164bef2f3d6a72',
                        planName: 'Basic',
                        planHistory: 'Jagadeesha updated plan for 60 DAY  ',
                        adminId: '63be8a5456164bef2f3d6a67',
                        planStartDate: '2023-01-11T10:08:50.142Z',
                        planExpireDate: '2023-03-12T10:08:50.114Z',
                    },
                    {
                        _id: '63be9882edda08988e104db2',
                        planName: 'Gold',
                        planHistory: 'Jagadeesha updated plan for 1 MONTHS  ',
                        adminId: '63be8a5456164bef2f3d6a67',
                        planStartDate: '2023-01-11T11:07:46.045Z',
                        planExpireDate: '2023-02-11T11:07:46.010Z',
                    },
                    {
                        _id: '63be998a7c68844350ad4b5f',
                        planName: 'Premium',
                        planHistory: 'Jagadeesha updated plan for 1 YEARS  ',
                        adminId: '63be8a5456164bef2f3d6a67',
                        planStartDate: '2023-01-11T11:12:10.356Z',
                        planExpireDate: '2024-01-11T11:12:10.319Z',
                    },
                    {
                        _id: '63be9b2551c67678867a3675',
                        planName: 'Basic',
                        planHistory: 'Jagadeesha updated plan for 60 DAY>0?S: DAY ',
                        adminId: '63be8a5456164bef2f3d6a67',
                        planStartDate: '2023-01-11T11:19:01.407Z',
                        planExpireDate: '2023-03-12T11:19:01.366Z',
                    },
                ],
            },
        },
        fetchPlanHistoryFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Plan history is not present. || Error while fetching plan history, please check ID.',
            },
        },
        planActivityFilterSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Activity search successfully.',
                data: [
                    {
                        _id: '63ce302e94e201c8c6d1f504',
                        planHistory: 'Jagadeesha viewed plans',
                        adminId: null,
                        planViewedBy: {
                            id: '63ce1e3e6074b2311133f5ab',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        viewedAt: '2023-01-23T06:58:54.962Z',
                    },
                    {
                        _id: '63ce34413b990901b652de86',
                        planHistory: 'Jagadeesha viewed plans',
                        adminId: null,
                        planViewedBy: {
                            id: '63ce1e3e6074b2311133f5ab',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        viewedAt: '2023-01-23T07:16:17.512Z',
                    },
                    {
                        _id: '63ce34aaf01453d5784ebc7a',
                        planHistory: 'Jagadeesha viewed plans',
                        adminId: null,
                        planViewedBy: {
                            id: '63ce1e3e6074b2311133f5ab',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        viewedAt: '2023-01-23T07:18:02.562Z',
                    },
                    {
                        _id: '63ce3904b77b69d92305393d',
                        planName: 'Premium',
                        planHistory: 'Jagadeesha updated plan for 1 YEARS ',
                        planSelectedBy: {
                            id: '63ce1e3e6074b2311133f5ab',
                            name: 'Jagadeesha',
                            profilePic: 'https://rb.gy/ksmsxg',
                        },
                        planStartDate: '2023-01-23T07:36:36.697Z',
                        planExpireDate: '2024-01-23T07:36:36.668Z',
                    },
                ],
            },
        },
        planActivityFilterFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Activity data not found.',
            },
        },
        //project module sample response
        projectCreate: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Project created successfully.',
                data: {
                    response: {
                        acknowledged: true,
                        insertedId: '63ad1241ddb1243181626137',
                    },
                    data: {
                        projectName: 'EmpMonitor WM Module',
                        projectCode: 'E-101',
                        description: 'Employeee Monitoring WM Module handles the Project and Task Modules',
                        startDate: '2022-03-10T18:30:00.000Z',
                        endDate: '2022-03-20T18:30:00.000Z',
                        userAssigned: [
                            {
                                id: '63ad121fddb1243181626135',
                                role: 'Member',
                            },
                        ],
                        plannedBudget: 20000,
                        actualBudget: 10000,
                        adminProfilePic: 'admin.jpeg',
                        projectLogo: 'project.jpeg',
                        currencyType: 'INR',
                        status: 'Todo',
                        progress: 0,
                        softDeleted: false,
                        adminName: 'Jagadeesha Ravibabu',
                        superUserId: '63ac3ae9c1ab45e06cf1d13e',
                        createdAt: '2022-12-29T04:06:25.684Z',
                        _id: '63ad1241ddb1243181626137',
                    },
                },
            },
        },
        projectCreateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to create project. || Project Already Exist. || Plan exceeded for the Project feature, please upgrade your plan.',
            },
        },
        projectFeaturePlan: {
            statusCode: 429,
            body: {
                status: 'failed',
                message: 'Plan exceeded for the Project feature, Please upgrade your plan.',
            },
        },
        projectFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Project fetched successfully.',
                data: {
                    projectCount: 1,
                    skip: 0,
                    projectData: [
                        {
                            taskCount: 0,
                            subTaskCount: 0,
                            progress: 0,
                            project: {
                                _id: '63ad1241ddb1243181626137',
                                projectName: 'EmpMonitor WM Module',
                                projectCode: 'E-101',
                                description: 'Employeee Monitoring WM Module handles the Project and Task Modules',
                                startDate: '2022-03-10T18:30:00.000Z',
                                endDate: '2022-03-20T18:30:00.000Z',
                                userAssigned: [
                                    {
                                        _id: '63ad121fddb1243181626135',
                                        firstName: 'Jagadeesha',
                                        lastName: 'Ravibabu',
                                        email: 'jagadeesha@empmonitor.com',
                                        role: 'Member',
                                        permission: 'write',
                                        profilePic: 'globus.pneg',
                                        isAdmin: false,
                                        verified: false,
                                        orgId: 'GLB-BAN-001',
                                        createdAt: '2022-12-29T04:05:51.885Z',
                                    },
                                ],
                                plannedBudget: 20000,
                                actualBudget: 10000,
                                adminProfilePic: 'admin.jpeg',
                                projectLogo: 'project.jpeg',
                                currencyType: 'INR',
                                status: 'Todo',
                                progress: 0,
                                softDeleted: false,
                                adminName: 'Jagadeesha Ravibabu',
                                superUserId: '63ac3ae9c1ab45e06cf1d13e',
                                createdAt: '2022-12-29T04:06:25.684Z',
                            },
                        },
                    ],
                },
            },
        },
        projectFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch project, please check project ID. || Project ID not found.',
            },
        },
        updateProSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Project updated successfully.',
                data: {
                    _id: '63ad1241ddb1243181626137',
                    projectName: 'EmpMonitor WM Module update',
                    projectCode: 'E-101',
                    description: 'Employeee Monitoring WM Module handles the Project and Task Modules updates',
                    startDate: '2022-03-10T18:30:00.000Z',
                    endDate: '2022-03-21T18:30:00.000Z',
                    userAssigned: [
                        {
                            id: '63ad121fddb1243181626135',
                            role: 'Member',
                        },
                    ],
                    plannedBudget: 20000,
                    actualBudget: 10000,
                    adminProfilePic: 'admin.jpeg',
                    projectLogo: 'project.jpeg',
                    currencyType: 'INR',
                    status: 'Todo',
                    progress: 0,
                    softDeleted: false,
                    adminName: 'Jagadeesha Ravibabu',
                    superUserId: '63ac3ae9c1ab45e06cf1d13e',
                    createdAt: '2022-12-29T04:06:25.684Z',
                    updatedAt: '2022-12-29T04:19:24.190Z',
                    updatedBy: '63ac3ae9c1ab45e06cf1d13e',
                },
            },
        },
        updateProFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to updated project, please check project ID. || Project ID not found.',
            },
        },
        deleteSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Project deleted successfully.',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        deleteProFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete project, please check project ID. || Project ID not found.',
            },
        },
        searchSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result.',
                data: {
                    skip: 0,
                    projectCount: 1,
                    projectData: [
                        {
                            taskCount: 0,
                            progress: 0,
                            project: {
                                _id: '63ad1bd4f2884671429532b1',
                                projectName: 'EmpMonitor WM Module',
                                projectCode: 'E-101',
                                description: 'Employeee Monitoring WM Module handles the Project and Task Modules',
                                startDate: '2022-03-10T18:30:00.000Z',
                                endDate: '2022-03-20T18:30:00.000Z',
                                userAssigned: [
                                    {
                                        id: '63ad121fddb1243181626135',
                                        role: 'Member',
                                    },
                                ],
                                plannedBudget: 20000,
                                actualBudget: 10000,
                                adminProfilePic: 'admin.jpeg',
                                projectLogo: 'project.jpeg',
                                currencyType: 'INR',
                                status: 'Todo',
                                progress: 0,
                                softDeleted: false,
                                adminName: 'Jagadeesha Ravibabu',
                                superUserId: '63ac3ae9c1ab45e06cf1d13e',
                                createdAt: '2022-12-29T04:47:16.333Z',
                            },
                        },
                    ],
                },
            },
        },
        searchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search.',
            },
        },
        filterSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result.',
                data: [
                    {
                        _id: '63b50bb90d12b6baf18e667e',
                        projectName: 'EmpMonitor WM Module1',
                        projectCode: 'E-101',
                        description: 'Employee Monitoring WM Module handles the Project and Task Modules',
                        startDate: '2022-03-10T18:30:00.000Z',
                        endDate: '2022-03-20T18:30:00.000Z',
                        userAssigned: [
                            {
                                id: '63ad121fddb1243181626135',
                                role: 'Sponsor',
                            },
                        ],
                        plannedBudget: 20000,
                        actualBudget: 10000,
                        adminProfilePic: 'admin.jpeg',
                        projectLogo: 'project.jpeg',
                        currencyType: 'INR',
                        status: 'Todo',
                        progress: 0,
                        softDeleted: false,
                        adminName: 'Jagadeesha Ravibabu',
                        superUserId: '63ac3ae9c1ab45e06cf1d13e',
                        createdAt: '2023-01-04T05:16:41.042Z',
                    },
                ],
            },
        },
        filterFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search',
                error: {},
            },
        },
        projectExist: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Project is already exist.',
            },
        },
        projectNotExist: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Project is not exist.',
            },
        },

        //ProjectComment module sample responses
        commentSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment added successfully.',
                data: {
                    acknowledged: true,
                    insertedId: '63ad1f870a35c73b8a5e0961',
                },
            },
        },
        commentFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to add comment. || Unable to fetch comment, please check ID.',
            },
        },
        commentFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment fetched successfully.',
                data: {
                    _id: '63ad1f870a35c73b8a5e0961',
                    project_id: '63ad1bd4f2884671429532b1',
                    comment: 'project is on hold for some days',
                    superUserId: '63ac3ae9c1ab45e06cf1d13e',
                    commentCreator: {
                        creatorId: '63ac3ae9c1ab45e06cf1d13e',
                        creatorName: 'Jagadeesha',
                        creatorProfilePic: 'https://rb.gy/ksmsxg',
                    },
                    is_edited: false,
                    createdAt: '2022-12-29T05:03:03.050Z',
                },
            },
        },
        commentFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch comment, please check ID. || Unable to fetch comment, please check ID.',
            },
        },
        commentUpdateSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment updated successfully.',
                data: {
                    lastErrorObject: {
                        n: 1,
                        updatedExisting: true,
                    },
                    value: {
                        _id: '63ad1f870a35c73b8a5e0961',
                        project_id: '63ad1bd4f2884671429532b1',
                        comment: 'project is on hold for some days',
                        superUserId: '63ac3ae9c1ab45e06cf1d13e',
                        commentCreator: {
                            creatorId: '63ac3ae9c1ab45e06cf1d13e',
                            creatorName: 'Jagadeesha',
                            creatorProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        is_edited: false,
                        createdAt: '2022-12-29T05:03:03.050Z',
                    },
                    ok: 1,
                },
            },
        },
        commentUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to updated comment, please check comment ID. || Unable to fetch comment, please check ID.',
            },
        },
        commentDeleteSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Comment deleted successfully.',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        commentDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to updated comment, please check comment ID.',
            },
        },
        //projectActivity module sample responses
        activityFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                data: [
                    {
                        _id: '63ad1bd4f2884671429532b2',
                        project_id: '63ad1bd4f2884671429532b1',
                        activity: 'Jagadeesha created the project EmpMonitor WM Module ',
                        createdAt: '2022-12-29T04:47:16.333Z',
                        activityCreator: {
                            creatorId: '63ac3ae9c1ab45e06cf1d13e',
                            creatorName: 'Jagadeesha',
                            creatorProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        superUserId: '63ac3ae9c1ab45e06cf1d13e',
                    },
                ],
            },
        },
        activityFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch activity, please check given ID. || Activity id not found.',
            },
        },
        activityDelete: {
            statusCode: 200,
            body: {
                status: 'success',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        activityDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to delete activity. || Project is present, but activity of this project is not present.',
            },
        },
        activityFilterSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                data: [
                    {
                        _id: '63b3fbdee11db082377d9218',
                        project_id: '63b3fbdee11db082377d9217',
                        activity: 'Jagadeesha created the project EmpMonitor WM CLOUD slowest ',
                        superUserId: '63ac3ae9c1ab45e06cf1d13e',
                        activityCreator: {
                            creatorId: '63ac3ae9c1ab45e06cf1d13e',
                            creatorName: 'Jagadeesha',
                            creatorProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        createdAt: '2023-01-03T09:56:46.623Z',
                    },
                    {
                        _id: '63b401e8fd505491d50501ba',
                        project_id: '63b401e8fd505491d50501b9',
                        activity: 'Jagadeesha created the project EmpMonitor WM CLOUD slowest ',
                        superUserId: '63ac3ae9c1ab45e06cf1d13e',
                        activityCreator: {
                            creatorId: '63ac3ae9c1ab45e06cf1d13e',
                            creatorName: 'Jagadeesha',
                            creatorProfilePic: 'globus.pneg',
                        },
                        createdAt: '2023-01-03T10:22:32.978Z',
                    },
                ],
            },
        },
        activityFilterFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Activity not found.',
            },
        },
        //roles module sample responses
        rolesCreate: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'ROLE_NAME roles created successfully.ROLE_NAME roles already exist with organiozation.|| ROLE_NAME roles created successfully.',
            },
        },
        rolesFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'ROLE_NAME role already exist with organiozation. || Adding roles capacity is already reached. || Error creating roles.',
            },
        },
        rolesPlan: {
            statusCode: 429,
            body: {
                status: 'failed',
                message: 'Plan exceeded for the Project feature, please upgrade your plan.',
            },
        },
        rolesFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully fetched.',
                data: {
                    rolesCount: 6,
                    totalRolesData: [
                        {
                            _id: '63ac424a0e894eaa62d5ef0d',
                            orgId: 'GLB-BAN-001',
                            roles: 'Member',
                            is_default: true,
                            createdAt: '2022-12-28T13:18:54.750Z',
                            updatedAt: '2022-12-28T13:18:54.750Z',
                            __v: 0,
                        },
                        {
                            _id: '63ac424a0e894eaa62d5ef12',
                            orgId: 'GLB-BAN-001',
                            roles: 'Sponsor',
                            is_default: true,
                            createdAt: '2022-12-28T13:18:54.750Z',
                            updatedAt: '2022-12-28T13:18:54.750Z',
                            __v: 0,
                        },
                    ],
                },
            },
        },
        rolesFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Unable to fetch roles please check with ID. || Unable to fetch roles from this organiozation. || Unable to fetch roles please check with ID.',
            },
        },
        rolesUpdateSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully updated.',
                data: {
                    lastErrorObject: {
                        n: 1,
                        updatedExisting: true,
                    },
                    value: {
                        _id: '63ad2faf28b2d14f27cefefb',
                        orgId: 'GLB-BAN-001',
                        roles: 'ghtgb',
                        is_default: false,
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        createdAt: '2022-12-29T06:11:59.853Z',
                        updatedAt: '2022-12-29T06:26:10.589Z',
                    },
                    ok: 1,
                },
            },
        },
        rolesUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: "This role is already present, unable to update rolename. || Can't update default role and roleName is already present. || Can't update default role.",
            },
        },
        rolesDelete: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Roles deleted successfully.',
                data: {
                    acknowledged: true,
                    deletedCount: 1,
                },
            },
        },
        rolesDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: "Can't delete default roles. || Can't delete role, this role is assigned to some users. || There is no roles present except default roles.",
            },
        },
        rolesSearch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result.',
                data: {
                    skip: 0,
                    TotalRolesCount: 5,
                    RolesData: [
                        {
                            role: {
                                _id: '63ac424a0e894eaa62d5ef19',
                                orgId: 'GLB-BAN-001',
                                roles: 'Manager',
                                is_default: true,
                                createdAt: '2022-12-28T13:18:54.750Z',
                                updatedAt: '2022-12-28T13:18:54.750Z',
                                __v: 0,
                            },
                            AssignedRole: [],
                        },
                        {
                            role: {
                                _id: '63ac424a0e894eaa62d5ef0d',
                                orgId: 'GLB-BAN-001',
                                roles: 'Member',
                                is_default: true,
                                createdAt: '2022-12-28T13:18:54.750Z',
                                updatedAt: '2022-12-28T13:18:54.750Z',
                                __v: 0,
                            },
                        },
                    ],
                },
            },
        },
        rolesSearchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search.',
            },
        },
        rolesFetchPermission: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully fetched.',
                data: {
                    RoleName: 'Manager',
                    PermissionCount: 0,
                    PermissionData: [
                        {
                            _id: '63bfb6145981e2871e5ccb80',
                            firstName: 'Jagadeesha',
                            lastName: 'Ravibabu',
                            email: 'jagadeesha@empmonitor.com',
                            role: 'Member',
                            permission: 'write',
                            profilePic: 'globus.pneg',
                            verified: false,
                            softDeleted: false,
                            orgId: 'GLB-BAN-001',
                            adminId: '63beaf712baa2fe276babc2d',
                            password: 'qUIYrAwOwp',
                            emailValidateToken: '7de9d280-9278-11ed-8cee-9091360d36ac',
                            emailTokenExpire: '2023-01-09T07:26:12.456Z',
                            createdAt: '2023-01-12T07:26:12.456Z',
                        },
                    ],
                },
            },
        },
        rolesPermissionFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Unable to fetch roles from this organiozation. || Unable to fetch roles please check with ID.',
            },
        },
        //user module sample responses
        userCreate: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'New user created successfully.',
                data: [
                    {
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        email: 'jjagadeesha@empmonitor.com',
                        role: 'Member',
                        permission: 'write',
                        profilePic: 'globus.pneg',
                        verified: false,
                        softDeleted: false,
                        orgId: 'GLB-BAN-001',
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        password: 'LUJUkvgCuM',
                        emailValidateToken: '362812c0-8776-11ed-893e-cf5d5fc76344',
                        emailTokenExpire: '2022-12-26T07:12:10.284Z',
                        createdAt: '2022-12-29T07:12:10.284Z',
                        _id: '63ad3dca233a77513191db22',
                    },
                ],
            },
        },
        userCreateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Error while adding user.',
            },
        },
        userPlan: {
            statusCode: 429,
            body: {
                status: 'failed',
                message: 'Plan exceeded for the User feature, please upgrade your plan.',
            },
        },
        userFetchSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'User fetched successful.',
                data: {
                    TotalUserCount: 6,
                    Progress: 0,
                    user: [
                        {
                            _id: '63ad121fddb1243181626135',
                            firstName: 'Jagadeesha',
                            lastName: 'Ravibabu',
                            email: 'jagadeesha@empmonitor.com',
                            role: 'Member',
                            permission: 'write',
                            profilePic: 'globus.pneg',
                            verified: false,
                            softDeleted: false,
                            orgId: 'GLB-BAN-001',
                            adminId: '63ac3ae9c1ab45e06cf1d13e',
                            password: 'MwVjYDnEpw',
                            emailValidateToken: '2f4fbfd0-875c-11ed-8767-fc9295f8e869',
                            emailTokenExpire: '2022-12-26T04:05:51.885Z',
                            createdAt: '2022-12-29T04:05:51.885Z',
                            Project_details: {
                                'Total project count': 0,
                                projects: [],
                            },
                            task_details: {
                                'Total task count': 0,
                                task: [],
                            },
                            subTask_details: {
                                'Total sub-task count': 0,
                                subtask: [],
                            },
                        },
                    ],
                },
            },
        },
        userFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Fail to fetch user details.',
            },
        },
        userUpdateSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'User updated successfully',
                data: [
                    {
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        email: 'jjagadeesha@empmonitor.com',
                        role: 'Member',
                        permission: 'write',
                        profilePic: 'globus.pneg',
                        verified: false,
                        softDeleted: false,
                        orgId: 'GLB-BAN-001',
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        password: 'LUJUkvgCuM',
                        emailValidateToken: '362812c0-8776-11ed-893e-cf5d5fc76344',
                        emailTokenExpire: '2022-12-26T07:12:10.284Z',
                        createdAt: '2022-12-29T07:12:10.284Z',
                        _id: '63ad3dca233a77513191db22',
                    },
                ],
            },
        },
        userUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'PERMISSION_NAME permission not exist please select valid permission. || Fail to update, invalid User ID.',
            },
        },
        userDeleteSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'User deleted successfully.',
                data: {
                    lastErrorObject: {
                        n: 1,
                        updatedExisting: true,
                    },
                    value: {
                        _id: '63ad3eb3473ce13edb4636ab',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        email: 'jjagadeesha@empmonitor.com',
                        role: 'Member',
                        permission: 'write',
                        profilePic: 'globus.pneg',
                        verified: false,
                        softDeleted: true,
                        orgId: 'GLB-BAN-001',
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        password: 'c4tunGvUf4',
                        emailValidateToken: 'c14504d0-8776-11ed-8ccb-fdb371b67976',
                        emailTokenExpire: '2022-12-26T07:16:03.677Z',
                        createdAt: '2022-12-29T07:16:03.677Z',
                        deletedAt: '2022-12-29T07:41:10.951Z',
                    },
                    ok: 1,
                },
            },
        },
        userDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Invalid User ID.',
            },
        },
        recoverableUser: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'User fetched successful.',
                data: {
                    users: [
                        {
                            _id: '63ad3eb3473ce13edb4636ab',
                            firstName: 'Jagadeesha',
                            lastName: 'Ravibabu',
                            email: 'jjagadeesha@empmonitor.com',
                            role: 'Member',
                            permission: 'write',
                            profilePic: 'globus.pneg',
                            isAdmin: false,
                            verified: false,
                            softDeleted: true,
                            orgId: 'GLB-BAN-001',
                            createdAt: '2022-12-29T07:16:03.677Z',
                            Project_details: {
                                'Total project count': 0,
                                projects: [],
                            },
                            task_details: {
                                'Total task count': 0,
                                task: [],
                            },
                            subTask_details: {
                                'Total sub-task count': 0,
                                subtask: [],
                            },
                        },
                    ],
                    count: 1,
                },
            },
        },
        recoverableUserFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Users not  present in the organization check Organization Id.',
            },
        },
        searchScu: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Search result.',
                data: {
                    skip: 0,
                    userCount: 6,
                    userData: [
                        {
                            _id: '63ad121fddb1243181626135',
                            firstName: 'Jagadeesha',
                            lastName: 'Ravibabu',
                            email: 'jagadeesha@empmonitor.com',
                            role: 'Member',
                            permission: 'write',
                            profilePic: 'globus.pneg',
                            verified: false,
                            softDeleted: false,
                            orgId: 'GLB-BAN-001',
                            adminId: '63ac3ae9c1ab45e06cf1d13e',
                            password: 'MwVjYDnEpw',
                            emailValidateToken: '2f4fbfd0-875c-11ed-8767-fc9295f8e869',
                            emailTokenExpire: '2022-12-26T04:05:51.885Z',
                            createdAt: '2022-12-29T04:05:51.885Z',
                        },
                        {
                            _id: '63ad3dca233a77513191db22',
                            firstName: 'Jagadeesha',
                            lastName: 'Ravibabu',
                            email: 'jjagadeesha@empmonitor.com',
                            role: 'Member',
                            permission: 'write',
                            profilePic: 'globus.pneg',
                            verified: false,
                            softDeleted: false,
                            orgId: 'GLB-BAN-001',
                            adminId: '63ac3ae9c1ab45e06cf1d13e',
                            password: 'LUJUkvgCuM',
                            emailValidateToken: '362812c0-8776-11ed-893e-cf5d5fc76344',
                            emailTokenExpire: '2022-12-26T07:12:10.284Z',
                            createdAt: '2022-12-29T07:12:10.284Z',
                        },
                    ],
                },
            },
        },
        searchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to search.',
            },
        },
        fetchRoleByUser: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'User fetched successful',
                data: {
                    TotalUserCount: 5,
                    data: [
                        {
                            _id: '63ad121fddb1243181626135',
                            firstName: 'Jagadeesha',
                            lastName: 'Ravibabu',
                            email: 'jagadeesha@empmonitor.com',
                            role: 'Member',
                            permission: 'write',
                            profilePic: 'globus.pneg',
                            verified: false,
                            softDeleted: false,
                            orgId: 'GLB-BAN-001',
                            adminId: '63ac3ae9c1ab45e06cf1d13e',
                            password: 'MwVjYDnEpw',
                            emailValidateToken: '2f4fbfd0-875c-11ed-8767-fc9295f8e869',
                            emailTokenExpire: '2022-12-26T04:05:51.885Z',
                            createdAt: '2022-12-29T04:05:51.885Z',
                        },
                    ],
                },
            },
        },
        fetchRoleByUserFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Invalid Role Name.',
            },
        },
        //Shortcut-Keys module sample responses
        shortCutKeySuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Default Shortcut Key created successfully.',
                data: {
                    acknowledged: true,
                    insertedId: '63ad49e1d2614d494f6e4164',
                },
            },
        },
        shortCutKeyFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'KEY_NAME shortcut Key already present.',
            },
        },
        shortKeyFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Shortcut Keys fetching successful.',
                data: [
                    {
                        _id: '63ac3dd9c1ab45e06cf1d157',
                        keystroke: 'CTRL + O',
                        feature: 'Reset All Data',
                        code: 80,
                        shortCutType: 'global',
                        isDefault: true,
                        isEditable: false,
                        createdAt: '2022-12-28T12:47:26.076Z',
                        updatedAt: '2022-12-28T12:47:26.076Z',
                        createdBy: [],
                        updatedBy: [],
                        __v: 0,
                    },
                    {
                        _id: '63ac3dd9c1ab45e06cf1d186',
                        keystroke: 'CTRL + D',
                        feature: 'View Dashboard',
                        code: 90,
                        shortCutType: 'global',
                        isDefault: true,
                        isEditable: false,
                        createdAt: '2022-12-28T12:47:26.076Z',
                        updatedAt: '2022-12-28T12:47:26.076Z',
                        createdBy: [],
                        updatedBy: [],
                        __v: 0,
                    },
                    {
                        _id: '63ac3dd9c1ab45e06cf1d190',
                        keystroke: 'CTRL + P',
                        feature: 'View All Project',
                        code: 100,
                        shortCutType: 'global',
                        isDefault: true,
                        isEditable: false,
                        createdAt: '2022-12-28T12:47:26.076Z',
                        updatedAt: '2022-12-28T12:47:26.076Z',
                        createdBy: [],
                        updatedBy: [],
                        __v: 0,
                    },
                ],
            },
        },
        shortKeyFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch Shortcut keys.',
            },
        },
        shortKeyUpdateSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Shortcut Keys updated successful.',
                data: [
                    {
                        _id: '63ac3dd9c1ab45e06cf1d157',
                        keystroke: 'CTRL + O',
                        feature: 'Reset All Data',
                        code: 80,
                        shortCutType: 'global',
                        isDefault: true,
                        isEditable: false,
                        createdAt: '2022-12-28T12:47:26.076Z',
                        updatedAt: '2022-12-28T12:47:26.076Z',
                        createdBy: [],
                        updatedBy: [],
                        __v: 0,
                    },
                ],
            },
        },
        shortKeyUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update Shortcut keys.',
            },
        },
        shortKeyDeleteSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Deleted Shortcutkey with id:ID_VALUE',
            },
        },
        shortKeyDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Fail to deleted Shortcut key.',
            },
        },
        dashboardConfigSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Dashboard config created successfully.',
                data: {
                    dashboardConfigData: {
                        _id: '63ac3ae9c1ab45e06cf1d13e',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        password: 'Jagan@wm123',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-001',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560001',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: true,
                        dashboardConfig_id: '1 ',
                        verified: false,
                        isAdmin: true,
                        forgotPasswordToken: 'e19f0b90-86db-11ed-81d5-3e5c102c20bf',
                        forgotTokenExpire: '2022-12-26T12:47:25.962Z',
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T12:47:25.963Z',
                        emailValidateToken: 'e19f59b0-86db-11ed-8c6c-e97237a850a3',
                        emailTokenExpire: '2022-12-26T12:47:25.963Z',
                        createdAt: '2022-12-28T12:47:25.963Z',
                        updatedAt: '2022-12-28T12:47:25.963Z',
                        __v: 0,
                        dashboardConfig: {
                            project_status: 1,
                            project_progress: 1,
                            project_recent: 1,
                            project_member: 1,
                            project_by_status: 1,
                            project_task: 1,
                            project_budget_grid: 1,
                            project_grid_XL: 1,
                        },
                        dashboardConfigCreatedAt: '2022-12-29T11:46:56.210Z',
                        dashboardConfigUpdatedAt: '2022-12-29T11:46:56.210Z',
                    },
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXNoYm9hcmRDb25maWdJZCI6IjEgIiwiaWF0IjoxNjcyMzE0NDE2LCJleHAiOjE2NzI0MDA4MTZ9.REoCUmv3gU3Ra_eRFC0TdTj6MazS8l_249Ae12OcmiE',
                },
            },
        },
        dashboardConfigFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Please select valid Dashboard Configuration.',
            },
        },
        dashboardConfigFetch: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Dashboard Config Fetch sucessfully.',
                data: {
                    _id: '63ac3ae9c1ab45e06cf1d13e',
                    firstName: 'Jagadeesha',
                    lastName: 'Ravibabu',
                    userName: 'JaganGlb',
                    profilePic: 'https://rb.gy/ksmsxg',
                    password: 'Jagan@wm123',
                    countryCode: '+91',
                    phoneNumber: '6787986543',
                    email: 'jagadeeshar@globussoft.in',
                    orgId: 'GLB-BAN-001',
                    orgName: 'Globussoft Technologies',
                    address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: 'India',
                    zipCode: '560001',
                    isEmpMonitorUser: false,
                    lastUserFetched: null,
                    isConfigSet: true,
                    dashboardConfig_id: '1 ',
                    verified: false,
                    isAdmin: true,
                    forgotPasswordToken: 'e19f0b90-86db-11ed-81d5-3e5c102c20bf',
                    forgotTokenExpire: '2022-12-26T12:47:25.962Z',
                    language: 'en',
                    planName: 'Basic',
                    planId: '63a59c0a2b762a95c3a39313',
                    planUpdatedAt: '2022-12-28T12:47:25.963Z',
                    emailValidateToken: 'e19f59b0-86db-11ed-8c6c-e97237a850a3',
                    emailTokenExpire: '2022-12-26T12:47:25.963Z',
                    createdAt: '2022-12-28T12:47:25.963Z',
                    updatedAt: '2022-12-28T12:47:25.963Z',
                    __v: 0,
                    dashboardConfig: {
                        project_status: 1,
                        project_progress: 1,
                        project_recent: 1,
                        project_member: 1,
                        project_by_status: 1,
                        project_task: 1,
                        project_budget_grid: 1,
                        project_grid_XL: 1,
                    },
                    dashboardConfigCreatedAt: '2022-12-29T11:46:56.210Z',
                    dashboardConfigUpdatedAt: '2022-12-29T11:46:56.210Z',
                },
            },
        },
        dashboardConfigFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Dashboard Config Failed to Fetch.',
            },
        },
        dashboardConfigUpdate: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Dashboard config Updated successfully.',
                data: {
                    updatedConfigData: {
                        _id: '63ac3ae9c1ab45e06cf1d13e',
                        firstName: 'Jagadeesha',
                        lastName: 'Ravibabu',
                        userName: 'JaganGlb',
                        profilePic: 'https://rb.gy/ksmsxg',
                        password: 'Jagan@wm123',
                        countryCode: '+91',
                        phoneNumber: '6787986543',
                        email: 'jagadeeshar@globussoft.in',
                        orgId: 'GLB-BAN-001',
                        orgName: 'Globussoft Technologies',
                        address: '#29 BHIVE MG Road, Mahalakshmi Chambers,MG Road Next to Trinity Metro Station',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        country: 'India',
                        zipCode: '560001',
                        isEmpMonitorUser: false,
                        lastUserFetched: null,
                        isConfigSet: true,
                        dashboardConfig_id: '1 ',
                        verified: false,
                        isAdmin: true,
                        forgotPasswordToken: 'e19f0b90-86db-11ed-81d5-3e5c102c20bf',
                        forgotTokenExpire: '2022-12-26T12:47:25.962Z',
                        language: 'en',
                        planName: 'Basic',
                        planId: '63a59c0a2b762a95c3a39313',
                        planUpdatedAt: '2022-12-28T12:47:25.963Z',
                        emailValidateToken: 'e19f59b0-86db-11ed-8c6c-e97237a850a3',
                        emailTokenExpire: '2022-12-26T12:47:25.963Z',
                        createdAt: '2022-12-28T12:47:25.963Z',
                        updatedAt: '2022-12-28T12:47:25.963Z',
                        __v: 0,
                        dashboardConfig: {
                            project_status: 1,
                            project_progress: 1,
                            project_recent: 1,
                            project_member: 1,
                            project_by_status: 1,
                            project_task: 1,
                            project_budget_grid: 1,
                            project_grid_XL: 1,
                        },
                        dashboardConfigCreatedAt: '2022-12-29T11:46:56.210Z',
                        dashboardConfigUpdatedAt: '2022-12-29T11:52:29.406Z',
                    },
                },
            },
        },
        dashboardConfigUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to update dashboardConfig.',
            },
        },
        //group module sample responses
        groupSuccess: [
            {
                statusCode: 200,
                body: {
                    status: 'success',
                    message: 'Plan created successfully',
                    data: {
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        groupName: 'Developers',
                        groupDescription: 'Group for developers who are very innovative',
                        groupLogo: 'shorturl.at/BHIZ3',
                        groupCreatedBy: {
                            userId: '63ac3ae9c1ab45e06cf1d13e',
                            userName: 'JaganGlb',
                            userProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        groupUpdatedBy: {
                            userId: '63ac3ae9c1ab45e06cf1d13e',
                            userName: 'JaganGlb',
                            userProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        assignedMembers: [
                            {
                                UserId: 'c693f0ec693f0ed73dc96f',
                                _id: '63aeb98e07893211da1984de',
                            },
                        ],
                        createdAt: '2022-12-30T10:10:48.402Z',
                        updatedAt: '2022-12-30T10:10:48.402Z',
                        _id: '63aeb98e07893211da1984dd',
                        __v: 0,
                    },
                },
            },
        ],
        groupFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Group Name Already Exist. || Error.',
            },
        },
        groupFetchSuccess: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully fetched',
                data: [
                    {
                        groupCreatedBy: {
                            userId: '63ac3ae9c1ab45e06cf1d13e',
                            userName: 'JaganGlb',
                            userProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        groupUpdatedBy: {
                            userId: '63ac3ae9c1ab45e06cf1d13e',
                            userName: 'JaganGlb',
                            userProfilePic: 'https://rb.gy/ksmsxg',
                        },
                        _id: '63aeb98e07893211da1984dd',
                        adminId: '63ac3ae9c1ab45e06cf1d13e',
                        groupName: 'Developers',
                        groupDescription: 'Group for developers who are very innovative',
                        groupLogo: 'shorturl.at/BHIZ3',
                        assignedMembers: [
                            {
                                UserId: 'c693f0ec693f0ed73dc96f',
                                _id: '63aeb98e07893211da1984de',
                            },
                        ],
                        createdAt: '2022-12-30T10:10:48.402Z',
                        updatedAt: '2022-12-30T10:10:48.402Z',
                        __v: 0,
                    },
                ],
            },
        },
        groupFetchFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Failed to fetch the Group details from the Admin. || Check Inputs either Invalid Group ID.',
            },
        },
        groupUpdateSuc: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Successfully updated',
                data: {
                    groupCreatedBy: {
                        userId: '63ac3ae9c1ab45e06cf1d13e',
                        userName: 'JaganGlb',
                        userProfilePic: 'https://rb.gy/ksmsxg',
                    },
                    groupUpdatedBy: {
                        userId: '63ac3ae9c1ab45e06cf1d13e',
                        userName: 'JaganGlb',
                        userProfilePic: 'https://rb.gy/ksmsxg',
                    },
                    _id: '63aeb98e07893211da1984dd',
                    adminId: '63ac3ae9c1ab45e06cf1d13e',
                    groupName: 'Developers Updated ',
                    groupDescription: 'Group for developers who are very innovative updated',
                    groupLogo: 'shorturl.at/BHIZ3',
                    assignedMembers: [
                        {
                            UserId: '63a939653d73dc693f0ec96f',
                            _id: '63aebbe7ef59356144467bed',
                        },
                    ],
                    createdAt: '2022-12-30T10:10:48.402Z',
                    updatedAt: '2022-12-30T10:22:31.547Z',
                    __v: 0,
                },
            },
        },
        groupUpdateFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Invalid Group Id. || Unable to update.',
            },
        },
        groupDelete: {
            statusCode: 200,
            body: {
                status: 'success',
                message: 'Group deleted successfully.',
                data: {
                    groupCreatedBy: {
                        userId: '63ac3ae9c1ab45e06cf1d13e',
                        userName: 'JaganGlb',
                        userProfilePic: 'https://rb.gy/ksmsxg',
                    },
                    groupUpdatedBy: {
                        userId: '63ac3ae9c1ab45e06cf1d13e',
                        userName: 'JaganGlb',
                        userProfilePic: 'https://rb.gy/ksmsxg',
                    },
                    _id: '63aeb98e07893211da1984dd',
                    adminId: '63ac3ae9c1ab45e06cf1d13e',
                    groupName: 'Developers Updated ',
                    groupDescription: 'Group for developers who are very innovative updated',
                    groupLogo: 'shorturl.at/BHIZ3',
                    assignedMembers: [
                        {
                            UserId: '63a939653d73dc693f0ec96f',
                            _id: '63aebbe7ef59356144467bed',
                        },
                    ],
                    createdAt: '2022-12-30T10:10:48.402Z',
                    updatedAt: '2022-12-30T10:22:31.547Z',
                    __v: 0,
                },
            },
        },
        groupDeleteFail: {
            statusCode: 400,
            body: {
                status: 'failed',
                message: 'Invalid Group Id. || Error while delete group check with Group Id.',
            },
        },
        createChat: {
            userId: '63d104c30c3fbf6605a89ac5',
        },
        deleteChat: {
            chatChannel_id: '63cfb6db0090926794b5dd2b',
        },
        groupChat: {
            chatName: 'Test Group',
            users: ['63d104c30c3fbf6605a89ac5', '63d1055b0c3fbf6605a89acd', '63d105b60c3fbf6605a89ade'],
            groupLogo: 'demo.jpeg',
        },
        renameGroup: {
            chatName: 'Updated Group Name',
            chatChannel_id: '63cfb6db0090926794b5dd2b',
        },
        addToGroup: {
            chatChannel_id: '63cfb6db0090926794b5dd2b',
            userId: '63d104c30c3fbf6605a89ac5',
        },
        removeFromGroup: {
            chatChannel_id: '63cfb6db0090926794b5dd2b',
            userId: '63d104c30c3fbf6605a89ac5',
        },
        sendMessage: {
            content: 'Hey! How are you ?',
            chatChannel_id: '63cfb6db0090926794b5dd2b',
        },
        editMessage: {
            messageId: '63d3b40a987050fedafe51e4',
            content: 'Edited message test',
        },
        replyMessage: {
            messageId: '63d3b40a987050fedafe51e4',
        },
        forwardMessage: {
            forwardTo: ['63d79f7d54dd6bef909357fe', '641170a93bdf8ca13f07f92c'],
        },
        deleteMessage: {
            messageId: ['63d79f7d54dd6bef909357fe', '641170a93bdf8ca13f07f92c'],
        },
        createEvent: {
            attendees: [
                {
                    id: '63d79f7d54dd6bef909357fe',
                },
            ],
            eventName: 'Discussion with team',
            description: 'Some discussion',
            eventStatus: 'queue',
            startTime: '2022-12-28T05:15:00.796Z',
            endTime: '2022-12-28T05:15:00.796Z',
            reminder: false,
        },
        updateEvent: {
            attendees: [
                {
                    id: '63d79f7d54dd6bef909357fe',
                },
            ],
            eventName: 'Update',
            description: 'Some updation',
            eventStatus: 'queue',
            startTime: '2022-12-28T05:15:00.796Z',
            endTime: '2022-12-28T05:15:00.796Z',
            reminder: false,
        },
        filterEventDetails: {
            eventName: 'Discussion with team',
            description: 'Some discussion',
            creatorId: '642e605c14abd60fd5979ac2',
            eventStatus: 'queue',
            reminder: false,
            // attendees: ['63d79f7d54dd6bef909357fe'],
            startTime: {
                startDate: '2022-12-28T05:15:00.796Z',
                endDate: '2022-12-28T05:15:00.796Z',
            },
            endTime: {
                startDate: '2022-12-28T05:15:00.796Z',
                endDate: '2022-12-28T05:15:00.796Z',
            },
        },
        createPoll: {
            question: 'Who all will be attending the upcoming contest ?',
        },
        votePoll: {
            selectedOption: 'Yes',
        },
        projectIds: {
            projectIds: [
                "60d0fe4f5311236168a109ca",
                "60d0fe4f5311236168a109cb",
                "60d0fe4f5311236168a109cc"
            ]
        },
        userIds: {
            userIds: [
                "60d0fe4f5311236168a109ca",
                "60d0fe4f5311236168a109cb",
                "60d0fe4f5311236168a109cc"
            ]
        },
        addPermissionConfig:{
            permissionName:'admin',
            permissionConfig: {
                dashboard: { view: true, create: true, edit: true, delete: true },
                project: { view: true, create: true, edit: true, delete: true },
                otherProject: { view: true, create: true, edit: true, delete: true },
                task: { view: true, create: true, edit: true, delete: true },
                otherTask: { view: true, create: true, edit: true, delete: true },
                subtask: { view: true, create: true, edit: true, delete: true },
                otherSubtask: { view: true, create: true, edit: true, delete: true },
                user: { view: true, create: true, edit: true, delete: true },
                roles: { view: true, create: true, edit: true, delete: true },
                comments: { view: true, create: true, edit: true, delete: true },
                upload: { view: true, create: true, edit: true, delete: true },
                links: { view: true, create: true, edit: true, delete: true },
                permission: { view: true, create: true, edit: true, delete: true },
                activity: { view: true, create: false, edit: false, delete: false },
            },
        }

    },
};

const outputFile = './resources/views/swagger-api-view.json';
const endpointsFiles = ['./resources/routes/public.routes.js'];

/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

await swagger(outputFile, endpointsFiles, doc);
