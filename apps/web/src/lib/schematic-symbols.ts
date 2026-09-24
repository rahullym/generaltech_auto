/**
 * The drawing kit for a process schematic: equipment, the media that run
 * between it, and the pipework itself.
 *
 * The page lays a plant out the way an instrument maker's application sheet
 * does — vessels drawn in shaded steel, pipes coloured by what they carry,
 * and a lettered bubble on a leader line wherever something is measured. Every
 * piece of equipment is drawn from its box (`x`, `y`, `w`, `h`) so a layout can
 * size a tank to the story rather than to a fixed icon.
 *
 * Gradients are referenced by id (`metal`, `metal-v`, `liq-<medium>`) and are
 * defined once per drawing by Schematic.astro, which also prefixes them so two
 * drawings on one page cannot collide; `ref()` builds those references.
 */

export interface Medium {
  pipe: string
  edge: string
  /** Top and bottom of the liquid in a vessel, where the medium is a liquid. */
  liquid?: [string, string]
}

export const MEDIA: Record<string, Medium> = {
  product: { pipe: '#f1d07e', edge: '#c9a24c', liquid: ['#f7dc98', '#e59a2e'] },
  steam: { pipe: '#f2c3ab', edge: '#cf9476' },
  condensate: { pipe: '#bcd6ec', edge: '#88aac8' },
  water: { pipe: '#9fcaeb', edge: '#6c9fc7', liquid: ['#c3e0f5', '#6ea5d3'] },
  'hot-water': { pipe: '#f3bba3', edge: '#d18c72', liquid: ['#f8d3c2', '#e39576'] },
  air: { pipe: '#dde6ed', edge: '#a9bac8' },
  'compressed-air': { pipe: '#93bde3', edge: '#5f8fbe' },
  chemical: { pipe: '#bcdd9d', edge: '#87b667', liquid: ['#d5edc1', '#89bf5f'] },
  gas: { pipe: '#dac9ec', edge: '#a893c6' },
  refrigerant: { pipe: '#a9ddd7', edge: '#6fb3ab' },
  wastewater: { pipe: '#c9bfa6', edge: '#9c8f70', liquid: ['#ddd4bf', '#a89770'] },
  fuel: { pipe: '#e8b77a', edge: '#b9894a', liquid: ['#f1cf9e', '#c98a3c'] },
}

export const medium = (name?: string): Medium => MEDIA[name ?? ''] ?? MEDIA.water!

export interface Equipment {
  kind: string
  x: number
  y: number
  w: number
  h: number
  /** Vertical tanks: the head and the bottom. */
  top?: 'dome' | 'cone' | 'flat'
  bottom?: 'cone' | 'dish' | 'flat'
  /** Box: what is drawn on its face. */
  detail?: string
  /** 0–1: how full a vessel is drawn, in its `medium`. */
  fill?: number
  medium?: string
  /** Drawn in red: something the work adds, rather than what is already there. */
  fitted?: boolean
  /** Mirror left to right (pumps, motors, chutes). */
  flip?: boolean
}

type Ref = (id: string) => string

const f = (n: number) => Math.round(n * 10) / 10

/** A closed outline, filled with steel, with its liquid clipped inside it. */
const shell = (id: string, outline: string, e: Equipment, ref: Ref, gradient = 'metal') => {
  const level =
    e.fill && e.medium
      ? `<clipPath id="${id}"><path d="${outline}"/></clipPath>
         <rect clip-path="url(#${id})" x="${e.x - 2}" y="${f(e.y + e.h * (1 - e.fill))}" width="${e.w + 4}" height="${f(e.h * e.fill + 2)}" fill="${ref(`liq-${e.medium}`)}"/>
         <path d="M${e.x} ${f(e.y + e.h * (1 - e.fill))}h${e.w}" clip-path="url(#${id})" class="e-surface"/>`
      : ''
  return `<path d="${outline}" fill="${ref(gradient)}"/>${level}<path d="${outline}" class="e-edge"/>`
}

const tank = (id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const ht = e.top === 'flat' ? 0 : e.top === 'cone' ? w * 0.32 : w * 0.16
  const hb = e.bottom === 'flat' ? 0 : e.bottom === 'dish' ? w * 0.16 : w * 0.5
  const head =
    e.top === 'flat'
      ? `M${x} ${y}H${x + w}`
      : e.top === 'cone'
        ? `M${x} ${f(y + ht)}L${f(x + w * 0.42)} ${y}H${f(x + w * 0.58)}L${x + w} ${f(y + ht)}`
        : `M${x} ${f(y + ht)}A${f(w / 2)} ${f(ht)} 0 0 1 ${x + w} ${f(y + ht)}`
  const foot =
    e.bottom === 'flat'
      ? `V${y + h}H${x}Z`
      : e.bottom === 'dish'
        ? `V${f(y + h - hb)}A${f(w / 2)} ${f(hb)} 0 0 1 ${x} ${f(y + h - hb)}Z`
        : `V${f(y + h - hb)}L${f(x + w * 0.56)} ${y + h}H${f(x + w * 0.44)}L${x} ${f(y + h - hb)}Z`
  return shell(id, head + foot, e, ref)
}

const htank = (id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const r = h / 2
  const outline = `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  const saddle = (sx: number) =>
    `<path d="M${f(sx - 14)} ${f(y + h + 14)}L${f(sx - 8)} ${f(y + h - 6)}H${f(sx + 8)}L${f(sx + 14)} ${f(y + h + 14)}Z" class="e-dark"/>`
  return saddle(x + w * 0.25) + saddle(x + w * 0.75) + shell(id, outline, e, ref, 'metal-v')
}

const hood = (id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const body = y + h * 0.42
  const chimney = `<rect x="${f(x + w * 0.44)}" y="${y}" width="${f(w * 0.12)}" height="${f(h * 0.16)}" fill="${ref('metal')}" class="e-edge"/>`
  const cone = `<path d="M${x - 6} ${f(body)}L${f(x + w * 0.4)} ${f(y + h * 0.15)}H${f(x + w * 0.6)}L${x + w + 6} ${f(body)}Z" fill="${ref('metal')}" class="e-edge"/>`
  const vessel = `M${x} ${f(body)}H${x + w}V${f(y + h - 10)}Q${x + w} ${y + h} ${x + w - 10} ${y + h}H${x + 10}Q${x} ${y + h} ${x} ${f(y + h - 10)}Z`
  return chimney + shell(id, vessel, e, ref) + cone
}

/** Faces for a box: what turns a steel rectangle into a particular machine. */
const face = (e: Equipment) => {
  const { x, y, w, h } = e
  const cx = x + w / 2
  switch (e.detail) {
    case 'fan': {
      const r = Math.min(w, h) * 0.3
      const gx = x + w * 0.34
      const gy = y + h * 0.54
      return `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(r)}" class="e-panel"/>
        <path d="M${f(gx - r)} ${f(gy)}h${f(2 * r)}M${f(gx)} ${f(gy - r)}v${f(2 * r)}M${f(gx - r * 0.7)} ${f(gy - r * 0.7)}l${f(r * 1.4)} ${f(r * 1.4)}M${f(gx - r * 0.7)} ${f(gy + r * 0.7)}l${f(r * 1.4)} ${f(-r * 1.4)}" class="e-line"/>
        <rect x="${f(x + w * 0.66)}" y="${f(y + h * 0.16)}" width="${f(w * 0.24)}" height="${f(h * 0.2)}" rx="2" class="e-screen"/>
        <path d="M${f(x + w * 0.66)} ${f(y + h * 0.56)}h${f(w * 0.24)}M${f(x + w * 0.66)} ${f(y + h * 0.66)}h${f(w * 0.24)}M${f(x + w * 0.66)} ${f(y + h * 0.76)}h${f(w * 0.24)}" class="e-line"/>`
    }
    case 'louvre': {
      const rows = [0.12, 0.2, 0.28, 0.36]
        .map((t) => `M${f(x + w * 0.14)} ${f(y + h * t)}h${f(w * 0.72)}`)
        .join('')
      return `<path d="${rows}" class="e-line"/><rect x="${f(cx - w * 0.2)}" y="${f(y + h * 0.56)}" width="${f(w * 0.4)}" height="${f(h * 0.14)}" rx="2" class="e-screen"/>`
    }
    case 'screen':
      return `<rect x="${f(x + w * 0.16)}" y="${f(y + h * 0.1)}" width="${f(w * 0.68)}" height="${f(h * 0.24)}" rx="2" class="e-screen"/>
        <path d="M${f(x + w * 0.22)} ${f(y + h * 0.28)}l${f(w * 0.12)} ${f(-h * 0.08)} ${f(w * 0.1)} ${f(h * 0.04)} ${f(w * 0.14)} ${f(-h * 0.1)} ${f(w * 0.12)} ${f(h * 0.05)}" class="e-trend"/>
        <circle cx="${f(cx - w * 0.2)}" cy="${f(y + h * 0.44)}" r="4" class="e-lamp"/><circle cx="${f(cx)}" cy="${f(y + h * 0.44)}" r="4" class="e-lamp"/><circle cx="${f(cx + w * 0.2)}" cy="${f(y + h * 0.44)}" r="4" class="e-lamp"/>
        <path d="M${f(x + w * 0.5)} ${f(y + h * 0.54)}V${f(y + h * 0.96)}" class="e-seam"/>`
    case 'doors': {
      const n = Math.max(2, Math.round(w / 55))
      let s = ''
      for (let i = 1; i < n; i++) s += `M${f(x + (w / n) * i)} ${y}V${y + h}`
      let b = ''
      for (let i = 0; i < n; i++)
        for (let j = 0; j < 3; j++)
          b += `<rect x="${f(x + (w / n) * i + (w / n) * 0.22)}" y="${f(y + h * (0.12 + j * 0.16))}" width="${f((w / n) * 0.56)}" height="${f(h * 0.08)}" rx="1.5" class="e-panel"/>`
      return `<path d="${s}" class="e-seam"/>${b}`
    }
    case 'keypad':
      return `<rect x="${f(x + w * 0.2)}" y="${f(y + h * 0.12)}" width="${f(w * 0.6)}" height="${f(h * 0.2)}" rx="2" class="e-screen"/>
        <path d="M${f(x + w * 0.2)} ${f(y + h * 0.5)}h${f(w * 0.6)}M${f(x + w * 0.2)} ${f(y + h * 0.62)}h${f(w * 0.6)}M${f(x + w * 0.2)} ${f(y + h * 0.74)}h${f(w * 0.6)}" class="e-line"/>`
    case 'flame':
      return `<rect x="${f(x + w * 0.16)}" y="${f(y + h * 0.18)}" width="${f(w * 0.68)}" height="${f(h * 0.62)}" rx="3" class="e-hot"/>
        <path d="M${f(cx - w * 0.16)} ${f(y + h * 0.74)}q${f(-w * 0.06)} ${f(-h * 0.14)} 0 ${f(-h * 0.26)}q${f(w * 0.04)} ${f(h * 0.1)} ${f(w * 0.08)} ${f(h * 0.05)}q0 ${f(-h * 0.12)} ${f(w * 0.08)} ${f(-h * 0.2)}q${f(w * 0.12)} ${f(h * 0.16)} ${f(w * 0.06)} ${f(h * 0.3)}q${f(w * 0.06)} 0 ${f(w * 0.08)} ${f(-h * 0.08)}q${f(w * 0.06)} ${f(h * 0.12)} ${f(-w * 0.02)} ${f(h * 0.2)}Z" class="e-flame"/>`
    case 'window':
      return `<rect x="${f(x + w * 0.1)}" y="${f(y + h * 0.12)}" width="${f(w * 0.52)}" height="${f(h * 0.5)}" rx="3" class="e-glass"/>
        <path d="M${f(x + w * 0.22)} ${f(y + h * 0.5)}l${f(w * 0.12)} ${f(-h * 0.24)}M${f(x + w * 0.32)} ${f(y + h * 0.54)}l${f(w * 0.12)} ${f(-h * 0.24)}" class="e-shine"/>
        <rect x="${f(x + w * 0.7)}" y="${f(y + h * 0.12)}" width="${f(w * 0.2)}" height="${f(h * 0.36)}" rx="2" class="e-screen"/>`
    case 'fins': {
      let s = ''
      for (let i = 0; i < 6; i++) s += `M${f(x + w * (0.14 + i * 0.145))} ${f(y + h * 0.2)}V${f(y + h * 0.9)}`
      return `<path d="${s}" class="e-line"/>
        <rect x="${f(x + w * 0.2)}" y="${f(y - h * 0.16)}" width="${f(w * 0.1)}" height="${f(h * 0.16)}" class="e-panel"/><rect x="${f(cx - w * 0.05)}" y="${f(y - h * 0.2)}" width="${f(w * 0.1)}" height="${f(h * 0.2)}" class="e-panel"/><rect x="${f(x + w * 0.7)}" y="${f(y - h * 0.16)}" width="${f(w * 0.1)}" height="${f(h * 0.16)}" class="e-panel"/>`
    }
    case 'coldroom':
      return `<rect x="${f(x + w * 0.1)}" y="${f(y + h * 0.3)}" width="${f(w * 0.32)}" height="${f(h * 0.7)}" class="e-panel"/>
        <rect x="${f(x + w * 0.52)}" y="${f(y + h * 0.1)}" width="${f(w * 0.4)}" height="${f(h * 0.16)}" rx="3" class="e-panel"/>
        <circle cx="${f(x + w * 0.62)}" cy="${f(y + h * 0.18)}" r="${f(h * 0.05)}" class="e-line"/><circle cx="${f(x + w * 0.82)}" cy="${f(y + h * 0.18)}" r="${f(h * 0.05)}" class="e-line"/>
        <path d="M${f(x + w * 0.72)} ${f(y + h * 0.42)}v${f(h * 0.2)}M${f(x + w * 0.63)} ${f(y + h * 0.52)}h${f(w * 0.18)}M${f(x + w * 0.66)} ${f(y + h * 0.45)}l${f(w * 0.12)} ${f(h * 0.14)}M${f(x + w * 0.66)} ${f(y + h * 0.59)}l${f(w * 0.12)} ${f(-h * 0.14)}" class="e-cold"/>`
    default:
      return ''
  }
}

const box = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const plinth = `<rect x="${x - 4}" y="${y + h}" width="${w + 8}" height="7" rx="1.5" class="e-dark"/>`
  return `${plinth}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${ref('metal')}" class="e-edge"/>${face(e)}`
}

const pump = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const r = Math.min(h * 0.42, w * 0.24)
  const vx = x + r + 2
  const vy = y + h - r - 8
  const out = `<rect x="${f(vx - r * 0.35)}" y="${y}" width="${f(r * 0.7)}" height="${f(vy - y)}" fill="${ref('metal')}" class="e-edge"/>`
  const motor = `<rect x="${f(vx + r * 0.8)}" y="${f(vy - r * 0.62)}" width="${f(x + w - vx - r * 0.8)}" height="${f(r * 1.24)}" rx="5" fill="${ref('metal-v')}" class="e-edge"/>`
  let fins = ''
  for (let i = 1; i < 5; i++) fins += `M${f(vx + r * 0.8 + ((x + w - vx - r * 0.8) / 5) * i)} ${f(vy - r * 0.62)}v${f(r * 1.24)}`
  const g = `${out}<rect x="${x}" y="${y + h - 8}" width="${w}" height="8" rx="1.5" class="e-dark"/>${motor}<path d="${fins}" class="e-line"/><circle cx="${f(vx)}" cy="${f(vy)}" r="${f(r)}" fill="${ref('metal')}" class="e-edge"/><circle cx="${f(vx)}" cy="${f(vy)}" r="${f(r * 0.32)}" class="e-panel"/>`
  return e.flip ? `<g transform="translate(${2 * x + w} 0) scale(-1 1)">${g}</g>` : g
}

const motor = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  let fins = ''
  for (let i = 1; i < 6; i++) fins += `M${f(x + w * 0.1 + ((w * 0.72) / 6) * i)} ${f(y + h * 0.18)}v${f(h * 0.64)}`
  const g = `<rect x="${x}" y="${y + h - 8}" width="${f(w * 0.85)}" height="8" rx="1.5" class="e-dark"/>
    <rect x="${f(x + w * 0.1)}" y="${f(y + h * 0.18)}" width="${f(w * 0.72)}" height="${f(h * 0.64)}" rx="6" fill="${ref('metal-v')}" class="e-edge"/>
    <rect x="${x}" y="${f(y + h * 0.24)}" width="${f(w * 0.1)}" height="${f(h * 0.52)}" rx="2" fill="${ref('metal-v')}" class="e-edge"/>
    <rect x="${f(x + w * 0.36)}" y="${y}" width="${f(w * 0.22)}" height="${f(h * 0.18)}" rx="2" fill="${ref('metal')}" class="e-edge"/>
    <path d="${fins}M${f(x + w * 0.82)} ${f(y + h / 2)}H${x + w}" class="e-line"/>`
  return e.flip ? `<g transform="translate(${2 * x + w} 0) scale(-1 1)">${g}</g>` : g
}

const valve = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const cy = y + h * 0.7
  const hh = h * 0.3
  return `<path d="M${x} ${f(cy - hh)}V${f(cy + hh)}L${x + w} ${f(cy - hh)}V${f(cy + hh)}Z" fill="${ref('metal')}" class="e-edge"/>
    <path d="M${f(x + w / 2)} ${f(cy)}V${f(y + h * 0.28)}" class="e-line"/>
    <path d="M${f(x + w * 0.08)} ${f(y + h * 0.28)}Q${f(x + w / 2)} ${f(y - h * 0.06)} ${f(x + w * 0.92)} ${f(y + h * 0.28)}Z" fill="${ref('metal')}" class="e-edge"/>`
}

const hx = (id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const r = h / 2
  const tubes = [0.35, 0.5, 0.65].map((t) => `M${f(x + r)} ${f(y + h * t)}H${f(x + w - r)}`).join('')
  const noz = (nx: number, top: boolean) =>
    `<rect x="${f(nx - 7)}" y="${top ? f(y - 12) : f(y + h)}" width="14" height="12" fill="${ref('metal')}" class="e-edge"/>`
  return (
    htank(id, { ...e, fill: 0 }, ref) +
    `<path d="${tubes}" class="e-line"/>` +
    noz(x + w * 0.28, true) +
    noz(x + w * 0.72, true)
  )
}

const filter = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  return `<rect x="${x}" y="${y}" width="${w}" height="${f(h * 0.22)}" rx="2" fill="${ref('metal')}" class="e-edge"/>
    <path d="M${f(x + w * 0.14)} ${f(y + h * 0.22)}V${f(y + h * 0.78)}Q${f(x + w * 0.14)} ${f(y + h * 0.9)} ${f(x + w / 2)} ${f(y + h * 0.9)}Q${f(x + w * 0.86)} ${f(y + h * 0.9)} ${f(x + w * 0.86)} ${f(y + h * 0.78)}V${f(y + h * 0.22)}Z" fill="${ref('metal')}" class="e-edge"/>
    <path d="M${f(x + w / 2)} ${f(y + h * 0.9)}V${y + h}" class="e-line"/>`
}

const conveyor = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const by = y + h * 0.55
  const bh = h * 0.14
  const legs = `<path d="M${f(x + w * 0.1)} ${f(by + bh)}V${y + h}M${f(x + w * 0.9)} ${f(by + bh)}V${y + h}M${f(x + w * 0.5)} ${f(by + bh)}V${y + h}" class="e-leg"/>`
  let items = ''
  for (let i = 0; i < Math.max(1, Math.floor(w / 70)); i++) {
    const bw = h * 0.36
    items += `<rect x="${f(x + 16 + i * 70)}" y="${f(by - bw)}" width="${f(bw)}" height="${f(bw)}" rx="2" class="e-carton"/>`
  }
  return `${legs}<rect x="${x}" y="${f(by)}" width="${w}" height="${f(bh)}" rx="${f(bh / 2)}" fill="${ref('metal-v')}" class="e-edge"/>
    <circle cx="${f(x + bh / 2)}" cy="${f(by + bh / 2)}" r="${f(bh * 0.32)}" class="e-panel"/><circle cx="${f(x + w - bh / 2)}" cy="${f(by + bh / 2)}" r="${f(bh * 0.32)}" class="e-panel"/>${items}`
}

const screen = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  return `<path d="M${f(x + w / 2)} ${f(y + h * 0.62)}V${y + h}M${f(x + w * 0.3)} ${y + h}H${f(x + w * 0.7)}" class="e-leg"/>
    <rect x="${x}" y="${y}" width="${w}" height="${f(h * 0.62)}" rx="4" fill="${ref('metal')}" class="e-edge"/>
    <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${f(h * 0.62 - 12)}" rx="2" class="e-screen"/>
    <path d="M${x + 12} ${f(y + h * 0.45)}l${f(w * 0.18)} ${f(-h * 0.14)} ${f(w * 0.14)} ${f(h * 0.06)} ${f(w * 0.2)} ${f(-h * 0.16)} ${f(w * 0.2)} ${f(h * 0.08)}" class="e-trend"/>`
}

const gateway = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const cx = x + w / 2
  return `<path d="M${f(cx)} ${f(y + h * 0.55)}V${y + h}M${f(cx - w * 0.3)} ${y + h}H${f(cx + w * 0.3)}" class="e-leg"/>
    <rect x="${x}" y="${f(y + h * 0.3)}" width="${w}" height="${f(h * 0.25)}" rx="3" fill="${ref('metal')}" class="e-edge"/>
    <path d="M${f(x + w * 0.75)} ${f(y + h * 0.3)}V${f(y + h * 0.06)}M${f(x + w * 0.58)} ${f(y + h * 0.08)}a${f(w * 0.2)} ${f(w * 0.2)} 0 0 1 ${f(w * 0.34)} 0M${f(x + w * 0.46)} ${f(y + h * 0.02)}a${f(w * 0.34)} ${f(w * 0.34)} 0 0 1 ${f(w * 0.58)} 0" class="e-line"/>`
}

const cylinders = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const n = Math.max(1, Math.round(w / 34))
  const cw = w / n - 6
  let s = ''
  for (let i = 0; i < n; i++) {
    const cx = x + i * (w / n) + 3
    s += `<rect x="${f(cx + cw * 0.3)}" y="${y}" width="${f(cw * 0.4)}" height="${f(h * 0.08)}" class="e-dark"/>
      <rect x="${f(cx)}" y="${f(y + h * 0.08)}" width="${f(cw)}" height="${f(h * 0.92)}" rx="${f(cw / 2)}" fill="${ref('metal')}" class="e-edge"/>`
  }
  return s + `<path d="M${x} ${f(y + h * 0.45)}H${x + w}" class="e-leg"/>`
}

const chute = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const g = `<path d="M${f(x + w * 0.06)} ${y + h}V${f(y + h * 0.3)}" class="e-leg"/>
    <path d="M${x} ${y}H${f(x + w * 0.3)}L${f(x + w * 0.72)} ${f(y + h * 0.6)}V${f(y + h * 0.72)}H${f(x + w * 0.58)}L${x} ${f(y + h * 0.26)}Z" fill="${ref('metal')}" class="e-edge"/>
    <rect x="${f(x + w * 0.56)}" y="${f(y + h * 0.66)}" width="${f(w * 0.44)}" height="${f(h * 0.34)}" rx="3" class="e-carton"/>`
  return e.flip ? `<g transform="translate(${2 * x + w} 0) scale(-1 1)">${g}</g>` : g
}

const curtain = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  let beams = ''
  for (let i = 1; i < 8; i++) beams += `M${x + 12} ${f(y + (h / 8) * i)}H${x + w - 12}`
  return `<rect x="${x}" y="${y}" width="12" height="${h}" rx="3" fill="${ref('metal-v')}" class="e-edge"/>
    <rect x="${x + w - 12}" y="${y}" width="12" height="${h}" rx="3" fill="${ref('metal-v')}" class="e-edge"/>
    <path d="${beams}" class="e-beam"/>`
}

const guard = (_id: string, e: Equipment) => {
  const { x, y, w, h } = e
  let mesh = ''
  for (let i = 1; i < Math.round(w / 16); i++) mesh += `M${f(x + i * 16)} ${y}V${y + h - 10}`
  for (let j = 1; j < Math.round(h / 16); j++) mesh += `M${x} ${f(y + j * 16)}H${x + w}`
  return `<path d="${mesh}" class="e-mesh"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h - 10}" class="e-frame"/>
    <rect x="${f(x + w * 0.55)}" y="${y + 4}" width="${f(w * 0.3)}" height="${h - 18}" class="e-frame"/>
    <path d="M${x} ${y + h - 10}V${y + h}M${x + w} ${y + h - 10}V${y + h}" class="e-leg"/>`
}

const ibc = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const body = y + h * 0.08
  const bh = h * 0.8
  let cage = ''
  for (let i = 1; i < 4; i++) cage += `M${f(x + (w / 4) * i)} ${f(body)}v${f(bh)}`
  for (let j = 1; j < 3; j++) cage += `M${x} ${f(body + (bh / 3) * j)}h${w}`
  const liquid =
    e.fill && e.medium
      ? `<rect x="${x + 3}" y="${f(body + bh * (1 - e.fill))}" width="${w - 6}" height="${f(bh * e.fill - 3)}" fill="${ref(`liq-${e.medium}`)}" opacity="0.85"/>`
      : ''
  return `<rect x="${f(x + w * 0.4)}" y="${y}" width="${f(w * 0.2)}" height="${f(h * 0.08)}" class="e-dark"/>
    <rect x="${x}" y="${f(body)}" width="${w}" height="${f(bh)}" rx="4" class="e-poly"/>${liquid}
    <path d="${cage}" class="e-cage"/><rect x="${x}" y="${f(body)}" width="${w}" height="${f(bh)}" rx="4" class="e-cage"/>
    <rect x="${x - 3}" y="${f(body + bh)}" width="${w + 6}" height="${f(h - bh - h * 0.08)}" rx="1.5" class="e-dark"/>`
}

const truck = (_id: string, e: Equipment, ref: Ref) => {
  const { x, y, w, h } = e
  const bw = w * 0.7
  const wr = h * 0.13
  return `<rect x="${x}" y="${y}" width="${f(bw)}" height="${f(h * 0.74)}" rx="4" fill="${ref('metal')}" class="e-edge"/>
    <rect x="${x + 6}" y="${f(y + h * 0.08)}" width="${f(w * 0.12)}" height="${f(h * 0.22)}" rx="2" class="e-panel"/>
    <path d="M${f(x + bw + 4)} ${f(y + h * 0.74)}V${f(y + h * 0.26)}H${f(x + w * 0.9)}L${x + w} ${f(y + h * 0.48)}V${f(y + h * 0.74)}Z" fill="${ref('metal')}" class="e-edge"/>
    <path d="M${f(x + bw + 12)} ${f(y + h * 0.33)}H${f(x + w * 0.88)}L${f(x + w * 0.95)} ${f(y + h * 0.47)}H${f(x + bw + 12)}Z" class="e-glass"/>
    ${[x + w * 0.14, x + w * 0.34, x + w * 0.84].map((cx) => `<circle cx="${f(cx)}" cy="${f(y + h - wr)}" r="${f(wr)}" class="e-tyre"/>`).join('')}`
}

export const DRAW: Record<string, (id: string, e: Equipment, ref: Ref) => string> = {
  tank,
  htank,
  hood,
  box,
  pump,
  motor,
  valve,
  hx,
  filter,
  conveyor,
  screen,
  gateway,
  cylinders,
  chute,
  curtain,
  guard,
  ibc,
  truck,
}

/**
 * A pipe through its corner points, with every bend rounded so the run reads
 * as pipework rather than a chart line.
 */
export const pipePath = (points: [number, number][], radius = 12) => {
  if (points.length < 2) return ''
  let d = `M${points[0]![0]} ${points[0]![1]}`
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1]!
    const [x, y] = points[i]!
    const [nx, ny] = points[i + 1]!
    const inLen = Math.hypot(x - px, y - py)
    const outLen = Math.hypot(nx - x, ny - y)
    const r = Math.min(radius, inLen / 2, outLen / 2)
    const ax = x - ((x - px) / inLen) * r
    const ay = y - ((y - py) / inLen) * r
    const bx = x + ((nx - x) / outLen) * r
    const by = y + ((ny - y) / outLen) * r
    d += `L${f(ax)} ${f(ay)}Q${x} ${y} ${f(bx)} ${f(by)}`
  }
  const last = points[points.length - 1]!
  return d + `L${last[0]} ${last[1]}`
}
