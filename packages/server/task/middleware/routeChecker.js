export const viewAccessRouteCheck = (mainPath = '') => {
    let [mainRoute, subRoute, route, id] = mainPath.split('/');

    let path = id ? mainPath.split('/').splice(0, 3).join('/') : mainPath;
    let paths = ['/getAll', '/search', '/get-comments', '/get-activity', '/fetch', '/get', '/activity/get', '/comment/get', '/filter', '/search-default-values', '/status', '/fetch/by-userId','/fetch-report'];
    const found = paths.find(p => p == path.toString());
    let result = found ? true : false;
    return result;
};

export const createAccessRouteCheck = (mainPath = '') => {
    let path = mainPath.split('/').splice(1, 1);

    let paths = ['create', 'comment', 'create-comment'];
    const found = paths.find(p => p == path.toString());
    let result = found ? true : false;
    return result;
};

export const editAccessRouteCheck = (mainPath = '') => {
    let [mainRoute, subRoute, route, id] = mainPath.split('/');

    let path = id ? mainPath.split('/').splice(0, 3).join('/') : mainPath.split('/').splice(0, 2).join('/');

    let paths = ['/update', '/update-comment', '/comment/update'];
    const found = paths.find(p => p == path.toString());
    let result = found ? true : false;
    return result;
};

export const deleteAccessRouteCheck = (path = '') => {
    return ['/delete', '/delete-comment', '/delete-activity', '/comment/delete', '/activity/delete'].includes(path);
};
