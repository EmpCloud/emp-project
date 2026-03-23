import { mongo } from 'mongoose';
import { connection } from '../../../resources/database/mongo.connect.js';

export default function deleteDummy(schemaName) {
    try {
        const db = connection.client.db(mongo.db_name);
        db.collection(`${schemaName.toLowerCase()}s`).deleteMany({});
    } catch (error) {
        return false;
    }
}
