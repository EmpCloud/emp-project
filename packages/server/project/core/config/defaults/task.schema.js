import mongoose from 'mongoose';
import deleteDummy from './delete.dummydocument.js';

const TaskSchema = new mongoose.Schema({
    id: { type: Number },
    projectName: { type: String },
    projectId: { type: String },
    stageName: { type: String, trim: true },
    category: { type: String }, //Task,Bug,Epic,Service,Problem,Incident,Change
    taskTitle: { type: String },
    taskType: { type: String, default: 'Feature' }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    taskStatus: {
        type: String,
        default: 'Todo',
    },
    taskDetails: { type: String }, // need to changes
    taskCreator: {
        id: { type: String },
        name: { type: String },
        profilePic: { type: String },
    },
    dueDate: { type: Date },
    reason: {type: String,trim:true},
    completedDate:{type: Date},
    estimationHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    remainingHours: { type: Number, default: 0 },
    exceededHours: { type: Number, default: 0 },
    assignedTo: [
        {
            id: { type: String },
            name: { type: String },
            profilePic: { type: String },
        },
    ],
    attachment: { type: [String] },
    epicLink: { type: [String] },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    stringInput_64: { type: String, trim: true, length: { min: 4, max: 64 } },
    stringInput_256: { type: String, trim: true, length: { min: 4, max: 256 } },
    stringInput_1000: { type: String, trim: true, length: { min: 4, max: 1000 } },
    date_dd_mm_yyyy: { type: Date },
    date_mm_dd_yyyy: { type: Date },
    date_dd_mm_yyyy: { type: Date },
    date_dd_mon_yyyy: { type: Date },
    date_yy_mon_dd: { type: Date },
    dateTime_ddmmyyyy_hhmmss: { type: String },
    dateTime_mmddyyyy_hhmmss: { type: String },
    dateTime_yyyymmdd_hhmmss: { type: String },
    dateTime_ddmonyyyy_hhmmss: { type: String },
    dateTime_yymondd_hhmmss: { type: String },
    dateTime_ddmmyyyy_hhmm: { type: String },
    dateTime_mmddyyyy_hhmm: { type: String },
    dateTime_yyyymmdd_hhmm: { type: String },
    dateTime_ddmonyyyy_hhmm: { type: String },
    numberInput_6: { type: Number },
    numberInput_10: { type: Number },
    checkBox: [{ type: String, trim: true }],
    labels: [{ type: String, trim: true }],
    url: [{ type: String, trim: true }],
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
    },
});

export const SaveDefaultTaskData = async (schemaName, data) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, TaskSchema);

        await new orgsSchemaModel(data).save();
        deleteDummy(schemaName);
        return true;
    } catch (error) {
        return error;
    }
};

export let task = {
    projectId: '62fe6ea87ab5913e391f055c',
    projectName: 'EmpCloud',
    stageName: 'development',
    taskTitle: "Create API's for project",
    taskType: 1,
    taskDetails: 'some description  about task',
    taskCreator: {
        name: 'Jagadeesha',
        profilePic: 'abcd.png',
    },
    dueDate: '7/23/22',
    estimationHours: 8,
    assignedTo: [
        {
            id: '1',
            Name: 'Ravi',
            ProfilePic: 'pic',
        },
        {
            id: '2',
            name: 'Jaggu',
            profilePic: 'pic',
        },
    ],
    attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
    epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
    priority: 'Medium',
};
