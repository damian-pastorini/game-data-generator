/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { MonsterAttributesPerLevel } = require('../lib/generator/monsters-attributes-per-level');

let monstersExperiencePerLevel = new MonsterAttributesPerLevel({
    monsterBase: {
        hp: 10,
        atk: 10,
        def: 10,
        speed: 10,
        mAtk: 10,
        mDef: 10,
        dodge: 10,
        aim: 10
    },
    typeTemplates: {
        melee: {
            hp: {min: 7, max: 20},
            atk: {min: 7, max: 20},
            def: {min: 7, max: 20},
            speed: {min: 1, max: 2},
            mAtk: {min: 1, max: 2},
            mDef: {min: 1, max: 2},
            dodge: {min: 1, max: 4},
            aim: {min: 1, max: 2}
        },
        mage: {
            hp: {min: 5, max: 10},
            atk: {min: 1, max: 2},
            def: {min: 1, max: 2},
            speed: {min: 1, max: 4},
            mAtk: {min: 7, max: 20},
            mDef: {min: 7, max: 20},
            dodge: {min: 1, max: 2},
            aim: {min: 5, max: 10}
        },
        archer: {
            hp: {min: 5, max: 10},
            atk: {min: 5, max: 10},
            def: {min: 1, max: 4},
            speed: {min: 5, max: 10},
            mAtk: {min: 1, max: 2},
            mDef: {min: 1, max: 2},
            dodge: {min: 7, max: 20},
            aim: {min: 7, max: 20}
        }
    },
    variationsScaleFactorsMinMax: {
        monsterA: {min: 1, max: 1.2},
        monsterB: {min: 1.2, max: 1.4},
        boss: {min: 1.5, max: 2.5}
    },
    monsterTypesVariations: ['monsterA', 'monsterB', 'boss']
});

monstersExperiencePerLevel.generate();
