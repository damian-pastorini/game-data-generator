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
        monsterA: 8,
        monsterB: 12,
        bossExtra: 25
    },
    decrementProportionPerLevel: {'5': 0.5, '10': 0.3, '15': 0.2, '20': 0.1, '40': 0.05},
    decrementProportionDivisor: 0.1,
    everyLevelsQuantity: 1
});

monstersExperiencePerLevel.generate();
