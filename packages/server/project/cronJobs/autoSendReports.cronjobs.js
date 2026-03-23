import autoReportModel from '../core/autoReport/autoReport.model.js';
import Logger from '../resources/logs/logger.log.js';
import groupSchema from '../core/groups/group.schema.js';
import GenerateReport from '../core/pdf-maker/pdf-csv-generate.js'
import moment from 'moment';
import mailTemplate from '../mailService/mailTemplate.js';
import fs from 'fs/promises';
import path from 'path';
import {
  checkCollection
} from './../utils/project.utils.js';
import { ObjectId } from 'mongodb';
import adminModel from '../core/admin/admin.model.js'
import { cronJobActivity } from './cronSchedule.js';

class AutoSendReport {
  async sendDailyReport(frequencys, time) {
    const frequencyField = `${frequencys}`;
    try {
      const isExistAutoSendData = await autoReportModel.find({
        frequency: { $elemMatch: { [frequencyField]: 1, Time: time } }
      });
      for (const doc of isExistAutoSendData) {
        const reuse = collections(doc.orgId);
        const db = await checkCollection(reuse.project);

        if (doc.filter.wholeOrganization === 1) {
          for (const content of doc.Content) {
            await callSchemaBasedOnContent(content, 'all', doc, db, reuse);
          }
        } else {
          for (const content of doc.Content) {
            await callSchemaBasedOnContent(content, 'specific', doc, db, reuse);
          }
        }

      }
      // cronJobActivity.Daily.stop();
    } catch (error) {
      Logger.error(error.message);
    }
  }
}
export function collections(orgName) {
  let orgNamewithoutLowerCase = orgName
  const organization = orgName.toLowerCase();

  let collectionName = {
    project: `org_${organization}_projectfeatures`,
    action: `org_${organization}_projectactivityfeatures`,
    user: `org_${organization}_users`,
    group: `org_${organization}_groups`,
    task: `org_${organization}_taskfeatures`,
    subTask: `org_${organization}_subtaskfeatures`,

    taskActivity: `org_${organization}_taskactivityfeatures`,
    taskComment: `org_${organization}_taskcommentfeatures`,
    subTaskActivity: `org_${organization}_subtaskactivityfeatures`,
    subTaskComment: `org_${organization}_subtaskcommentfeatures`,
    projectComment: `org_${organization}_projectcomments`,
    planActivity: `org_${organization}_plan_histories`,
    permissionActivity: `org_${organization}_permissionactivities`,
    userActivity: `org_${organization}_useractivities`,
    configActivity: `org_${organization}_configactivitylogs`,
    chat: `org_${organization}_chats`,
    message: `org_${organization}_messages`,
    notification: `org_${organization}_notifications`,
    chatChannel: `org_${organization}_chatchannels`,
    orgNamewithoutLowerCase: orgNamewithoutLowerCase
  }
  return collectionName;
}

export async function callSchemaBasedOnContent(content, allOrSpecific, doc, db, reuse) {
  //For Specific Users Report
  if (allOrSpecific !== 'all') {

    let specificAttachments = []
    for (const employee of doc.filter.specificEmployees) {
      let emp = await db.collection(reuse.user).findOne({ _id: ObjectId(employee.id) })
      let fileName
      if (content.task === 1 && content.project === 1) {
        projects = await db
          .collection(reuse.project)
          .find({ 'userAssigned.id': employee.id }).toArray();
          Tasks = await db
          .collection(reuse.task)
          .find({ 'assignedTo.id': employee.id }).toArray();
        const pdfData = await tableContent(content, projects, Tasks, subTasks,groups, reuse, db)
        if (doc.ReportsType[0].pdf === 1) {
          try {
            fileName = `${emp.firstName}_${emp.lastName}_ProjectAndTaskReport_${moment().format("YYYY-MM-DD")}`;
            let pdf = await GenerateReport.LogsPDFTaskandProject('en', fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData)
            allAttachments.push(pdf)
          } catch (err) {
            console.log(err)
          }
        }
      } else if (content.task === 1) {
        // Call Task Schema
        Tasks = await db
          .collection(reuse.task)
          .find({ 'assignedTo.id': employee.id }).toArray();
        const pdfData = await tableContent(content, projects, Tasks, subTasks,groups, reuse, db)
        try {
          if (doc.ReportsType[0].pdf === 1) {
            fileName = `${emp.firstName}_${emp.lastName}_TaskReport_${moment().format("YYYY-MM-DD")}`
            let pdf = await GenerateReport.LogsPDF('en', Tasks, fileName, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData)
            allAttachments.push(pdf)
          }
          if (doc.ReportsType[0].csv === 1) {
            let excl = await GenerateReport.LogsCSV('en', Tasks, fileName, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData);
            allAttachments.push(excl)
          }
        } catch (err) {
          console.log(err)
        }
      } else if (content.project === 1) {
        projects = await db
          .collection(reuse.project)
          .find({ 'userAssigned.id': employee.id }).toArray();
        const pdfData = await tableContent(content, projects, Tasks, subTasks,groups, reuse, db)
        try {
          if (doc.ReportsType[0].pdf === 1) {
            fileName = `${emp.firstName}_${emp.lastName}_ProjectReport_${moment().format("YYYY-MM-DD")}`
            let pdf = await GenerateReport.LogsPDF('en', projects, fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, isExistAutoSendData)
            allAttachments.push(pdf)
          }
          if (doc.ReportsType[0].csv === 1) {
            let excl = await GenerateReport.LogsCSV('en', projects, fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, isExistAutoSendData);
            allAttachments.push(excl)
          }
        } catch (err) {
          console.log(err);
        }
      } else if (content.subTask === 1) {
        // Call SubTask Schema
        subTasks = await db
          .collection(reuse.subTask)
          .find({ 'subTaskAssignedTo.id': employee.id }).toArray()
      } else if (content.progress === 1) {
        // Call Progress Schema
      } else if (content.group === 1) {
        groups = await groupSchema.find({ 'assignedMembers.userId': employee.id })
        const pdfData = await tableContent(content, projects, Tasks, subTasks, groups, reuse, db)
        if (doc.ReportsType[0].pdf === 1) {
          fileName = `${emp.firstName}_${emp.lastName}_SubTaskReport_${moment().format("YYYY-MM-DD")}`
          let pdf = await GenerateReport.LogsPDF('en', projects, fileName, pdfData.pdfFileTableHeader, pdfData.pdfTableRowData, isExistAutoSendData)
          allAttachments.push(pdf)
        }
        if (doc.ReportsType[0].csv === 1) {
          let excl = await GenerateReport.LogsCSV('en', projects, fileName, pdfData.pdfFileTableHeader, pdfData.pdfTableRowData, isExistAutoSendData);
          allAttachments.push(excl)
        }
      }if (content.task === 1 && content.project === 1 && content.group === 1) {
        projects = await db
        .collection(reuse.project)
        .find({ 'userAssigned.id': employee.id }).toArray();
        Tasks = await db
        .collection(reuse.task)
        .find({ 'assignedTo.id': employee.id }).toArray();
        groups = await groupSchema.find({ 'assignedMembers.userId': employee.id })
      const pdfData = await tableContent(content, projects, Tasks, subTasks,groups, reuse, db)
      if (doc.ReportsType[0].pdf === 1) {
        try {
          fileName = `${emp.firstName}_${emp.lastName}_ProjectAndTaskReport_${moment().format("YYYY-MM-DD")}`;
          let pdf = await GenerateReport.LogsPDFTaskandProject('en', fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData)
          allAttachments.push(pdf)
        } catch (err) {
          console.log(err)
        }
      }
      } if (content.task === 1 && content.project === 1 && content.group === 1 && content.subTask==1) {
        projects = await db
        .collection(reuse.project)
        .find({ 'userAssigned.id': employee.id }).toArray();
        Tasks = await db
        .collection(reuse.task)
        .find({ 'assignedTo.id': employee.id }).toArray();
        groups = await groupSchema.find({ 'assignedMembers.userId': employee.id })
      const pdfData = await tableContent(content, projects, Tasks, subTasks,groups, reuse, db)
      if (doc.ReportsType[0].pdf === 1) {
        try {
          fileName = `${emp.firstName}_${emp.lastName}_ProjectAndTaskReport_${moment().format("YYYY-MM-DD")}`;
          let pdf = await GenerateReport.LogsPDFTaskandProject('en', fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData)
          allAttachments.push(pdf)
        } catch (err) {
          console.log(err)
        }
      }
      }
      for (const email of doc.Recipients) {
        let mail = await mailTemplate.sendAutoGenerateReportMail(specificAttachments, email)
      }
      // Code to delete files from local dir
      specificAttachments.forEach((filePath) => {
        const absolutePath = path.resolve(filePath);

        fs.unlink(absolutePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${absolutePath}: ${err}`);
          } else {
            console.log(`File ${absolutePath} deleted successfully`);
          }
        });
      });
    }
  } else {
    //Whole Organization Report
    let allAttachments = []
    let emp = await adminModel.findOne({ orgId: reuse.orgNamewithoutLowerCase })
    let Tasks = [], projects = [], subTasks = [], groups = [], fileName;
    const isExistAutoSendData = await autoReportModel.find({
      frequency: { $elemMatch: { ["Daily"]: 1 } }
    });
    if (content.task === 1 && content.project === 1) {
      Tasks = await db.collection(reuse.task).find({}).toArray()
      projects = await db.collection(reuse.project).find({}).toArray();
      console.log("reuse",reuse)
      const pdfData = await tableContent(content, projects, Tasks, subTasks, groups, reuse, db)
      if (doc.ReportsType[0].pdf === 1) {
        try {
          fileName = `${emp.firstName}_${emp.lastName}_ProjectAndTaskReport_${moment().format("YYYY-MM-DD")}`;
          let pdf = await GenerateReport.LogsPDFTaskandProject('en', fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData)
          allAttachments.push(pdf)
        } catch (err) {
          console.log(err)
        }
      }
    } else if (content.task === 1) {
      Tasks = await db.collection(reuse.task).find({}).toArray();
      try {
        const pdfData = await tableContent(content, projects, Tasks, subTasks, groups, reuse, db)
        if (doc.ReportsType[0].pdf === 1) {
          fileName = `${emp.firstName}_${emp.lastName}_TaskReport_${moment().format("YYYY-MM-DD")}`
          let pdf = await GenerateReport.LogsPDF('en', Tasks, fileName, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData)
          allAttachments.push(pdf)
        }
        if (doc.ReportsType[0].csv === 1) {
          let excl = await GenerateReport.LogsCSV('en', Tasks, fileName, pdfData.taskFileTableHeader, pdfData.taskTableRowData, isExistAutoSendData);
          allAttachments.push(excl)
        }
      } catch (err) {
        console.log(err)
      }
    } else if (content.project === 1) {
      projects = await db.collection(reuse.project).find({}).toArray();
      try {
        const pdfData = await tableContent(content, projects, Tasks,subTasks, groups, reuse, db)
        if (doc.ReportsType[0].pdf === 1) {
          fileName = `${emp.firstName}_${emp.lastName}_ProjectReport_${moment().format("YYYY-MM-DD")}`
          let pdf = await GenerateReport.LogsPDF('en', projects, fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, isExistAutoSendData)
          allAttachments.push(pdf)
        }
        if (doc.ReportsType[0].csv === 1) {
          let excl = await GenerateReport.LogsCSV('en', projects, fileName, pdfData.projectFileTableHeader, pdfData.projectTableRowData, isExistAutoSendData);
          allAttachments.push(excl)
        }
      } catch (err) {
        console.log(err);
      }
    } else if (content.subTask === 1) {
      subTasks = await db.collection(reuse.subTask).find({}).toArray()
      const pdfData = await tableContent(content, projects, Tasks, subTasks, groups, reuse, db)
      if (doc.ReportsType[0].pdf === 1) {
        fileName = `${emp.firstName}_${emp.lastName}_SubTaskReport_${moment().format("YYYY-MM-DD")}`
        let pdf = await GenerateReport.LogsPDF('en', projects, fileName, pdfData.pdfFileTableHeader, pdfData.pdfTableRowData, isExistAutoSendData)
        allAttachments.push(pdf)
      }
      if (doc.ReportsType[0].csv === 1) {
        let excl = await GenerateReport.LogsCSV('en', projects, fileName, pdfData.pdfFileTableHeader, pdfData.pdfTableRowData, isExistAutoSendData);
        allAttachments.push(excl)
      }
    } else if (content.progress === 1) {
      // Call Progress Schema
    } else if (content.group === 1) {
      groups = await groupSchema.find({ orgId: allOrSpecific })
      const pdfData = await tableContent(content, projects, Tasks, subTasks, groups, reuse, db)
      if (doc.ReportsType[0].pdf === 1) {
        fileName = `${emp.firstName}_${emp.lastName}_GroupsReport_${moment().format("YYYY-MM-DD")}`
        let pdf = await GenerateReport.LogsPDF('en', projects, groups, pdfData.FileTableHeader, pdfData.pdfTableRowData, isExistAutoSendData)
        allAttachments.push(pdf)
      }
      if (doc.ReportsType[0].csv === 1) {
        let excl = await GenerateReport.LogsCSV('en', projects, groups, pdfData.pdfFileTableHeader, pdfData.pdfTableRowData, isExistAutoSendData);
        allAttachments.push(excl)
      }
    }

    for (const email of doc.Recipients) {
      let mail = await mailTemplate.sendAutoGenerateReportMail(allAttachments, email)
    }
    allAttachments.forEach((filePath) => {
      const absolutePath = path.resolve(filePath);
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${absolutePath}: ${err}`);
        } else {
          console.log(`File ${absolutePath} deleted successfully`);
        }
      });
    });

  }
}
async function tableContent(content, projects, Tasks, subTasks,groups, reuse, db) {
  const projectFileTableHeader = [], projectTableRowData = [], taskFileTableHeader = [], taskTableRowData = [], pdfFileTableHeader = [], pdfTableRowData = [], groupFileTableHeader = [], groupTableRowData = [];
  let projectUsers = [], taskUsers = [], users = [], groupUsers = [];
  if (projects.length > 0) {
    projectFileTableHeader.push(
      { id: 'ProjectName', title: 'ProjectName' },
      { id: 'ProjectCode', title: 'ProjectCode' },
      { id: 'Description', title: 'Description' },
      { id: 'Reason', title: 'Reason' },
      { id: 'StartDate', title: 'StartDate' },
      { id: 'EndDate', title: 'EndDate' },
      { id: 'EstimationDat', title: 'EstimationDat' },
      { id: 'CompletedDate', title: 'CompletedDate' },
      { id: 'PlannedBudget', title: 'PlannedBudget' },
      { id: 'ActualBudget', title: 'ActualBudget' },
      { id: 'CurrencyType', title: 'CurrencyType' },
      { id: 'UserAssigned', title: 'UserAssigned' },
      { id: 'Status', title: 'Status' },
      { id: 'ProjectLogo', title: 'ProjectLogo' },
      { id: 'AdminName', title: 'AdminName' },
      { id: 'CreatedAt', title: 'CreatedAt' },
      { id: 'Progress', title: 'Progress' },
      { id: 'CompletedDate', title: 'CompletedDate' },
    )
    for (const log of projects) {
      if (!Array.isArray(log.userAssigned) || log.userAssigned.length === 0) {
        console.warn("userAssigned is either not an array or empty:", log.userAssigned);
        continue;
      }
      const ids = log.userAssigned.map(user => user.id).filter(id => id); // Filter out any falsy values
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            let userInfo = await db.collection(reuse.user).findOne({ _id: ObjectId(id) });
            return userInfo;
          })
        );
        projectUsers = results.map(result => `${result?.firstName}_${result?.lastName}`);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      projectTableRowData.push({
        ProjectName: `${log.projectName}`,
        ProjectCode: `${log.projectCode}`,
        Description: `${log.description}`,
        Reason: `${log.reason || null}`,
        StartDate: `${log.startDate}`,
        EndDate: log.endDate ? `${log.endDate.toISOString()}` : null,
        EstimationDat: log.estimationDat ? `${log.estimationDat.toISOString()}` : null,
        CompletedDate: log.completedDate ? `${log.completedDate.toISOString()}` : null,
        PlannedBudget: `${log.plannedBudget}`,
        ActualBudget: `${log.actualBudget}`,
        CurrencyType: `${log.currencyType}`,
        UserAssigned: `${projectUsers}`,
        Status: `${log.status}`,
        ProjectLogo: `${log.projectLogo}`,
        AdminName: `${log.adminName}`,
        CreatedAt: log.createdAt ? `${log.createdAt.toISOString()}` : null,
        Progress: `${log.progress}`,
        CompletedDate: log.completedDate ? `${log.completedDate.toISOString()}` : null
      });
    }
  }
  if (Tasks.length > 0) {
    taskFileTableHeader.push(
      { id: 'Category', title: 'Category' },
      { id: 'EpicLink', title: 'EpicLink' },
      { id: 'DueDate', title: 'DueDate' },
      { id: 'TaskDetails', title: 'TaskDetails' },
      { id: 'Reason', title: 'Reason' },
      { id: 'StageName', title: 'StageName' },
      { id: 'TaskTitle', title: 'TaskTitle' },
      { id: 'TaskType', title: 'TaskType' },
      { id: 'AssignedTo', title: 'AssignedTo' },
      { id: 'EstimationTime', title: 'EstimationTime' },
      { id: 'ActualHours', title: 'ActualHours' },
      { id: 'EstimationDate', title: 'EstimationDate' },
      { id: 'CompletedDate', title: 'CompletedDate' },
      { id: 'Priority', title: 'Priority' },
      { id: 'TaskStatus', title: 'TaskStatus' },
      { id: 'Progress', title: 'Progress' },
      { id: 'CreatedAt', title: 'CreatedAt' },
      { id: 'ProjectName', title: 'ProjectName' },
      { id: 'ProjectCode', title: 'ProjectCode' },
    );
    for (const log of Tasks) {
      const ids = log?.assignedTo.map(user => user.id);
      try {
        const results = await Promise.all(ids.map(async (id) => {
          let userInfo = await db.collection(reuse.user).findOne({ _id: ObjectId(id) });
          return userInfo;
        }
        ));
        taskUsers = results.map(result => `${result?.firstName}_${result?.lastName}`);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      taskTableRowData.push({
        Category: `${log.category}`,
        EpicLink: `${log.epicLink}`,
        DueDate: log.dueDate ? `${log.dueDate.toISOString()}` : null,
        TaskDetails: `${log.taskDetails || null}`,
        Reason: `${log.reason}`,
        StageName: `${log.stageName}`,
        TaskTitle: `${log.taskTitle}`,
        TaskType: `${log.taskType}`,
        AssignedTo: `${taskUsers}`,
        EstimationTime: `${log.estimationTime}`,
        ActualHours: `${log.actualHours}`,
        EstimationDate: log.estimationDate ? `${log.estimationDate.toISOString()}` : null,
        CompletedDate: log.completedDate ? `${log.completedDate.toISOString()}` : null,
        Priority: `${log.priority}`,
        TaskStatus: `${log.taskStatus}`,
        Progress: `${log.progress}`,
        CreatedAt: log.createdAt ? `${log.createdAt.toISOString()}` : null,
        CompletedDate: `${log.projectName}`,
        CompletedDate: `${log.projectCode}`,
      });
    }
  }
  if (subTasks.length > 0) {
    pdfFileTableHeader.push(
      { id: 'SubTaskCategory', title: 'SubTaskCategory' },
      { id: 'SubTaskStageName', title: 'SubTaskStageName' },
      { id: 'SubTaskTitle', title: 'SubTaskTitle' },
      { id: 'SubTaskType', title: 'SubTaskType' },
      { id: 'Reason', title: 'Reason' },
      { id: 'DueDate', title: 'DueDate' },
      { id: 'EstimationDate', title: 'EstimationDate' },
      { id: 'CompletedDate', title: 'CompletedDate' },
      { id: 'EstimationTime', title: 'EstimationTime' },
      { id: 'ActualHours', title: 'ActualHours' },
      { id: 'SubTaskAssignedTo', title: 'SubTaskAssignedTo' },
      { id: 'EpicLink', title: 'EpicLink' },
      { id: 'Priority', title: 'Priority' },
      { id: 'SubTaskStatus', title: 'SubTaskStatus' },
      { id: 'Progress', title: 'Progress' },
      { id: 'CreatedAt', title: 'CreatedAt' },
      { id: 'RemainingHours', title: 'RemainingHours' },
      { id: 'ExceededHours', title: 'ExceededHours' },
    );
    for (const log of subTasks) {
      const ids = log.subTaskAssignedTo.map(user => user.id);
      for (const id of ids) {
        const result = await db.collection(reuse.user).findOne({ _id: ObjectId(id) })
        let concat = `${result.firstName}_${result.lastName}`
        users.push(concat)
      }
      pdfTableRowData.push({
        SubTaskCategory: `${log.subTaskCategory}`,
        SubTaskStageName: `${log.subTaskStageName}`,
        SubTaskTitle: `${log.subTaskTitle}`,
        SubTaskType: `${log.subTaskType}`,
        Reason: `${log.reason}`,
        DueDate: log.dueDate ? `${log.dueDate.toISOString()}` : null,
        EstimationDate: log.estimationDate ? `${log.estimationDate.toISOString()}` : null,
        CompletedDate: log.completedDate ? `${log.completedDate.toISOString()}` : null,
        EstimationTime: `${log.estimationTime}`,
        ActualHours: `${log.actualHours}`,
        SubTaskAssignedTo: `${users}`,
        EpicLink: `${log.epicLink}`,
        Priority: `${log.priority}`,
        SubTaskStatus: `${log.subTaskStatus}`,
        Progress: `${log.progress}`,
        CreatedAt: log.createdAt ? `${log.createdAt.toISOString()}` : null,
        RemainingHours: `${log.remainingHours}`,
        ExceededHours: `${log.exceededHours}`,
      });
    }
  }
  if (groups.length) {
    groupFileTableHeader, push(
      { id: 'GroupName', title: 'GroupName' },
      { id: 'GroupDescription', title: 'GroupDescription' },
      { id: 'GroupLogo', title: 'GroupLogo' },
      { id: 'GroupCreatedBy', title: 'GroupCreatedBy' },
      { id: 'GroupUpdatedBy', title: 'GroupUpdatedBy' },
      { id: 'AssignedMembers', title: 'AssignedMembers' },
      { id: 'OrgId', title: 'OrgId' },
      { id: 'CreatedAt', title: 'CreatedAt' }
    )
    for (const log of groups) {
      const ids = log.assignedMembers.map(user => user.userId);
      for (const id of ids) {
        const result = await db.collection(reuse.user).findOne({ _id: ObjectId(id) })
        let concat = `${result.firstName}_${result.lastName}`
        groupUsers.push(concat)
      }
      pdfTableRowData.push({
        GroupName: `${log.groupName}`,
        GenerateReportroupDescription: `${log.groupDescription}`,
        GroupLogo: `${log.groupLogo}`,
        GroupCreatedBy: `${log.groupCreatedBy.userName}`,
        GroupUpdatedBy: `${log.groupUpdatedBy.userName}`,
        AssignedMembers: `${users}`,
        OrgId: `${log.orgId}`,
        CreatedAt: log.createdAt ? `${log.createdAt.toISOString()}` : null
      });
    }
  }
  return { projectFileTableHeader, projectTableRowData, taskFileTableHeader, taskTableRowData, projectUsers, taskUsers, pdfFileTableHeader, pdfTableRowData, users, groupFileTableHeader, groupTableRowData, groupUsers };
}

export default new AutoSendReport();