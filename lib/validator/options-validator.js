/**
 *
 * Reldens - Game Data Generator - OptionsValidator
 *
 */

const { Logger, sc } = require('@reldens/utils');

class OptionsValidator
{
    validate(options)
    {
        if(!sc.get(options, 'originalJSON')){
            Logger.error('Missing required option: "originalJSON".');
            return false;
        }
        return true;
    }
}

module.exports.OptionsValidator = OptionsValidator;
