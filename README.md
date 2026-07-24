[![Reldens - GitHub - Release](https://www.dwdeveloper.com/media/reldens/reldens-mmorpg-platform.png)](https://github.com/damian-pastorini/reldens)

# Reldens - Game Data Generator

A comprehensive tool to generate balanced game data for RPG systems, including player progression, monster rewards, and attribute scaling.

## Features

- Player experience curve generation with dynamic growth factors
- Monster/NPC experience reward tables with variations
- Character attributes and stats scaling per level
- Configurable templates and variations
- JSON output for easy integration
- Validation of all generator options
- Timestamped output files to prevent overwriting

## Installation

```bash
npm install @reldens/game-data-generator
```

## Usage

### PlayersExperiencePerLevel

Generates player level progression data with experience requirements.

```javascript
const { PlayersExperiencePerLevel } = require('@reldens/game-data-generator');

let generator = new PlayersExperiencePerLevel({
    startExp: 100,
    baseGrowthFactor: 1.15,
    maxLevel: 100,
    growthIncrease: 0.01,
    jsonFileName: 'player-levels.json',
    generateFolderPath: 'generated'
});

generator.generate();
```

**Required Options:**
- `startExp`: Experience required to reach level 2 from level 1
- `baseGrowthFactor`: Initial growth factor per level (e.g., 1.15 = 15% increase)
- `maxLevel`: Maximum level to calculate

**Optional Options:**
- `growthIncrease`: Increase in growth factor per level (default: 0)
- `baseGrowthFactorPerLevel`: Object with specific growth factors per level
- `jsonFileName`: Output filename (default: auto-generated with timestamp)
- `generateFolderPath`: Output folder path (default: 'generated')

**Output Format:**
```json
{
    "1": {"req": 100, "total": 100, "growthFactor": 1.15},
    "2": {"diff": 15, "req": 115, "total": 215, "growthFactor": 1.16},
    ...
}
```

### MonstersExperiencePerLevel

Generates monster/enemy experience reward tables with variations.

```javascript
const { MonstersExperiencePerLevel } = require('@reldens/game-data-generator');

let generator = new MonstersExperiencePerLevel({
    levelsExperienceByKey: {
        "1": {"req": 100},
        "2": {"req": 115},
        ...
    },
    variations: {
        "weak": 0.5,
        "normal": 1.0,
        "strong": 1.5
    },
    decrementProportionPerLevel: {
        "1": 0.1,
        "2": 0.12,
        ...
    },
    jsonFileName: 'monster-rewards.json',
    generateFolderPath: 'generated'
});

generator.generate();
```

**Required Options:**
- `levelsExperienceByKey`: Object with experience requirements per level
- `variations`: Object with variation multipliers (e.g., weak, normal, strong)
- `decrementProportionPerLevel`: Object with decrement proportions per level

**Optional Options:**
- `jsonFileName`: Output filename (default: auto-generated with timestamp)
- `generateFolderPath`: Output folder path (default: 'generated')

**Output Format:**
```json
{
    "1": {
        "req": 100,
        "weak": {"decrementProportion": 0.1, "randomVariation": 0.5, "exp": 50, "kills": 2},
        "normal": {"decrementProportion": 0.1, "randomVariation": 1.0, "exp": 100, "kills": 1}
    },
    ...
}
```

### AttributesPerLevel

Generates character stats/attributes per level with type templates and variations.

```javascript
const { AttributesPerLevel } = require('@reldens/game-data-generator');

let generator = new AttributesPerLevel({
    templateBase: {
        "hp": 100,
        "mp": 50,
        "atk": 10,
        "def": 8
    },
    typeTemplates: {
        "warrior": {
            "hp": 2.0,
            "atk": 1.5,
            "def": 1.8
        },
        "mage": {
            "mp": 2.5,
            "atk": 1.2,
            "def": 0.8
        }
    },
    typesVariations: {
        "common": {"min": 0.8, "max": 1.0},
        "rare": {"min": 1.2, "max": 1.5}
    },
    maxLevel: 50,
    setBaseAsInitialLevel: true,
    jsonFileName: 'attributes.json',
    generateFolderPath: 'generated'
});

generator.generate();
```

**Required Options:**
- `templateBase`: Base stats object with initial values
- `typeTemplates`: Object with stat multipliers per entity type
- `typesVariations`: Object with variation ranges (min/max)

**Optional Options:**
- `setBaseAsInitialLevel`: Use base stats for level 1 (default: false)
- `maxLevel`: Maximum level to generate (default: 100)
- `typeScaleFactorRandom`: Random seed for scaling (default: Math.random())
- `scaleDivisor`: Divisor for scale calculation (default: 10)
- `levelDivisor`: Divisor for level calculation (default: 10)
- `jsonFileName`: Output filename (default: auto-generated with timestamp)
- `generateFolderPath`: Output folder path (default: 'generated')

**Output Format:**
```json
{
    "statsByVariation": {
        "common": {
            "1": {"hp": 100, "mp": 50, "atk": 10, "def": 8},
            "2": {"hp": 112, "mp": 56, "atk": 11, "def": 9},
            ...
        },
        "rare": {
            ...
        }
    },
    "typeScaleFactorRandom": 0.6234567
}
```

## API Reference

### GameDataGenerator (Base Class)

Base class for all generators. Not used directly.

**Methods:**
- `setReady(props)`: Initializes generator with options and validates
- `setOptions(options)`: Sets generator options (implemented by subclasses)
- `validate()`: Validates options using validator
- `generate()`: Generates data and saves to file (implemented by subclasses)

**Properties:**
- `currentDate`: Timestamp for file naming
- `optionsValidator`: Validator instance
- `fileHandler`: FileHandler from @reldens/server-utils
- `isReady`: Boolean indicating if generator is ready

### Validators

Each generator has a corresponding validator that checks required options:

- `PlayersExperiencePerLevelValidator`
- `MonstersExperiencePerLevelValidator`
- `AttributesPerLevelValidator`

All validators have a `validate(options)` method that returns `true` if valid, `false` otherwise.

## Dependencies

- `@reldens/utils`: Logger and Shortcuts utilities
- `@reldens/server-utils`: FileHandler for file operations

## Output

All generators save JSON files to the `generated` folder by default. Files are timestamped to prevent overwriting previous generations.

Example output filename: `players-experience-per-level-2025-11-20-14-30-45.json`

## Documentation

[https://www.reldens.com/documentation/game-data-generator/](https://www.reldens.com/documentation/game-data-generator/)

## Need a Feature?

[Request a feature here: https://www.reldens.com/features-request](https://www.reldens.com/features-request)

---

### [Reldens](https://github.com/damian-pastorini/reldens/ "Reldens")

##### [By DwDeveloper](https://www.dwdeveloper.com/ "DwDeveloper")
