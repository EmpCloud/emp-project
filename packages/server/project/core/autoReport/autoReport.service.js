import autoReportModule from './autoReport.model.js';
import reportValidation from './autoReport.validation.js';
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import mailService from '../../mailService/userMailTemplate.js'
import adminSchema from '../../core/admin/admin.model.js'
import Reuse from '../../utils/reuse.js';
import { callSchemaBasedOnContent, collections } from '../../cronJobs/autoSendReports.cronjobs.js'
import {
    checkCollection
} from '../../utils/project.utils.js';
import { cronJobActivity } from './../../cronJobs/cronSchedule.js';

class autoReportService {
    async sendAutoReport(req, res) {
        const result = req?.verified;
        let { orgId } = result.userData.userData;
        if (result.state === true) {
            try {
                const data = req.body;
                const { language, orgId } = result.userData?.userData;
                const { value, error } = reportValidation.sendreport(data);
                if (error) res.send(Response.projectSuccessResp("Validation Failed", error.message));
                data.orgId = orgId
                const findReport = await autoReportModule.find({ reportsTitle: data.reportsTitle, orgId: data.orgId })
                if (findReport.length > 0) { res.send(Response.projectFailResp("This title with report already present.")); }
                if (data.Recipients.length <= 0) {
                    res.send(Response.projectFailResp("Minimum one user required."));
                }
                if (data.Content.length <= 0) {
                    res.send(Response.projectFailResp("Minimum one Content required."));
                }
                if (data.filter.length <= 0) {
                    res.send(Response.projectFailResp("Minimum one send to filter option required."));
                }
                const createData = await autoReportModule.create(data);
                if (createData) {
                    cronJobActivity.initializeCronJobs();
                    res.send(Response.projectSuccessResp("Information Stored successfully", createData));
                } else {
                    res.send(Response.projectFailResp("Error while creating data"));
                }
            } catch (error) {
                Logger.error(error);
                return res.send(Response.projectFailResp("Failed to stored Data", error.message));
            }
        } else {
            res.send(result);
        }
    }

    async fetchReportDetails(req, res) {
        try {
            const reuse = new Reuse(req);
            const db = await checkCollection(reuse.collectionName.project);
            const result = req.verified;
            const searchQuery = req.query.searchQuery;

            const sortBy = {};
            if (reuse.orderby === 'frequency') {
                sortBy['frequency.Daily'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
                sortBy['frequency.Weekly'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
                sortBy['frequency.Monthly'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
            } else {
                sortBy[reuse.orderby || 'reportsTitle'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
            }
            const { language, email, orgId } = result.userData?.userData;

            const userData = await adminSchema.findOne({ email: email });

            if (!userData) res.send(Response.projectFailResp("Failed to fetch data ", 'Admin not Found!'));
            let query = { orgId: orgId }
            if (searchQuery) {
                query.$or = [
                    { reportsTitle: new RegExp(searchQuery, 'i') },
                    { Recipients: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
                ];
                query.orgId = orgId
            }
            console.log(query);
            let autoReportFetch = await autoReportModule.find(query).select('reportsTitle frequency Recipients Content').sort(sortBy).skip(reuse?.skip).limit(reuse?.limit);
            let totalCount = await autoReportModule.countDocuments(query)

            if (autoReportFetch) {
                let data = {
                    totalCount,
                    autoReportFetch
                }
                res.send(Response.projectSuccessResp("Information Fetched successfully", data))
            } else {
                res.send(Response.projectFailResp("Error while fetching data"));
            }
        } catch (error) {
            Logger.error(error)
            return res.send(Response.projectFailResp("Failed to stored Data", error.message));
        }
    }
    async updateReport(req, res) {
        const result = req?.verified;
        let { orgId } = result.userData.userData;
        if (result.state === true) {
            try {
                const reportId = req.query.Id;
                const data = req.body;
                const { language, orgId } = result.userData?.userData;
                const { value, error } = reportValidation.updateReport(data);
                if (error) res.send(Response.projectSuccessResp("Validation Failed", error.message));
                data.orgId = orgId
                const findReport = await autoReportModule.find({ _id: reportId, orgId: data.orgId });
                if (findReport.length > 0) { res.send(Response.projectFailResp("Report not found.")); }
                const reportName = await autoReportModule.find({ reportsTitle: data.reportsTitle, orgId: data.orgId })
                if (reportName.length > 0) { res.send(Response.projectFailResp("This title with report already present.")); }
                const updateData = await autoReportModule.updateOne({ _id: reportId }, { $set: data }, { returnDocument: 'after' });
                if (updateData) {
                    cronJobActivity.initializeCronJobs();
                    res.send(Response.projectSuccessResp("Report updated successfully", createData));
                } else {
                    res.send(Response.projectFailResp("Error while updating report"));
                }
            } catch (error) {
                Logger.error(error);
                return res.send(Response.projectFailResp("Failed to pdate report", error.message));
            }
        } else {
            res.send(result);
        }
    }
    async deleteReport(req, res) {
        const result = req?.verified;
        if (result.state === true) {
            try {
                const reportId = req?.query?.Id;
                const deletedData = await autoReportModule.findOneAndDelete({ _id: reportId });
                let frequency = null;

                if (deletedData && deletedData.frequency && deletedData.frequency.length > 0) {
                  const freq = deletedData.frequency[0];
                  if (freq.Daily === 1 ){
                    frequency = "Daily";
                  }else if(freq.Weekly===1){
                    frequency="Weekly";
                  }else if(freq.Monthly===1){
                    frequency="Monthly";
                  }
                }
                if (deletedData) {
                  cronJobActivity.deleteCronJob(reportId,frequency)
                    res.send(Response.projectSuccessResp("Data deleted successfully", deletedData))
                } else {
                    res.send(Response.projectFailResp("Error while deleting data"));
                }
            } catch (err) {
                Logger.error(err)
                return res.send(Response.projectFailResp("Failed to delete Data", err.message));
            }
        } else {
            res.send(result)
        }
    }
    async sendTestMailReport(req, res) {
        const result = req?.verified;
        if (result.state === true) {
            try {
                const data = req.body;
                const { language, orgId } = result.userData?.userData;
                const { value, error } = reportValidation.sendreport(data);
                if (error) res.send(Response.projectSuccessResp("Validation Failed", error.message));
                data.orgId = orgId
                const findReport = await autoReportModule.find({ reportsTitle: data.reportsTitle, orgId: data.orgId })
                if (findReport.length > 0) { res.send(Response.projectFailResp("This title with report already present.")); }
                if (data.Recipients.length <= 0) {
                    res.send(Response.projectFailResp("Minimum one user required."));
                }
                if (data.Content.length <= 0) {
                    res.send(Response.projectFailResp("Minimum one Content required."));
                }
                if (data.ReportsType.pdf == 0 && data.ReportsType.csv == 0) {
                    res.send(Response.projectFailResp("Minimum one report type is required."));
                }
                if (data.filter.specificEmployees.length == 0) {
                    res.send(Response.projectFailResp("Minimum one user is required."));
                }
                
                    const reuse = collections(data.orgId);
                    const db = await checkCollection(reuse.project);

                    if (data.filter.wholeOrganization === 1) {
                        for (const content of data.Content) {
                            let sentMail = await callSchemaBasedOnContent(content, 'all', data, db, reuse);
                            if (sentMail) {
                                return res.send(Response.projectSuccessResp("Test mail sent successfully"))
                            }
                        }
                    } else {
                        for (const content of data.Content) {
                            let sentMail = await callSchemaBasedOnContent(content, 'specific', data, db, reuse);
                            if (sentMail) {
                                return res.send(Response.projectSuccessResp("Test mail sent successfully"))
                            }
                        }
                    }

            } catch (error) {
                Logger.error(error);
                return res.send(Response.projectFailResp("Failed to send test mail.", error.message));
            }

        } else {
            res.send(result);
        }
    }
}

export default new autoReportService();