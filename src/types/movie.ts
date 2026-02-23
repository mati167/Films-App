export interface Movie {
  id: number
  name: string
  year: number
  directors: string[]
  duration: string
  countries: string[]
  genres: string[]
  imdbUrl: string
  rottenTomatoesUrl: string
  letterboxdUrl: string
  imdbID?: string
}

export interface SearchFilters {
  name: string
  country: string
  director: string
  genre: string
  maxDuration: string | null
}
