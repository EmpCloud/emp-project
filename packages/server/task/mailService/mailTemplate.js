import sendGridMail from '@sendgrid/mail';
import config from 'config';
import { taskAssignmentMail } from './mailCode.js';
import logger from '../resources/logs/logger.log.js';

class MailService {
    
    async sendTaskAssignmentMail(userData,task) {
        sendGridMail.setApiKey(config.get('sendgrid.key'));
        let bulkEmail = [];
        const mailPromise = async () => {
            let email = {
                from: {
                    name: config.get('sendgrid.name'),
                    email: config.get('sendgrid.email'),
                },
                to: userData?.email,
                subject: config.get('sendgrid.TaskAssignmentSubject'),
                html: taskAssignmentMail(userData,task),
            };
            return email;
        };
        bulkEmail = await mailPromise();
        let sendStatus = await sendGridMail.send(bulkEmail);
        logger.info({sendstatus:sendStatus})
        return sendStatus;
    }
}
export default new MailService();
