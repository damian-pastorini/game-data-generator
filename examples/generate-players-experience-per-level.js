/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { PlayersExperiencePerLevel } = require('../lib/generator/players-experience-per-level');
const { Logger } = require('@reldens/utils');


const playersExperiencePerLevel = new PlayersExperiencePerLevel({});

playersExperiencePerLevel.generate().catch((error) => {
    Logger.error(error);
}).then(() => {
    Logger.info('Data saved! Check the "generated" folder.');
});
