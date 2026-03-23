import axios from 'axios';
import config from 'config';
import planModel from '../plan/plan.model.js';
import Response from '../../response/response.js';


class AdminEmpDataFetch {
    async adminRegisterDetails(res,actualPassword,userName,password) {
        console.log(userName,password);
                // 1. Checking Access
                const checkAccessConfig = {
                    method: 'get',
                    url: `${config.get('A_Member_Routes')}/check-access/by-login-pass?_key=${config.get('_key')}&login=${userName}&pass=${password}`,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                };
    
                const checkAccessResponse = await axios.request(checkAccessConfig);
                const userId = checkAccessResponse?.data?.user_id;
    
                if (!userId) {
                    throw new Error('User ID not found');
                }
    
                // 2. Getting Admin Details
                const getAdminDetailsConfig = {
                    method: 'get',
                    url: `${config.get('A_Member_Routes')}/users?_key=${config.get('_key')}&_filter[user_id]=${userId}`,
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                };
    
                let adminDetailsResponse = await axios.request(getAdminDetailsConfig);
                if(adminDetailsResponse?.data[0]?.isworkforce===0){
                res.send(Response.projectFailResp('Cannot Create user. Not a user from A Member Login', adminDetailsResponse?.data[0]?.isworkforce));
                }
                // 3. Getting Admin Invoice Details
                const getAdminInvoiceConfig = {
                    method: 'get',
                    url: `${config.get('A_Member_Routes')}/invoices?_key=${config.get('_key')}&_filter[user_id]=${userId}`,
                     headers: { 
                        'Content-Type': 'application/json'
                    }
                };
                
                const adminInvoice = await axios.request(getAdminInvoiceConfig);
    
                if(adminInvoice['_total'] == 0){
                    //  retrun with plan invild message 
                    return ;
                }
                let checkPlan = checkPlans(checkAccessResponse?.data?.subscriptions);
                let activePlanIndex = checkActiveInvoice(adminInvoice, checkPlan);
                let activePlan =  adminInvoice?.data[activePlanIndex]; // this is this current active plan 
                let activePlanDetails =  activePlan['nested']['invoice-items'][0];
                let activePlanAccess =  activePlan['nested']['access'][0];

                let planType = (function() {
                    switch(activePlanDetails?.item_title) {
                        case 'Free For Lifetime 2 Account':
                            return 'Free';
                        case 'Standard - Yearly':
                            return 'Standard';
                        case 'Premium - Yearly':
                            return 'Premium';
                        case 'Pro - Yearly':
                            return 'Pro';
                        case 'Standard - Quarterly':
                            return 'Standard';
                        case 'Premium - Quarterly':
                            return 'Premium';
                        case 'Pro - Quarterly':
                            return 'Pro';
                        default:
                            return 'Unknown';
                    }
                })();

                        let adminRegisterData = {
                            "firstName":adminDetailsResponse?.data[0]?.name_f,
                            "userName":adminDetailsResponse?.data[0]?.name_f+''+adminDetailsResponse?.data[0]?.name_l,
                            "password":actualPassword,
                            "phoneNumber":adminDetailsResponse?.data[0]?.phone,
                            "email":adminDetailsResponse?.data[0]?.email,
                            "orgId":adminDetailsResponse?.data[0]?.company_id,

                            "planName": planType,
                            "planStartDate": activePlanAccess.begin_date,
                            "planExpireDate": activePlanAccess.expire_date,
                            "isWorkForce": adminDetailsResponse?.data[0]?.isworkforce===1?true:false, // valid register with WFM signup form or not
                            // if you want you can store 
                            "plan_id": activePlanDetails.item_id,
                            "time_started": activePlan['tm_started'],
                            "rebill_date": activePlan['rebill_date'],

                            "orgName":adminDetailsResponse?.data[0]?.orgname,
                            "address":adminDetailsResponse?.data[0]?.street+''+adminDetailsResponse?.[0]?.street2+''+adminDetailsResponse?.[0]?.city+''+adminDetailsResponse?.[0]?.state+''+adminDetailsResponse?.[0]?.country,
                            "country":adminDetailsResponse?.data[0]?.country,
                            "isEmpMonitorUser":false
                        }
            

                        if (planType) {
                            let details = await planModel.findOne({ planName: planType });
                            details.userFeatureCount=activePlanDetails.qty
                            details.currency = activePlanDetails.currency
                            details.planPrice = activePlanDetails.first_total
                            let { createdAt, updatedAt, ...planDetails } = details.toJSON();
                            adminRegisterData.planData = planDetails;
                        }
                        return adminRegisterData;
                    }
}
export default new AdminEmpDataFetch();



// check with current date - plan is not expire 
// get the latest plan id from multiple subsription
function checkPlans(plans) {
    const currentDate = new Date().toISOString().split('T')[0];
    const keys = Object.keys(plans).map(Number);
    const maxKey = Math.max(...keys);
    
    if (new Date(plans[maxKey]) >= new Date(currentDate)) {
        return maxKey;
    } else {
        delete plans[maxKey];
        return checkPlans(plans);
    }
}

// Check status should not be 0 
// ItemId check with verified latest plan id, return the index of active plan
function checkActiveInvoice(invoice, plan) {
    for (let i = invoice?.data?._total - 1; i >= 0; i--) {
        const status = invoice?.data?.[i].status;
        const itemId = invoice?.data?.[i].nested['invoice-items'][0].item_id; // Adjusted to access nested property correctly

        if ((status === 1 || status === 2 || status === 3 || status === 4 || status === 5) && itemId === plan) {
            return i;
        }
    }
    return -1; 
}

