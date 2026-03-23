import { CronJob } from "cron"; 
import ActivityService from './allActivity.cronjobs.js';
import Logger from '../resources/logs/logger.log.js'

const restoreFailedData= new CronJob(
    `*/5 * * * *`,
    ActivityService.restoreFailedData,
    () => Logger.info("---failed data restoring Cron complete---"),
    false,
    "Asia/Kolkata"
);
restoreFailedData.start();

export default restoreFailedData;
