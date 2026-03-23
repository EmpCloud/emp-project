import adminSchema from '../core/admin/admin.model.js';
import axios from 'axios';
import logger from '../resources/logs/logger.log.js';
import config from 'config';
import Response from '../response/response.js';

async function isEmpAdmin({ resultData, empUser, res }) {
    try {
        let response = await axios.post(config.get('add_emp_admin_link'), { email: resultData?.email, wmId: resultData?._id, secretKey: config.get('emp_secret_key') });
        if (response?.data?.data) {
            let orgId = response?.data?.data;
            await adminSchema.findOneAndUpdate({ email: resultData.email }, { isEmpMonitorUser: true, verified: true, orgId: orgId }, { returnDocument: 'after' });
            empUser = true;
            (resultData.isEmpMonitorUser = true), (resultData.verified = true), (resultData.orgId = orgId);
        }
    } catch (error) {
        logger.log(`Error in catch ${error}`);
        res.send(Response.projectFailResp('Error creating admin.', error.message));
    }
    return { resultData, empUser };
}

export { isEmpAdmin };
