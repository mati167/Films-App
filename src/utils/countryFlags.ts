export const countryToISO: Record<string, string> = {
    // Spanish
    'Argentina': 'ar',
    'Estados Unidos': 'us',
    'EE.UU.': 'us',
    'USA': 'us',
    'usa': 'us',
    'US': 'us',
    'us': 'us',
    'Francia': 'fr',
    'España': 'es',
    'Italia': 'it',
    'Reino Unido': 'gb',
    'UK': 'gb',
    'uk': 'gb',
    'U.K.': 'gb',
    'u.k.': 'gb',
    'gb': 'gb',
    'GB': 'gb',
    'Great Britain': 'gb',
    'G.B.': 'gb',
    'Alemania': 'de',
    'Japón': 'jp',
    'Japon': 'jp',
    'Corea del Sur': 'kr',
    'Brasil': 'br',
    'México': 'mx',
    'Mexico': 'mx',
    'India': 'in',
    'Canadá': 'ca',
    'Canada': 'ca',
    'Australia': 'au',
    'Irlanda': 'ie',
    'Suecia': 'se',
    'Taiwan': 'tw',
    'Nueva Zelanda': 'nz',
    'Dinamarca': 'dk',
    'Uruguay': 'uy',
    'Hong Kong': 'hk',
    'Austria': 'at',
    'Bélgica': 'be',
    'Belgica': 'be',
    'Chile': 'cl',
    'Noruega': 'no',
    'Polonia': 'pl',
    'Países Bajos': 'nl',
    'Holanda': 'nl',
    'Suiza': 'ch',
    'Grecia': 'gr',
    'Turquía': 'tr',
    'Rusia': 'ru',
    'China': 'cn',
    'Colombia': 'co',
    'Perú': 'pe',
    'Peru': 'pe',
    'Ecuador': 'ec',
    'Venezuela': 've',
    'Paraguay': 'py',
    'Bolivia': 'bo',
    'Panamá': 'pa',
    'Panama': 'pa',
    'Costa Rica': 'cr',
    'Cuba': 'cu',
    'República Dominicana': 'do',
    'Finlandia': 'fi',
    'Islandia': 'is',

    // English
    'United States': 'us',
    'United Kingdom': 'gb',
    'France': 'fr',
    'Spain': 'es',
    'Italy': 'it',
    'Germany': 'de',
    'Japan': 'jp',
    'South Korea': 'kr',
    'Brazil': 'br',
    'Ireland': 'ie',
    'Sweden': 'se',
    'New Zealand': 'nz',
    'Denmark': 'dk',
    'Belgium': 'be',
    'Norway': 'no',
    'Poland': 'pl',
    'Netherlands': 'nl',
    'Switzerland': 'ch',
    'Greece': 'gr',
    'Turkey': 'tr',
    'Russia': 'ru',
    'Finland': 'fi',
    'Iceland': 'is'
}

/**
 * Normalizes input to be case and accent insensitive.
 */
const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/**
 * Returns the ISO 3166-1 alpha-2 code for a country.
 */
export function getCountryISO(country: string): string | null {
    if (!country) return null

    const trimmed = country.trim()
    const lowerTrimmed = trimmed.toLowerCase()

    // 1. Check direct match (case-insensitive) in manual map
    const entry = Object.entries(countryToISO).find(
        ([name, iso]) => name.toLowerCase() === lowerTrimmed || iso.toLowerCase() === lowerTrimmed
    )
    if (entry) return entry[1]

    // 2. Normalized match in manual map
    const normalizedInput = normalize(trimmed)
    for (const [name, iso] of Object.entries(countryToISO)) {
        if (normalize(name) === normalizedInput) {
            return iso
        }
    }

    // 3. Fallback: if it's already 2 letters, assume it's a valid ISO code
    // Special case: if is 'uk', force 'gb'
    if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) {
        return lowerTrimmed === 'uk' ? 'gb' : lowerTrimmed
    }

    return null
}

/**
 * Returns a flag image URL for a given country.
 */
export function getCountryFlagUrl(country: string): string {
    const iso = getCountryISO(country)
    if (!iso) return ''
    // Use flagcdn.com for robust cross-platform flags
    return `https://flagcdn.com/w40/${iso.toLowerCase()}.png`
}

// Deprecated: use getCountryFlagUrl or getCountryISO
export function getCountryFlag(country: string): string {
    const iso = getCountryISO(country)
    return iso ? iso.toUpperCase() : '🌐'
}
