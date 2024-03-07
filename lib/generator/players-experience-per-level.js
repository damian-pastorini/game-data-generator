/**
 *
 * Reldens - Game Data Generator - PlayersExperiencePerLevel
 *
 */

const { PlayersExperiencePerLevelValidator } = require('../validator/players-experience-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { Logger, sc } = require('@reldens/utils');

class PlayersExperiencePerLevel extends GameDataGenerator
{

    constructor(props)
    {
        super();
        this.optionsValidator = new PlayersExperiencePerLevelValidator();
        this.levels = {};
        this.setReady(props);
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
        // optional:
        // increase in growth factor per level (example: 0.01):
        this.growthIncrease = sc.get(options, 'growthIncrease', 0);
        this.jsonFileName = sc.get(options, 'jsonFileName', 'players-experience-per-level-'+this.currentDate+'.json');
        this.generateFolderPath = sc.get(options, 'generateFolderPath', 'generated');
        this.baseGrowthFactorPerLevel = sc.get(options, 'baseGrowthFactorPerLevel', {});
    }

    async generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return;
        }
        await this.fileHandler.createFolder(this.generateFolderPath);
        let result = await this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify(this.calculateLevelExpDynamicGrowth())
        );
        if (!result) {
            Logger.info('There was an error generating the data.');
            return;
        }
        Logger.info('Data saved! Check the "generated" folder.');
    }

    calculateLevelExpDynamicGrowth()
    {
        let totalExp = 0;
        let currentGrowthFactor = this.baseGrowthFactor;
        for (let level = 1; level <= this.maxLevel; level++) {
            if (level === 1) {
                totalExp = this.startExp;
                this.levels[level] = {req: this.startExp, total: this.startExp, growthFactor: currentGrowthFactor};

                continue;
            }
            currentGrowthFactor = this.roundToPrecision(this.baseGrowthFactorPerLevel[level] || currentGrowthFactor);
            let reqExp = Math.floor(this.levels[level - 1].req * currentGrowthFactor);
            // increase the growth factor for the next level:
            currentGrowthFactor = this.roundToPrecision(currentGrowthFactor + this.growthIncrease);
            totalExp += reqExp;
            this.levels[level] = {req: reqExp, total: totalExp, growthFactor: currentGrowthFactor};
        }
        return this.levels;
    }

    roundToPrecision(number, precision = 4)
    {
        let factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

}

module.exports.PlayersExperiencePerLevel = PlayersExperiencePerLevel;
