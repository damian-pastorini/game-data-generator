/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { MonstersExperiencePerLevel } = require('../lib/generator/monsters-experience-per-level');
const playerLevels = require('./players-experience-per-level.json');

const monstersExperiencePerLevel = new MonstersExperiencePerLevel({
    levelsExperienceByKey: playerLevels,
    variations: {
        monsterA: 8,
        monsterB: 12,
        bossExtra: 25
    },
    decrementProportionPerLevel: {
        '5': 0.8,
        '10': 0.42,
        '15': 0.4,
        '20': 0.26,
        '25': 0.15,
        '30': 0.1,
        '35': 0.08,
        '40': 0.0025
    }
});

monstersExperiencePerLevel.generate();
