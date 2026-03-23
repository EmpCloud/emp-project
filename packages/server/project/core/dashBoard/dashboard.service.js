import Response from '../../response/response.js';
import adminSchema from '../admin/admin.model.js';
import jwt from 'jsonwebtoken';
import logger from '../../resources/logs/logger.log.js';
import config from 'config';
import { DashboardConfigNew } from '../../core/language/language.translator.js';
import { projectGrids, taskGrids, subTaskGrids, memberGrids, activityGrids, dashboardConfigMappings } from './dashboard.select.js';

class DashboardService {
    async createDashboardConfig(req, res) {
        const dashboardConfigName = dashboardConfigMappings[+req.query.id ?? 1];
        const result = req.verified;
        let { adminId: Id, language } = result.userData?.userData;
        try {
            let dashboardData;
            if (!dashboardConfigName) {
                res.send(Response.projectFailResp(DashboardConfigNew['DASHBOARD_NOT_VALID'][language ?? 'en']));
            }
            if (dashboardConfigName == 'ProjectManagement') {
                dashboardData = projectGrids;
            } else if (dashboardConfigName == 'TaskManagement') {
                dashboardData = taskGrids;
            } else if (dashboardConfigName == 'SubTaskManagement') {
                dashboardData = subTaskGrids;
            } else if (dashboardConfigName == 'MemberManagement') {
                dashboardData = memberGrids;
            } else if (dashboardConfigName == 'AcivityManagement') {
                dashboardData = activityGrids;
            }
            const isDataExist = await adminSchema.findOne({ _id: Id });
            if (isDataExist && dashboardConfigName) {  
                let update= {
                    dashboardConfigData :[
                    {
                    dashboardConfig_id:req?.query?.id,
                    dashboardConfig :dashboardData,
                    }]};
                let value ={
                isDasboardConfigSet: true,
                dashboardConfigCreatedAt: Date.now(),
                dashboardConfigUpdatedAt: Date.now(),
               }
            let data;
            let configExist = await adminSchema.findOne({$and: [{_id: Id },{"dashboardConfigData.dashboardConfig_id": req?.query?.id}]});
            if(configExist){
                data = await adminSchema.findOneAndUpdate({$and: [{_id: Id },{"dashboardConfigData.dashboardConfig_id":req?.query?.id}]}, { $set: value, "dashboardConfigData.$.dashboardConfig": dashboardData }, { returnDocument: 'after' });
            }  
            else{ 
             data = await adminSchema.findOneAndUpdate(
                    {_id: Id },
               { $set:value,
                    
                $push: update}
                ,{returnDocument: 'after'} );
            }
            let { dashboardConfigData, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filteredData } = data.toJSON();
            let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
            res.send(Response.projectSuccessResp(DashboardConfigNew['DASHBOARD_CREATE_SUCCESS'][language ?? 'en'], { data, accessToken }));

            }
        } catch (err) {
            logger.error(`Error in catch ${err}`);
            return res.send(Response.projectFailResp(DashboardConfigNew['DASHBOARD_CREATE_FAIL'][language ?? 'en'], err));
        }
    }

    async fetchConfig(req, res) {
        const result = req.verified;
        const { orgId, adminId: Id, language } = result.userData?.userData;
        try {


            let id = +req.query.id 
            let configExist = await adminSchema.findOne({$and: [{_id: Id },{"dashboardConfigData.dashboardConfig_id":id}]});
            if(!configExist){
               return res.send(Response.projectFailResp(DashboardConfigNew['DASHBOARD_CONFIG_NOT_EXIST'][language ?? 'en']));
            } 
            res.send(Response.projectSuccessResp(DashboardConfigNew['DASHBOARD_CONFIG__FETCH'][language ?? 'en'], configExist));
        } catch (err) {
            logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp(DashboardConfigNew['DASHBOARD_FETCH_FAIL'][language ?? 'en'], err));
        }
    }

       async updateDashboardConfig(req, res) {
        const result = req.verified;
        const { orgId, adminId: Id, language } = result.userData?.userData;
        try {
            const dbConfig = req?.body;
            let id = +req.query.id 
            let configExist = await adminSchema.findOne({$and: [{_id: Id },{"dashboardConfigData.dashboardConfig_id":id}]});
            if(!configExist){
               return res.send(Response.projectFailResp(DashboardConfigNew['DASHBOARD_CONFIG_NOT_EXIST'][language ?? 'en']));
            }
            const filteredArray = configExist.dashboardConfigData.find(item => (item.dashboardConfig_id == id));

            const oldConfig = Object.keys(filteredArray.dashboardConfig).every(key => dbConfig.hasOwnProperty(key));
            const ExistDbConfig = Object.keys(dbConfig).every(key => filteredArray.dashboardConfig.hasOwnProperty(key));
            
            if (ExistDbConfig && oldConfig) {
                let value ={
                dashboardConfigCreatedAt: Date.now(),
                dashboardConfigUpdatedAt: Date.now(),
               }
                const updateConfig = await adminSchema.findOneAndUpdate({$and: [{_id: Id },{"dashboardConfigData.dashboardConfig_id":id}]}, { $set: value, "dashboardConfigData.$.dashboardConfig": dbConfig }, { returnDocument: 'after' });
                logger.info('Updated result', updateConfig);
                return res.send(Response.projectSuccessResp(DashboardConfigNew['DASHBOARD_UPDATE_SUCCESS'][language ?? 'en'], { updatedConfigData: updateConfig }));
            }
            else {
                return res.send(Response.projectFailResp(DashboardConfigNew['FAILED_TO_MATCH_DASHBOARD_DATA'][language ?? 'en']));
            }
        } catch (err) {
            logger.error(`Error in catch ${err}`);
            return res.send(Response.projectFailResp(DashboardConfigNew['DASHBOARD_UPDATE_FAIL'][language ?? 'en'], err));
        }
    }
}

export default new DashboardService();
