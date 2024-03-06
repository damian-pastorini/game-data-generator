const fs = require('fs');

const levels = require('./zephyros-players-experience-per-level.json');

// Adjusted variations for MonsterA and MonsterB
const minVariationA = 0.07; // 7%
const maxVariationA = 0.10; // 10%
const minVariationB = 0.10; // 10%
const maxVariationB = 0.13; // 13%
const bossExtra = 0.05; // Additional percentage for boss

const filteredLevels = {}; // To store only the levels that are multiples of 5

const getRandomVariation = (min, max) => Math.random() * (max - min) + min;

Object.keys(levels).forEach(level => {
    const levelNum = parseInt(level, 10);
    if (levelNum === 1 || levelNum % 5 === 0) { // Process only levels that are multiples of 5
        const reqExp = levels[level].req;

        const monsterAExp = Math.round(reqExp * getRandomVariation(minVariationA, maxVariationA));
        const monsterBExp = Math.round(reqExp * getRandomVariation(minVariationB, maxVariationB));
        const bossExp = Math.round(reqExp * (maxVariationB + getRandomVariation(0, bossExtra)));

        const monsterAKills = Math.ceil(reqExp / monsterAExp);
        const monsterBKills = Math.ceil(reqExp / monsterBExp);
        const bossKills = Math.ceil(reqExp / bossExp);

        filteredLevels[level] = {
            monsterA: { exp: monsterAExp, kills: monsterAKills },
            monsterB: { exp: monsterBExp, kills: monsterBKills },
            boss: { exp: bossExp, kills: bossKills },
            req: reqExp,
            total: levels[level].total
        };
    }
});

// console.log(levels);

fs.writeFile('zephyros-monsters-experience-per-level.json', JSON.stringify(filteredLevels), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data written to file successfully.');
    }
});
