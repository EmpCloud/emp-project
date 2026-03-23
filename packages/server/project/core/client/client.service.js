import Response from "../../response/response.js";
import Reuse from "../../utils/reuse.js";
import clientModel from "./client.model.js";
import companyModel from "./company.module.js"
import clientValidation from './client.validation.js';
import logger from "../../resources/logs/logger.log.js";
import { projectMessageNew } from "../language/language.translator.js";
import { checkCollection } from "../../utils/project.utils.js";
import { ObjectId } from "mongodb";
import config from 'config';
import NotificationService from '../notifications/notifications.service.js';
import permissionModel from "../permissions/permission.model.js";
class clientService {
    async clientCreate(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, language, firstName, lastName, adminId, _id: Id, permission } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const clientDetails = req.body;
                const { value, error } = clientValidation.createClient(req.body);
                if (error) {
                    return res.send(Response.projectFailResp("Validation Error", error.message));
                }
                const findClient = await clientModel.find({ clientName: clientDetails.clientName, orgId: orgId });
                if (findClient.length > 0) { return res.send(Response.projectFailResp("Client already present.")) }
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                //     let InvalidProject = {};
                //     let InvalidProjects = [];
                //     let clientPromise;
                //     if(clientDetails.projectIds){
                //         clientPromise=clientDetails.projectIds.map(async (ele) => {
                //         const projectFound = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(ele.id) })
                //         if (!projectFound) {
                //             InvalidProject.invalidId = ele.id;
                //         }
                //         InvalidProjects.push(InvalidProject);
                //     })
                //   }
                //     await Promise.all(clientPromise)
                //     if (InvalidProjects.length >0) {
                //         return res.send(Response.projectFailResp("Please Add valid ProjectId", { InvalidProjectIds: InvalidProjects }));
                //     }
                clientDetails.orgId = orgId;
                const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.create == false) {
                    return res.send(Response.projectFailResp(`You don't have permission to add client`));
                }
                const createdClient = await clientModel.create(clientDetails);

                if (createdClient) {
                    if (reuse.result.type === 'user') {
                        // To Admin
                        const message = `${firstName + ' ' + lastName} created ${createdClient.clientName} and ${createdClient.clientCompany} client info`;
                        await NotificationService.adminNotification(message, Id, adminId, { collection: 'ProjectComment', id: createdClient._id });
                    }
                    return res.send(Response.projectSuccessResp("Client Info Added successfully", createdClient))
                }
            } catch (err) {
                logger.error(`err ${err}`)
                return res.send(Response.projectFailResp("Error while adding client data", err.message));
            }

        } else {
            return res.send(result)
        }

    }

    async createCompany(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, language, firstName, lastName, adminId, _id: Id, permission } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const companyDetails = req.body;
                const { value, error } = clientValidation.createCompany(req.body);
                if (error) {
                    return res.send(Response.projectFailResp("Validation Error", error.message));
                }
                const findClient = await companyModel.find({ clientCompany: companyDetails.clientCompany, orgId: orgId });
                if (findClient.length > 0) { return res.send(Response.projectFailResp("company already present.")) }
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                companyDetails.orgId = orgId;
                let notExist = [];
                let exist = [];

                if (companyDetails.clientName) {
                    for (const ele of companyDetails.clientName) {
                        const projectFound = await clientModel.findOne({ _id: ObjectId(ele.id) })
                        projectFound == null ? notExist.push({ id: ele.id }) : exist.push({ id: ele.id });
                    }
                }
                if (notExist.length > 0 && exist.length == 0) {
                    return res.status(400).send(Response.projectFailResp("Please Add valid client Ids", notExist));
                }
                const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.create == false) {
                    return res.send(Response.projectFailResp(`You don't have permission to add company`));
                }
                const createdCompany = await companyModel.create(companyDetails);

                if (createdCompany) {
                    if (reuse.result.type === 'user') {
                        const message = `${firstName + ' ' + lastName} created ${createdCompany.clientCompany} company info`;
                        await NotificationService.adminNotification(message, Id, adminId, { collection: 'ProjectComment', id: createdCompany._id });
                    }
                    return res.send(Response.projectSuccessResp("company Info Added successfully", createdCompany))
                }
            } catch (err) {
                logger.error(`err ${err}`)
                return res.send(Response.projectFailResp("Error while adding company data", err.message));
            }

        } else {
            return res.send(result)
        }

    }
    async fetchClient(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, language } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const clientId = req?.query?.clientId;
                let skipValue = +req?.query?.skip || config.get('skip')
                let limitValue = +req?.query?.limit || config.get('limit')
                let clientDetail;
                const totalCount = await clientModel.countDocuments({ orgId: orgId });
                if (clientId) {
                    const findClient = await clientModel.findOne({ _id: ObjectId(clientId) });
                    if (!findClient) { return res.send(Response.projectFailResp("Invalid ClientId,please check.")) }
                    clientDetail = await clientModel.find({ _id: ObjectId(clientId) });
                } else {
                    clientDetail = await clientModel.find({ orgId: orgId }).skip(skipValue).limit(limitValue);
                }
                let data = {
                    totalClientCount: totalCount,
                    clientDetail: clientDetail,
                }
                return res.send(Response.projectSuccessResp("Client Info Fetched successfully", data))
            } catch (err) {
                logger.error(`err ${err}`)
                return res.send(Response.projectFailResp("Error while fetching client data", err.message));
            }
        } else {
            return res.send(result)
        }
    }

    async fetchCompany(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, language } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const companyId = req?.query?.companyId;
                let skipValue = +req?.query?.skip || config.get('skip')
                let limitValue = +req?.query?.limit || config.get('limit')
                let companyDetail;
                const totalCount = await companyModel.countDocuments({ orgId: orgId });
                let updatedDetail;
                if (companyId) {
                    const findClient = await companyModel.findOne({ _id: ObjectId(companyId) });
                    if (!findClient) { return res.send(Response.projectFailResp("Invalid companyId,please check.")) }
                    companyDetail = await companyModel.find({ _id: ObjectId(companyId) });
                } else {
                    companyDetail = await companyModel.find({ orgId: orgId }).skip(skipValue).limit(limitValue);
                    updatedDetail = await Promise.all(companyDetail.map(async (client) => {

                        const updatedClientName = await Promise.all(client.clientName.map(async (ele) => {
                            const findData = await clientModel.findOne({ _id: ele.id })
                            return { ...ele.toObject(), clientName: findData.clientName };

                        }))
                        return { ...client.toObject(), clientName: updatedClientName };
                    }))
                }

                let data = {
                    totalClientCount: totalCount,
                    companyDetail: updatedDetail,
                }
                return res.send(Response.projectSuccessResp("company Info Fetched successfully", data))

            } catch (err) {
                logger.error(`err ${err}`)
                return res.send(Response.projectFailResp("Error while fetching company data", err.message));
            }
        } else {
            return res.send(result)
        }
    }
    async updateClient(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, firstName, lastName, _id: Id, adminId, language, permission } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const clientDetails = req.body;
                const clientId = req.query.clientId;
                const { value, error } = clientValidation.updateClient(req.body);
                if (error) {
                    return res.send(Response.projectFailResp("Validation Error", error.message));
                }
                const findClient = await clientModel.findOne({ _id: ObjectId(clientId) });
                if (!findClient) { return res.send(Response.projectFailResp("Invalid ClientId,please check.")) }
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                const clientNameExist = await clientModel.find({ _id: { $ne: clientId }, orgId:orgId, clientName: new RegExp(`^${clientDetails.clientName}$`, 'i') });
                if (clientNameExist.length > 0) {
                    return res.send(Response.projectFailResp("ClientName already exist."))
                }
                clientDetails.orgId = orgId;
                const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.edit == false) {
                    return res.send(Response.projectFailResp(`You don't have permission to update client details`));
                }
                const createdClient = await clientModel.findByIdAndUpdate({ _id: ObjectId(clientId) }, { $set: clientDetails }, { returnDocument: 'after' });
                if (createdClient) {
                    if (reuse.result.type === 'user') {
                        // To Admin
                        const message = `${firstName + ' ' + lastName} updated client detailes`;
                        await NotificationService.adminNotification(message, Id, adminId, { collection: 'client', id: createdClient._id });
                    }
                    return res.send(Response.projectSuccessResp("Client Info Updated successfully", createdClient))
                }
            } catch (err) {
                return res.send(Response.projectFailResp("Error while updating client data", err.message));
            }

        } else {
            logger.error(`err ${err}`)
            return res.send(result)
        }
    }
    async updateCompany(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, firstName, lastName, _id: Id, adminId, language, permission } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const companyDetails = req.body;
                const companyId = req.query.companyId;
                const { value, error } = clientValidation.updateCompany(req.body);
                if (error) {
                    return res.send(Response.projectFailResp("Validation Error", error.message));
                }
                const findClient = await companyModel.findOne({ _id: ObjectId(companyId) });
                if (!findClient) { return res.send(Response.projectFailResp("Invalid ClientId,please check.")) }
                const findCompany = await companyModel.find({ _id: { $ne: companyId }, orgId:orgId, clientCompany: new RegExp(`^${companyDetails?.clientCompany}$`, 'i') });
                const db = await checkCollection(reuse.collectionName.project);
                if (findCompany.length > 0) { return res.send(Response.projectFailResp("Company name already present.")) }
                let isClientExist = await db.collection(reuse.collectionName.project).find({ clientCompany: companyDetails?.clientCompany }).toArray()
                if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                companyDetails.orgId = orgId;

                if (companyDetails.clientName) {
                    for (const ele of companyDetails.clientName) {
                        const projectFound = await clientModel.findOne({ _id: ObjectId(ele.id) })
                        if (!projectFound) {
                            return res.status(400).send(Response.projectFailResp("Please Add valid client Ids"));
                        }
                    }
                }
                const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.edit == false) {
                    return res.send(Response.projectFailResp(`You don't have permission to update company details`));
                }
                const createdClient = await companyModel.findByIdAndUpdate({ _id: ObjectId(companyId) }, { $set: companyDetails }, { returnDocument: 'after' });
                if (createdClient) {

                    if (isClientExist.length) {
                        isClientExist.map(async (ele) => {
                            await db.collection(reuse.collectionName.project).findOneAndUpdate({ _id: ObjectId(ele._id) }, { $set: { clientCompany: companyDetails?.clientCompany } }, { returnDocument: 'after' });
                        })
                    }
                    if (reuse.result.type === 'user') {
                        // To Admin
                        const message = `${firstName + ' ' + lastName} updated client detailes`;
                        await NotificationService.adminNotification(message, Id, adminId, { collection: 'client', id: createdClient._id });
                    }
                    return res.send(Response.projectSuccessResp("Client Info Updated successfully", createdClient))
                }
            } catch (err) {
                return res.send(Response.projectFailResp("Error while updating client data", err.message));
            }

        } else {
            logger.error(`err ${err}`)
            return res.send(result)
        }
    }
    async deleteClient(req, res) {
        const reuse = new Reuse(req)
        const result = req.verified;
        let { orgId, language, permission } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const clientId = req.query.clientId;
                const companyId = req.query.companyId;
                let deletedData;
                if (clientId) {
                    const findClient = await clientModel.findOne({ _id: ObjectId(clientId) });
                    if (!findClient) { return res.send(Response.projectFailResp("Invalid ClientId,please check.")) }
                    const db = await checkCollection(reuse.collectionName.project);
                    if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                    const isClientExist = await db.collection(reuse.collectionName.project).find({ clientName: findClient.clientName }).toArray();
                    if (isClientExist.length > 0) { return res.send(Response.projectFailResp("You can't delete client assingend with project.")) };
                    const isClientAssign = await companyModel.find({ "clientName.id": clientId })
                    if (isClientAssign.length > 0) { return res.send(Response.projectFailResp("You can't delete client assingend to company.")) }
                    const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                    if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.delete == false) {
                        return res.send(Response.projectFailResp(`You don't have permission to delete client details`));
                    }
                    deletedData = await clientModel.deleteOne({ _id: ObjectId(clientId) });
                    if (deletedData.deletedCount > 0) {
                        return res.send(Response.projectSuccessResp("Deleted successfully", deletedData))
                    }
                }
                if (companyId) {
                    const findClient = await companyModel.findOne({ _id: ObjectId(companyId) });
                    if (!findClient) { return res.send(Response.projectFailResp("Invalid company Id, please check.")) }
                    const db = await checkCollection(reuse.collectionName.project);
                    if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                    const isClientExist = await db.collection(reuse.collectionName.project).find({'clientCompany.id': findClient.id, }).toArray();
                    if (isClientExist.length > 0) { return res.send(Response.projectFailResp("You can't delete company assingend with project.")) }
                    const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                    if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.delete == false) {
                        return res.send(Response.projectFailResp(`You don't have permission to delete company details`));
                    }
                    deletedData = await companyModel.deleteOne({ _id: ObjectId(companyId) });
                    if (deletedData.deletedCount > 0) {
                        return res.send(Response.projectSuccessResp("Deleted successfully", deletedData))
                    }
                    else return res.send(Response.projectFailResp("Error while deleting company data"))
                }
            } catch (err) {
                return res.send(Response.projectFailResp("Error while deleting client data", err.message));
            }
        } else {
            return res.send(result)
        }
    }
    async clientDetails(req, res) {
        const reuse = new Reuse(req);
        const result = req.verified;
        let { orgId } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const clientId = req?.query?.clientId;
                const companyId = req?.query?.companyId;
                let clientDetails;
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                let completedTasks, inprogressTask, pendingTask, onHoldingTasks, toatalOverDueTasks, totalCount, tasks, isExist, allsubtask, allClientDetails = [];

                if (!companyId && !clientId) {
                    let findClient = await companyModel.find({ orgId: orgId })
                    let clients = await Promise.all(findClient.map(async (client) => {
                        let clientIds=[]
                        client?.clientName.map(clientId=>{
                        clientIds.push(clientId.id)
                        })
                          const Data= await clientModel.find({ 
                            _id: { $in: clientIds},
                          },
                          { 
                            clientName: 1 
                          });
                        let query;
                        if (req?.query.startDate && req?.query.endDate) {
                            query = {
                                $and: [
                                    {'clientCompany.id': client._id.toString() },
                                    {
                                        createdAt: {
                                            $gte: new Date(req?.query.startDate),
                                            $lt: new Date(new Date(req?.query.endDate).setHours(23, 59, 59, 999))
                                        }
                                    }
                                ]
                            }
                        }else{
                            query ={'clientCompany.id': client._id.toString() }
                        }
                        let totalCount = await db.collection(reuse.collectionName.project).countDocuments({ _id: ObjectId(client._id) })
                        let isExist = await db.collection(reuse.collectionName.project).aggregate([
                            {
                                $match: query
                            }
                        ]).toArray();
                        let userAssignedCorrect = [];
                        isExist.map(async (user)=>{
                        if (user?.userAssigned) {
                            for (const [index, value] of user.userAssigned.entries()) {
                                const userDetails = await db
                                    .collection(reuse.collectionName.user)
                                    .aggregate([
                                        { $match: { _id: ObjectId(value.id), softDeleted: false } },
                                        {
                                            $project: reuse.userObj,
                                        },
                                    ])
                                    .toArray();
                                if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                            }
                        }
                        user.userAssigned = userAssignedCorrect ?? [];
                        })
                        let allTask = await Promise.all(isExist.map(async (project) => {
                            let userAssignedCorrect = [];
                            if (project?.userAssigned) {
                                for (const value of project?.userAssigned) {
                                    const userDetails = await db
                                        .collection(reuse.collectionName.user)
                                        .aggregate([
                                            { $match: { _id: ObjectId(value.id), softDeleted: false } },
                                            {
                                                $project: reuse.userObj,
                                            },
                                        ])
                                        .toArray();
                                    if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                                }
                            }
                            project.userAssigned = userAssignedCorrect ?? [];
                            let query;
                            if (req?.query.startDate && req?.query.endDate) {
                                query =
                                    { $and: [{ projectId: project._id.toString() }, { createdAt: { $gte: new Date(req?.query.startDate), $lt: new Date(new Date(req?.query.endDate).setHours(23, 59, 59, 999)) } }] }

                            }
                            else {
                                query = { projectId: project._id.toString() };
                            }
                            tasks = await db.collection(reuse.collectionName.task).aggregate([{ $match: query }]).toArray();
                            completedTasks = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'Done' }] } }]).toArray();
                            inprogressTask = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'inprogress' }] } }]).toArray();
                            pendingTask = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'Todo' }] } }]).toArray();
                            onHoldingTasks = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'onhold' }] } }])
                            let count = 0;
                            tasks.map(over => {
                                if (over.taskStatus != "done" && over.dueDate < new Date()) {
                                    count++;
                                }
                            })
                            toatalOverDueTasks = count;
                            project.tasks = tasks;

                            return { project };
                        })
                        )
                        let info = {
                            clientCompany: client.clientCompany,
                            clients:Data,
                            project: allTask
                        }
                        return info;
                    })
                    )
                    return res.send(Response.projectSuccessResp("Client details fetched successfully", clients))
                }

                if (companyId) {
                    const findClient = await companyModel.findOne({ _id: ObjectId(companyId) });
                    if (!findClient) { return res.send(Response.projectFailResp("Invalid ClientId,please check.")) }
                    totalCount = await db.collection(reuse.collectionName.project).countDocuments({ 'clientCompany.id': findClient._id.toString() })
                    isExist = await db.collection(reuse.collectionName.project).find({'clientCompany.id': findClient._id.toString()}).toArray()

                    isExist.map(async (user)=>{
                        let updateProject=await Promise.all(user.clientCompany.map(async (ele) => {
                            const findData = await companyModel.findOne({ _id: ele.id })
                            let updatedClientName=await Promise.all(findData.clientName.map(async (ele2)=>{
                                const FindClient=await clientModel.findOne({_id:ele2.id})
                                return { ...ele2.toObject(), clientName: FindClient.clientName };
                            }))
                            user.clientCompany.push(updatedClientName)
                        }))
                        let userAssignedCorrect = [];
                        if (user?.userAssigned) {
                            for (const [index, value] of user.userAssigned.entries()) {
                                const userDetails = await db
                                    .collection(reuse.collectionName.user)
                                    .aggregate([
                                        { $match: { _id: ObjectId(value.id), softDeleted: false } },
                                        {
                                            $project: reuse.userObj,
                                        },
                                    ])
                                    .toArray();
                                if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                            }
                        }
                        user.userAssigned = userAssignedCorrect ?? [];
                    })
                }
                if (clientId) {
                    const findClient = await clientModel.findOne({ _id: ObjectId(clientId) });
                    if (!findClient) { return res.send(Response.projectFailResp("Invalid ClientId,please check.")) }
                    totalCount = await db.collection(reuse.collectionName.project).countDocuments({ clientName: clientId })
                    isExist = await db.collection(reuse.collectionName.project).find({ clientName: clientId }).toArray();
                    
                }
                if (isExist.length > 0) {
                    let allTask = isExist.map(async (project) => {
                        tasks = await db.collection(reuse.collectionName.task).aggregate([{ $match: { projectId: project._id.toString() } }]).toArray();
                        completedTasks = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'Done' }] } }]).toArray();
                        inprogressTask = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'inprogress' }] } }]).toArray();
                        pendingTask = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'Todo' }] } }]).toArray();
                        onHoldingTasks = await db.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: project._id.toString() }, { taskStatus: 'onhold' }] } }])
                        let count = 0;
                        tasks.map(over => {
                            if (over.taskStatus != "done" && over.dueDate < new Date()) {
                                count++;
                            }
                        })
                        toatalOverDueTasks = count;
                        project.tasks = tasks;
                        return project;
                    })
                    allsubtask = await Promise.all(allTask.map(async (ele) => {
                        const allSubtask = await db.collection(reuse.collectionName.subTask)
                            .aggregate([
                                { $match: { taskId: ele._id } },
                            ])
                            .toArray();
                        ele.subTasks = allSubtask;
                        return ele;
                    }));
                }
                let totalTasks = tasks ? tasks.length : 0;
                let completedTask = completedTasks ? completedTasks.length : 0;
                let inProgressTask = inprogressTask ? inprogressTask.length : 0;
                let pendingTasks = pendingTask ? pendingTask.length : 0;
                let onHold = onHoldingTasks ? onHoldingTasks.length : 0;

                clientDetails = {
                    totalProjects: totalCount,
                    totalTasks: totalTasks,
                    completedTask: completedTask,
                    inProgressTask: inProgressTask,
                    pendingTask: pendingTasks,
                    onHoldingTasks: onHold,
                    overDueTasks: toatalOverDueTasks,
                    clientProjectandTaskDetails: allsubtask
                }
                return res.send(Response.projectSuccessResp("Client details fetched successfully", clientDetails))

            } catch (err) {
                logger.error(`err ${err}`);
                return res.send(Response.projectFailResp("Error while fetching client details", err.message));
            }
        } else {
            return res.send(result)
        }
    }
}
export default new clientService();