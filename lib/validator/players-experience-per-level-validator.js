/**
 *
 * Reldens - Game Data Generator - PlayersExperiencePerLevelValidator
 *
 */

const { Logger, sc } = require('@reldens/utils');

class PlayersExperiencePerLevelValidator
{
    validate(options)
    {
        if(!sc.get(options, 'startExp')){
            Logger.error('Missing required option: "startExp".');
            return false;
        }
        if(!sc.get(options, 'baseGrowthFactor')){
            Logger.error('Missing required option: "baseGrowthFactor".');
            return false;
        }
        if(!sc.get(options, 'maxLevel')){
            Logger.error('Missing required option: "maxLevel".');
            return false;
        }
        if(!sc.get(options, 'growthIncrease')){
            Logger.error('Missing required option: "growthIncrease".');
            return false;
        }
        return true;
    }
}

module.exports.PlayersExperiencePerLevelValidator = PlayersExperiencePerLevelValidator;
