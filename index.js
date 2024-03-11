/**
 *
 * Reldens - Game Data Generator
 *
 */

const { PlayersExperiencePerLevel } = require('./lib/generator/players-experience-per-level');
const { MonstersExperiencePerLevel } = require('./lib/generator/monsters-experience-per-level');
const { MonsterAttributesPerLevel } = require('./lib/generator/monsters-attributes-per-level');

module.exports = {
    PlayersExperiencePerLevel,
    MonstersExperiencePerLevel,
    MonsterAttributesPerLevel
};
