/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { PlayersExperiencePerLevel } = require('../lib/generator/players-experience-per-level');
const { Logger } = require('@reldens/utils');


const playersExperiencePerLevel = new PlayersExperiencePerLevel({
    startExp: 10, // experience required to reach level 2 from level 1
    baseGrowthFactor: 1.1, // initial growth per level
    maxLevel: 100, // maximum level you want to calculate up to
    growthIncrease: 0.01 // increase in growth factor per level
});

playersExperiencePerLevel.generate().catch((error) => {
    Logger.error(error);
}).then(() => {
    Logger.info('Data saved! Check the "generated" folder.');
});
