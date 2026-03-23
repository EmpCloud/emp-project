import { connection } from '../resources/database/mongo.connect.js';
import config from 'config';

async function checkCollection(ORG) {
    const dbName = config.get('mongo.db_name');
    const db = await connection.client.db(dbName);
    const collInfo = await db.listCollections({ name: ORG }).toArray();
    if (collInfo.length === 0) {
        return null;
    }
    return db;
}

function removeDuplicates(arr, property) {
    return [...new Map(arr.map(item => [item[property], item])).values()];
}

export { checkCollection, removeDuplicates };
