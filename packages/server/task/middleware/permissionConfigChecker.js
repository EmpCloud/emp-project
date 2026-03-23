export const viewPermissionConfigChecker = (mainPath = '') => {
    if (!mainPath || mainPath === '') return false;
    const [mainRoute, subRoute, route, id] = mainPath.split('/')

    let path = id ? mainPath.split('/').splice(0, 3).join('/') : mainPath; 
    if (['subtask/getAll', 'subtask/search'].includes(path)) return 'subtask';

    if (['subtask/get-comments', 'task/comment/get'].includes(path)) return 'comments';

    if (['task/activity/get', 'subtask/get-activity'].includes(path)) return 'activity';

    if (['subtask-status/get'].includes(path)) return 'subtaskstatus';

    if (['subtask-type/get'].includes(path)) return 'subtasktype';

    if (['task/fetch', 'task/search', 'task/search-default-values', 'task/filter', 'task/status', 'task/fetch/by-userId', 'task-category/get','task-stage/get','task-status/fetch', 'task-status/search','task-type/fetch', 'task-type/search','task/fetch-report'].includes(path)) return 'task';

    // if (['task-type/fetch', 'task-type/search'].includes(path)) return 'tasktype';

    // if (['task-status/fetch', 'task-status/search'].includes(path)) return 'taskstatus';

    // if (['task-stage/get'].includes(path)) return 'taskstage';

    // if (['task-category/get'].includes(path)) return 'taskcategory';
    else {
        return '';
    }
};

export const createPermissionConfigChecker = (mainPath = '') => {
    let path = mainPath.split('/').splice(0, 2).join('/');
    switch (path) {
        case 'subtask/create':
            return 'subtask';
        case 'task/comment':
        case 'subtask/create-comment':
            return 'comments';
        case 'subtask-status/create':
            return 'subtaskstatus';
        case 'subtask-type/create':
            return 'subtasktype';
        case 'task/create':
            return 'task';
        case 'task-type/create':
            return 'task';
        case 'task-status/create':
            return 'task';
        case 'task-stage/create':
            return 'task';
        case 'task-category/create':
            return 'task';

        default:
            return '';
    }
};

export const editPermissionConfigChecker = (mainPath = '') => {
    let [mainRoute, subRoute, route, id] = mainPath.split('/');

    let path = id ? mainPath.split('/').splice(0, 3).join('/') : mainPath.split('/').splice(0, 2).join('/');
    switch (path) {
        case 'subtask/update':
            return 'subtask';
        case 'subtask/update-comment':
        case 'task/comment/update':
            return 'comments';
        case 'subtask-status/update':
            return 'subtaskstatus';
        case 'subtask-type/update':
            return 'subtasktype';
        case 'task/update':
            return 'task';
        case 'task-type/update':
            return 'task';
        case 'task-status/update':
            return 'task';
        case 'task-stage/update':
            return 'task';
        case 'task-category/update':
            return 'task';

        default:
            return '';
    }
};

export const deletePermissionConfigChecker = (path = ' ') => {
    switch (path) {
        case 'subtask/delete':
            return 'subtask';
        case 'subtask/delete-activity':
        case 'task/activity/delete':
            return 'activity';
        case 'subtask/delete-comment':
        case 'task/comment/delete':
            return 'comments';
        case 'subtask-status/delete':
            return 'subtaskstatus';
        case 'subtask-type/delete':
            return 'subtasktype';
        case 'task/delete':
            return 'task';
        case 'task-type/delete':
            return 'task';
        case 'task-status/delete':
            return 'task';
        case 'task-stage/delete':
            return 'task';
        case 'task-category/delete':
            return 'task';

        default:
            return '';
    }
};
