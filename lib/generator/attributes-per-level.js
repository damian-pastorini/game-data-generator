/**
 *
 * Reldens - Game Data Generator - MonsterAttributesPerLevel
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
        this.maxLevel = sc.get(options, 'maxLevel', 100);
        this.jsonFileName = sc.get(options, 'jsonFileName', 'attributes-per-level-'+this.currentDate+'.json');
        this.generateFolderPath = sc.get(options, 'generateFolderPath', 'generated');
    }

    async generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        // define scale factors for each monster type:
        for (let variationType of Object.keys(this.typesVariations)) {
            let factor = this.typesVariations[variationType];
            this.typeScaleFactors[variationType] = Math.random() * (factor.max - factor.min) + factor.min;
        }
        await this.fileHandler.createFolder(this.generateFolderPath);
        await this.fileHandler.writeFile(
            this.fileHandler.joinPaths(this.generateFolderPath, this.jsonFileName),
            JSON.stringify(this.generateMonstersData())
        );
        Logger.info('Data saved! Check the "generated" folder.');
    }

    generateMonstersData()
    {
        for (let level = 1; level <= this.maxLevel; level ++) {
            this.variations[level] = {};
            this.generateMonster(level);
        }
        return this.variations;
    }

    generateMonster(level)
    {
        let typesKeys = Object.keys(this.typeTemplates);
        for (let variationType of Object.keys(this.typesVariations)) {
            this.variations[level][variationType] = {};
            for (let typeKey of typesKeys) {
                this.variations[level][variationType][typeKey] = this.applyTemplate(typeKey, level, variationType);
            }
        }
    }

    applyTemplate(typeKey, level, variationType)
    {
        let base = this.templateBase;
        let result = {...base};
        let scaleTypeFactor = this.typeScaleFactors[variationType];
        let templatesProperties = Object.keys(this.typeTemplates[typeKey]);
        for (let key of templatesProperties) {
            let templateData = this.typeTemplates[typeKey][key];
            let scale = sc.isObject(templateData)
                ? sc.randomInteger(templateData.min, templateData.max) + templateData.min
                : templateData;
            result[key] = Math.round(base[key] * (1 + scale / 100) * (1 + level / scale) * scaleTypeFactor);
        }
        return result;
    }

}

module.exports.AttributesPerLevel = AttributesPerLevel;
