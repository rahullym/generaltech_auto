import * as migration_20260818_085319_initial from './20260818_085319_initial';
import * as migration_20260819_151924_block_variants from './20260819_151924_block_variants';
import * as migration_20260820_023215_industries_blocks from './20260820_023215_industries_blocks';
import * as migration_20260905_074435_page_blocks from './20260905_074435_page_blocks';

export const migrations = [
  {
    up: migration_20260818_085319_initial.up,
    down: migration_20260818_085319_initial.down,
    name: '20260818_085319_initial',
  },
  {
    up: migration_20260819_151924_block_variants.up,
    down: migration_20260819_151924_block_variants.down,
    name: '20260819_151924_block_variants',
  },
  {
    up: migration_20260820_023215_industries_blocks.up,
    down: migration_20260820_023215_industries_blocks.down,
    name: '20260820_023215_industries_blocks',
  },
  {
    up: migration_20260905_074435_page_blocks.up,
    down: migration_20260905_074435_page_blocks.down,
    name: '20260905_074435_page_blocks'
  },
];
