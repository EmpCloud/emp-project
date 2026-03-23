import mongoose from 'mongoose';

import deleteDummy from './delete.dummydocument.js';

const projectSchema = new mongoose.Schema(
    {
        superUserId: { type: String, trim: true }, // Mongo default admin id
        adminProfilePic: { type: String, trim: true },
        adminName: { type: String, trim: true },
        projectLogo: { type: String, trim: true },
        projectName: { type: String, trim: true, required: true },
        projectCode: { type: String, length: { min: 4, max: 12 } },
        description: { type: String, trim: true },
        startDate: { type: Date, default: Date.now() },
        endDate: { type: Date },
        clientName: { type: String },
        clientCompany: [{
            id: { type: String },
            key: { type: String }
        }],
        plannedBudget: { type: Number },
        actualBudget: { type: Number },
        estimationDate: { type: Date },
        estimationTime: { type: Number, default: 0 },
        completedDate: { type: Date },
        actualHours: { type: Number, default: 0 },
        remainingHours: { type: Number, default: 0 },
        exceededHours: { type: Number, default: 0 },
        currencyType: { type: String, enum: ['INR', 'DOLLAR', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'KRW', 'NGN'], default: 'INR' },
        userAssigned: [
            {
                id: { type: String },
                role: { type: String, trim: true },
            },
        ],
        status: { type: String, enum: ['Todo', 'Inprogress', 'Pending', 'Review', 'Done'], default: 'Todo' },
        progress: { type: Number, default: 0 },
        reason: { type: String, trim: true },
        softDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: String, trim: true },
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
        priority: { type: String, trim: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

export const SaveData = async (schemaName, data) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, projectSchema);

        await new orgsSchemaModel(data).save();
        deleteDummy(schemaName);
        return true;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export let project = {
    projectName: 'EmpMonitor',
    projectCode: 'E-101',
    description: 'Employeee Monitoring WM Module handles the Project and Task Modules',
    startDate: '2022-03-11',
    endDate: '2022-03-21',
    userAssigned: [
        {
            id: '1',
            role: 'Admin',
        },
    ],
    plannedBudget: 20000,
    actualBudget: 10000,
    adminProfilePic: 'admin.jpeg',
    currencyType: 'INR',
};
