/**
 *
 * Reldens - Game Data Generator - FileHandler
 *
 */

const fs = require('fs');
const path = require('path');
const { Logger} = require('@reldens/utils');

class FileHandler
{

    joinPaths(...paths)
    {
        return path.join(...paths);
    }

    copyFile(from, name, generatedFolder)
    {
        fs.copyFileSync(from, path.join(generatedFolder, name));
    }

    createFolder(generateFolderPath)
    {
        fs.mkdirSync(generateFolderPath, { recursive: true });
    }

    async writeFile(fileName, content)
    {
        return fs.writeFile(fileName, content, 'utf8', (err) => {
            if(err){
                Logger.error('Error saving the file:', err);
                return false;
            }
            Logger.info('The file has been saved! New file name: '+fileName);
            return true;
        });
    }

}

module.exports.FileHandler = FileHandler;
