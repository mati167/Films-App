import { create } from 'zustand'
import type { Movie, SearchFilters } from '@/types/movie'
import { API_BASE_URL } from '../config'

export interface DirectorMetadata {
  country?: string
  totalFilm?: number
}

export interface CountryMetadata {
  continent?: string
  totalFilm?: number
  totalPerson?: number
}

export interface GenreMetadata {
  totalFilm?: number
}

interface MovieStore {
  movies: Movie[]
  directors: string[]
  genres: string[]
  countries: string[]
  countryIds: Record<string, number>
  directorIds: Record<string, number>
  genreIds: Record<string, number>
  // Inverse lookups: id → display name
  directorById: Record<number, string>
  genreById: Record<number, string>
  countryById: Record<number, string>
  directorMetadata: Record<string, DirectorMetadata>
  countryMetadata: Record<string, CountryMetadata>
  genreMetadata: Record<string, GenreMetadata>
  filters: SearchFilters
  decodeUTF8: (str: string) => string
  normalizeName: (name: string) => string
  fetchInitialData: () => Promise<void>
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void
  resetFilters: () => void
  getFilteredMovies: () => Movie[]
  addMovie: (movie: Omit<Movie, 'id'>) => void
  updateMovie: (id: number, movie: Partial<Movie>) => void
  deleteMovie: (id: number) => void
  addDirector: (name: string, metadata?: DirectorMetadata) => void
  updateDirector: (oldName: string, newName: string, metadata?: DirectorMetadata) => void
  deleteDirector: (name: string) => void
  addGenre: (name: string) => void
  updateGenre: (oldName: string, newName: string) => void
  deleteGenre: (name: string) => void
  addCountry: (name: string, metadata?: CountryMetadata) => void
  updateCountry: (oldName: string, newName: string, metadata?: CountryMetadata) => void
  deleteCountry: (name: string) => void
  fetchMovieDetails: (imdbId: string) => Promise<any>
  isLoading: boolean
}

const initialFilters: SearchFilters = {
  name: '',
  country: null,
  director: null,
  genre: null,
  maxDuration: null,
}

const useMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  directors: [],
  genres: [],
  countries: [],
  countryIds: {},
  directorIds: {},
  genreIds: {},
  directorById: {},
  genreById: {},
  countryById: {},
  directorMetadata: {},
  countryMetadata: {},
  genreMetadata: {},
  filters: { ...initialFilters },
  isLoading: false,

  decodeUTF8: (str: string) => {
    if (!str) return '';
    if (/[\u00C2-\u00C3][\u0080-\u00BF]/.test(str)) {
      try {
        return decodeURIComponent(escape(str));
      } catch (e) {
        try {
          const bytes = new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
          return new TextDecoder('utf-8').decode(bytes);
        } catch (e2) {
          return str;
        }
      }
    }
    return str;
  },

  normalizeName: (name: string) => {
    return name
      .trim()
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+/g, ' ')
  },

  async fetchInitialData() {
    set({ isLoading: true })
    try {
      console.log('Iniciando fetch de datos...');
      const [moviesRes, countriesRes, directorsRes, genresRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Film/GetFilms`),
        fetch(`${API_BASE_URL}/Country/GetCountries`),
        fetch(`${API_BASE_URL}/person/GetPersonList`),
        fetch(`${API_BASE_URL}/Genre/GetGenres`)
      ])

      if (!moviesRes.ok || !countriesRes.ok || !directorsRes.ok || !genresRes.ok) {
        throw new Error('Error al cargar datos de la API')
      }

      const moviesData = await moviesRes.json()
      const countriesData = await countriesRes.json()
      const directorsData = await directorsRes.json()
      const genresData = await genresRes.json()

      const { decodeUTF8, normalizeName } = get()

      // ── Países ──────────────────────────────────────────────────────────────
      const countries: string[] = []
      const countryIds: Record<string, number> = {}
      const countryById: Record<number, string> = {}
      const countryMetadata: Record<string, CountryMetadata> = {}

      if (Array.isArray(countriesData)) {
        countriesData.forEach((c: any) => {
          const rawName = c.countryName || c.description || ''
          if (rawName) {
            const name = decodeUTF8(rawName)
            const id: number = c.idcountry || c.id || 0
            countries.push(name)
            countryIds[name] = id
            countryById[id] = name
            countryMetadata[name] = {
              continent: decodeUTF8(c.continent?.description || c.continentName || ''),
              totalFilm: c.totalFilm || 0,
              totalPerson: c.totalPerson || 0
            }
          }
        })
      }

      // ── Directores (Personas) ────────────────────────────────────────────────
      const directorIds: Record<string, number> = {}
      const directorById: Record<number, string> = {}
      const directorMetadata: Record<string, DirectorMetadata> = {}
      const directors: string[] = []

      if (Array.isArray(directorsData)) {
        directorsData.forEach((d: any) => {
          const name = decodeUTF8(d.name || '').trim()
          const lastName = decodeUTF8(d.lastName || '').trim()
          const id: number = d.idpersona || d.idPersona || 0

          // Canonical format: "Apellido, Nombre"
          const fullNameSorted = normalizeName(`${lastName}, ${name}`)

          if (!directors.includes(fullNameSorted)) {
            directors.push(fullNameSorted)
          }

          directorIds[fullNameSorted] = id
          directorById[id] = fullNameSorted
          directorMetadata[fullNameSorted] = {
            country: decodeUTF8(d.countries?.[0]?.description || ''),
            totalFilm: d.totalFilm || 0
          }
        })
      }

      // ── Géneros ──────────────────────────────────────────────────────────────
      const genres: string[] = []
      const genreIds: Record<string, number> = {}
      const genreById: Record<number, string> = {}
      const genreMetadata: Record<string, GenreMetadata> = {}

      if (Array.isArray(genresData)) {
        genresData.forEach((g: any) => {
          if (g.description) {
            const name = normalizeName(decodeUTF8(g.description))
            const id: number = g.idgenre
            genres.push(name)
            genreIds[name] = id
            genreById[id] = name
            genreMetadata[name] = { totalFilm: g.totalFilm || 0 }
          }
        })
      }

      // ── Películas ─────────────────────────────────────────────────────────────
      // We build a temporary name→id map for countries to resolve film countries by ID
      const tempCountryIdByName: Record<string, number> = countryIds

      const mappedMovies: Movie[] = Array.isArray(moviesData)
        ? moviesData.map((m: any) => {
          let hours = 0
          let minutes = 0

          if (typeof m.duration === 'string') {
            const parts = m.duration.split(':').map(Number)
            hours = parts[0] || 0
            minutes = parts[1] || 0
            const seconds = parts[2] || 0
            if (seconds > 0) {
              minutes += 1
              if (minutes >= 60) { minutes = 0; hours += 1 }
            }
          } else if (m.duration && typeof m.duration === 'object') {
            hours = m.duration.hour || 0
            minutes = m.duration.minute || 0
          }

          const durationStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

          // Directors: the films API returns directed[].id (NOT idpersona)
          const movieDirectorIds: number[] = Array.isArray(m.directed)
            ? m.directed
                .map((d: any) => d.idpersona || d.idPersona || d.id || 0)
                .filter((id: number) => id > 0)
            : []

          // Genres: the films API returns genres[].id (NOT idgenre)
          const movieGenreIds: number[] = Array.isArray(m.genres)
            ? m.genres
                .map((g: any) => g.idgenre || g.id || 0)
                .filter((id: number) => id > 0)
            : []

          // Countries: the films API returns countries[].id (NOT idcountry)
          const movieCountryIds: number[] = Array.isArray(m.countries)
            ? m.countries
                .map((c: any) => c.idcountry || c.id || 0)
                .filter((id: number) => id > 0)
            : []

          return {
            id: m.idfilm,
            name: decodeUTF8(m.filmName || ''),
            year: m.year,
            duration: durationStr,
            directors: movieDirectorIds,
            countries: movieCountryIds,
            genres: movieGenreIds,
            imdbUrl: m.imdbUrl || '',
            rottenTomatoesUrl: m.rottenTomatoesUrl || '',
            letterboxdUrl: m.letterboxdUrl || '',
            imdbID: m.imdbID,
          }
        })
        : []

      console.log('Películas Mapeadas:', mappedMovies);
      console.log('directorById:', directorById);
      console.log('genreById:', genreById);
      console.log('countryById:', countryById);

      set({
        movies: mappedMovies,
        countries: Array.from(new Set(countries)).sort(),
        countryIds,
        countryById,
        directors: Array.from(new Set(directors)).sort(),
        directorIds,
        directorById,
        directorMetadata,
        genres: Array.from(new Set(genres)).sort(),
        genreIds,
        genreById,
        genreMetadata,
        countryMetadata,
      })
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({ filters: { ...initialFilters } }),

  fetchMovieDetails: async (imdbId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Film/GetMovieFromOmdb?imdbid=${imdbId}`)
      if (!response.ok) throw new Error('Failed to fetch movie details')
      return await response.json()
    } catch (error) {
      console.error('Error fetching movie details:', error)
      return null
    }
  },

  addMovie: (movie) =>
    set((state) => ({
      movies: [...state.movies, { ...movie, id: Math.max(0, ...state.movies.map(m => m.id)) + 1 }],
    })),

  updateMovie: (id, updatedMovie) =>
    set((state) => ({
      movies: state.movies.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m)),
    })),

  deleteMovie: (id) =>
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== id),
    })),

  addDirector: (name, metadata) =>
    set((state) => ({
      directors: [...state.directors, name].sort(),
      directorMetadata: { ...state.directorMetadata, [name]: metadata || {} }
    })),

  updateDirector: (oldName, newName, metadata) =>
    set((state) => {
      const newMeta = { ...state.directorMetadata }
      if (metadata || newMeta[oldName]) {
        newMeta[newName] = metadata || newMeta[oldName]
        if (oldName !== newName) delete newMeta[oldName]
      }
      return {
        directors: state.directors.map((d) => (d === oldName ? newName : d)).sort(),
        directorMetadata: newMeta,
      }
    }),

  deleteDirector: (name) =>
    set((state) => {
      const newMeta = { ...state.directorMetadata }
      delete newMeta[name]
      return {
        directors: state.directors.filter((d) => d !== name),
        directorMetadata: newMeta,
      }
    }),

  addGenre: (name) =>
    set((state) => ({
      genres: [...state.genres, name].sort(),
    })),

  updateGenre: (oldName, newName) =>
    set((state) => ({
      genres: state.genres.map((g) => (g === oldName ? newName : g)).sort(),
    })),

  deleteGenre: (name) =>
    set((state) => ({
      genres: state.genres.filter((g) => g !== name),
    })),

  addCountry: (name, metadata) =>
    set((state) => ({
      countries: [...state.countries, name].sort(),
      countryMetadata: { ...state.countryMetadata, [name]: metadata || {} }
    })),

  updateCountry: (oldName, newName, metadata) =>
    set((state) => {
      const newMeta = { ...state.countryMetadata }
      if (metadata || newMeta[oldName]) {
        newMeta[newName] = metadata || newMeta[oldName]
        if (oldName !== newName) delete newMeta[oldName]
      }
      return {
        countries: state.countries.map((c) => (c === oldName ? newName : c)).sort(),
        countryMetadata: newMeta,
      }
    }),

  deleteCountry: (name) =>
    set((state) => {
      const newMeta = { ...state.countryMetadata }
      delete newMeta[name]
      return {
        countries: state.countries.filter((c) => c !== name),
        countryMetadata: newMeta,
      }
    }),

  getFilteredMovies: () => {
    const { movies, filters } = get()
    const norm = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return movies.filter((movie) => {
      const matchesName = !filters.name || norm(movie.name).includes(norm(filters.name))
      const matchesCountry = filters.country === null || movie.countries.includes(filters.country)
      const matchesDirector = filters.director === null || movie.directors.includes(filters.director)
      const matchesGenre = filters.genre === null || movie.genres.includes(filters.genre)
      const matchesDuration = !filters.maxDuration || movie.duration <= filters.maxDuration

      return matchesName && matchesCountry && matchesDirector && matchesGenre && matchesDuration
    })
  },
}))

export default useMovieStore
