/**
 *
 * Reldens - Game Data Generator - MonstersAttributesPerLevelValidator
 *
 */

const { Logger, sc } = require('@reldens/utils');

class MonstersAttributesPerLevelValidator
{
    validate(options)
    {
        if(!sc.get(options, 'monsterBase')){
            Logger.error('Missing required option: "monsterBase".');
            return false;
        }
        if(!sc.get(options, 'typeTemplates')){
            Logger.error('Missing required option: "typeTemplates".');
            return false;
        }
        if(!sc.get(options, 'monsterTypesVariations')){
            Logger.error('Missing required option: "monsterTypesVariations".');
            return false;
        }
        if(!sc.get(options, 'variationsScaleFactorsMinMax')){
            Logger.error('Missing required option: "variationsScaleFactorsMinMax".');
            return false;
        }
        return true;
    }
}

module.exports.MonstersAttributesPerLevelValidator = MonstersAttributesPerLevelValidator;
