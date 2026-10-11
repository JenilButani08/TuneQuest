/**
 * Dynamic Song Color Theme Utility
 * Derives rich, harmonious visual atmospheres from song metadata and artwork.
 * Provides curated palettes for existing songs and procedural extraction with caching.
 */

export interface SongColorPalette {
  primary: string;       // Main dominant color (HEX)
  secondary: string;     // Complementary ambient color (HEX)
  accent: string;        // Vibrant highlight color (HEX)
  glow: string;          // Soft ambient glow RGBA
  dark: {
    bgGradient: string;  // CSS background gradient for dark mode
    ambientBlob1: string;
    ambientBlob2: string;
    vignette: string;
  };
  light: {
    bgGradient: string;  // CSS background gradient for light mode
    ambientBlob1: string;
    ambientBlob2: string;
    vignette: string;
  };
}

// Curated high-fidelity color palettes mapped by song ID
const CURATED_PALETTES: Record<string, { primary: string; secondary: string; accent: string }> = {
  'song-faded': {
    primary: '#1E3A8A',    // Deep Electric Blue
    secondary: '#0369A1',  // Sky Blue
    accent: '#38BDF8',     // Cyan highlight
  },
  'song-let-me-down-slowly': {
    primary: '#B45309',    // Warm Amber
    secondary: '#C2410C',  // Rust Orange
    accent: '#F59E0B',     // Golden Amber
  },
  'song-arz-kiya-hai': {
    primary: '#6D28D9',    // Midnight Violet
    secondary: '#4338CA',  // Indigo
    accent: '#A78BFA',     // Lavender
  },
  'song-soulmate': {
    primary: '#0D9488',    // Deep Teal
    secondary: '#0F766E',  // Dark Spruce
    accent: '#2DD4BF',     // Aqua
  },
  'song-bairan': {
    primary: '#9A3412',    // Desert Terracotta
    secondary: '#78350F',  // Warm Earth
    accent: '#F97316',     // Orange Glow
  },
  'song-darkhaast': {
    primary: '#1D4ED8',    // Symphonic Royal Blue
    secondary: '#0284C7',  // Glacial Blue
    accent: '#60A5FA',     // Soft Ice Blue
  },
  'song-dooron-dooron': {
    primary: '#4D7C0F',    // Olive Sage
    secondary: '#15803D',  // Forest Green
    accent: '#84CC16',     // Bright Sage
  },
  'song-ehsaas': {
    primary: '#0F766E',    // Kashmiri Mystic Teal
    secondary: '#1E3A5F',  // Twilight Deep Blue
    accent: '#5EEAD4',     // Soft Mint Glow
  },
  'song-him-and-i': {
    primary: '#BE123C',    // Crimson Rose
    secondary: '#881337',  // Deep Wine
    accent: '#FB7185',     // Pastel Rose
  },
  'song-gehra-hua': {
    primary: '#312E81',    // Oceanic Deep Navy
    secondary: '#1E40AF',  // Cobalt
    accent: '#818CF8',     // Periwinkle
  },
  'song-ishqa-ve': {
    primary: '#7E22CE',    // Royal Purple
    secondary: '#BE185D',  // Mulberry
    accent: '#C084FC',     // Orchid
  },
};

// Genre-based fallback color anchors
const GENRE_PALETTES: Record<string, { primary: string; secondary: string; accent: string }> = {
  'edm': { primary: '#1E40AF', secondary: '#0284C7', accent: '#38BDF8' },
  'pop': { primary: '#7C3AED', secondary: '#BE185D', accent: '#F472B6' },
  'indie': { primary: '#B45309', secondary: '#9A3412', accent: '#FBBF24' },
  'rock': { primary: '#991B1B', secondary: '#450A0A', accent: '#F87171' },
  'hip-hop': { primary: '#831843', secondary: '#4C1D95', accent: '#EC4899' },
  'bollywood': { primary: '#92400E', secondary: '#B91C1C', accent: '#F59E0B' },
  'folk': { primary: '#854D0E', secondary: '#78350F', accent: '#EAB308' },
  'sufi': { primary: '#0F766E', secondary: '#1E3A5F', accent: '#2DD4BF' },
  'electronic': { primary: '#4338CA', secondary: '#0369A1', accent: '#818CF8' },
  'chill': { primary: '#0D9488', secondary: '#1D4ED8', accent: '#5EEAD4' },
};

// Internal in-memory cache for derived song palettes
const paletteCache = new Map<string, SongColorPalette>();

/**
 * Deterministically generates harmonious primary, secondary, and accent colors
 * from a string seed (e.g. song title or artwork URL)
 */
function deriveColorsFromSeed(seed: string): { primary: string; secondary: string; accent: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40 + (Math.abs(hash >> 3) % 40)) % 360;
  const hueAccent = (hue1 + 180 + (Math.abs(hash >> 5) % 30)) % 360;

  return {
    primary: `hsl(${hue1}, 65%, 45%)`,
    secondary: `hsl(${hue2}, 60%, 35%)`,
    accent: `hsl(${hueAccent}, 75%, 65%)`,
  };
}

/**
 * Convert hex or hsl to an RGBA string with custom opacity
 */
function toRgba(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (color.startsWith('hsl')) {
    // If hsl(H, S%, L%), convert to hsla(H, S%, L%, opacity)
    return color.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`);
  }

  return color;
}

/**
 * Build a complete SongColorPalette for both Dark and Light modes
 */
function buildPalette(base: { primary: string; secondary: string; accent: string }): SongColorPalette {
  const { primary, secondary, accent } = base;

  return {
    primary,
    secondary,
    accent,
    glow: toRgba(accent, 0.15),
    dark: {
      bgGradient: `radial-gradient(circle at 18% 12%, ${toRgba(primary, 0.22)} 0%, transparent 55%), radial-gradient(circle at 82% 28%, ${toRgba(secondary, 0.18)} 0%, transparent 60%)`,
      ambientBlob1: toRgba(primary, 0.25),
      ambientBlob2: toRgba(secondary, 0.20),
      vignette: 'radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(15, 17, 21, 0.85) 100%)',
    },
    light: {
      bgGradient: `radial-gradient(circle at 18% 12%, ${toRgba(primary, 0.10)} 0%, transparent 55%), radial-gradient(circle at 82% 28%, ${toRgba(secondary, 0.08)} 0%, transparent 60%)`,
      ambientBlob1: toRgba(primary, 0.12),
      ambientBlob2: toRgba(secondary, 0.09),
      vignette: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(248, 249, 251, 0.90) 100%)',
    },
  };
}

/**
 * Get or compute the dynamic theme for a song
 */
export function getSongTheme(song: { id?: string; title?: string; genre?: string; coverImage?: string } | null): SongColorPalette | null {
  if (!song) return null;

  const cacheKey = song.id || song.title || 'default';
  if (paletteCache.has(cacheKey)) {
    return paletteCache.get(cacheKey)!;
  }

  // 1. Check curated ID mapping
  if (song.id && CURATED_PALETTES[song.id]) {
    const palette = buildPalette(CURATED_PALETTES[song.id]);
    paletteCache.set(cacheKey, palette);
    return palette;
  }

  // 2. Check genre matching
  if (song.genre) {
    const lowerGenre = song.genre.toLowerCase();
    for (const [key, colors] of Object.entries(GENRE_PALETTES)) {
      if (lowerGenre.includes(key)) {
        const palette = buildPalette(colors);
        paletteCache.set(cacheKey, palette);
        return palette;
      }
    }
  }

  // 3. Procedural seed-based derivation
  const seed = `${song.title || ''}-${song.genre || ''}-${song.coverImage || ''}`;
  const colors = deriveColorsFromSeed(seed);
  const palette = buildPalette(colors);
  paletteCache.set(cacheKey, palette);
  return palette;
}
