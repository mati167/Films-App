export const countryToFlag: Record<string, string> = {
    // Nombres comunes en las APIs
    'Argentina': '🇦🇷',
    'Estados Unidos': '🇺🇸',
    'EE.UU.': '🇺🇸',
    'USA': '🇺🇸',
    'Francia': '🇫🇷',
    'España': '🇪🇸',
    'Italia': '🇮🇹',
    'Reino Unido': '🇬🇧',
    'UK': '🇬🇧',
    'Alemania': '🇩🇪',
    'Japón': '🇯🇵',
    'Japon': '🇯🇵',
    'Corea del Sur': '🇰🇷',
    'Brasil': '🇧🇷',
    'México': '🇲🇽',
    'Mexico': '🇲🇽',
    'India': '🇮🇳',
    'Canadá': '🇨🇦',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Irlanda': '🇮🇪',
    'Suecia': '🇸🇪',
    'Taiwan': '🇹🇼',
    'Nueva Zelanda': '🇳🇿',
    'Dinamarca': '🇩🇰',
    'Uruguay': '🇺🇾',
    'Hong Kong': '🇭🇰',
    'Austria': '🇦🇹',
    'Bélgica': '🇧🇪',
    'Belgica': '🇧🇪',
    'Chile': '🇨🇱',
    'Noruega': '🇳🇴',
    'Polonia': '🇵🇱',
    'Países Bajos': '🇳🇱',
    'Holanda': '🇳🇱',
    'Suiza': '🇨🇭',
    'Grecia': '🇬🇷',
    'Turquía': '🇹🇷',
    'Rusia': '🇷🇺',
    'China': '🇨🇳',
    'Colombia': '🇨🇴',
    'Perú': '🇵🇪',
    'Peru': '🇵🇪',
    'Ecuador': '🇪🇨',
    'Venezuela': '🇻🇪',
    'Paraguay': '🇵🇾',
    'Bolivia': '🇧🇴',
    'Panamá': '🇵🇦',
    'Panama': '🇵🇦',
    'Costa Rica': '🇨🇷',
    'Cuba': '🇨🇺',
    'República Dominicana': '🇩🇴',
    'Finlandia': '🇫🇮',
    'Islandia': '🇮🇸',
}

/**
 * Genera un emoji de bandera a partir de un código ISO de 2 letras.
 */
function getFlagFromISO(isoCode: string): string | null {
    if (!isoCode || isoCode.length !== 2) return null;
    const codePoints = isoCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    try {
        return String.fromCodePoint(...codePoints);
    } catch {
        return null;
    }
}

/**
 * Returns the flag emoji for a given country name or code.
 * Normalizes input to be case and accent insensitive.
 */
export function getCountryFlag(country: string): string {
    if (!country) return '🌐'

    const trimmed = country.trim()

    // 1. Primero intentamos coincidencia directa en el mapa manual
    if (countryToFlag[trimmed]) return countryToFlag[trimmed]

    // 2. Normalización para búsqueda robusta en el mapa manual
    const normalize = (s: string) =>
        s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const normalizedInput = normalize(trimmed)

    for (const [name, flag] of Object.entries(countryToFlag)) {
        if (normalize(name) === normalizedInput) {
            return flag
        }
    }

    // 3. Si no hay coincidencia manual y son 2 letras, probamos ISO automático
    if (trimmed.length === 2 && /^[a-zA-Z]{2}$/.test(trimmed)) {
        return getFlagFromISO(trimmed) || '🌐'
    }

    return '🌐'
}
