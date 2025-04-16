/**
 *
 * Reldens - Game Data Generator - Examples
 *
 */

const { AttributesPerLevel } = require('../lib/generator/attributes-per-level');

let attributesPerLevel = new AttributesPerLevel({
    templateBase: {
        hp: 10,
        mp: 10,
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
            hp: {min: 10, max: 20},
            mp: {min: 1, max: 5},
            atk: {min: 10, max: 20},
            def: {min: 10, max: 20},
            speed: {min: 1, max: 2},
            mAtk: {min: 1, max: 2},
            mDef: {min: 1, max: 2},
            dodge: {min: 1, max: 4},
            aim: {min: 1, max: 2}
        },
        mage: {
            hp: {min: 5, max: 10},
            mp: {min: 10, max: 20},
            atk: {min: 1, max: 2},
            def: {min: 1, max: 2},
            speed: {min: 1, max: 4},
            mAtk: {min: 10, max: 20},
            mDef: {min: 10, max: 20},
            dodge: {min: 1, max: 2},
            aim: {min: 5, max: 10}
        },
        archer: {
            hp: {min: 5, max: 10},
            mp: {min: 5, max: 10},
            atk: {min: 5, max: 10},
            def: {min: 1, max: 4},
            speed: {min: 5, max: 10},
            mAtk: {min: 1, max: 2},
            mDef: {min: 1, max: 2},
            dodge: {min: 7, max: 20},
            aim: {min: 7, max: 20}
        }
    },
    typesVariations: {
        monsterA: {min: 1, max: 1.5},
        monsterB: {min: 1.5, max: 1.8},
        boss: {min: 2.5, max: 3.5}
    }
});

attributesPerLevel.generate();
