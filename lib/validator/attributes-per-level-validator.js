/**
 *
 * Reldens - Game Data Generator - AttributesPerLevelValidator
 *
 */

const { Logger, sc } = require('@reldens/utils');

class AttributesPerLevelValidator
{
    validate(options)
    {
        if(!sc.get(options, 'templateBase')){
            Logger.error('Missing required option: "templateBase".');
            return false;
        }
        if(!sc.get(options, 'typeTemplates')){
            Logger.error('Missing required option: "typeTemplates".');
            return false;
        }
        if(!sc.get(options, 'typesVariations')){
            Logger.error('Missing required option: "typesVariations".');
            return false;
        }
        return true;
    }
}

module.exports.AttributesPerLevelValidator = AttributesPerLevelValidator;
