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
        await this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify(this.generateExperience())
        );
        Logger.info('Data saved! Check the "generated" folder.');
    }

    generateExperience()
    {
        let levelsKeys = Object.keys(this.levelsExperienceByKey);
        let variationsKeys = Object.keys(this.variations);
        let decrementProportion = {};
        for (let variationKey of variationsKeys) {
            decrementProportion[variationKey] = 0;
        }
        for (let levelKey of levelsKeys) {
            this.experiencePerVariationAndLevel[levelKey] = this.levelsExperienceByKey[levelKey];
            let reqExp = this.levelsExperienceByKey[levelKey].req;
            for (let variationKey of variationsKeys) {
                decrementProportion[variationKey] = Number(this.decrementProportionPerLevel[levelKey] || decrementProportion[variationKey]);
                let newVariationValue = this.calculateVariation(this.variations[variationKey], decrementProportion[variationKey]);
                let newVariationExperience = this.calculateExperience(newVariationValue, reqExp);
                let previousLevel = this.experiencePerVariationAndLevel[Number(levelKey) - 1];
                let previousExp = 0;
                if (previousLevel) {
                    previousExp = this.experiencePerVariationAndLevel[Number(levelKey) - 1][variationKey].exp;
                    if(previousExp > newVariationExperience){
                        let fixedValidation = false;
                        for (let i = 0.9; i >= 0.1; i -= 0.1) {
                            let testDecrementProportion = this.roundToPrecision(decrementProportion[variationKey] * i, 5);
                            let testNewVariationValue = this.calculateVariation(this.variations[variationKey], testDecrementProportion);
                            let testNewVariationExperience = this.calculateExperience(testNewVariationValue, reqExp);
                            if (previousExp <= testNewVariationExperience) {
                                Logger.warning('Level decrement fixed.', {
                                    levelKey,
                                    variationKey,
                                    decrementProportion: decrementProportion[variationKey],
                                    testDecrementProportion
                                });
                                decrementProportion[variationKey] = testDecrementProportion;
                                newVariationValue = testNewVariationValue;
                                newVariationExperience = testNewVariationExperience;
                                fixedValidation = true;
                                break;
                            }
                        }
                        if (!fixedValidation) {
                            Logger.warning('Level decrement not fixed.', {
                                levelKey,
                                variationKey,
                                decrementProportion: decrementProportion[variationKey]
                            });
                        }
                    }
                }
                let kills = Math.ceil(reqExp / newVariationExperience);
                this.variations[variationKey] = newVariationValue;
                this.experiencePerVariationAndLevel[levelKey][variationKey] = {
                    decrementProportion: decrementProportion[variationKey],
                    randomVariation: this.variations[variationKey],
                    exp: this.roundToPrecision(newVariationExperience, 2),
                    kills: kills
                }
            }
        }
        return this.experiencePerVariationAndLevel;
    }

    calculateExperience(variationValue, reqExp)
    {
        return this.roundToPrecision((variationValue * reqExp) / 100, 0);
    }

    calculateVariation(variationValue, decrementProportion)
    {
        let newVariation = this.roundToPrecision(variationValue - decrementProportion, 5);
        if (newVariation <= 0) {
            newVariation = variationValue;
        }
        return newVariation;
    }

    roundToPrecision(number, precision = 4)
    {
        return Number(number.toFixed(precision));
    }

}

module.exports.MonstersExperiencePerLevel = MonstersExperiencePerLevel;
