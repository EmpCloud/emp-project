import mongoose from 'mongoose';

let planHistorySchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    planName: { type: String, required: true },
    planData: {type:Object,required:true},
    durationValue: { type: String },
    durationType: { type: String},
    startDate: { type: Date },
    expireDate: { type: Date },
    status:{ type: String, default:'active'},
    purchasedBy: { type: mongoose.Types.ObjectId, ref: 'adminSchema', required: true }
},
    { timestamps: true }
);
let planHistoryModel = mongoose.model('planHistorySchema', planHistorySchema);
export default planHistoryModel;