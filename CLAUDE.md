## Package Overview

**@reldens/game-data-generator** is a game data generation package for Reldens. It provides utilities to generate balanced game data for RPG systems including:
- Player experience progression curves
- Monster/NPC experience reward tables
- Character attributes and stats scaling per level
- Configurable generation with validation
- JSON output for easy integration

## Key Commands

```bash
# Install dependencies
npm install

# Run tests (if configured)
npm test
```

## Architecture

### Core Classes

**GameDataGenerator** (lib/generator/game-data-generator.js):
- Abstract base class for all generators
- Handles options validation through validators
- Manages file output using FileHandler
- Provides timestamped file naming
- Core methods: `setReady()`, `setOptions()`, `validate()`, `generate()`

**PlayersExperiencePerLevel** (lib/generator/players-experience-per-level.js):
- Generates player level progression data
- Calculates experience requirements per level
- Supports dynamic growth factors
- Required options: `startExp`, `baseGrowthFactor`, `maxLevel`
- Optional: `growthIncrease`, `baseGrowthFactorPerLevel`, `jsonFileName`, `generateFolderPath`
- Output includes: required exp, total exp, growth factor per level

**MonstersExperiencePerLevel** (lib/generator/monsters-experience-per-level.js):
- Generates monster/enemy experience reward tables
- Supports multiple variations (weak, normal, strong, etc.)
- Validates experience progression to prevent decreasing values
- Required options: `levelsExperienceByKey`, `variations`, `decrementProportionPerLevel`
- Optional: `jsonFileName`, `generateFolderPath`
- Output includes: exp per kill, kills required, variation factors

**AttributesPerLevel** (lib/generator/attributes-per-level.js):
- Generates character stats/attributes per level
- Supports multiple entity types with templates
- Applies scaling factors and variations
- Required options: `templateBase`, `typeTemplates`, `typesVariations`
- Optional: `setBaseAsInitialLevel`, `maxLevel`, `typeScaleFactorRandom`, `scaleDivisor`, `levelDivisor`, `jsonFileName`, `generateFolderPath`
- Output includes: stats by variation and level

### Validators

**PlayersExperiencePerLevelValidator** (lib/validator/players-experience-per-level-validator.js):
- Validates `startExp`, `baseGrowthFactor`, `maxLevel` are provided

**MonstersExperiencePerLevelValidator** (lib/validator/monsters-experience-per-level-validator.js):
- Validates `levelsExperienceByKey`, `variations`, `decrementProportionPerLevel` are provided

**AttributesPerLevelValidator** (lib/validator/attributes-per-level-validator.js):
- Validates `templateBase`, `typeTemplates`, `typesVariations` are provided

## Usage Pattern

```javascript
const { PlayersExperiencePerLevel } = require('@reldens/game-data-generator');

let generator = new PlayersExperiencePerLevel({
    startExp: 100,
    baseGrowthFactor: 1.15,
    maxLevel: 100
});

generator.generate();
```

## Dependencies

- `@reldens/utils`: Provides Logger and sc (Shortcuts) for safe property access
- `@reldens/server-utils`: Provides FileHandler for file operations

## Important Notes

- All generators validate options before execution
- Generated files are timestamped to avoid overwriting
- Output folder defaults to `generated` in current directory
- All generators use FileHandler for safe file operations
- Logging uses Logger from @reldens/utils
- Property access uses sc.get() for safe defaults
- Follows Reldens coding standards (no else, Yoda conditions, let over const, etc.)
