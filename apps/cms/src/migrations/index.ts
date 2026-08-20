import * as migration_20260818_085319_initial from './20260818_085319_initial';
import * as migration_20260819_151924_block_variants from './20260819_151924_block_variants';

export const migrations = [
  {
    up: migration_20260818_085319_initial.up,
    down: migration_20260818_085319_initial.down,
    name: '20260818_085319_initial',
  },
  {
    up: migration_20260819_151924_block_variants.up,
    down: migration_20260819_151924_block_variants.down,
    name: '20260819_151924_block_variants'
  },
];
