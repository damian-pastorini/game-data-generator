/**
 *
 * Reldens - Game Data Generator - GameDataGenerator
 *
 */

const { OptionsValidator } = require('./validator/options-validator');
const { FileHandler } = require('./files/file-handler');
const { Logger, sc } = require('@reldens/utils');

class GameDataGenerator
{

    constructor(props)
    {
        this.currentDate = (new Date()).toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '-');
        this.optionsValidator = new OptionsValidator();
        this.fileHandler = new FileHandler();
        this.isReady = false;
        if(props && 0 < Object.keys(props).length){
            this.setOptions(props);
            this.isReady = this.validate();
        }
    }

    setOptions(options)
    {
        // required:
        this.originalJSON = sc.get(options, 'originalJSON', false);
        this.newJSON = this.originalJSON;
        // @TODO - Complete.
        // optional
        // dynamic generated
    }

    validate()
    {
        return this.optionsValidator.validate(this);
    }

    async generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        // @TODO - Generate contents.
        return true;
    }
}

module.exports.GameDataGenerator = GameDataGenerator;
