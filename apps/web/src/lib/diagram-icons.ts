/**
 * Line icons on the same 24px grid the rest of the site draws on. This set runs
 * wider than the feature grid's because a diagram has to name specific things —
 * a tank, a meter, a phone — where a feature card can stay abstract.
 */
export const ICONS: Record<string, string> = {
  gauge: '<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M13.4 10.6 19 5"/><path d="M20.5 17a10 10 0 1 0-17 0"/>',
  meter:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15a5 5 0 0 1 10 0"/><path d="m12 15 3-3.5"/><path d="M7 8h2"/>',
  flow: '<path d="M3 12h4"/><path d="M17 12h4"/><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 12h4"/><path d="m12.5 10.5 1.5 1.5-1.5 1.5"/>',
  valve:
    '<path d="M2 12h4"/><path d="M18 12h4"/><path d="M6 8v8l6-4z"/><path d="M18 8v8l-6-4z"/><path d="M12 8V4"/><path d="M9.5 4h5"/>',
  tank: '<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v12c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V6"/><path d="M5 14c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6"/>',
  transmitter:
    '<rect x="7" y="9" width="10" height="9" rx="1.5"/><path d="M12 9V5"/><path d="M8.5 5.5a5 5 0 0 1 7 0"/><path d="M10.5 18v3"/><path d="M13.5 18v3"/>',
  cabinet:
    '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 2v20"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7 6h2"/><path d="M15 6h2"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
  logger:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6 15l3-4 2.5 2.5L15 8l3 4"/><circle cx="18.5" cy="8" r="1"/>',
  network:
    '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4"/><path d="M5 16v-2h14v2"/>',
  gateway:
    '<rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 17h.01"/><path d="M11 17h6"/><path d="M12 10V7"/><path d="M8.5 6.5a5 5 0 0 1 7 0"/><path d="M6 4a9 9 0 0 1 12 0"/>',
  signal:
    '<path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M2 8.82a16 16 0 0 1 20 0"/><path d="M8.5 16.43a6 6 0 0 1 7 0"/><circle cx="12" cy="20" r="1"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6.5 6.5 0 0 0 5.4 11.2 3.9 3.9 0 0 0 6 19z"/>',
  phone:
    '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/><path d="M10 5h4"/>',
  screen:
    '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M6 8h6"/><path d="M6 11.5h4"/>',
  dashboard:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="M13 13h4"/><path d="M13 17h4"/>',
  motor:
    '<rect x="3" y="8" width="12" height="9" rx="1.5"/><path d="M15 11h3v3h-3"/><path d="M18 12.5h3"/><path d="M6 17v3"/><path d="M12 17v3"/><path d="M6.5 8V5.5h5V8"/>',
  pump: '<circle cx="11" cy="12" r="6"/><path d="M11 6v6l4.2 4.2"/><path d="M17 12h4"/><path d="M2 12h3"/><path d="M11 21h6"/>',
  machine:
    '<path d="M3 20h18"/><path d="M5 20V9h6v11"/><path d="M11 13h8v7"/><path d="M8 9V5h3"/><path d="M14 17h2"/>',
  robot:
    '<rect x="5" y="8" width="14" height="10" rx="2"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.4"/><circle cx="9.5" cy="13" r="1.2"/><circle cx="14.5" cy="13" r="1.2"/><path d="M2 12h3"/><path d="M19 12h3"/>',
  conveyor:
    '<circle cx="5.5" cy="15.5" r="3"/><circle cx="18.5" cy="15.5" r="3"/><path d="M5.5 12.5h13"/><path d="M5.5 18.5h13"/><rect x="8" y="4" width="8" height="5" rx="1"/>',
  sensor:
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="m5 5 2.1 2.1"/><path d="m16.9 16.9 2.1 2.1"/>',
  thermometer:
    '<path d="M14 14.8V4a2 2 0 1 0-4 0v10.8a4 4 0 1 0 4 0z"/><path d="M12 9v6.5"/>',
  battery:
    '<rect x="2" y="8" width="16" height="9" rx="2"/><path d="M20 11v3"/><path d="m9.5 10-1.5 3h2l-1.5 3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  alert:
    '<path d="M10.3 3.6a2 2 0 0 1 3.4 0l8 13.9a2 2 0 0 1-1.7 3H4a2 2 0 0 1-1.7-3z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/>',
  wrench:
    '<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.9 9.9a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3 18 3a4 4 0 0 1 3 3l-3.3 3.3"/>',
  cable:
    '<path d="M4 4v6a4 4 0 0 0 4 4h8a4 4 0 0 1 4 4v2"/><rect x="2" y="2" width="4" height="3" rx="1"/><rect x="18" y="19" width="4" height="3" rx="1"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  clipboard:
    '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  pipe: '<path d="M2 9h20"/><path d="M2 15h20"/><path d="M6 7v10"/><path d="M18 7v10"/>',
  building: '<path d="M3 21V9l9-6 9 6v12"/><path d="M3 21h18"/><path d="M9 21v-6h6v6"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
}

export const icon = (name?: string) => ICONS[name ?? ''] ?? ICONS.cog
