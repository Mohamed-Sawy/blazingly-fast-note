import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import { fileURLToPath } from "url";
import path from "path";
import directoryScanner from "../helpers/directoryScanner.mjs";


await configureCommands();

async function configureCommands() {
    let argsConfiguration = yargs(hideBin(process.argv));

    const commandModules = await getCommandModules();

    for (const cmdModule of commandModules) {
        argsConfiguration.command(cmdModule);
    }
    
    await (argsConfiguration
        .demandCommand(1, 1, "You must specify a command")
        .strict()
        .parse());
}

async function getCommandModules() {
    const directory = path.dirname(fileURLToPath(import.meta.url));

    return await directoryScanner.getModules({
        directory, 
        filesFilter: filePath => path.basename(filePath).startsWith('cmd-')
    });
}