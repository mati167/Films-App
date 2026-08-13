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
  id: number | null
  country: number | null
  director: number | null
  genre: number[] | null
  genreMatchMode: 'and' | 'or'
  maxDuration: string | null
}
