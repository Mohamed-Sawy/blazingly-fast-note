import 'dotenv/config';
import mongoose, { mongo } from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const models = {};

await configureDatabase();

async function configureDatabase() {
    mongoose.connect(process.env.DB_CONNECTION_STRING);

    const schemaPaths = await getSchemaPaths();

    const schemaModules = await Promise.all(
        schemaPaths.map(filePath => import(pathToFileURL(filePath)))
    );

    for (const schModule of schemaModules) {
        models[schModule.modelName] = mongoose.model(schModule.modelName, schModule.schema);
    }
}

async function getSchemaPaths() {
    const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), '/schemas');
    
    try {
    return (await fs.readdir(directory))
                .map(fileName => path.join(directory, fileName));
    }
    catch (err) {
        console.log(err);
    }
}

function close() {
    mongoose.connection.close();
}

export const db = {models, close};