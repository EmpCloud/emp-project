import UserValidation from './unauthorized.validate.js';
import Response from '../../response/response.js';
import { checkCollection } from '../../utils/user.utils.js';
import uuidv1 from 'uuidv1';
import MailResponse from '../../mailService/userMailTemplate.js';
import jwt from 'jsonwebtoken';
import config from 'config';
import moment from 'moment';
import Logger from '../../resources/logs/logger.log.js';
import { unauthorizedUserMessage } from '../language/language.translator.js';
import NotificationService from '../notifications/notifications.service.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/eventEmitter.js';
import Password from '../../utils/passwordEncoderDecoder.js';
import defaultScreen from '../defaultScreenConfig/defaultScreenConfig.model.js';
import { setDefaultScreenUser } from '../../utils/project.utils.js';
import adminSchema from '../admin/admin.model.js';

class unauthorizedService {
    async verifyUser(req, res) {
        try {
            let { activationLink, orgId, invitation } = req?.body;
            let userMail = req?.body?.userMail?.toLowerCase();
            const { error } = UserValidation.verifyUser({ activationLink, userMail, orgId, invitation });
            if (error) return res.send(Response.validationFailResp(unauthorizedUserMessage['VALIDATION_FAILED'][config.get('defaultLanguage')], error));
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;

            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${userCollectionName}${unauthorizedUserMessage['COLLECTION_NOT_PRESENT'][config.get('defaultLanguage')]}`));
            const isDataExist = await db.collection(userCollectionName).findOne({ email: userMail });
            if (!isDataExist) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_NOT_PRESENT'][config.get('defaultLanguage')]));
            if (isDataExist?.verified == true) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_ACTIVATED'][config.get('defaultLanguage')]));
            if(isDataExist?.invitation == 2 ) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_INVITATION_CLOSED'][config.get('defaultLanguage')]))
            if (invitation === 2) {
                const data = await db.collection(userCollectionName).findOneAndUpdate({ email: userMail }, { $set: { invitation: 2 } });
                if (!data) return res.send(Response.projectFailResp(`Error in active admin.!!`));
                const adminData = await adminSchema.find({_id:isDataExist?.adminId})
                if(process.env.node_env !== 'localDev'){
                    let mailResponse = await MailResponse.sendInvitationDeclinedMail(isDataExist,adminData[0]);}

                // Notification to Admin
                const message = `${isDataExist.firstName+" "+isDataExist.lastName} (${userMail}) rejected mail invitation`;
                await NotificationService.adminNotification(message, isDataExist.adminId, isDataExist._id, { collection: 'users', id: isDataExist._id.toString() });

                return res.send(Response.projectFailResp('Mail Invitation Rejected'));
            }
            if (isDataExist?.emailValidateToken != activationLink) return res.send(Response.projectFailResp(unauthorizedUserMessage['INVALID_TOKEN'][config.get('defaultLanguage')]));
            if (isDataExist?.emailTokenExpire < moment()) return res.send(Response.projectFailResp(unauthorizedUserMessage['TOKEN_EXPIRED'][config.get('defaultLanguage')]));
            else {
                
                // if(process.env.node_env !== 'localDev'){
                //  let mailResponse = await MailResponse.sendWelcomeMailBySendgridAPI(isDataExist);}
                // Notification to Admin
               
                res.send(Response.projectSuccessResp(unauthorizedUserMessage['ACTIVATION_SUCCESS'][config.get('defaultLanguage')]));
            }
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(unauthorizedUserMessage['ACTIVATION_FAIL_ERROR'][config.get('defaultLanguage')], err));
        }
    }

    async UserLogin(req, res) {
        try {
            const { password, orgId } = req?.body;
            const userMail = req?.body?.userMail?.toLowerCase();
            const { error } = UserValidation.verifyUserCreds({ userMail, password });
            if (error) return res.send(Response.validationFailResp(unauthorizedUserMessage['VALIDATION_FAILED'][config.get('defaultLanguage')], error));
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${userCollectionName}${unauthorizedUserMessage['INVALID_ORG_ID'][config.get('defaultLanguage')]}`));
            let userData = await db.collection(userCollectionName).findOne({ email: userMail });
            if (!userData) return res.send(Response.projectFailResp(unauthorizedUserMessage['USER_NOT_PRESENT'][config.get('defaultLanguage')]));
            let decryptPassword = await Password.decryptText(userData?.password, config.get('encryptionKey'))
            if(password !== decryptPassword){
                return res.send(Response.projectFailResp(unauthorizedUserMessage['INVALID_PASSWORD'][config.get('defaultLanguage')]));
            }
        
            if (userData?.verified == false) return res.send(Response.projectEmailNotValidate(unauthorizedUserMessage['EMAIL_NOT_VERIFIED'][config.get('defaultLanguage')]));
            const suspendedUser = await db.collection(userCollectionName).findOne({ email: userMail, isSuspended: true });
            if (suspendedUser) return res.status(400).send(Response.projectFailResp(unauthorizedUserMessage['USER_SUSPENDED'][config.get('defaultLanguage')]));
            if (userData?.invitation === 2) return res.status(400).send(Response.projectFailResp(unauthorizedUserMessage['USER_REJECTED'][config.get('defaultLanguage')]));
            let accessToken = jwt.sign({ userData }, config.get('user_token_secret'), { expiresIn: '24h' });
            let { firstName, _id, profilePic } = userData;
            let userId = _id.toString();
            await db.collection(userCollectionName).findOneAndUpdate({ email: userMail }, { $set: { lastLogin: new Date() } }, { returnDocument: 'after' });
             const isDefaultScreenSet = await defaultScreen.findOne({ userId: userId });
            if (!isDefaultScreenSet) await setDefaultScreenUser(userId);
            let userActivityDetails = activityOfUser(`${userData.firstName+" "+userData.lastName} logged In `, 'User', firstName, 'Login', orgId, userId, profilePic);
            event.emit('activity', userActivityDetails);
            res.send(Response.projectSuccessResp(unauthorizedUserMessage['USER_LOGIN_SUCCESS'][config.get('defaultLanguage')], { userData, accessToken }));
        } catch (error) {
            Logger.error(`Error in the catch ${error}`);
            Response.projectFailResp(unauthorizedUserMessage['USER_FETCH_FAIL_ERR'][config.get('defaultLanguage')], error);
        }
    }

    async forgotPassword(req, res) {
        try {
            const email  = req?.body?.email?.toLowerCase();
            const {  orgId } = req?.body;
            const { error } = UserValidation.forgotPasswordValidation({ email, orgId });
            if (error) return res.send(Response.validationFailResp(unauthorizedUserMessage['VALIDATION_FAILED'][config.get('defaultLanguage')], error));
            //checking collection
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${userCollectionName}${unauthorizedUserMessage['COLLECTION_NOT_PRESENT'][config.get('defaultLanguage')]}`));
            let userData = await db.collection(userCollectionName).findOne({ email: email });
            if (!userData) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_NOT_FOUND'][config.get('defaultLanguage')]));
            let current_day = new Date();
            const verifyToken = uuidv1();
            const emailTokenExpire = moment().add(1, 'day')?._d;
            let data;
            //refresh the email sent count for a fresh day
            if (new Date(moment(current_day).format('YYYY-MM-DD')) >=new Date(moment(userData.forgotTokenExpire).format('YYYY-MM-DD'))) {           
                data = await db
                    .collection(userCollectionName)
                    .findOneAndUpdate({ email: email }, { $set: { forgotPasswordToken: verifyToken, forgotTokenExpire: emailTokenExpire, passwordEmailSentCount: 1} });
                
            } else if (userData.passwordEmailSentCount >= config.get('passwordEmailSentCount') && userData.forgotTokenExpire > current_day) {
                return res.send(Response.projectFailResp('Password Updation mail sent limit reached,Please try next day.'));
             }
            else if (current_day <= userData.forgotTokenExpire) {
                data = await db
                    .collection(userCollectionName)
                    .findOneAndUpdate(
                        { email: email },
                        { $set: { forgotPasswordToken: verifyToken, forgotTokenExpire: emailTokenExpire, passwordEmailSentCount: userData.passwordEmailSentCount + 1 } },
                        { returnDocument: 'after' }
                    );
            }
            if (process.env.node_env !== 'localDev') {
                let mailResponse = await MailResponse.sendUserForgotPasswordVerificationMail(data?.value);
                Logger.info(`Mail invitation response ${mailResponse}`);
             }
            res.send(Response.projectSuccessResp(unauthorizedUserMessage['PWD_MAIL_SUCCESS'][config.get('defaultLanguage')]));
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(unauthorizedUserMessage['ERROR_Forget_PWD'][config.get('defaultLanguage')], err.message));
        }
    }

    async resetPassword(req, res, next) {
        try {
            const   email  = req?.body?.email?.toLowerCase();
            const { newPassword, verifyToken, orgId } = req?.body;
            const { error } = UserValidation.resetPassword({ email, newPassword, orgId, verifyToken });
            if (error) return res.send(Response.validationFailResp(unauthorizedUserMessage['VALIDATION_FAILED'][config.get('defaultLanguage')], error));
            //checking collection
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${userCollectionName}${unauthorizedUserMessage['INVALID_ORG_ID'][config.get('defaultLanguage')]}`));
            //finding email is exist or not
            const userData = await db.collection(userCollectionName).findOne({ email: email });
            if (!userData) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_NOT_FOUND'][config.get('defaultLanguage')]));
            if (userData.forgotTokenExpire < moment()) return res.send(Response.projectFailResp(unauthorizedUserMessage['TOKEN_EXPIRED'][config.get('defaultLanguage')]));
            let encryptedPassword = await Password.encryptText(newPassword, config.get('encryptionKey'))
            //verifying token, if it is true it will reset password otherwise it will give error
            if (userData.forgotPasswordToken == verifyToken) {
                const resultData = await db.collection(userCollectionName).findOneAndUpdate({ email: email }, { $set: { password: encryptedPassword,forgotPasswordToken: uuidv1() } }, { returnDocument: 'after' });
                const { firstName, _id, profilePic } = userData;
                const userId = _id.toString();
                const userActivityDetails = activityOfUser(`${userData.firstName+" "+userData.lastName} reset the password`, 'User', firstName, 'Reset Password', orgId, userId, profilePic);
                event.emit('activity', userActivityDetails);
                if (resultData.value) res.send(Response.projectSuccessResp(unauthorizedUserMessage['PWD_RESET_SUCCESS'][config.get('defaultLanguage')], resultData.value));
            } else {
                res.send(Response.projectFailResp(unauthorizedUserMessage['INVALID_TOKEN'][config.get('defaultLanguage')]));
            }
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(unauthorizedUserMessage['ERROR_IN_PWD_RESET'][config.get('defaultLanguage')], err.message));
        }
    }

    async setPassword(req, res, next) {
        try {
            const mail = req?.body?.userMail?.toLowerCase();
            const { password, orgId } = req?.body;
            const { error } = UserValidation.setPassword({ mail, password, orgId });
            if (error) return res.send(Response.validationFailResp(unauthorizedUserMessage['VALIDATION_FAILED'][config.get('defaultLanguage')], error));

            //checking collection
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${orgId} ${unauthorizedUserMessage['INVALID_ORG_ID'][config.get('defaultLanguage')]}`));

            //finding user is exist or not
            const userData = await db.collection(userCollectionName).findOne({ email: mail });
            if (!userData) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_NOT_FOUND'][config.get('defaultLanguage')]));
            const encryptedPassword = await Password.encryptText(password,config.get('encryptionKey'))
            const resultData = await db.collection(userCollectionName).findOneAndUpdate({ email: mail }, { $set: { password: encryptedPassword,verified: true, invitation: 1, emailValidateToken: uuidv1() } }, { returnDocument: 'after' });
            resultData.value.password = password;
            if(process.env.node_env !== 'localDev'){
            await MailResponse.sendWelcomeMailBySendgridAPI(resultData?.value);}
             // Notification to Admin
             const message = `${userData.firstName+" "+userData.lastName} (${mail}) joined WM`;
             await NotificationService.adminNotification(message, userData?.adminId, userData?._id,{ collection: 'users', id: userData?._id.toString() });
            res.send(Response.projectSuccessResp(unauthorizedUserMessage['PASSWORD_SET'][config.get('defaultLanguage')]));
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(unauthorizedUserMessage['ERROR_IN_PWD_RESET'][config.get('defaultLanguage')], err.message));
        }
    }

    async generateToken(req, res) {
        try {
            const   email  = req?.body?.email?.toLowerCase();
            const {  orgId } = req?.body;
            const { error } = UserValidation.forgotPasswordValidation({ email, orgId });
            if (error) return res.send(Response.validationFailResp(unauthorizedUserMessage['VALIDATION_FAILED'][config.get('defaultLanguage')], error));
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${userCollectionName}${unauthorizedUserMessage['COLLECTION_NOT_PRESENT'][config.get('defaultLanguage')]}`));
            const ValidEmail = await db.collection(userCollectionName).findOne({ email: email });
            if (!ValidEmail) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_NOT_FOUND'][config.get('defaultLanguage')]));
            const verified = await db.collection(userCollectionName).findOne({ email: email, verified: true });
            const current_day = new Date();
            const token_expire = ValidEmail.emailTokenExpire;
            if (verified) return res.send(Response.projectFailResp(unauthorizedUserMessage['EMAIL_ACTIVATED'][config.get('defaultLanguage')]));
            let data;
            //refresh the email sent count for a fresh day
            if (new Date(moment(current_day).format('YYYY-MM-DD')) >= new Date(moment(token_expire).format('YYYY-MM-DD'))) {
                data = await db
                    .collection(userCollectionName)
                    .findOneAndUpdate({ email: email }, { $set: { emailValidateToken: uuidv1(), emailTokenExpire: new Date(moment().add(1, 'day')), verificationEmailSentCount: 1 } });
            }
            //checking email sending restriction for a day
            else if (ValidEmail.verificationEmailSentCount >= config.get('verificationEmailSentCount') && new Date(token_expire) > new Date(current_day)) {
                return res.send(Response.projectFailResp(unauthorizedUserMessage['MAIL_GENERATE_LIMIT_REACHED'][config.get('defaultLanguage')]));
            }
            //increasing the count every time after mail sent
            else if (current_day <= token_expire) {
                data = await db.collection(userCollectionName).findOneAndUpdate(
                    { email: email },
                    {
                        $set: {
                            emailValidateToken: uuidv1(),
                            emailTokenExpire: new Date(moment(current_day).add(1, 'day')),
                            verificationEmailSentCount: ValidEmail.verificationEmailSentCount + 1,
                        },
                    },
                    { returnDocument: 'after' }
                );
            }

            if (process.env.node_env !== 'localDev') {
                let mailResponse = await MailResponse.sendUserVerificationMail(data.value);
                Logger.info(`Mail invitation response ${mailResponse}`);
            }
            res.send(Response.projectSuccessResp(unauthorizedUserMessage['VERIFICATION_MAIL_SUCCESS'][config.get('defaultLanguage')]));
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(unauthorizedUserMessage['GENERATE_TOKEN_ERROR'][config.get('defaultLanguage')], err.message));
        }
    }

    async updatePassword(req, res) {
        try {
            const result = req.verified;
            const { language, email,orgId } = result.userData?.userData;
            const { oldPassword } = req?.body;
            const userCollectionName = `org_${orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.send(Response.projectFailResp(`${userCollectionName}${unauthorizedUserMessage['COLLECTION_NOT_PRESENT'][config.get('defaultLanguage')]}`));
            const userData = await db.collection(userCollectionName).findOne({ email: email });
            let decryptedPassword = await Password.decryptText(userData.password, config.get('encryptionKey'));
            if (oldPassword !== decryptedPassword) return res.send(Response.projectFailResp(unauthorizedUserMessage['USER_CURRENT_PASSWORD_FAIL'][language ?? 'en']));
            const newPassword = req?.body?.newPassword ? await Password.encryptText(req.body.newPassword, config.get('encryptionKey')) : null;
            const { error } = UserValidation.updatePassword(req.body);
            if (error) return res.send(Response.projectFailResp(CommentMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.message));
            const resultData = await db.collection(userCollectionName).findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, { returnDocument: 'after' });
            res.send(Response.projectSuccessResp(unauthorizedUserMessage['USER_PASSWORD_SUCCESS'][language ?? 'en'], resultData.value));
        } catch (err) {
            Logger.log(`Error in catch ${err}`);
            res.send(Response.projectFailResp(unauthorizedUserMessage['ERROR_IN_PWD_RESET'][language ?? 'en'], err.message));
        }
    }
}

export default new unauthorizedService();
