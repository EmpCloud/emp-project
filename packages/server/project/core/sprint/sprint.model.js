import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
    name: { type: String, required: true }, // "Sprint 1", "Sprint 2"
    goal: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['planning', 'active', 'completed', 'cancelled'], default: 'planning' },
    velocity: { type: Number, default: 0 }, // story points completed
    plannedPoints: { type: Number, default: 0 },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task_management' }],
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

sprintSchema.index({ orgId: 1, projectId: 1 });
sprintSchema.index({ orgId: 1, status: 1 });

export default mongoose.model('sprint', sprintSchema);
