/**
 *
 * Reldens - Game Data Generator - PlayersExperiencePerLevel
 *
 */

const { PlayersExperiencePerLevelValidator } = require('../validator/players-experience-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { sc } = require('@reldens/utils');


class PlayersExperiencePerLevel extends GameDataGenerator
{

    constructor(props)
    {
        props = props || {};
        props.optionsValidator = new PlayersExperiencePerLevelValidator();
        super(props);
        this.levels = {};
    }

    setOptions(options)
    {
        // required:
        // experience required to reach level 2 from level 1 (example: 10):
        this.startExp = sc.get(options, 'startExp', false);
        // initial growth per level (example: 1.1):
        this.baseGrowthFactor = sc.get(options, 'baseGrowthFactor', false);
        // maximum level you want to calculate up to (example: 100):
        this.maxLevel = sc.get(options, 'maxLevel', false);
        // increase in growth factor per level (example: 0.01):
        this.growthIncrease = sc.get(options, 'growthIncrease', false);
        // optional:
        this.jsonFileName = sc.get(options, 'jsonFileName', 'players-experience-per-level-'+this.currentDate+'.json');
        this.generateFolderPath = sc.get(options, 'generateFolderPath', 'generate');
        this.baseGrowthFactorPerLevel = sc.get(options, 'baseGrowthFactorPerLevel', {});
    }

    generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify(this.calculateLevelExpDynamicGrowth())
        );
        return true;
    }

    calculateLevelExpDynamicGrowth()
    {
        let totalExp = 0;
        let currentGrowthFactor = this.baseGrowthFactor;
        for (let level = 1; level <= this.maxLevel; level++) {
            if (level === 1) {
                totalExp = this.startExp;
                this.levels[level] = {req: this.startExp, total: this.startExp}

                continue;
            }
            currentGrowthFactor = this.baseGrowthFactorPerLevel[level] || currentGrowthFactor;
            let reqExp = Math.floor(this.levels[level - 1].req * currentGrowthFactor);
            // increase the growth factor for the next level:
            currentGrowthFactor += this.growthIncrease;
            totalExp += reqExp;
            this.levels[level] = {req: reqExp, total: totalExp};
        }
        return this.levels;
    }

}

module.exports.PlayersExperiencePerLevel = PlayersExperiencePerLevel;
