export interface Movie {
  id: number
  name: string
  year: number
  directors: number[]
  duration: string
  countries: number[]
  genres: number[]
  imdbUrl: string
  rottenTomatoesUrl: string
  letterboxdUrl: string
  imdbID?: string
}

export interface SearchFilters {
  name: string
  country: number | null
  director: number | null
  genre: number | null
  maxDuration: string | null
}
