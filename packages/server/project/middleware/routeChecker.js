export const viewAccessRouteCheck = (path = '') => {
    return [
        '/fetch',
        '/search',
        '/exist',
        '/stat',
        '/filter',
        '/status',
        '/comment-get',
        '/get-activity',
        '/filter-activity',
        '/fetch-role-by-permission',
        '/fetch-users-by-roles',
        '/recoverable-users',
        '/get',
        '/fetch-users',
        '/config-get',
        '/group-members',
        '/all/activity',
        '/activity/fetch',
        '/activity/filter',
        '/totalTime/fetch',
        '/get-events',
        '/search-events',
        '/filter',
        '/userdetails',
        '/fetch-client',
        '/fetch-clientdetails',
        '/fetch-company',   
    ].includes(path);
};

export const createAccessRouteCheck = (path = '') => {
    return ['/create', '/private', '/comment-post', '/select', '/config', '/group', '/forward', '/send', '/poll-create', '/add-event', '/add-client', '/add-company' ].includes(path);
};

export const editAccessRouteCheck = (mainPath = '') => {
    let [mainRoute, subRoute, route, id] = mainPath.split('/');

    let path = id ? mainPath.split('/').splice(0, 3).join('/') : mainPath.split('/').splice(0, 2).join('/');
    let paths = ['/update', '/comment-update', '/remove-member', '/restore-users', '/config-update', '/group-rename', '/group-remove', '/group-add', '/edit', '/poll-vote', '/update-event', '/update-profile', '/update-client', '/update-company'];
    const found = paths.find(p => p == path.toString());
    let result = found ? true : false;
    return result;
};

export const deleteAccessRouteCheck = (path = '') => {
    return ['/delete', '/multiDelete', '/comment-delete', '/delete-activity', '/force-delete-users', '/activity/delete', '/delete-events', '/force-delete-users', '/delete-client'].includes(path);
};
export const UserAccess = [
    '/v1/plan/get',
    '/v1/plan/select',
    '/v1/admin-config/create',
    '/v1/admin-config/fetch',
    '/v1/admin-config/update',
    '/v1/custom/fields/fetch',
    '/v1/custom/fields/create',
    '/v1/custom/fields/update',
    '/v1/custom/fields/view/update'
]
