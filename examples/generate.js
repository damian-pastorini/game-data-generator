/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { GameDataGenerator } = require('../lib/game-data-generator');
const { Logger } = require('@reldens/utils');

// @TODO - Implement.
const gameDataGenerator = new GameDataGenerator({});

gameDataGenerator.generate().catch((error) => {
    Logger.error(error);
}).then(() => {
    Logger.info('Data saved! Check the "generated" folder.');
});
