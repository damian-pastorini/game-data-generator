/**
 *
 * Reldens - Game Data Generator - MonstersExperiencePerLevel
 *
 */

const { MonstersExperiencePerLevelValidator } = require('../validator/monsters-experience-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { sc } = require('@reldens/utils');

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
        // adjusted variations for different monsters:
        this.variationsMinMax = sc.get(options, 'variationsMinMax', false);
        // between how many levels the experience will be re-calculated (example: 5):
        this.everyLevelsQuantity = sc.get(options, 'everyLevelsQuantity', false);
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
        return await this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify(this.generateExperience())
        );
    }

    generateExperience()
    {
        let levelsKeys = Object.keys(this.levelsExperienceByKey);
        let variationsKeys = Object.keys(this.variationsMinMax);
        for (let levelKey of levelsKeys) {
            const levelNum = parseInt(levelKey, 10);
            // process only levels that are multiples of the everyLevelsQuantity:
            if (levelNum === 1 || 0 === (levelNum % this.everyLevelsQuantity)) {
                this.experiencePerVariationAndLevel[levelKey] = this.levelsExperienceByKey[levelKey];
                let reqExp = this.levelsExperienceByKey[levelKey].req;
                // loop through variations:
                for (let variationKey of variationsKeys) {
                    let variation = this.variationsMinMax[variationKey];
                    let variationExperience = Math.round(
                        reqExp * this.getRandomVariation(variation.min, variation.max)
                    );
                    let monsterAKills = Math.ceil(reqExp / variationExperience);
                    this.experiencePerVariationAndLevel[levelKey][variationKey] = {
                        exp: variationExperience,
                        kills: monsterAKills
                    }
                }
            }

        }
        return this.experiencePerVariationAndLevel;
    }

    getRandomVariation(min, max)
    {
        return Math.random() * (max - min) + min;
    }

}

module.exports.MonstersExperiencePerLevel = MonstersExperiencePerLevel;
