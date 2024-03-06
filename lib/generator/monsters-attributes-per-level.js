const fs = require('fs');

const monsterBase = {
    type: null,
    hp: 10,
    atk: 10,
    def: 10,
    speed: 10,
    mAtk: 10,
    mDef: 10,
    dodge: 10,
    aim: 10
};

const templates = {
    m: {
        hp: {min: 7, max: 20},
        atk: {min: 7, max: 20},
        def: {min: 7, max: 20},
        speed: {min: 1, max: 2},
        mAtk: {min: 1, max: 2},
        mDef: {min: 1, max: 2},
        dodge: {min: 1, max: 4},
        aim: {min: 1, max: 2}
    },
    ma: {
        hp: {min: 5, max: 10},
        atk: {min: 1, max: 2},
        def: {min: 1, max: 2},
        speed: {min: 1, max: 4},
        mAtk: {min: 7, max: 20},
        mDef: {min: 7, max: 20},
        dodge: {min: 1, max: 2},
        aim: {min: 5, max: 10}
    },
    a: {
        hp: {min: 5, max: 10},
        atk: {min: 5, max: 10},
        def: {min: 1, max: 4},
        speed: {min: 5, max: 10},
        mAtk: {min: 1, max: 2},
        mDef: {min: 1, max: 2},
        dodge: {min: 7, max: 20},
        aim: {min: 7, max: 20}
    }
};

let monsters = {};

function applyTemplate(base, template, level, monsterType) {
    const result = {...base, type: template.type};
    // Define scale factors for each monster type
    const typeScaleFactors = {
        a: Math.random() * (1.2 - 1) + 1, // Random between 1 and 1.2
        b: Math.random() * (1.4 - 1.2) + 1.2, // Random between 1.2 and 1.4
        bs: Math.random() * (2.5 - 1.5) + 1.5 // Random between 1.5 and 2.5
    };
    const scaleTypeFactor = typeScaleFactors[monsterType];

    Object.keys(template).forEach(key => {
        if (key !== 'type') {
            const range = template[key];
            const scale = Math.random() * (range.max - range.min) + range.min;
            result[key] = Math.round(base[key] * (1 + scale / 100) * (1 + level / 20) * scaleTypeFactor);
        }
    });
    return result;
}

function generateMonster(level) {
    const types = ['m', 'ma', 'a'];
    const monsterTypes = ['a', 'b', 'bs']; // Added for clarity
    monsterTypes.forEach(monsterType => {
        const typeIndex = Math.floor(Math.random() * types.length);
        const type = types[typeIndex];
        const template = templates[type];
        monsters[level][monsterType] = applyTemplate(monsterBase, template, level, monsterType);
    });
}

for (let level = 1; level <= 100; level += (level === 1 ? 4 : 5)) {
    monsters[level] = {};
    generateMonster(level);
}

// console.log(JSON.stringify(monsters, null, 2));

fs.writeFile('zephyros-monsters-attributes-increments-per-level.json', JSON.stringify(monsters), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data written to file successfully.');
    }
});
