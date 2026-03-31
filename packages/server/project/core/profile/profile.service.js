import Response from '../../response/response.js';
import logger from '../../resources/logs/logger.log.js';
import adminSchema from '../admin/admin.model.js';
import Reuse from '../../utils/reuse.js';
import { checkCollection } from '../../utils/project.utils.js';
import { ObjectId } from 'mongodb';
import { ProfileMessage } from '../language/language.translator.js';
import permissionModel from '../permissions/permission.model.js';

class ProfileService {

  async fetchProfile(req, res) {
    const reuse = new Reuse(req);
    const { adminId: Id, _id: userId, language, email, isAdmin, permission } = reuse.result.userData?.userData;
    try {
      const db = await checkCollection(reuse.collectionName.task);
      if (!db) return res.send(Response.projectFailResp(ProfileMessage['FEATURE_NOT_ENABLED'][language ?? 'en']));
      let totalTask;
      let userData;
      let totalProjectCount, completedProjets;
      let adminData;
      if (reuse.result.type === 'user' && permission != 'admin') {
        userData = await db.collection(reuse.collectionName.user).findOne({ _id: ObjectId(userId) })
        let PermissionsData = await permissionModel.findOne({ orgId: userData?.orgId, permissionName: userData.permission })
        userData.adminPermission = PermissionsData.permissionName == 'admin' ? true : false;
        userData.PermissionsConfig = PermissionsData.permissionConfig;
        totalTask = await db.collection(reuse.collectionName.task).find({
          assignedTo: {
            $elemMatch: {
              id: userId
            }
          }
        }).toArray();
        totalProjectCount = await db.collection(reuse.collectionName.project).countDocuments({
          userAssigned: {
            $elemMatch: {
              id: userId
            }
          }
        });

        completedProjets = await db.collection(reuse.collectionName.project).countDocuments({
          $and: [{
            userAssigned: {
              $elemMatch: {
                id: userId
              }
            }
          }, {
            status: 'Done'
          }]
        });
      }
      else if (reuse.result.type === 'user' && permission == 'admin') {
        userData = await db.collection(reuse.collectionName.user).findOne({ _id: ObjectId(userId) })
        let PermissionsData = await permissionModel.findOne({ orgId: userData?.orgId, permissionName: userData.permission })
        userData.adminPermission = PermissionsData.permissionName == 'admin' ? true : false;
        userData.PermissionsConfig = PermissionsData.permissionConfig;
        totalTask = await db.collection(reuse.collectionName.task).find().toArray();
        totalProjectCount = await db.collection(reuse.collectionName.project).countDocuments();
        completedProjets = await db.collection(reuse.collectionName.project).countDocuments({ status: 'Done' });
      }
      else {
        // #1203 — Try finding admin by _id first, then fallback to orgId for SSO-provisioned admins
        adminData = await adminSchema.findOne({ _id: ObjectId(userId) })
            || await adminSchema.findOne({ orgId: reuse.result.userData?.userData?.orgId });
        totalTask = await db.collection(reuse.collectionName.task).find().toArray();
        totalProjectCount = await db.collection(reuse.collectionName.project).countDocuments();
        completedProjets = await db.collection(reuse.collectionName.project).countDocuments({ status: 'Done' });
      }
      let pendingCount = 0;
      let completedCount = 0;
      let ongoingCount = 0;
      let totalCount = 0;
      let onHoldTasks = 0;
      totalTask.map(x => {
        totalCount++;
        if (x.taskStatus.match(/^Done/i)) completedCount++;
        if (x.taskStatus.match(/^inprogress/i)) ongoingCount++;
        if (x.taskStatus.match(/^todo/i)) pendingCount++;
        if (x.taskStatus.match(/^Onhold/i)) onHoldTasks++;
      });
      let taskProgress = totalTask.length == 0 ? Math.round((completedProjets / totalProjectCount) * 100) : Math.round((completedCount / totalCount) * 100);
      let resultData;
      if (isAdmin) {
        // #1203 — Use optional chaining to prevent crash when adminData fields are missing (SSO users)
        resultData = {
          firstName: adminData?.firstName,
          lastName: adminData?.lastName,
          email: email,
          role: 'Admin',
          orgId: adminData?.orgId,
          profilePic: adminData?.profilePic,
          countryCode: adminData?.countryCode,
          phoneNumber: adminData?.phoneNumber,
          address: adminData?.address,
          city: adminData?.city,
          state: adminData?.state,
          country: adminData?.country,
          zipCode: adminData?.zipCode,
        }
      }
      else {
        resultData = {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          email: email,
          role: userData.role,
          orgId: userData?.orgId,
          profilePic: userData?.profilePic,
          countryCode: userData.countryCode,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          zipCode: userData.zipCode,
          permission: userData.permission,
          adminPermission: userData.adminPermission,
          permissionConfig: userData.PermissionsConfig,
        }
      }
      resultData.totalProject = totalProjectCount,
        resultData.totalTask = totalTask.length,
        resultData.ongoingTasks = ongoingCount,
        resultData.completedTasks = completedCount,
        resultData.pendingTasks = pendingCount,
        resultData.onHoldTasks = onHoldTasks,
        resultData.progress = taskProgress,


        res.send(Response.projectSuccessResp(ProfileMessage['PROFILE_FETCH_SUCCESS'][language ?? 'en'], resultData));
    } catch (err) {
      logger.log(`Error in catch ${err}`);
      res.send(Response.projectFailResp(ProfileMessage['PROFILE_FETCH_FAILED'][language ?? 'en'], err.message));
    }
  }
}

export default new ProfileService();
