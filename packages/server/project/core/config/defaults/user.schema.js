import mongoose from 'mongoose';
import deleteDummy from './delete.dummydocument.js';
import uuidv1 from 'uuidv1';
import moment from 'moment';

const userSchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    userName:{type:String},
    password: { type: String, required: true },
    email: { type: String, required: true },
    permission: { type: String, required: true },
    role: { type: String, required: true },
    empMonitorId: { type: String },
    verified: {
        type: Boolean,
        default: false,
    },
    userName: {type:String,trim:true},
    emailValidateToken: {
        type: String,
        default: uuidv1(),
    },
    emailTokenExpire: { type: Date, default: moment().add(1, 'day')?._d },
    verificationEmailSentCount: { type: Number, default: 0 },
    forgotPasswordToken: { type: String, default: uuidv1() }, //Token for handling the  forget password
    forgotTokenExpire: { type: Date, default: moment().add(1, 'day')?._d }, //Token expire for forget password
    passwordEmailSentCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    userName:{type:String},
    invitation: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
    }, // 0- pending , 1- accepted, 2- rejected
    suspendedAt: {type:Date},
    creatorId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    softDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
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
    isSuspended:{ type: Boolean, default: false},
});

export const saveUserData = async (schemaName, data) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, userSchema);

        await new orgsSchemaModel(data).save();
        deleteDummy(schemaName);
        return true;
    } catch (error) {
        return error;
    }
};

export const userInfo = {
    orgId: 'GLB-BAN-001',
    firstName: 'Jagadeesha',
    lastName: 'Ravibabu',
    password: 'EmpMonitor@1234',
    email: 'jagadeesha@empmonitor.com',
    role: 'Software Developer',
    permissions: 'Read',
    verified: false,
    emailValidateToken: uuidv1(),
    emailTokenExpire: moment().add(1, 'day')?._d,
};
