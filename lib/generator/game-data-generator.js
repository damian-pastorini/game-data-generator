/**
 *
 * Reldens - Game Data Generator - GameDataGenerator
 *
 */

const { FileHandler } = require('../files/file-handler');
const { Logger } = require('@reldens/utils');

class GameDataGenerator
{

    constructor()
    {
        this.currentDate = (new Date()).toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '-');
        this.optionsValidator = null;
        this.fileHandler = new FileHandler();
    }

    setReady(props)
    {
        this.isReady = false;
        if (props && 0 < Object.keys(props).length) {
            this.setOptions(props);
            this.isReady = this.validate();
        }
    }

    setOptions()
    {
        Logger.warning('Method "setOptions" was not implemented.');
    }

    validate()
    {
        return Boolean(this.optionsValidator?.validate(this));
    }

    generate()
    {
        Logger.warning('Method "generate" was not implemented.');
    }
}

module.exports.GameDataGenerator = GameDataGenerator;
