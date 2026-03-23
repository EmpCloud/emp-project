import mongoose from "mongoose";
const autoReportSchema = new mongoose.Schema({
    reportsTitle: { type: String, required: true },
    orgId: { type: String, max: 11, required: true },
    frequency: [
        {
            Daily: { type: Number },
            Weekly: { type: Number },
            Monthly: { type: Number },
            Time: { type: String , default: '00:00'},
            Date: {
                startDate: { type: Date },
                endDate: { type: Date }
            }
        }
    ],
    Recipients: [{ type: String }],
    Content: [{
        task: { type: Number },
        project: { type: Number },
        subTask: { type: Number },
        progress: { type: Number },
        group: { type: Number },
        role: { type: Number }
    }],
    ReportsType: [{
        pdf: { type: Number },
        csv: { type: Number }
    }],
    filter: {
        wholeOrganization: { type: Number },
        specificEmployees: [
            {
                id: { type: String }
            }],
        specificGroups: [{
            groupId: { type: String }
        }],
        specificRoles: [{
            roleId: { type: String }
        }]
    },
    sendTestMail: { type: Boolean }
},
{ timestamps: true });
export default mongoose.model('autoReportSchema', autoReportSchema);