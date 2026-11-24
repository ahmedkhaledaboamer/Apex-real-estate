// GENERATED from Natural Earth land (world-atlas 50m) — do not edit by hand. Dots live in mapDots.ts.
// Mercator, framed from London to Mumbai; 4925 dots on a 9px grid.

export const MAP_WIDTH = 900
export const MAP_HEIGHT = 600


/** City positions in the same viewBox. */
export const MAP_CITIES = {
  "dubai": {
    "label": "Dubai",
    "x": 606.2,
    "y": 443.9
  },
  "london": {
    "label": "London",
    "x": 157.2,
    "y": 166.5
  },
  "moscow": {
    "label": "Moscow",
    "x": 463.1,
    "y": 108.3
  },
  "istanbul": {
    "label": "Istanbul",
    "x": 393.1,
    "y": 290
  },
  "cairo": {
    "label": "Cairo",
    "x": 411.4,
    "y": 399.6
  },
  "riyadh": {
    "label": "Riyadh",
    "x": 536.9,
    "y": 448.3
  },
  "mumbai": {
    "label": "Mumbai",
    "x": 748.9,
    "y": 497.5
  },
  "karachi": {
    "label": "Karachi",
    "x": 701.3,
    "y": 446.9
  },
  "delhi": {
    "label": "New Delhi",
    "x": 784,
    "y": 412.9
  },
  "berlin": {
    "label": "Berlin",
    "x": 266.8,
    "y": 153
  }
} as const

export type MapCityKey = keyof typeof MAP_CITIES
