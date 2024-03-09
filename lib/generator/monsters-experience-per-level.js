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
        // dynamically generated:
        this.incrementalProportions = {};
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
        for (let i of variationsKeys){
            this.incrementalProportions[i] = this.generateDecrementalProportions(this.variationsMinMax[i]);
        }
        let multiplier = 1;
        for (let levelKey of levelsKeys) {
            let levelNum = parseInt(levelKey, 10);
            // process only levels that are multiples of the everyLevelsQuantity:
            if (levelNum !== 1 && 0 !== (levelNum % this.everyLevelsQuantity)) {
                continue;
            }
            this.experiencePerVariationAndLevel[levelKey] = this.levelsExperienceByKey[levelKey];
            let reqExp = this.levelsExperienceByKey[levelKey].req;
            // let growthFactor = this.levelsExperienceByKey[levelKey].growthFactor;
            // loop through variations:
            for (let variationKey of variationsKeys) {
                if (variationKey !== 'monsterA') {
                    continue;
                }
                multiplier = Number(this.incrementalProportions[variationKey][levelNum] || multiplier);
                let randomVariation = this.variationsMinMax[variationKey] * multiplier;
                // let randomVariation = this.variationsMinMax[variationKey] * multiplier * growthFactor;
                let variationExperienceProportion = this.roundToPrecision(
                    (randomVariation * reqExp) / 100,
                    2
                );
                let kills = Math.floor(reqExp / variationExperienceProportion);
                this.experiencePerVariationAndLevel[levelKey][variationKey] = {
                    multiplier,
                    // growthFactor,
                    randomVariation,
                    experienceProportion: variationExperienceProportion,
                    exp: this.roundToPrecision(reqExp / kills, 2),
                    kills: kills
                }
            }
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

    generateDecrementalProportions(startAt)
    {
        let incrementalProportions = [];
        for (let n = startAt; n > 0;) {
            // console.log(n.toFixed(5));
            incrementalProportions.push(n.toFixed(6));
            if (n > 1) n -= 1;
            else if (n <= 1 && n > 0.1) n = parseFloat((n - 0.1).toFixed(2));
            else if (n <= 0.1 && n > 0.01) n = parseFloat((n - 0.01).toFixed(3));
            else if (n <= 0.01 && n > 0.001) n = parseFloat((n - 0.001).toFixed(4));
            else if (n <= 0.001 && n > 0.0001) n = parseFloat((n - 0.0001).toFixed(5));
            // else if (n <= 0.0001 && n > 0.00001) n = parseFloat((n - 0.00001).toFixed(5));
            // else if (n <= 0.00001 && n > 0.000001) n = parseFloat((n - 0.000001).toFixed(6));
            else break;
        }
        return incrementalProportions;
    }

}

module.exports.MonstersExperiencePerLevel = MonstersExperiencePerLevel;
