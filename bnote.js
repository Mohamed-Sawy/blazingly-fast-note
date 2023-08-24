#!/usr/bin/env node

import 'dotenv/config';
import chalk from 'chalk';


const requiredEnvVars = [
    process.env.DB_CONNECTION_STRING,
    process.env.SNOTES_PASSWORD
];

if (requiredEnvVars.every(exists)) {
    start();
} else {
    console.error(chalk.red("Error: Environment is not configured correctly"));
}


function exists(variable) {
    return variable
}

async function start() {
    import('./src/commands/index.mjs');
}