import type { Field } from 'payload'

/** The icon keys `apps/web/src/lib/diagram-icons.ts` draws; anything else falls back. */
export const DIAGRAM_ICONS = [
  'gauge',
  'meter',
  'flow',
  'valve',
  'tank',
  'transmitter',
  'cabinet',
  'cpu',
  'logger',
  'network',
  'gateway',
  'signal',
  'cloud',
  'phone',
  'screen',
  'dashboard',
  'motor',
  'pump',
  'machine',
  'robot',
  'conveyor',
  'sensor',
  'thermometer',
  'battery',
  'shield',
  'alert',
  'wrench',
  'cable',
  'database',
  'clipboard',
  'pipe',
  'building',
  'cog',
]

/** A line icon from the diagram set, picked by name. */
export const diagramIcon = (name = 'icon'): Field => ({
  name,
  type: 'select',
  options: DIAGRAM_ICONS,
})
