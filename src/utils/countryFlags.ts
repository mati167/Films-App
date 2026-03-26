/**
 * Returns a flag image URL for a given ISO 3166-1 alpha-2 code.
 */
export function getCountryFlagUrl(iso: string): string {
    if (!iso) return ''
    // Use flagcdn.com for robust cross-platform flags
    return `https://flagcdn.com/w40/${iso.toLowerCase()}.png`
}
