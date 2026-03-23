import mongoose from 'mongoose';
import deleteDummy from './delete.dummydocument.js';

const SubTaskSchema = new mongoose.Schema({
    projectName: { type: String }, //ProjectId It is Optional field for standalone tasks, else required field
    projectId: { type: String }, //ProjectId It is Optional field for standalone tasks, else required field
    taskId: { type: String, required: true }, // Admin First Name required field
    stageName: { type: String, trim: true }, //development,production,testing
    subTaskCategory: { type: String }, //  general ,  Problem ticket,  incident , service Req
    subtaskTitle: { type: String, length: { min: 10, max: 30 } },
    subtaskType: { type: Number, default: 1 }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    subTaskDescription: { type: String, length: { min: 20, max: 50 } },
    dueDate: { type: Date, default: Date.now },
    estimationDate: { type: Date },
    estimationTime: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    remainingHours: { type: Number, default: 0 },
    exceededHours: { type: Number, default: 0 },
    reason: {type: String,trim:true},
    completedDate:{type: Date},
    assignedTo: [
        {
            id: { type: String },
        },
    ],
    attachment: { type: [String] },
    epicLink: { type: [String] },
    status: { type: String, enum: ['Todo', 'Inprogress', 'Pending', 'Review', 'Done'], default: 'Todo' }, // 1- High , 2- Medium, 3- Low
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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

export const saveDefaultSubData = async (schemaName, data) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, SubTaskSchema);

        await new orgsSchemaModel(data).save();
        deleteDummy(schemaName);
        return true;
    } catch (error) {
        return error;
    }
};

export let subtask = {
    projectName: 'EmpCloud',
    projectId: '62fe6ea87ab5913e391f055c',
    taskId: '01',
    stageName: 'development',
    subTaskCategory: 'Bug',
    subtaskTitle: "Create API's for project",
    subtaskType: 1,
    subTaskDescription: 'some description  about task',
    dueDate: '7/23/22',
    estimationDate: '12/30/22',
    estimationTime: 8,
    assignedTo: [
        {
            id: '1',
        },
    ],
    attachment: ['deafltpic.jpg', 'attachmentpic.jpg'],
    epicLink: ['https://apidoc.com', 'htttps://somewhere.com'],
    priority: 'Medium',
    status: 'Todo',
};
