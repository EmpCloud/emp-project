import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    superUserId: { type: String, trim: true }, // Mongo default admin id
    adminProfilePic: { type: String, trim: true },
    adminName: { type: String, trim: true },
    projectLogo: { type: String, trim: true },
    projectName: { type: String, trim: true, required: true },
    projectCode: { type: String, length: { min: 4, max: 12 } },
    description: { type: String, trim: true },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date },
    plannedBudget: { type: Number, min: 0, default: 0 },
    actualBudget: { type: Number, min: 0, default: 0 },
    currencyType: { type: String, enum: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'CNY', 'KRW', 'NGN'], default: 'INR' },
    userAssigned: [
        {
            id: { type: String },
            role: { type: String, trim: true },
        },
    ],
    status: { type: String, enum: ['Todo', 'Inprogress', 'Pending', 'Review', 'Done'], default: 'Todo' },
    progress: { type: Number, default: 0 },
});

export default mongoose.model('project', projectSchema);
