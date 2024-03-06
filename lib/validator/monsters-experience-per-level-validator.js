/**
 *
 * Reldens - Game Data Generator - MonstersExperiencePerLevelValidator
 *
 */

const { Logger, sc } = require('@reldens/utils');

class MonstersExperiencePerLevelValidator
{
    validate(options)
    {
        if(!sc.get(options, 'levelsExperienceByKey')){
            Logger.error('Missing required option: "levelsExperienceByKey".');
            return false;
        }
        if(!sc.get(options, 'variationsMinMax')){
            Logger.error('Missing required option: "variationsMinMax".');
            return false;
        }
        if(!sc.get(options, 'everyLevelsQuantity')){
            Logger.error('Missing required option: "everyLevelsQuantity".');
            return false;
        }
        return true;
    }
}

module.exports.MonstersExperiencePerLevelValidator = MonstersExperiencePerLevelValidator;
