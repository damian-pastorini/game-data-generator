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

    writeFile(fileName, content)
    {
        fs.writeFile(fileName, content, 'utf8', (err) => {
            if(err){
                Logger.error('Error saving the file:', err);
                return;
            }
            Logger.info('The file has been saved! New file name: '+fileName);
        });
    }

}

module.exports.FileHandler = FileHandler;
