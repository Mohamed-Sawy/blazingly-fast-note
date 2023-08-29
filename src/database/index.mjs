import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import directoryScanner from '../helpers/directoryScanner.mjs';

const models = {};

await configureDatabase();

async function configureDatabase() {
    mongoose.connect(process.env.DB_CONNECTION_STRING);

    const schemaModules = await getSchemaModules();
    
    for (const schModule of schemaModules) {
        models[schModule.modelName] = mongoose.model(schModule.modelName, schModule.schema);
    }
}

function getSchemaModules() {
    const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), '/schemas');
    
    return directoryScanner.getModules({directory});
}

function close() {
    mongoose.connection.close();
}

export default {models, close};