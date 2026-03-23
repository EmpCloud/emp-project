import { CronJob } from 'cron';
import Logger from '../resources/logs/logger.log.js';
import ActivityService from './allActivity.cronjobs.js';
import autoSendReportsCronjobs from './autoSendReports.cronjobs.js';
import autoReportSchema from '../core/autoReport/autoReport.model.js'

let checkPlanActivity = new CronJob('0 0 0 * * *', ActivityService.planActivityRemove, () => {
    Logger.info('---Folder checking plan Cron complete---'), false, 'Asia/Kolkata';
});
checkPlanActivity.start();
let checkProjectActivity = new CronJob('0 0 0 * * *', ActivityService.projectActivityRemove, () => {
    Logger.info('---Folder checking project Cron complete---'), false, 'Asia/Kolkata';
});
checkProjectActivity.start();
let checkPermissionActivity = new CronJob('0 0 0 * * *', ActivityService.permissionActivityRemove, () => {
    Logger.info('---Folder checking permission Cron complete---'), false, 'Asia/Kolkata';
});
checkPermissionActivity.start();
let checkConfigActivity = new CronJob('0 0 0 * * *', ActivityService.configActivityRemove, () => {
    Logger.info('---Folder checking Config Cron complete---'), false, 'Asia/Kolkata';
});
checkConfigActivity.start();
let userActivityRemove = new CronJob('0 0 0 * * *', ActivityService.userActivityRemove, () => {
    Logger.info('---Folder checking user Cron complete---'), false, 'Asia/Kolkata';
});
userActivityRemove.start();
let taskActivityRemove = new CronJob('0 0 0 * * *', ActivityService.taskActivityRemove, () => {
    Logger.info('---Folder checking task Cron complete---');
    false, 'Asia/Kolkata';
});
taskActivityRemove.start();
let subTaskActivityRemove = new CronJob('0 0 0 * * *', ActivityService.subTaskActivityRemove, () => {
    Logger.info('---Folder checking subtask Cron complete---');
    false, 'Asia/Kolkata';
});
subTaskActivityRemove.start();

let adminActivityRemove = new CronJob('0 0 0 * * *', ActivityService.adminActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
adminActivityRemove.start();
let subTaskStatusActivityRemove = new CronJob('0 0 0 * * *', ActivityService.subTaskStatusActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
subTaskStatusActivityRemove.start();
let subTaskTypeActivityRemove = new CronJob('0 0 0 * * *', ActivityService.subTaskTypeActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
subTaskTypeActivityRemove.start();
let TaskCategoryActivityRemove = new CronJob('0 0 0 * * *', ActivityService.TaskCategoryActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
TaskCategoryActivityRemove.start();
let TaskStageActivityRemove = new CronJob('0 0 0 * * *', ActivityService.TaskStageActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
TaskStageActivityRemove.start();
let TaskStatusActivityRemove = new CronJob('0 0 0 * * *', ActivityService.TaskStatusActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
TaskStatusActivityRemove.start();
let TaskTypeActivityRemove = new CronJob('0 0 0 * * *', ActivityService.TaskTypeActivityRemove, () => {
    Logger.info('---Folder checking admin Cron complete---');
    false, 'Asia/Kolkata';
});
TaskTypeActivityRemove.start();


function convertTimeToCron(time, frequency) {
    const [hour, minute] = time.split(':').map(Number);
    
    let cronTime;
    switch (frequency) {
        case 'Daily':
            cronTime = `0 ${minute} ${hour} * * *`;
            break;
        case 'Weekly':
            cronTime = `0 ${minute} ${hour} * * 0`; 
            break;
        case 'Monthly':
            cronTime = `0 ${minute} ${hour} 1 * *`; 
            break;
        default:
            throw new Error('Invalid frequency');
    }

    return cronTime;
}

const cronJobs = {};

function createOrUpdateCronJob(Id, time, frequency) {
    const cronTime = convertTimeToCron(time, frequency);
    const jobKey = `${Id}_${frequency}`;
    if (cronJobs[jobKey]) {
        cronJobs[jobKey].stop();
    }
    const newJob = new CronJob(cronTime, 
        autoSendReportsCronjobs.sendDailyReport(frequency,time),()=>{
            Logger.info('---Folder checking admin Cron complete---');
            false, 'Asia/Kolkata';
    });
    
    cronJobs[jobKey] = newJob;
    newJob.start();
}

function deleteCronJob(Id, frequency) {
    const jobKey = `${Id}_${frequency}`;
    
    if (cronJobs[jobKey]) {
        cronJobs[jobKey].stop();
        delete cronJobs[jobKey];
        console.log(`Cron job with key ${jobKey} has been deleted.`);
    } else {
        console.log(`No cron job found with key ${jobKey}.`);
    }
}

async function initializeCronJobs() {
    const users = await autoReportSchema.find();
    users.forEach(user => {
        if(user.frequency[0].Daily===1){
        createOrUpdateCronJob(user._id, user.frequency[0].Time, 'Daily');
        }else if(user.frequency[0].Weekly===1){
        createOrUpdateCronJob(user._id, user.frequency[0].Time, 'Weekly');
        }else if(user.frequency[0].Monthly===1){
        createOrUpdateCronJob(user._id, user.frequency[0].Time, 'Monthly');
        }
    });
}

export let cronJobActivity = {
    checkPlanActivity,
    checkProjectActivity,
    checkPermissionActivity,
    checkConfigActivity,
    userActivityRemove,
    taskActivityRemove,
    subTaskActivityRemove,
    adminActivityRemove,
    initializeCronJobs,
    deleteCronJob
};
