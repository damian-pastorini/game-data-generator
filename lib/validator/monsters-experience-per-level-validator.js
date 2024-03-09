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
        if(!sc.get(options, 'variations')){
            Logger.error('Missing required option: "variations".');
            return false;
        }
        if(!sc.get(options, 'decrementProportionPerLevel')){
            Logger.error('Missing required option: "decrementProportionPerLevel".');
            return false;
        }
        return true;
    }
}

module.exports.MonstersExperiencePerLevelValidator = MonstersExperiencePerLevelValidator;
