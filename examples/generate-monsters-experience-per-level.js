/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { MonstersExperiencePerLevel } = require('../lib/generator/monsters-experience-per-level');
const playerLevels = require('./players-experience-per-level.json');

const monstersExperiencePerLevel = new MonstersExperiencePerLevel({
    levelsExperienceByKey: playerLevels,
    variationsMinMax: {
        monsterA: {min: 0.07, max: 0.10}, // 7% - 10%
        monsterB: {min: 0.10, max: 0.13}, // 10% - 13%
        bossExtra: {min: 0, max: 0.5} // 0% - 50%
    },
    everyLevelsQuantity: 5
});

monstersExperiencePerLevel.generate();
