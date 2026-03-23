import sendGridMail from '@sendgrid/mail';
import config from 'config';
import { WelComeMail, verificationMail, forgetPassword,invitationRejectedMail } from './mailCode.js';
import {autoMailReport} from './autoReportTemplate.js';

class MailService {
    async sendWelcomeMailBySendgridAPI(data) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        const email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: data?.email,
            subject: config.get('sendgrid.WelcomeSubject'),
            html: WelComeMail(data),
        };
        let sendStatus = await sendGridMail.send(email);
        return sendStatus;
    }
    async sendUserForgotPasswordVerificationMail(data) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: data?.email,
            subject: config.get('sendgrid.resetPwdSub'),
            html: forgetPassword(data),
        };
        let sendStatus = await sendGridMail.send(email);
        return sendStatus;
    }
    async sendUserVerificationMail(data) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: data?.email,
            subject: config.get('sendgrid.generateTokenSub'),
            html: verificationMail(data),
        };
        let sendStatus = await sendGridMail.send(email);
        return sendStatus;
    }
    async sendInvitationDeclinedMail(userData,adminData) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: adminData?.email,
            subject: config.get('sendgrid.InvitationRejectedSubject'),
            html: invitationRejectedMail(userData,adminData),
        };
        let sendStatus = await sendGridMail.send(email);
        return sendStatus;
    }
    async sendAutoReportMail(userData){
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = userData.Recipients.map(userEmail => {
        let email = {
            from: {
                name: config.get('sendgrid.name'),
                email: config.get('sendgrid.email'),
            },
            to: userEmail,
            subject: config.get('sendgrid.autoMailReportSubject'),
            html: autoMailReport(userData),
        };
        return email;
    })
        bulkEmail = await Promise.all(mailPromise);
        let sendStatus = await sendGridMail.send(bulkEmail);
        return sendStatus;
    
}
}

export default new MailService();
