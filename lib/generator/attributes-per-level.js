/**
 *
 * Reldens - Game Data Generator - AttributesPerLevel
 *
 */

const { AttributesPerLevelValidator } = require('../validator/attributes-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { Logger, sc } = require('@reldens/utils');

class AttributesPerLevel extends GameDataGenerator
{

    constructor(props)
    {
        super();
        this.optionsValidator = new AttributesPerLevelValidator();
        this.typeScaleFactors = {};
        this.variations = {};
        this.setReady(props);
    }

    setOptions(options)
    {
        // required:
        this.templateBase = sc.get(options, 'templateBase', false);
        this.typeTemplates = sc.get(options, 'typeTemplates', false);
        this.typesVariations = sc.get(options, 'typesVariations', false);
        // optional:
        this.setBaseAsInitialLevel = sc.get(options, 'setBaseAsInitialLevel', false);
        this.maxLevel = sc.get(options, 'maxLevel', 100);
        this.typeScaleFactorRandom = sc.get(options, 'typeScaleFactorRandom', Math.random());
        this.scaleDivisor = sc.get(options, 'scaleDivisor', 10);
        this.levelDivisor = sc.get(options, 'levelDivisor', 10);
        this.jsonFileName = sc.get(options, 'jsonFileName', 'attributes-per-level-'+this.currentDate+'.json');
        this.generateFolderPath = sc.get(options, 'generateFolderPath', 'generated');
    }

    async generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        // define scale factors for each type:
        for(let variationType of Object.keys(this.typesVariations)){
            let factor = this.typesVariations[variationType];
            this.typeScaleFactors[variationType] = this.typeScaleFactorRandom * (factor.max - factor.min) + factor.min;
        }
        await this.fileHandler.createFolder(this.generateFolderPath);
        await this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify({
                statsByVariation: this.generateAttributesData(),
                typeScaleFactorRandom: this.typeScaleFactorRandom
            })
        );
        Logger.info('Data saved! Check the "generated" folder.');
    }

    generateAttributesData()
    {
        for(let variationType of Object.keys(this.typesVariations)){
            this.variations[variationType] = {};
            this.generateVariation(variationType);
        }
        return this.variations;
    }

    generateVariation(variationType)
    {
        let typesKeys = Object.keys(this.typeTemplates);
        for(let level = 1; level <= this.maxLevel; level ++){
            this.variations[variationType][level] = {};
            for(let typeKey of typesKeys){
                this.variations[variationType][level][typeKey] = this.applyTemplate(typeKey, level, variationType);
            }
        }
    }

    applyTemplate(typeKey, level, variationType)
    {
        let base = this.templateBase;
        let result = {...base};
        let scaleTypeFactor = this.typeScaleFactors[variationType];
        let templatesProperties = Object.keys(this.typeTemplates[typeKey]);
        for(let key of templatesProperties){
            if(1 === level && this.setBaseAsInitialLevel){
                result[key] = base[key];
                continue;
            }
            let templateData = this.typeTemplates[typeKey][key];
            let scale = sc.isObject(templateData)
                ? sc.randomInteger(templateData.min, templateData.max) + templateData.min
                : templateData;
            result[key] = Math.round(
                base[key] * (1 + scale / this.scaleDivisor) * (1 + level / this.levelDivisor) * scaleTypeFactor
            );
        }
        return result;
    }

}

module.exports.AttributesPerLevel = AttributesPerLevel;
