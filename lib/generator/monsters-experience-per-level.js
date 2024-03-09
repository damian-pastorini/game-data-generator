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
        this.variations = sc.get(options, 'variations', false);
        this.decrementProportionPerLevel = sc.get(options, 'decrementProportionPerLevel', false);
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
        let variationsKeys = Object.keys(this.variations);
        let decrementProportion = 0;
        for (let levelKey of levelsKeys) {
            this.experiencePerVariationAndLevel[levelKey] = this.levelsExperienceByKey[levelKey];
            let reqExp = this.levelsExperienceByKey[levelKey].req;
            for (let variationKey of variationsKeys) {
                if (variationKey !== 'monsterA') {
                    continue;
                }
                decrementProportion = Number(this.decrementProportionPerLevel[levelKey] || decrementProportion);
                let newVariation = this.roundToPrecision(this.variations[variationKey] - decrementProportion, 2);
                if (newVariation <= 0) {
                    newVariation = this.variations[variationKey];
                }
                this.variations[variationKey] = newVariation;
                let expPerVariation = this.roundToPrecision((this.variations[variationKey] * reqExp) / 100, 0);
                let kills = Math.ceil(reqExp / expPerVariation);
                this.experiencePerVariationAndLevel[levelKey][variationKey] = {
                    decrementProportion,
                    randomVariation: this.variations[variationKey],
                    exp: this.roundToPrecision(expPerVariation, 2),
                    kills: kills
                }
            }
        }
        return this.experiencePerVariationAndLevel;
    }

    roundToPrecision(number, precision = 4)
    {
        return Number(number.toFixed(precision));
    }

}

module.exports.MonstersExperiencePerLevel = MonstersExperiencePerLevel;
