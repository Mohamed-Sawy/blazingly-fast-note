#!/usr/bin/env node

import 'dotenv/config';
import db from './src/database/index.mjs';
import ioHandler from './src/helpers/ioHandler.mjs';

const requiredEnvVars = [
    process.env.DB_CONNECTION_STRING,
    process.env.SNOTES_PASSWORD
];

if (requiredEnvVars.every(exists)) {
    start();
}
else {
    ioHandler.showError('Environment is not configured correctly');
}


function exists(variable) {
    return variable
}

async function start() {
    await import('./src/commands/index.mjs');

    db.close();
}