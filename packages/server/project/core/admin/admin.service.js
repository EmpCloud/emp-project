import adminSchema from './admin.model.js';
import Response from '../../response/response.js';
import jwt from 'jsonwebtoken';
import config from 'config';
import logger from '../../resources/logs/logger.log.js';
import uuidv1 from 'uuidv1';
import MailResponse from '../../mailService/mailTemplate.js';
import mongoose from 'mongoose';
import moment from 'moment';
import adminValidation from './admin.validate.js';
import { AdminMessageNew, CommentMessageNew } from '../language/language.translator.js';
import planModel from '../plan/plan.model.js';
import { plans } from '../plan/plan.model.js';
import defaultScreen from '../defaultScreenConfig/defaultScreenConfig.model.js';
import { checkCollection, setDefaultScreen } from '../../utils/project.utils.js';
import { activityOfAdmin } from '../../utils/activity.utils.js';
import { isEmpAdmin } from '../../utils/admin.utils.js';
import event from '../event/eventEmitter.js';
import projectCommentSchema from '../project/projectComment.schema.js';
import activityModel from '../activity/activity.model.js';
import Password from '../../utils/passwordEncoderDecoder.js';
import { projectGrids, taskGrids, subTaskGrids, memberGrids, activityGrids } from '../dashBoard/dashboard.select.js';
import { activityOfUser, storePlanHistory } from '../../utils/activity.utils.js';
import Reuse from '../../utils/reuse.js';
import permissionModel from '../permissions/permission.model.js';
import roleModel from '../roles/roles.model.js';
import groupSchema from '../groups/group.schema.js';
import { configFieldSchema } from '../customFields/customFields.model.js';
import { configViewFieldSchema } from '../customFields/customFields.model.js';
import ConfigSchema from '../config/adminConfig.model.js';
import { dynamicFieldSchema } from '../customFields/customFields.model.js';
import TaskStatusModel from '../config/defaults/taskStatus.schema.js';
import TaskStageModel from '../config/defaults/taskStages.schema.js';
import TaskTypeModel from '../config/defaults/taskType.schema.js';
import TaskCategoryModel from '../config/defaults/taskCategory.schema.js';
import subtaskCommentSchema from '../config/defaults/subtaskComment.schema.js'
import taskCommentSchema from '../config/defaults/taskComment.schema.js';
import NotificationService from '../notifications/notifications.service.js';
import PlanDowngradeService from '../plan/plan.downgradeCheck.js'

import AdminEmpDataFetch from './admin.EmpDataFetch.js'
class AdminService {
    async addAdmin(req, res) {
        try {
            const data = req?.body;
            const { email: userEmail, orgId: userOrgId, phoneNumber: userPhoneNum, profilePic, planName ,isEmpMonitorUser,empMonitorId} = req.body;
            const { value, error } = adminValidation.createAdmin(req.body);
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));
            if (
                !(
                    profilePic?.includes('.jpeg') ||
                    profilePic?.includes('.png') ||
                    profilePic?.includes('.jpg') ||
                    profilePic?.includes('.svg+xml') ||
                    profilePic?.includes('.svg') ||
                    profilePic?.includes('https') ||
                    profilePic?.includes('http')
                ) &&
                profilePic
            )
                return res.status(400).send(Response.validationFailResp('Invalid Input,Provide valid image extension or url for Profile Pic'));
            let empUser = isEmpMonitorUser??false;

            const adminData = await adminSchema.find({});
            if (adminData.length == 0) {
                await planModel.insertMany(plans);
            }
            if (planName == null) {
                let details = await planModel.findOne({ planName: 'Free' });
                let expireDate = new Date(moment().add(details.durationValue, details.durationType))
                value.planExpireDate = expireDate;
                value.planStartDate = new Date();
                let { createdAt, updatedAt, ...planDetails } = details.toJSON();
                value.planData = planDetails;
            }
            //checking for duplication
            const dataDuplicate = await adminSchema.findOne({
                $or: [{ orgId: userOrgId }, { phoneNumber: userPhoneNum }, { email: userEmail }],
            });
            if (dataDuplicate) {
                if (dataDuplicate?.email === userEmail) return res.send(Response.projectFailResp(`Admin email ${value?.email} already exist.`, `Admin email ${value?.email} already exist.`));
                if (dataDuplicate?.orgId === userOrgId) return res.send(Response.projectFailResp(`Admin orgId ${value?.orgId} already exist.`, `Admin orgId ${value?.orgId} already exist.`));
                if (dataDuplicate?.phoneNumber === userPhoneNum)
                    return res.send(Response.projectFailResp(`Phone number already exist, please check phone number.`, `Phone number already exist, please check phone number.`));
            } else {
                value.email = value.email.toLowerCase();
                value.password = await Password.encryptText(value.password, config.get('encryptionKey'));
                //If Switched from Empmonitor to WM
                if(isEmpMonitorUser===true){
                    value.verified = true
                }
                //registering the admin
                let resultData = await adminSchema.create(value);
                let planHistory = storePlanHistory(userOrgId, resultData.planData, resultData._id.toString(), resultData.planExpireDate)
                event.emit('history', planHistory);
                //storing the activity
                const { firstName, lastName, orgId } = resultData;
                let adminDetails = activityOfAdmin(`${firstName} ${lastName} registered.`, 'Admin', 'Registered', `${orgId}`);
                adminDetails['adminId'] = resultData._id.toString();
                event.emit('activity', adminDetails);
                if(isEmpMonitorUser!==true){
                //checking for registerd admin is an empAdmin or not
                const result = await isEmpAdmin({ resultData, empUser, res });
                resultData = result?.resultData;
                empUser = result?.empUser;
                }
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = resultData.toJSON();

                //sending an email to the registered admin, excluding the empAdmin.
                if (!empUser) {
                    // if (process.env.node_env !== 'localDev') {
                    const mailResponse = await MailResponse.sendAdminVerificationMail([resultData]);
                    logger.info(`Mail invitation response ${mailResponse}`);
                    //    }
                    res.send(Response.projectSuccessResp(`Admin stored successfully.`, { resultData: filteredData }));
                } else {
                    // add the welcome mail
                    const isDataExist = await adminSchema.findOne({ email: resultData?.email });

                    isDataExist.password = await Password.decryptText(isDataExist.password, config.get('encryptionKey'));
                    // if (process.env.node_env !== 'localDev') {}

                    let mailStatus = await MailResponse.sendWelcomeMailAdminBySendgridAPI(isDataExist);
                    let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    resultData.toJSON();
                    filteredData = data;
                    let accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });

                    logger.info(`${resultData?.firstName} is EmpAdmin, auto verified \n Welcome Mail Status ${mailStatus}`);
                    res.send(Response.projectSuccessResp(`EmpAdmin stored successfully,Auto verified`, { resultData: filtereData ,accessToken}));
                }
            }
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error creating Config.', err.message));
        }
    }

    async fetchAdmin(req, res) {
        try {
            const userEmail = req?.body?.email?.toLowerCase();
            const { password: userPassword } = req?.body;
            const { error } = adminValidation.fetchAdmin(req?.body);
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));
            const isUserExist = await adminSchema.findOne({ 
                $or: [
                  { email: userEmail },
                  { userName: userEmail }
                ]
              });
            //checking user exists or not
            if (!isUserExist) return res.send(Response.projectFailResp(`User not exist.`));

            //checking user email verified or not
            if (!isUserExist?.verified) return res.send(Response.projectEmailNotValidate(`email not verified`));

            //checking admin account is suspended or not
            if (isUserExist?.isSuspended) return res.status(400).send(Response.projectFailResp(`Admin's account is suspended and not allowed to login.`));
            let decryptPassword = await Password.decryptText(isUserExist.password, config.get('encryptionKey'));
            if (userPassword !== decryptPassword) return res.send(Response.projectFailResp(`Invalid the Password.!!`));
            // add the default screen config
            const isDefaultScreenSet = await defaultScreen.findOne({ adminId: isUserExist?._id.toString() });
            if (!isDefaultScreenSet) await setDefaultScreen(isUserExist?._id.toString());

            let data, accessToken, filteredData;
            if (isUserExist.isDasboardConfigSet == false) {
                let update = {
                    dashboardConfigData: [
                        {
                            dashboardConfig_id: 1,
                            dashboardConfig: projectGrids,
                        },
                        {
                            dashboardConfig_id: 2,
                            dashboardConfig: taskGrids,
                        },
                        {
                            dashboardConfig_id: 3,
                            dashboardConfig: subTaskGrids,
                        },
                        {
                            dashboardConfig_id: 4,
                            dashboardConfig: memberGrids,
                        },
                        {
                            dashboardConfig_id: 5,
                            dashboardConfig: activityGrids,
                        },
                    ]
                };
                let value = {
                    isDasboardConfigSet: true,
                    dashboardConfigCreatedAt: Date.now(),
                    dashboardConfigUpdatedAt: Date.now(),
                };
                data = await adminSchema.findOneAndUpdate(
                    { _id: isUserExist._id },
                    {
                        $set: value,

                        $push: update
                    }
                    , { returnDocument: 'after' });
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    data.toJSON();
                filteredData = data;
                accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });
            }
            else {
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    isUserExist.toJSON();
                filteredData = isUserExist;
                accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });
            }
            await adminSchema.findOneAndUpdate({ email: userEmail }, { $set: { lastLogin: Date.now() } }, { returnDocument: 'after' });
            //storing the activity
            const fullName = filteredData.firstName + ' ' + filteredData.lastName;
            let adminDetails = activityOfAdmin(`${fullName} Logged in.`, 'Admin', 'Login', `${filteredData.orgId}`);
            adminDetails['adminId'] = filteredData._id.toString();
            event.emit('activity', adminDetails);
           if(new Date()==new Date(filteredData.planExpireDate- 5 * 24 * 60 * 60 * 1000)){
            const message = `Your Plan is expiring whitin five days,please upgrade plan.`
            await NotificationService.adminNotification(message, filteredData._id, _id, { collection: 'plan', id: filteredData._d.toString() });
           }
            res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error in fetch admin details.', err.message));
        }
    }

    async verifyAdmin(req, res) {
        try {
            const adminMail = req?.body?.adminMail?.toLowerCase();
            const { activationLink, orgId } = req?.body;
            const { error } = adminValidation.verifyAdmin({ activationLink, adminMail, orgId });
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));
            const isDataExist = await adminSchema.findOne({ email: adminMail });
            if (!isDataExist) return res.send(Response.projectFailResp(`Email not yet registered.!!`));
            if (isDataExist?.verified == true) return res.send(Response.projectFailResp(`Email already activated!.!!`));
            if (isDataExist?.emailValidateToken != activationLink) return res.send(Response.projectFailResp(`Invalid Activation token!.!!`));
            if (isDataExist?.emailTokenExpire < moment()) return res.send(Response.projectFailResp('Your Token has expired, please re-generated the email verify token'));
            else {
                const data = await adminSchema.findOneAndUpdate({ email: adminMail }, { $set: { verified: true, emailValidateToken: uuidv1() } });

                if (!data) return res.send(Response.projectFailResp(`Error in active admin.!!`));
                isDataExist.password = await Password.decryptText(isDataExist.password, config.get('encryptionKey'));
                // if (process.env.node_env !== 'localDev') {
                await MailResponse.sendWelcomeMailAdminBySendgridAPI(isDataExist);
                // }
                const fullName = data.firstName + ' ' + data.lastName;
                let adminDetails = activityOfAdmin(`${fullName} activated email.`, 'Admin', 'Verified', orgId);
                adminDetails['adminId'] = data._id.toString();
                event.emit('activity', adminDetails);
                res.send(Response.projectSuccessResp(`Admin activated successfully.!!`));
            }
        } catch (err) {
            res.send(Response.projectFailResp(`UnExpected Error while activating the Admin.`, err));
        }
    }

    async isEmailExist(req, res) {
        try {
            const userEmail = req?.query?.email?.toLowerCase();
            const isEmailExist = await adminSchema.findOne({ email: userEmail });
            isEmailExist ? res.send(Response.projectSuccessResp(`Email exist.`)) : res.send(Response.projectFailResp(`Email not exist.`));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error in fetch admin details.', err.message));
        }
    }

    async isOrgExist(req, res) {
        try {
            const userOrgId = req?.query?.OrgId;
            if (userOrgId.length >= 12) {
                res.send(Response.projectFailResp(`OrgId should be less than 12 or equal to 12 characters.`));
            }
            const isOrgExist = await adminSchema.findOne({ orgId: userOrgId });
            isOrgExist ? res.send(Response.projectSuccessResp(`Organization exist.`)) : res.send(Response.projectFailResp(`Organization not exist.`));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error in fetch admin details.', err.message));
        }
    }

    async updateAdmin(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const data = req?.body;
                const adminId = result?.userData?.userData?._id;
                const { value, error } = adminValidation.updateAdmin(req?.body);
                if (error) return res.send(Response.validationFailResp('validation failed', error.message));
                const profilePic = value?.profilePic;
                if (data.planData) {
                    const planCheck = await adminSchema.findOne({ _id: adminId })
                    if (planCheck.planName == 'Free') {
                        res.send(Response.projectFailResp("Can't update user seats in Free subscription"));
                    }
                }
                if (profilePic) {
                    if (
                        !(
                            profilePic?.includes('.jpeg') ||
                            profilePic?.includes('.png') ||
                            profilePic?.includes('.jpg') ||
                            profilePic?.includes('.svg+xml') ||
                            profilePic?.includes('.svg') ||
                            profilePic?.includes('https') ||
                            profilePic?.includes('http')
                        ) &&
                        profilePic
                    ) {
                        return res.status(400).send(Response.validationFailResp('Invalid Input,Provide valid image extension or url for Profile Pic'));
                    }
                }
                if (data.firstName || data.profilePic) {
                    //comment
                    let condition = { 'commentCreator.creatorId': adminId };
                    let updateOperation = { $set: { 'commentCreator.creatorName': data.firstName, 'commentCreator.creatorProfilePic': data.profilePic } };
                    await projectCommentSchema.updateMany(condition, updateOperation);
                    //activity
                    let activityCondition = { 'userDetails.id': adminId };
                    let updateActivity = { $set: { 'userDetails.name': data.firstName, 'userDetails.profilePic': data.profilePic } };
                    let value = await activityModel.updateMany(activityCondition, updateActivity);
                }
                let resultData = await adminSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId(adminId) }, { $set: data }, { returnDocument: 'after' });
                const fullName = resultData.firstName + ' ' + resultData.lastName;
                let adminDetails = activityOfAdmin(`${fullName} updated details.`, 'Admin', 'Updated', `${resultData.orgId}`);
                adminDetails['adminId'] = adminId.toString();
                event.emit('activity', adminDetails);

                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, ...filteredData } = resultData.toJSON();
                res.send(Response.projectSuccessResp(`Admin stored successfully.`, { resultData: filteredData }));
            } catch (err) {
                logger.log(`Error in catch ${err}`);
                res.send(Response.projectFailResp('Error updating Admin.', err.message));
            }
        } else {
            res.send(result);
        }
    }

    async forgotPassword(req, res) {
        try {
            const email = req?.query?.email?.toLowerCase();
            const userData = await adminSchema.findOne({ email: email });
            if (!userData) return res.send(Response.projectFailResp(` Email does not exist.`));
            if (!userData?.verified) return res.send(Response.projectEmailNotValidate(`email not verified`));
            let current_day = new Date();
            const token_expire = userData.forgotTokenExpire;
            let resultData;
            //refresh the email sent count for a fresh day
            if (new Date(moment(current_day).format('YYYY-MM-DD')) >= new Date(moment(token_expire).format('YYYY-MM-DD'))) {
                resultData = await adminSchema.findOneAndUpdate(
                    { email: email },
                    { $set: { forgotPasswordToken: uuidv1(), forgotTokenExpire: moment(current_day).add(1, 'day'), passwordEmailSentCount: 1 } },
                    { returnDocument: 'after' }
                );
            }
            //checking email sending restriction for a day
            else if (userData.passwordEmailSentCount >= config.get('passwordEmailSentCount') && token_expire > current_day) {
                return res.send(Response.projectFailResp('Password Updation mail sent limit reached,Please try next day.'));
            }
            //increasing the count every time after mail sent
            else if (current_day <= token_expire) {
                resultData = await adminSchema.findOneAndUpdate(
                    { email: email },
                    { $set: { forgotPasswordToken: uuidv1(), forgotTokenExpire: moment(current_day).add(1, 'day'), passwordEmailSentCount: userData.passwordEmailSentCount + 1 } },
                    { returnDocument: 'after' }
                );
            }
            if (process.env.node_env !== 'localDev') {
                let mailResponse = await MailResponse.sendAdminVerificationTokenMail([resultData]);
                logger.info(`Mail invitation response ${mailResponse}`);
            }
            const fullName = resultData.firstName + ' ' + resultData.lastName;
            let adminDetails = activityOfAdmin(`${fullName} trying to update password and password reset mail sent .`, 'Admin', 'UpdatedPassword', `${resultData.orgId}`);
            adminDetails['adminId'] = resultData._id.toString();
            event.emit('activity', adminDetails);
            res.send(Response.projectSuccessResp(`Admin password reset mail send successfully.`));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Something went wrong.', err.message));
        }
    }

    async resetPassword(req, res) {
        try {
            const email = req?.body?.email?.toLowerCase();
            const { token } = req?.body;
            const newPassword = req?.body?.newPassword ? await Password.encryptText(req.body.newPassword, config.get('encryptionKey')) : null;
            const ValidEmail = await adminSchema.findOne({ email: email });
            if (!ValidEmail) return res.send(Response.projectFailResp(` Email does not exist.`));
            if (!ValidEmail?.verified) return res.send(Response.projectEmailNotValidate(`email not verified`));
            if (ValidEmail?.forgotPasswordToken !== token) return res.send(Response.projectFailResp(`Token invalid. `));

            let resultData = await adminSchema.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, { returnDocument: 'after' });
            //storing the activity
            const fullName = resultData.firstName + ' ' + resultData.lastName;
            let adminDetails = activityOfAdmin(`${fullName} trying to update password and password reset mail sent .`, 'Admin', 'Reset Password', `${resultData.orgId}`);
            adminDetails['adminId'] = resultData._id.toString();
            event.emit('activity', adminDetails);
            res.send(Response.projectSuccessResp(`Admin password reset successfully.`, resultData));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error while resetting password.', err.message));
        }
    }

    async generateToken(req, res) {
        try {
            const email = req?.body?.email?.toLowerCase();
            const ValidEmail = await adminSchema.findOne({ email: email });
            if (!ValidEmail) return res.send(Response.projectFailResp(` email doesnot exist `));

            let current_day = new Date();
            const token_expire = ValidEmail.emailTokenExpire;
            if (ValidEmail?.verified) return res.send(Response.projectFailResp(`email already activated `));

            let resultData;
            //refresh the email sent count for a fresh day
            if (new Date(moment(current_day).format('YYYY-MM-DD')) >= new Date(moment(token_expire).format('YYYY-MM-DD'))) {
                resultData = await adminSchema.findOneAndUpdate(
                    { email: email },
                    { $set: { emailValidateToken: uuidv1(), emailTokenExpire: moment(current_day).add(1, 'day'), verificationEmailSentCount: 1 } },
                    { returnDocument: 'after' }
                );
            }
            //checking email sending restriction for a day
            else if (ValidEmail.verificationEmailSentCount >= config.get('verificationEmailSentCount') && token_expire > current_day) {
                return res.send(Response.projectFailResp('Verification mail sent limit reached,Please try next day.'));
            }
            //increasing the count every time after mail sent
            else if (current_day <= token_expire) {
                resultData = await adminSchema.findOneAndUpdate(
                    { email: email },
                    { $set: { emailValidateToken: uuidv1(), emailTokenExpire: moment(current_day).add(1, 'day'), verificationEmailSentCount: ValidEmail.verificationEmailSentCount + 1 } },
                    { returnDocument: 'after' }
                );
            }
            if (process.env.node_env !== 'localDev') {
                const mailResponse = await MailResponse.sendAdminVerificationMail([resultData]);
                logger.info(`Mail invitation response ${mailResponse}`);
            }
            res.send(Response.projectSuccessResp(`Admin verification mail sent successfully`));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error updating Admin', err.message));
        }
    }

    async updatePassword(req, res) {
        try {
            const result = req.verified;
            const { language, email } = result.userData?.userData;
            const { oldPassword } = req?.body;
            const userData = await adminSchema.findOne({ email: email });
            let decryptedPassword = await Password.decryptText(userData.password, config.get('encryptionKey'));
            if (oldPassword !== decryptedPassword) return res.send(Response.projectFailResp(AdminMessageNew['ADMIN_CURRENT_PASSWORD_FAIL'][language ?? 'en']));
            const newPassword = req?.body?.newPassword ? await Password.encryptText(req.body.newPassword, config.get('encryptionKey')) : null;
            const { error } = await adminValidation.updatePassword(req.body);
            if (error) return res.send(Response.projectFailResp(CommentMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.message));
            const resultData = await adminSchema.findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, { returnDocument: 'after' });
            res.send(Response.projectSuccessResp(AdminMessageNew['ADMIN_PASSWORD_SUCCESS'][language ?? 'en'], resultData));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp(AdminMessageNew['ADMIN_PASSWORD_FAIL'][language ?? 'en'], err.message));
        }
    }
    async AdminDelete(req, res) {
        const result = req.verified;
        if (result.state == true) {
            const reuse = new Reuse(req);
            try {
                const email = req.query.email;
                const orgId = req.query.orgId;
                let droppedCollections = [];
                const collectionNamesIterable = Object.entries(reuse.collectionName);
                for (const [key, collectionName] of collectionNamesIterable) {
                    const db = await checkCollection(collectionName);
                    if (db) {
                        await db.dropCollection(collectionName);
                        droppedCollections.push(collectionName);
                    }
                }
                logger.info(`droppedCollections ${droppedCollections}`);
                const adminInfo = await adminSchema.findOne({ email, orgId });
                if (!adminInfo) return res.send(Response.projectFailResp(`Invalid data to delete Admin`));
                await activityModel.deleteMany({ orgId: orgId })
                await permissionModel.deleteMany({ orgId: orgId })
                await roleModel.deleteMany({ orgId: orgId })
                await projectCommentSchema.deleteMany({ orgId: orgId })
                await groupSchema.deleteMany({ orgId: orgId })
                await configFieldSchema.deleteOne({ orgId: orgId })
                await configViewFieldSchema.deleteOne({ orgId: orgId })
                await dynamicFieldSchema.deleteMany({ orgId: orgId })
                await ConfigSchema.deleteOne({ orgId: orgId })
                await taskCommentSchema.deleteMany({ orgId: orgId });
                await subtaskCommentSchema.deleteMany({ orgId: orgId });
                let condition = {}
                condition.adminId = adminInfo._id.toString();
                condition.isDefault = false;
                await TaskTypeModel.deleteMany(condition);
                await TaskStatusModel.deleteMany(condition);
                await TaskStageModel.deleteMany(condition);
                await TaskCategoryModel.deleteMany(condition);
                const AdminDelete = await adminSchema.deleteOne({ orgId: orgId })
                if (AdminDelete.deletedCount == 1) {
                    return res.send(Response.projectSuccessResp("Successfully Deleted Admin"))
                }

            } catch (err) {
                res.send(Response.projectFailResp("Failed to Delete admin", err))
            }
        } else {
            return res.send(result)
        }
    }


    async isEmpUser(req, res) {
        try {
            const userToken=req?.body?.token;
            if(!userToken){
                return res.send(Response.tokenFailResp(`Access Token is Required`))
            }
            const empAdminData= await this.decryptText(userToken);
            if( (typeof(empAdminData)) === 'string'){
                return res.send(Response.tokenFailResp(`Invalid access token`,empAdminData))
            }

            const userEmail = empAdminData?.email;
            
            const isUserExist = await adminSchema.findOne({ email: userEmail });

            if (!isUserExist) return res.send(Response.projectFailResp(`User not exist.`,empAdminData));

            if (!isUserExist?.verified) return res.send(Response.projectEmailNotValidate(`email not verified`));

            if (isUserExist?.isSuspended) return res.status(400).send(Response.projectFailResp(`Admin's account is suspended and not allowed to login.`));

            const isDefaultScreenSet = await defaultScreen.findOne({ adminId: isUserExist?._id.toString() });
            if (!isDefaultScreenSet) await setDefaultScreen(isUserExist?._id.toString());

            let data, accessToken, filteredData;
            if (isUserExist.isDasboardConfigSet == false) {
                let update = {
                    dashboardConfigData: [
                        {
                            dashboardConfig_id: 1, 
                            dashboardConfig: projectGrids,
                        },
                        {
                            dashboardConfig_id: 2,
                            dashboardConfig: taskGrids,
                        },
                        {
                            dashboardConfig_id: 3,
                            dashboardConfig: subTaskGrids,
                        },
                        {
                            dashboardConfig_id: 4,
                            dashboardConfig: memberGrids,
                        },
                        {
                            dashboardConfig_id: 5,
                            dashboardConfig: activityGrids,
                        },
                    ]
                };
                let value = {
                    isDasboardConfigSet: true,
                    dashboardConfigCreatedAt: Date.now(),
                    dashboardConfigUpdatedAt: Date.now(),
                };
                data = await adminSchema.findOneAndUpdate(
                    { _id: isUserExist._id },
                    {
                        $set: value,

                        $push: update
                    }
                    , { returnDocument: 'after' });
            let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData,dashboardConfig, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    data.toJSON();
                filteredData = data;
                accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });
            }
            else {
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData,dashboardConfig, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    isUserExist.toJSON();
                filteredData = isUserExist;
                accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });
            }
            await adminSchema.findOneAndUpdate({ email: userEmail }, { $set: { lastLogin: Date.now() } }, { returnDocument: 'after' });
            //storing the activity
            const fullName = filteredData.firstName + ' ' + filteredData.lastName;
            let adminDetails = activityOfAdmin(`${fullName} Logged in.`, 'Admin', 'Login', `${filteredData.orgId}`);
            adminDetails['adminId'] = filteredData._id.toString();
            event.emit('activity', adminDetails);
           if(new Date()==new Date(filteredData.planExpireDate- 5 * 24 * 60 * 60 * 1000)){
            const message = `Your Plan is expiring whitin five days,please upgrade plan.`
            await NotificationService.adminNotification(message, filteredData._id, _id, { collection: 'plan', id: filteredData._d.toString() });
           }
            res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
        } catch (err) {
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error in fetch admin details.', err.message));
        }
    }

    async decryptText(text) {
        try{
            const data= await Password.decryptText(text, config.get('navigateKey'))
            return JSON.parse(data);
        }catch(err){
            return err.message;
        }
    }

    async adminSignInSignUp(req,res){
        try{

            const { email:userEmail,password} = req.body;
            //Checking if Admin Exists or not

            const isExists = await adminSchema.findOne({ 
                $or: [
                  { email: userEmail },
                  { userName: userEmail }
                ]
              });
            //If Admin Exists
            if(isExists){
                console.log('Login');
                const userEmail = req?.body?.email?.toLowerCase();
                // let { password } = req?.body;
                const { error } = adminValidation.fetchAdmin(req?.body);
                if (error) return res.send(Response.validationFailResp('validation failed', error.message));
                const isUserExist = await adminSchema.findOne({ 
                    $or: [
                      { email: userEmail },
                      { userName: userEmail }
                    ]
                  });

                //checking user exists or not
                if (!isUserExist) return res.send(Response.projectFailResp(`User not exist.`));
    
                //checking user email verified or not
                if (!isUserExist?.verified) return res.send(Response.projectEmailNotValidate(`email not verified`));
                
                //checking admin account is suspended or not
                if (isUserExist?.isSuspended) return res.status(400).send(Response.projectFailResp(`Admin's account is suspended and not allowed to login.`));
                let decryptPassword = await Password.decryptText(isUserExist.password, config.get('encryptionKey'));
                if (password !== decryptPassword) return res.send(Response.projectFailResp(`Invalid Password.!!`));

                  // add the default screen config
            const isDefaultScreenSet = await defaultScreen.findOne({ adminId: isUserExist?._id.toString() });
            if (!isDefaultScreenSet) await setDefaultScreen(isUserExist?._id.toString());

            let data, accessToken, filteredData;
            if (isUserExist.isDasboardConfigSet == false) {
                const { email:userEmail,password} = req.body;

                let update = {
                    dashboardConfigData: [
                        {
                            dashboardConfig_id: 1,
                            dashboardConfig: projectGrids,
                        },
                        {
                            dashboardConfig_id: 2,
                            dashboardConfig: taskGrids,
                        },
                        {
                            dashboardConfig_id: 3,
                            dashboardConfig: subTaskGrids,
                        },
                        {
                            dashboardConfig_id: 4,
                            dashboardConfig: memberGrids,
                        },
                        {
                            dashboardConfig_id: 5,
                            dashboardConfig: activityGrids,
                        },
                    ]
                };
            // let adminRegisterData=await AdminEmpDataFetch.adminRegisterDetails('empv3demo','empv3demodev');
                let value = {
                    isDasboardConfigSet: true,
                    dashboardConfigCreatedAt: Date.now(),
                    dashboardConfigUpdatedAt: Date.now()
                };
                data = await adminSchema.findOneAndUpdate(
                    { _id: isUserExist._id },
                    {
                        $set: value,

                        $push: update
                    }
                    , { returnDocument: 'after' });
                let { forgotPasswordToken, forgotTokenExpire,  dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    data.toJSON();
                filteredData = data;
                delete filteredData.password
                
                accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });
            }else {
                const { email:userEmail,password} = req.body;

            let adminRegisterData=await AdminEmpDataFetch.adminRegisterDetails(res,password,userEmail,password);

            delete adminRegisterData.password;
            const stable = await PlanDowngradeService.downGradePlan(res,isExists.orgId,adminRegisterData?.userOrgId, adminRegisterData.planData, isExists._id.toString(), adminRegisterData.planExpireDate,adminRegisterData);
            const newData = await adminSchema.findOneAndUpdate({ 
                $or: [
                  { email: userEmail },
                  { userName: userEmail }
                ]
              }, { $set: { lastLogin: Date.now() ,...adminRegisterData} }, { returnDocument: 'after' });
            //storing the activity
            let { forgotPasswordToken, forgotTokenExpire, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
            newData.toJSON();
            filteredData = filtereData;
            delete filteredData.password
            accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
        
            const fullName = filteredData.firstName + ' ' + filteredData.lastName;
            let adminDetails = activityOfAdmin(`${fullName} Logged in.`, 'Admin', 'Login', `${filteredData.orgId}`);
            adminDetails['adminId'] = filteredData._id.toString();
            event.emit('activity', adminDetails);

            if(new Date()>new Date(filteredData.planExpireDate- 5 * 24 * 60 * 60 * 1000)){
                const message = `Your Plan is expiring whitin five days,please upgrade plan.`
                await NotificationService.adminNotification(message, filteredData?._id, filteredData?._id.toString(), { collection: 'plan', id: filteredData?._id.toString() });
               }
            }
            res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            }else{
                console.log('Register');

            //If New Admin 
            const { value, error } = adminValidation.fetchAdmin(req.body);
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));

            let empUser = true;
            const adminData = await adminSchema.find({});
            if (adminData?.length === 0) {
                await planModel.insertMany(plans);
            }

            //Fetching Plan from External Api's
            let adminRegisterData=await AdminEmpDataFetch.adminRegisterDetails(res,password,userEmail,password);

                    //If Admin not Exist then Register Admin
                    //checking for duplication
                    const dataDuplicate = await adminSchema.findOne({
                        $or: [{ orgId: adminRegisterData?.orgId }, { phoneNumber: adminRegisterData?.phoneNumber }, { email: adminRegisterData?.email }],
                    });
                    if (dataDuplicate) {
                        if (dataDuplicate?.email === adminRegisterData?.email) return res.send(Response.projectFailResp(`Admin email ${value?.email} already exist.`, `Admin email ${value?.email} already exist.`));
                        if (dataDuplicate?.orgId === adminRegisterData?.orgId) return res.send(Response.projectFailResp(`Admin orgId ${value?.orgId} already exist.`, `Admin orgId ${value?.orgId} already exist.`));
                        if (dataDuplicate?.phoneNumber === adminRegisterData?.phoneNumber)
                            return res.send(Response.projectFailResp(`Phone number already exist, please check phone number.`, `Phone number already exist, please check phone number.`));
                    } else {
                        adminRegisterData.email = adminRegisterData.email.toLowerCase();
                        adminRegisterData.password = await Password.encryptText(adminRegisterData.password, config.get('encryptionKey'));
                        //If Switched from EmpMonitor to WM
                        if(empUser===true){
                            adminRegisterData.verified = true
                        }
                        //registering the admin
                        let resultData = await adminSchema.create(adminRegisterData);
                        let planHistory = storePlanHistory(adminRegisterData?.userOrgId, resultData.planData, resultData._id.toString(), resultData.planExpireDate)
                        event.emit('history', planHistory);
                        //storing the activity
                        const { firstName, lastName, orgId } = resultData;
                        let adminDetails = activityOfAdmin(`${firstName} ${lastName} registered.`, 'Admin', 'Registered', `${orgId}`);
                        adminDetails['adminId'] = resultData._id.toString();
                        event.emit('activity', adminDetails);
                        if(empUser!==true){
                        //checking for registerd admin is an empAdmin or not
                        const result = await isEmpAdmin({ resultData, empUser, res });
                        resultData = result?.resultData;
                        empUser = result?.empUser;
                        }
                    //sending an email to the registered admin, excluding the empAdmin.
                    if (!empUser) {
                        // if (process.env.node_env !== 'localDev') {
                            const mailResponse = await MailResponse.sendAdminVerificationMail([resultData]);
                            logger.info(`Mail invitation response ${mailResponse}`);
                            //    }
                    let {forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filteredData } = resultData.toJSON();
                    let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });

                    res.send(Response.projectSuccessResp(`Admin stored successfully.`, { resultData: filteredData ,accessToken}));
                } else {
                    // add the welcome mail
                    const isDataExist = await adminSchema.findOne({ email: resultData?.email });

                    isDataExist.password = await Password.decryptText(isDataExist.password, config.get('encryptionKey'));
                    // if (process.env.node_env !== 'localDev') {}

                    let mailStatus = await MailResponse.sendWelcomeMailAdminBySendgridAPI(isDataExist);

                    let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filtereData } =
                    resultData.toJSON();
                    let accessToken = jwt.sign({ userData: filtereData }, config.get('token_secret'), { expiresIn: '24h' });
                    console.log(mailStatus,'mailStatus');
                    logger.info(`${resultData?.firstName} is EmpAdmin, auto verified \n Welcome Mail Status ${mailStatus}`);
                    res.send(Response.projectSuccessResp(`EmpAdmin stored successfully,Auto verified`, { resultData: filtereData ,accessToken}));
                }
            }
        }
        }catch(err){
            
            logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error creating Config.', err.message));
        }
    }
}

export default new AdminService();
