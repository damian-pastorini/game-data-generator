/**
 *
 * Reldens - Game Data Generator
 *
 */

const { PlayersExperiencePerLevel } = require('./lib/generator/players-experience-per-level');
const { MonstersExperiencePerLevel } = require('./lib/generator/monsters-experience-per-level');
const { AttributesPerLevel } = require('./lib/generator/attributes-per-level');

module.exports = {
    PlayersExperiencePerLevel,
    MonstersExperiencePerLevel,
    AttributesPerLevel
};
