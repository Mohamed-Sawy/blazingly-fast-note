import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { fileURLToPath, pathToFileURL } from "url";
import path from "path"
import fs from "fs/promises"


configureCommands();

async function configureCommands() {
    let argsConfiguration = yargs(hideBin(process.argv));

    const modulePaths = await getModulePaths();

    const commandModules = await Promise.all(
        modulePaths.map(modulePath => import(pathToFileURL(modulePath)))
    );

    for (const cmdModule of commandModules) {
        argsConfiguration.command(cmdModule);
    }

    argsConfiguration
        .demandCommand(1, 1, "You must specify a command")
        .strict()
        .parse();
}

async function getModulePaths() {
    const commandsDirectory = path.dirname(fileURLToPath(import.meta.url));

    return (await fs.readdir(commandsDirectory))
                .map(fileName => path.join(commandsDirectory, fileName))
                .filter(filePath => path.basename(filePath).startsWith('cmd-'));
}