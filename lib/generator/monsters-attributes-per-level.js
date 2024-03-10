/**
 *
 * Reldens - Game Data Generator - MonsterAttributesPerLevel
 *
 */

const { MonstersAttributesPerLevelValidator } = require('../validator/monsters-attributes-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { sc, Logger} = require('@reldens/utils');

class MonsterAttributesPerLevel extends GameDataGenerator
{

    constructor(props)
    {
        super();
        this.optionsValidator = new MonstersAttributesPerLevelValidator();
        this.typeScaleFactors = {};
        this.monsters = {};
        this.setReady(props);
    }

    setOptions(options)
    {
        // required:
        this.monsterBase = sc.get(options, 'monsterBase', false);
        this.typeTemplates = sc.get(options, 'typeTemplates', false);
        this.monsterTypesVariations = sc.get(options, 'monsterTypesVariations', false);
        this.variationsScaleFactorsMinMax = sc.get(options, 'variationsScaleFactorsMinMax', false);
        // optional:
        this.jsonFileName = sc.get(options, 'jsonFileName', 'monsters-attributes-per-level-'+this.currentDate+'.json');
        this.generateFolderPath = sc.get(options, 'generateFolderPath', 'generated');
    }

    async generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        // define scale factors for each monster type:
        for (let monsterType of this.monsterTypesVariations) {
            let factor = this.variationsScaleFactorsMinMax[monsterType];
            this.typeScaleFactors[monsterType] = Math.random() * (factor.max - factor.min) + factor.min;
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
        for (let level = 1; level <= 100; level ++) {
            this.monsters[level] = {};
            this.generateMonster(level);
        }
        return this.monsters;
    }

    generateMonster(level)
    {
        let typesKeys = Object.keys(this.typeTemplates);
        for (let monstersType of this.monsterTypesVariations) {
            this.monsters[level][monstersType] = {};
            for (let typeKey of typesKeys) {
                this.monsters[level][monstersType][typeKey] = this.applyTemplate(typeKey, level, monstersType);
            }
        }
    }

    applyTemplate(typeKey, level, monsterType)
    {
        let base = this.monsterBase;
        let result = {...base};
        let scaleTypeFactor = this.typeScaleFactors[monsterType];
        let templatesProperties = Object.keys(this.typeTemplates[typeKey]);
        for (let key of templatesProperties) {
            let range = this.typeTemplates[typeKey][key];
            let scale = Math.random() * (range.max - range.min) + range.min;
            result[key] = Math.round(base[key] * (1 + scale / 100) * (1 + level / 20) * scaleTypeFactor);
        }
        return result;
    }

}

module.exports.MonsterAttributesPerLevel = MonsterAttributesPerLevel;
