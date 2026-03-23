import eventEmitter from 'events';
import activityModel from '../schema/activity.model.js';
import failedDataModel from '../schema/failedData.model.js';
import Logger from '../../resources/logs/logger.log.js';
import { ObjectId } from 'mongodb';
import mailTemplate from '../../mailService/mailTemplate.js';
const event = new eventEmitter();

event.on('activity', async activityDetails => {
    const MAX_RETRIES = 3;
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            let resultData = await activityModel.create(activityDetails);
            break;
        } catch (err) {
            Logger.error(err);
            retries++;
            if (retries === MAX_RETRIES) {
                Logger.error(`Failed to save activity after ${MAX_RETRIES} attempts.`);
                await failedDataModel.create({ category: 'activity', details: activityDetails });
                break;
            } else {
                Logger.error(`Retrying to save the activity, Attempt ${retries} of ${MAX_RETRIES}`);
                // Wait for some time before retrying
                const WAIT_TIME_MS = 6000; // Wait 6 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));
            }
        }
    }
});

event.on('mail', async (task, reuse, db) => {

    try {
      for (const user of task?.assignedTo) {
        const userDetails = await db
          .collection(reuse.collectionName.user)
          .aggregate([
            { $match: { _id: ObjectId(user.id), softDeleted: false } },
            {
              $project: reuse.userObj,
            },
          ])
          .toArray();
        await mailTemplate.sendTaskAssignmentMail(userDetails[0], task)
      }
    } catch (err) {
      Logger.error(err)
    }
  })
  event.on('email', async (value, data, TaskExist, reuse, db) => {
    try {   
      if (value?.assignedTo?.length) {
      
        for (const member of value?.assignedTo) {
          
          if (TaskExist?.assignedTo.some(user =>user.id == member.id) === false) {
            const userDetails = await db
              .collection(reuse.collectionName.user)
              .aggregate([
                { $match: { _id: ObjectId(member.id), softDeleted: false } },
                {
                  $project: reuse.userObj,
                },
              ])
              .toArray();
            await mailTemplate.sendTaskAssignmentMail(userDetails[0], data?.value)
          }
        }
      }
    } catch (err) {
      Logger.error(err)
    }
  
  })

event.on('progress', async (db, collectionName, progress, taskId) =>
{
    try {
      let updateProgress = await db.collection(collectionName).findOneAndUpdate({ _id: ObjectId(taskId) }, { $set: { progress: progress } }, { returnDocument: 'after' });
    } catch (err) {
      Logger.error(err)
    }
   
  }
)
event.on('projectProgress', async (projectDb, projectCollectionName, progress, status,  projectId) =>
{
    try {
      if(status == 'Done'){
      await projectDb.collection(projectCollectionName).findOneAndUpdate({ _id: ObjectId(projectId) }, { $set: { progress: progress, status: status,completedDate : new Date()} }, { returnDocument: 'after' }); }
      let updateProgress = await projectDb.collection(projectCollectionName).findOneAndUpdate({ _id: ObjectId(projectId) }, { $set: { progress: progress, status: status} }, { returnDocument: 'after' });
    } catch (err) {
      Logger.error(err)
    }
   
  }
)

export default event;
