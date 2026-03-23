export let projectMemberTaskGrid = {
    // *************************************************************************************** //
    // -- PRO {12} + Tasks {12} + SubTasks {10} + Role {7} + Member {9} + Permission {7} + Activity {7} + Comments {6} + Files {5} + Links {5} = 80 -- //
    // *************************************************************************************** //

    // *************************************************************************************** //
    // ------------------------- Project Grids >>> Total count  = {12} ------------------------ //
    // ---------------------------------------------------------------------------------------- //

    // -----------------------* Main Grid(s) *-----------------------
    project_grid_XL: 1, // Project records grid (Long Table - 5 pagination) - View Projects (Projects page link)
    project_grid_Large: 0, // 8-10 columns, 10 project records grid - view Projects (Projects page link)
    project_grid_small: 0, // (limited) project records 5 records grid with precise columns - 5 columns
    project_task: 1, // Tasks list under a project will be displayed in a table - 10 pagination
    project_recent: 0, // Recently created projects, Last 5 records
    project_member_grid: 0, // List of project member(s), All the Members with 10 pagination
    project_budget_grid: 0, // Budget data grid based on the Project
    project_progress: 1, // Project progress percentages for each project

    // ----------------------- Sub/Small Grid(s) -----------------------
    project_subtask: 0, // Subtasks list under a project will be displayed in a table - 10 pagination - with task Group
    project_by_status: 1, // A Pie/Bar chart with status grouping (Todo, In Progress, etc ...)
    project_stage_grid: 1, // Project list table based on the stage (dev, prod, etc..)

    // ----------------------- Combination Grid(s) -----------------------
    project_status: {
        // 5 list Tables -- Creates some small grids with 3-5 columns
        project_completed_grid: 0, // Completed Projects List
        project_inprogress_grid: 0, //  In Progress Projects List
        Project_ToDo_grid: 0, // ToDo Projects List
        Project_onHold_grid: 0, // On Hold Projects list
        Project_inReview_grid: 0, // In Review Projects list
    },

    // *************************************************************************************** //
    // ------------------------- Tasks Grids >>> Total count  = {12} ------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------
    task_grid_XL: 1, // Task records grid (Long Table - 5 pagination) - View Tasks (Tasks page link)
    task_grid_Large: 0, // 8-10 columns, 10 task records grid - view Tasks (Tasks page link)
    task_grid_small: 0, // (limited) tasks records 5 records grid with precise columns - 5 columns
    task_recent: 0, // Recently created tasks, Last 5 records
    task_subtasks: 0, // SubTasks list under a Task will be displayed in a table - 10 pagination
    task_member_grid: 0, // List of task member(s), All the Members with 10 pagination
    task_progress: 1, // Task progress percentages for each task

    // ----------------------- Sub/Small Grid(s) -----------------------
    task_priority: 1, // Task list table based on the Priority ("High", "Medium", "Low", etc...)
    task_type: 0, // Task list table based on Type( New feature, Improvement, Bug ,Epic, etc...) - graph 0 - line
    task_category: 0, // Task list table based on category (general ,Problem ticket,incident ,service Req, etc...)

    // ----------------------- Combination Grid(s) -----------------------
    task_status: {
        // 5 list Tables -- Creates some small grids with 3-5 columns
        task_completed_grid: 0, // Completed Task List
        task_inprogress_grid: 0, // In Progress Task List
        task_ToDo_grid: 0, // ToDo Task List
        task_onHold_grid: 0, // On Hold Task list
        task_inReview_grid: 0, // In Review Task list
    },
    subTask_status: {
        // 5 list Tables -- Creates some small grids with 3-5 columns
        subTask_completed_grid: 0, // Completed subTask List
        subTask_inprogress_grid: 0, // In Progress subTask List
        subTask_ToDo_grid: 0, // ToDo subTask List
        subTask_onHold_grid: 0, // On Hold subTask list
        subTask_inReview_grid: 0, // In Review subTask list
    },

    // *************************************************************************************** //
    // ------------------------- SubTasks Grids >>> Total count  = {10} ---------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------
    subtask_grid_XL: 1, // SubTask records grid (Long Table - 5 pagination) - View SubTask (SubTask page link)
    subtask_grid_Large: 0, // 8-10 columns, 10 subTask records grid - view subTask (subTask page link)
    subtask_grid_small: 0, // (limited) subTasks records 5 records grid with precise columns - 5 columns
    subtask_recent: 0, // Recently created subTasks, Last 5 records
    subtask_member_grid: 0, // List of subTask member(s), All the Members with 10 pagination
    subtask_progress: 1, // Task progress percentages for each task

    // ----------------------- Sub/Small Grid(s) -----------------------

    subtask_priority: 1, // Subtask list table based on the Priority ("High", "Medium", "Low", etc...)
    subtask_type: 0, // Subtask list table based on Type( New feature, Improvement, Bug ,Epic, etc...) - graph 0 - line
    subtask_category: 0, // Subtask list table based on category (general ,Problem ticket,incident ,service Req, etc...)

    // ----------------------- Combination Grid(s) -----------------------
    status: {
        // 5 list Tables -- Creates some small grids with 3-5 columns
        subTask_completed_grid: 0, // Completed subTask List
        subTask_inprogress_grid: 0, // In Progress subTask List
        subTask_ToDo_grid: 0, // ToDo subTask List
        subTask_onHold_grid: 0, // On Hold subTask list
        subTask_inReview_grid: 0, // In Review subTask list
    },

    // *************************************************************************************** //
    // ------------------------- Roles Grids >>> Total count  = {7} -------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------
    roles_grid: 1, // Roles records grid (Long Table - 5 pagination) - View Roles (Roles page link)
    project_roles_grid: 1, // List of Roles Projects, All the Projects with 10 pagination
    task_roles_grid: 0, // List of Roles Tasks, All the Tasks with 10 pagination
    subtask_roles_grid: 0, // List of Roles Tasks, All the Tasks with 10 pagination
    member_roles_grid: 0, // List of Roles member(s), All the Members with 10 pagination
    custom_roles_grid: 0, // List of custom Roles
    roles_progress_grid: 1, // Roles progress percentage

    // *************************************************************************************** //
    // ------------------------- Members Grids >>> Total count  = {9} ------------------------ //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------

    member_grid_XL: 1, // Member records grid (Long Table - 5 pagination) - View Member (Member page link)
    member_grid_Large: 0, // 8-10 columns, 10 Member records grid - view v (Member page link)
    member_grid_small: 0, // (limited) Member records 5 records grid with precise columns - 5 columns
    project_members_grid: 1, //  List of members projects, All the projects with 10 pagination
    task_members_grid: 0, //  List of members tasks, All the tasks with 10 pagination
    subtask_members_grid: 0, // List of members subtasks, All the subtasks with 10 pagination
    roles_member_grid: 0, /// List of members roles, All the roles with 10 pagination
    permission_members_grid: 0, // List of members permissions, All the permissions with 10 pagination
    members_progress_grid: 1, // Members progress percentage

    // *************************************************************************************** //
    // -------------------- Permissions Grids >>> Total count  = {7} ------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------

    permission_grid: 1, // Permission records grid (Long Table - 5 pagination) - View Permissions (Permissions page link)
    project_permission_grid: 1, // List of permission Projects, All the Projects with 10 pagination
    task_permission_grid: 0, // List of permission Tasks, All the Tasks with 10 pagination
    subtask_permission_grid: 0, // List of permission subtasks, All the subtasks with 10 pagination
    member_permission_grid: 0, // List of permission member(s), All the Members with 10 pagination
    custom_permission_grid: 0, // List of custom permission
    permission_progress_grid: 1, // Permission progress percentage

    // *************************************************************************************** //
    // ----------------------- Activity Grids >>> Total count  = {7} ------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------

    activity_grid: 1, //  Activity records grid (Long Table - 5 pagination) - View, Activity ( Activity page link)
    project_Activity_grid: 0, //  List of activity Projects, All the Projects with 10 pagination
    task_activity_grid: 0, // List of activity Tasks, All the Tasks with 10 pagination
    subtask_activity_grid: 0, // List of activity subtasks, All the subtasks with 10 pagination
    activity_progress_grid: 1, // Activity progress percentage
    activity_Main_categories_grid: 1, // List of Main Category (Project, Task ,edt)
    activity_filter: 0, // Filter based on Category - VIEW, DELETE, EDIT, UPDATE)

    // *************************************************************************************** //
    // ----------------------- Comments Grids >>> Total count  = {6} ------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------
    comments_grid: 1, // Comments records grid (Long Table - 5 pagination) - View Comments (Comments page link)
    project_comments_grid: 1, // List of comments Projects, All the Projects with 10 pagination
    task_comments_grid: 0, // List of comments Tasks, All the Tasks with 10 pagination
    subtask_comments_grid: 0, // List of comments subtasks, All the subtasks with 10 pagination
    member_comments_grid: 0, // List of comments member(s), All the Members with 10 pagination
    comments_progress_grid: 1, // Comments progress percentage

    // *************************************************************************************** //
    // -------------------------  Files Grids >>> Total count  = {5} ------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------

    files_grid: 1, // Files records grid (Long Table - 5 pagination) - View Files (Files page link)
    categories_files: 0, //  List of Category of Files(images, pdf, doc, video etc...)
    project_files_grid: 1, // List of files Projects, All the Projects with 10 pagination
    task_files_grid: 0, // List of files Tasks, All the Tasks with 10 pagination
    subtask_files_grid: 0, // List of files subTasks, All the subTasks with 10 pagination

    // *************************************************************************************** //
    // ------------------------- Links Grids >>> Total count  = {5} -------------------------- //
    // --------------------------------------------------------------------------------------- //

    // ----------------------- Main Grid(s) -----------------------

    links_grid: 1, // Files records grid (Long Table - 5 pagination) - View Comments (Comments page link)
    project_links_grid: 1, // List of links Projects, All the Projects with 10 pagination
    task_links_grid: 0, // List of links Tasks, All the Tasks with 10 pagination
    subtask_links_grid: 0, // List of links subTasks, All the subTasks with 10 pagination
    members_links_grid: 0, // List of links member(s), All the Members with 10 pagination

    // // *************************************************************************************** //
    // // Categories
    // // 10 subtaskType grid includes
    // subtaskType_grid: 0,
    // subtask_subtaskType_grid: 0, //based on subtaskType subtask list
    // subtaskType_progress_grid: 0, // based on subtaskType show the progress
    // subtaskType_status_grid: 0, // based on status show the subtaskType data

    // // 11 taskType grid includes
    // taskType_grid: 0,
    // task_taskType_grid: 0, //based on taskType task list
    // taskType_progress_grid: 0, // based on taskType show the progress
    // taskType_status_grid: 0, // based on status show the taskType data

    // //12 subtaskStatus grid includes
    // subtaskStatus_grid: 0,
    // subtask_subtaskStatus_grid: 0, //based on subtaskStatus subtask list
    // subtaskStatus_progress_grid: 0, // based on subtaskStatus show the progress
    // subtaskStatus_status_grid: 0, // based on status show the subtaskStatus data

    // // 13 taskStatus grid includes
    // taskStatus_grid: 0,
    // task_taskStatus_grid: 0, //based on taskStatus task list
    // taskStatus_progress_grid: 0, // based on taskStatus show the progress
    // taskStatus_status_grid: 0, // based on status show the taskStatus data

    // //  Categories -- Task, SubTask, Sprint, Story, etc ... (Task creations) 5 + 5
};
