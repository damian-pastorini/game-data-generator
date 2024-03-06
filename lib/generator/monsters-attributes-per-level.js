/**
 *
 * Reldens - Game Data Generator - MonsterAttributesPerLevel
 *
 */

const { MonsterAttributesPerLevelValidator } = require('../validator/monsters-attributes-per-level-validator');
const { GameDataGenerator } = require('./game-data-generator');
const { sc } = require('@reldens/utils');

class MonsterAttributesPerLevel extends GameDataGenerator
{

    constructor(props)
    {
        props = props || {};
        props.optionsValidator = new MonsterAttributesPerLevelValidator();
        super(props);
        this.typeScaleFactors = {};
        this.monsters = {};
    }

    setOptions(options)
    {
        // required:
        this.monsterBase = sc.get(options, 'monsterBase', false); // base attributes template
        this.typeTemplates = sc.get(options, 'typeTemplates', false); // m: melee, ma: mage, r: ranged
        this.monsterTypesVariations = sc.get(options, 'monsterTypesVariations', false); // monsterA, monsterB, boss
        this.variationsScaleFactorsMinMax = sc.get(options, 'variationsScaleFactorsMinMax', false);
        // optional:
        this.jsonFileName = sc.get(options, 'jsonFileName', 'players-experience-per-level-'+this.currentDate+'.json');
    }

    generate()
    {
        this.isReady = this.validate();
        if(!this.isReady){
            return false;
        }
        // define scale factors for each monster type:
        for (let monsterType of Object.keys(this.monsterTypesVariations)) {
            let factor = this.variationsScaleFactorsMinMax[monsterType];
            this.typeScaleFactors[monsterType] = Math.random() * (factor.max - factor.min) + factor.min;
        }
        this.fileHandler.writeFile(this.jsonFileName, JSON.stringify(this.generateMonstersData()));
        return true;
    }

    generateMonstersData()
    {
        for (let level = 1; level <= 100; level += (level === 1 ? 4 : 5)) {
            this.generateMonster(level);
        }
        return this.monsters;
    }

    generateMonster(level)
    {
        let typesKeys = Object.keys(this.typeTemplates);
        let monstersVariationsKeys = Object.keys(this.monsterTypesVariations);
        for (let monstersVariationsKey of monstersVariationsKeys) {
            let typeIndex = Math.floor(Math.random() * typesKeys.length);
            let monsterType = typesKeys[typeIndex];
            let template = this.typeTemplates[monstersVariationsKey];
            this.monsters[level][monsterType] = this.applyTemplate(this.monsterBase, template, level, monsterType);
        }
    }

    applyTemplate(base, template, level, monsterType)
    {
        const result = {...base, type: template.type};
        const scaleTypeFactor = this.typeScaleFactors[monsterType];
        let templatesKeys = Object.keys(template);
        for (let key of templatesKeys) {
            let range = template[key];
            let scale = Math.random() * (range.max - range.min) + range.min;
            result[key] = Math.round(base[key] * (1 + scale / 100) * (1 + level / 20) * scaleTypeFactor);
        }
        return result;
    }

}

module.exports.MonsterAttributesPerLevel = MonsterAttributesPerLevel;
