import * as migration_20260818_085319_initial from './20260818_085319_initial';

export const migrations = [
  {
    up: migration_20260818_085319_initial.up,
    down: migration_20260818_085319_initial.down,
    name: '20260818_085319_initial'
  },
];
