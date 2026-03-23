import task from '../../core/task/task.routes.js';
import taskType from '../../core/taskType/taskType.routes.js';
import taskStatus from '../../core/taskStatus/taskStatus.routes.js';
import taskStage from '../../core/taskStage/taskStage.routes.js';
import taskCategory from '../../core/taskCategory/taskCategory.routes.js';
import subTask from '../../core/subTask/subTask.routes.js';
import subTaskStatus from '../../core/subTaskStatus/subTaskStatus.routes.js';
import subTaskType from '../../core/subTaskType/subTaskType.routes.js';
import verifyToken from '../../middleware/verifyToken.js';
import cors from 'cors';

class Routes {
    constructor(app) {
        this.configureCors(app);
        // new OpenRoutes('/v1/', app);
        app.options('*', cors()); // include before other routes
        app.use(verifyToken);
        app.use('/v1/task', task);
        app.use('/v1/task-type', taskType);
        app.use('/v1/task-status', taskStatus);
        app.use('/v1/task-stage', taskStage);
        app.use('/v1/task-category', taskCategory);
        app.use('/v1/subtask', subTask);
        app.use('/v1/subtask-status', subTaskStatus);
        app.use('/v1/subtask-type', subTaskType);
    }

    configureCors(app) {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET');
            res.setHeader('Cache-Control', 'no-cache');
            next();
        });
    }
}
export default Routes;
