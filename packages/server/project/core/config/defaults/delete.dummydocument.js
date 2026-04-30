import mongoose from 'mongoose';

export default async function deleteDummy(schemaName) {
    try {
        await mongoose.model(schemaName).deleteMany({});
        return true;
    } catch (error) {
        return false;
    }
}
