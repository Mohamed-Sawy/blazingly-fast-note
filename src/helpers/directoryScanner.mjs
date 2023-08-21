import fs from 'fs/promises'
import path from 'path';
import { pathToFileURL } from 'url';

async function getDirectoryPaths(directory, filesFilter = (filePath) => true) {    
    return (await fs.readdir(directory))
                .map(fileName => path.join(directory, fileName))
                .filter(filesFilter);
};

async function getModules({modulePaths, directory, filesFilter}) {
    if (directory)
        modulePaths = await getDirectoryPaths(directory, filesFilter);

    return await Promise.all(
        modulePaths.map(filePath => import(pathToFileURL(filePath)))
    );
};

export default {getDirectoryPaths, getModules};