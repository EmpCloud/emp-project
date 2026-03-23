import mongoose from 'mongoose';
let subSchema = mongoose.Schema({
    id: { type: String }
}, { _id: false });

const clientSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    orgId: { type: String },
    projectIds: [subSchema],
},
    { timestamps: true }
)
export default mongoose.model('clientModel', clientSchema);