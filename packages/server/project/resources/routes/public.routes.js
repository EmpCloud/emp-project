import project from '../../core/project/project.routes.js';
import plan from '../../core/plan/plan.routes.js';
import roles from '../../core/roles/roles.routes.js';
import users from '../../core/users/users.routes.js';
import permissions from '../../core/permissions/permission.routes.js';
import upload from '../../core/upload/upload.router.js';
import adminConfig from '../../core/config/adminConfig.routes.js';
import admin from '../../core/admin/admin.routes.js';
import language from '../../core/language/language.routes.js';
import dashboardConfig from '../../core/dashBoard/dashboard.routes.js';
import shortcutKeys from '../../core/shortcutKeys/shortcutKeys.routes.js';
import unauthorizedUser from '../../core/unauthorized/unauthorized.routes.js';
import groups from '../../core/groups/group.routes.js';
import tableConfig from '../../core/defaultScreenConfig/defaultScreenConfig.routes.js';
import verifyToken from '../../middleware/verifyToken.js';
import chatChannel from '../../core/chatChannel/chatChannel.routes.js';
import cors from 'cors';
import { cronJobActivity } from '../../cronJobs/cronSchedule.js';
import restoreFailedData from '../../cronJobs/restore.cronjobs.js';
import messages from '../../core/messages/messages.routes.js';
import activity from '../../core/activity/activity.routes.js';
import customFields from '../../core/customFields/customFields.routes.js';
import calendar from '../../core/calendar/calendar.routes.js';
import notifications from '../../core/notifications/notifications.routes.js';
import socialLogin from '../../core/socialLogin/socialLogin.routes.js';
import profile from '../../core/profile/profile.routes.js'
import password from '../../core/password/password.routes.js'
import client from '../../core/client/client.routes.js';
import autoReport from '../../core/autoReport/autoReport.routes.js';
import sso from '../../core/sso/sso.routes.js';
import sprint from '../../core/sprint/sprint.routes.js';

// checkPermissionActivity.start();
class Routes {
    constructor(app) {
        this.configureCors(app);
        app.options('*', cors());
        // Bug fix: cronJobActivity and restoreFailedData are CronJob objects, not route paths.
        // Passing them to app.options() crashes Express. Cron jobs start automatically on import.
        // app.options(cronJobActivity);
        // app.options(restoreFailedData);
        app.use('/v1/admin', admin);
        app.use('/v1/social', socialLogin);
        app.use('/v1/admin-config', adminConfig);
        app.use('/v1/', unauthorizedUser);
        app.use('/v1/password', password);
        app.use('/v1/auth', sso);
        app.use(verifyToken);
        app.use('/v1/plan', plan);
        app.use('/v1/dashboard-view', dashboardConfig);
        app.use('/v1/project', project);
        app.use('/v1/role', roles);
        app.use('/v1/permission', permissions);
        app.use('/v1/client', client);
        app.use('/v1/user', users);
        app.use('/v1/report',autoReport);
        app.use('/v1/shortcut-key', shortcutKeys);
        app.use('/v1/chat-channel', chatChannel);
        app.use('/v1/messages', messages);
        app.use('/v1/activity', activity);
        app.use('/v1/custom', customFields);
        app.use('/v1/upload', upload)
        app.use('/v1/', language);
        app.use('/v1/groups', groups);
        app.use('/v1/table-config', tableConfig);
        app.use('/v1/calendar', calendar);
        app.use('/v1/notifications', notifications);
        app.use('/v1/profile', profile);
        app.use('/v1/sprint', sprint);
    }

    configureCors(app) {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', 'https://empusers.globusdemos.com');
            res.setHeader('Access-Control-Allow-Origin', 'localhost');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET');
            res.setHeader('Cache-Control', 'no-cache');
            next();
        });
    }
}
export default Routes;
