import mongoose from 'mongoose';
let subSchema = mongoose.Schema({
    id: { type: String }
}, { _id: false });

const companySchema = new mongoose.Schema({
    clientCompany: { type: String, required: true },
    clientName: [subSchema],
    orgId: { type: String },
    projectIds: [subSchema],
},
    { timestamps: true }
)
export default mongoose.model('companyModel', companySchema);