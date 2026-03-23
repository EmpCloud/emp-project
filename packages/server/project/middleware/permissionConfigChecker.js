export const viewPermissionConfigChecker = (mainPath = '') => {
    let [mainRoute, subRoute, routes] = mainPath.split('/');
    let path = routes ? mainPath.split('/').splice(2).join('/') ?? '' : mainPath;
    if (!path || path === '') return false;

    if (['project/fetch', 'project/search', 'project/filter', 'project/stat', 'project/exist', 'project/totalTime/fetch', 'project/status','project/userdetails','client/fetch-client','client/fetch-clientdetails','client/fetch-company'].includes(path)) return 'project';

    if (['project/comment-get'].includes(path)) return 'comments';

    // if (['project/get-activity', 'project/filter-activity', 'project/all/activity'].includes(path)) return 'activity';

    if (['activity/fetch', 'activity/search', 'activity/filter'].includes(path)) return 'activity';

    if (['permission/activity/fetch', 'permission/activity/filter', 'permission/fetch'].includes(path)) return 'permission';

    if (['role/fetch', 'role/filter', 'role/fetch-role-by-permission', 'role/search'].includes(path)) return 'roles';

    if (
        [
            'user/fetch',
            'user/fetch-users-by-roles',
            'user/filter',
            'user/search',
            'user/downloadForBulkUpdate',
            'user/fetch-emp-users',
            'user/recoverable-users',
            'user/stat',
            'user/activity/fetch',
            'user/activity/filter',
            'groups/fetch',
            'groups/search',
            'groups/filter'
        ].includes(path)
    )
        return 'user';

    if (['/config-get'].includes(path)) return 'dashboard';

    //if (['groups/fetch', 'groups/search'].includes(path)) return 'groups';

    if (['calendar/get-events', 'calendar/search-events', 'calendar/filter'].includes(path)) return 'calendar';

    if (['shortcut-key/get'].includes(path)) return 'shortcutKey';

    if (['chat-channel/fetch', 'chat-channel/fetch-users', 'chat-channel/group-members'].includes(path)) return 'chatChannel';
    if (['messages/fetch'].includes(path)) return 'messages';
    if (['notifications/get'].includes(path)) return 'notifications';
    else {
        return '';
    }
};

export const createPermissionConfigChecker = (mainPath = '') => {
    let [mainRoute, subRoute, routes] = mainPath.split('/');
    let path = routes ? mainPath.split('/').splice(2).join('/') ?? '' : mainPath;
    switch (path) {
        case 'project/create':
            return 'project';
        case 'project/comment-post':
            return 'comments';
        case 'client/add-client':
            return 'project';
        case 'client/add-company':
            return 'project'
        case 'role/create':
            return 'roles';
        case 'user/create':
            return 'user';
        case 'user/bulk-register':
            return 'user';
        case 'permission/create':
            return 'permission';
        case 'shortcut-key/create':
            return 'shortcutKey';
        case 'groups/create':
            return 'user';
        case '/config':
            return 'dashboard';
        case 'calendar/add-event':
            return 'calendar';
        case 'chat-channel/private':
            return 'chatChannel';
        case 'chat-channel/group':
            return 'chatChannel';
        case 'messages/forward':
            return 'messages';
        case 'messages/send':
            return 'messages';
        case 'messages/poll-create':
            return 'messages';
        default:
            return '';
    }
};

export const editPermissionConfigChecker = (mainPath = '') => {
    let [, , mainRoute, subRoute, id] = mainPath.split('/');
    let path = id || subRoute ? `${mainRoute}/${subRoute}` : mainPath;
    switch (path) {
        case 'project/update':
            return 'project';
        case 'project/remove-member':
            return 'project';
        case 'project/comment-update':
            return 'comments';
        case 'client/update-client':
            return 'project';
        case 'client/update-company':
            return 'project'
        case '/config-update':
            return 'dashboard';
        case 'role/update':
            return 'roles';
        case 'user/update':
            return 'user';
        case 'user/restore-users':
            return 'user';
        case 'user/update-profile':
            return 'user';
        case 'user/bulk-update':
                return 'user';
        case 'groups/update':
            return 'user';
        case 'shortcut-key/update':
            return 'shortcutKey';
        case 'calendar/update-event':
            return 'calendar';
        case 'chat-channel/group-rename':
            return 'chatChannel';
        case 'chat-channel/group-remove':
            return 'chatChannel';
        case 'chat-channel/group-add':
            return 'chatChannel';
        case 'permission/update':
            return 'permission';
        case 'permission/additional':
            return 'permission';
        case 'messages/edit':
            return 'messages';
        case 'messages/poll-vote':
            return 'messages';
        case 'notifications/mark-read':
            return 'notifications';
        default:
            return '';
    }
};

export const deletePermissionConfigChecker = (mainPath = ' ') => {
    let [mainRoute, subRoute, id] = mainPath.split('/');
    let path = id || subRoute ? `${mainRoute}/${subRoute}` : mainPath;
    switch (path) {
        case 'project/delete':
            return 'project';
        case 'project/multiDelete':
            return 'project';
        case 'client/delete-client':
            return 'project';
        case 'project/delete-activity':
            return 'activity';
        case 'project/comment-delete':
            return 'comments';
        case 'role/delete':
            return 'roles';
        case 'permission/activity/delete':
            return 'permission';
        case 'permission/delete':
            return 'permission';
        case 'user/activity/delete':
            return 'user';
        case 'user/delete':
            return 'user';
        case 'user/force-delete-users':
            return 'user';
        case 'shortcut-key/delete':
            return 'shortcutKey';
        case 'groups/delete':
            return 'user';
        case 'chat-channel/delete':
            return 'chatChannel';
        case 'messages/delete':
            return 'messages';
        case 'notifications/delete':
            return 'notifications';
        case 'calendar/delete-events':
            return 'calendar';

        default:
            return '';
    }
};
