/**
 *
 * Reldens - Game Data Generator - MonstersExperiencePerLevel
 *
 */

const { MonstersExperiencePerLevelValidator } = require('../validator/monsters-experience-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { Logger, sc } = require('@reldens/utils');

class MonstersExperiencePerLevel extends GameDataGenerator
{

    constructor(props)
    {
        super();
        this.optionsValidator = new MonstersExperiencePerLevelValidator();
        this.experiencePerVariationAndLevel = {};
        this.setReady(props);
    }

    setOptions(options)
    {
        // required:
        this.levelsExperienceByKey = sc.get(options, 'levelsExperienceByKey', false);
        this.variationsMinMax = sc.get(options, 'variationsMinMax', false);
        this.everyLevelsQuantity = sc.get(options, 'everyLevelsQuantity', false);
        this.decrementProportionPerLevel = sc.get(options, 'decrementProportionPerLevel', false);
        this.decrementProportionDivisor = sc.get(options, 'decrementProportionDivisor', false);
        // optional:
        this.jsonFileName = sc.get(options, 'jsonFileName', 'monsters-experience-per-level-'+this.currentDate+'.json');
        this.generateFolderPath = sc.get(options, 'generateFolderPath', 'generated');
    }

    async generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        await this.fileHandler.createFolder(this.generateFolderPath);
        let result = await this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify(this.generateExperience())
        );
        if (!result) {
            Logger.info('There was an error generating the data.');
            return;
        }
        Logger.info('Data saved! Check the "generated" folder.');
    }

    generateExperience()
    {
        let levelsKeys = Object.keys(this.levelsExperienceByKey);
        let variationsKeys = Object.keys(this.variationsMinMax);
        let currentDecrementProportion = 1;
        for (let levelKey of levelsKeys) {
            let levelNum = parseInt(levelKey, 10);
            // process only levels that are multiples of the everyLevelsQuantity:
            if (levelNum !== 1 && 0 !== (levelNum % this.everyLevelsQuantity)) {
                continue;
            }
            currentDecrementProportion = this.decrementProportionPerLevel[levelKey] || currentDecrementProportion;
            this.experiencePerVariationAndLevel[levelKey] = this.levelsExperienceByKey[levelKey];
            let reqExp = this.levelsExperienceByKey[levelKey].req;
            // loop through variations:
            for (let variationKey of variationsKeys) {
                if (variationKey !== 'monsterA') {
                    continue;
                }
                let randomVariation = this.roundToPrecision(
                    this.variationsMinMax[variationKey] * currentDecrementProportion,
                    2
                );
                let variationExperienceProportion = this.roundToPrecision(
                    (randomVariation * reqExp) / 100,
                    2
                );
                let kills = Math.floor(reqExp / variationExperienceProportion);
                this.experiencePerVariationAndLevel[levelKey][variationKey] = {
                    currentDecrementProportion,
                    randomVariation,
                    experienceProportion: variationExperienceProportion,
                    exp: this.roundToPrecision(reqExp / kills, 2),
                    kills: kills
                }
            }
            // currentDecrementProportion = currentDecrementProportion + this.decrementProportionDivisor;
        }
        return this.experiencePerVariationAndLevel;
    }

    getRandomVariation(min, max)
    {
        return Math.random() * (max - min) + min;
    }

    roundToPrecision(number, precision = 4)
    {
        let factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

}

module.exports.MonstersExperiencePerLevel = MonstersExperiencePerLevel;
