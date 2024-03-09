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
    decrementProportionPerLevel: {'5': 0.5, '10': 0.4, '15': 0.3, '20': 0.18, '25': 0.1, '30': 0}
});

monstersExperiencePerLevel.generate();
