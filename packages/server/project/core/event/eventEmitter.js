import eventEmitter from 'events';
import activityModel from '../activity/activity.model.js';
import failedDataModel from '../users/failedData.model.js'
import Logger from '../../resources/logs/logger.log.js';
import planHistoryModel from '../plan/planHistory.model.js';
import MailResponse from '../../mailService/mailTemplate.js';
import { ObjectId } from 'mongodb';
const event = new eventEmitter();

event.on('activity',async (activityDetails) => {
    const MAX_RETRIES = 3;
    let retries = 0;
   
    while (retries < MAX_RETRIES) {
    try {
    let resultData = await activityModel.create(activityDetails)
    break;
   }  catch(err){
      Logger.error(err)
      retries++;
      if (retries === MAX_RETRIES) {
        Logger.error(`Failed to save activity after ${MAX_RETRIES} attempts.`);
        await failedDataModel.create({category:'activity',details:activityDetails})
        break;
      } else {
        Logger.error(`Retrying to save the activity, Attempt ${retries} of ${MAX_RETRIES}`);
        // Wait for some time before retrying
        const WAIT_TIME_MS = 6000; // Wait 6 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));
      }
    }
    }
})
event.on('history',async (planDetails) => {
 
  try {
  let result = await planHistoryModel.updateMany({orgId:planDetails?.orgId},{$set:{status:'expired'}})
  let resultData = await planHistoryModel.create(planDetails)
 }  catch(err){
    Logger.error(err)
  }
})

event.on('mail', async (project, reuse, db) => {

  try {
    for (const user of project?.userAssigned) {
      const userDetails = await db
        .collection(reuse.collectionName.user)
        .aggregate([
          { $match: { _id: ObjectId(user.id), softDeleted: false } },
          {
            $project: reuse.userObj,
          },
        ])
        .toArray();
      await MailResponse.sendProjectAssignmentMail(userDetails[0], project)
    }

  } catch (err) {
    Logger.error(err)
  }
})
event.on('email', async (value, data, isProjectExist, reuse, db) => {

  try {
    if (value?.userAssigned?.length) {
      for (const member of value?.userAssigned) {
       
        if (isProjectExist?.userAssigned.some(user =>user.id == member.id) === false) {
          const userDetails = await db
            .collection(reuse.collectionName.user)
            .aggregate([
              { $match: { _id: ObjectId(member.id), softDeleted: false } },
              {
                $project: reuse.userObj,
              },
            ])
            .toArray();
          await MailResponse.sendProjectAssignmentMail(userDetails[0], data?.value)
          
        }
      }
    }
  } catch (err) {
    Logger.error(err)
  }

})

export default event;
