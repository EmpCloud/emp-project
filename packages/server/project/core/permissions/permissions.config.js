export let completeConfig = {
    // featureName: {view, create, edit, delete}
    dashboard: { view: true, create: false, edit: false, delete: false }, // 0, 0, 0, 0 { view: o/1, edit: 0/1 }
    project: { view: true, create: false, edit: false, delete: false },
    task: { view: true, create: false, edit: false, delete: false },
    subtask: { view: true, create: false, edit: false, delete: false },
    user: { view: true, create: false, edit: false, delete: false },
    activity: { view: true, create: false, edit: false, delete: false },
    roles: { view: true, create: false, edit: false, delete: false },
    comments: { view: true, create: false, edit: false, delete: false },
    upload: { view: true, create: false, edit: false, delete: false },
    links: { view: true, create: false, edit: false, delete: false },
    permission: { view: true, create: false, edit: false, delete: false },
};

export let adminConfig = {
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
};

export let readConfig = {
    project: { view: true, create: false, edit: false, delete: false },
    otherProject: { view: true, create: false, edit: false, delete: false },
    task: { view: true, create: false, edit: false, delete: false },
    otherTask: { view: true, create: false, edit: false, delete: false },
    subtask: { view: true, create: false, edit: false, delete: false },
    otherSubtask: { view: true, create: false, edit: false, delete: false },
    user: { view: true, create: false, edit: false, delete: false },
    roles: { view: true, create: false, edit: false, delete: false },
    comments: { view: true, create: false, edit: false, delete: false },
    upload: { view: true, create: false, edit: false, delete: false },
    links: { view: true, create: false, edit: false, delete: false },
    activity: { view: true, create: false, edit: false, delete: false },
};

export let writeConfig = {
    project: { view: true, create: true, edit: true, delete: false },
    otherProject: { view: true, create: true, edit: true, delete: false },
    task: { view: true, create: true, edit: true, delete: false },
    otherTask: { view: true, create: true, edit: true, delete: false },
    subtask: { view: true, create: true, edit: true, delete: false },
    otherSubtask: { view: true, create: true, edit: true, delete: false },
    user: { view: true, create: true, edit: true, delete: false },
    roles: { view: true, create: true, edit: true, delete: false },
    comments: { view: true, create: true, edit: true, delete: false },
    upload: { view: true, create: true, edit: true, delete: false },
    links: { view: true, create: true, edit: true, delete: false },
    activity: { view: true, create: false, edit: false, delete: false },
};

// dashboard : [0,0,0,0];
// edit the value of create-(1- createIndex || readIndex) // SESSION.config.dashboard[createIndex] = $('d-cI').isChecked();
// edit the value of create-(1- createIndex || readIndex) // SESSION.config.dashboard[createIndex] = $('d-cI').isChecked();

// Here we are validating the additional API for permission restriction for user.

export let addExtraPermissions = [
    'chatChannel',
    'language',
    'messages',
    'permission',
    'shortcutKey',
    'notifications',
    'subtask',
    'subtaskstatus',
    'subtasktype',
    'task',
    'tasktype',
    'taskstatus',
    'taskstage',
    'taskcategory',
    'calendar',
];
