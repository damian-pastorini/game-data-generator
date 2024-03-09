/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { PlayersExperiencePerLevel } = require('../lib/generator/players-experience-per-level');

const playersExperiencePerLevel = new PlayersExperiencePerLevel({
    startExp: 10, // experience required to reach level 2 from level 1
    baseGrowthFactor: 2, // initial growth per level
    baseGrowthFactorPerLevel: {'5': 1.5, '10': 1.35, '15': 1.271, '20': 1.1, '40': 1}, // growth factor per level
    maxLevel: 100, // how many levels
    growthIncrease: 0.005, // increase in growth factor per level
});

playersExperiencePerLevel.generate();
