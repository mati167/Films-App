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
  omdbApiKey: string
  setOmdbApiKey: (key: string) => void
  addCountry: (name: string, metadata?: CountryMetadata) => void
  updateCountry: (oldName: string, newName: string, metadata?: CountryMetadata) => void
  deleteCountry: (name: string) => void
}

const initialFilters: SearchFilters = {
  name: '',
  country: '',
  director: '',
  genre: '',
  maxDuration: null,
}

const useMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  omdbApiKey: localStorage.getItem('omdb_api_key') || '7ed67634',
  setOmdbApiKey: (key: string) => {
    localStorage.setItem('omdb_api_key', key)
    set({ omdbApiKey: key })
  },
  directors: [],
  genres: [],
  countries: [],
  countryIds: {},
  directorIds: {},
  genreIds: {},
  directorMetadata: {},
  countryMetadata: {},
  genreMetadata: {},
  filters: { ...initialFilters },

  decodeUTF8: (str: string) => {
    try {
      return decodeURIComponent(escape(str))
    } catch (e) {
      return str
    }
  },

  normalizeName: (name: string) => {
    return name
      .trim()
      .replace(/\s*,\s*/g, ', ') // Asegura "Apellido, Nombre"
      .replace(/\s+/g, ' ')      // Colapsa espacios
  },

  async fetchInitialData() {
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

      console.log('Respuesta Películas (Raw):', moviesData);
      console.log('Respuesta Países (Raw):', countriesData);
      console.log('Respuesta Personas (Raw):', directorsData);
      console.log('Respuesta Géneros (Raw):', genresData);

      // Mapeo para Países
      const { decodeUTF8, normalizeName } = get()
      const countries = Array.isArray(countriesData)
        ? countriesData.map((c: any) => decodeUTF8(c.countryName || ''))
        : []

      const countryIds: Record<string, number> = {}
      const countryMetadata: Record<string, CountryMetadata> = {}
      if (Array.isArray(countriesData)) {
        countriesData.forEach((c: any) => {
          if (c.countryName) {
            const name = decodeUTF8(c.countryName)
            countryIds[name] = c.idcountry
            countryMetadata[name] = {
              continent: decodeUTF8(c.continent?.description || ''),
              totalFilm: c.totalFilm || 0,
              totalPerson: c.totalPerson || 0
            }
          }
        })
      }

      // Mapeo para Directores (Personas)
      const directorIds: Record<string, number> = {}
      const directorMetadata: Record<string, DirectorMetadata> = {}
      const directors: string[] = []

      if (Array.isArray(directorsData)) {
        directorsData.forEach((d: any) => {
          const name = decodeUTF8(d.name || '').trim()
          const lastName = decodeUTF8(d.lastName || '').trim()
          const id = d.idpersona || d.idPersona || 0

          // NOMBRE = lastname, name
          const fullNameSorted = normalizeName(`${lastName}, ${name}`)
          const fullNameNatural = normalizeName(`${name} ${lastName}`)

          if (!directors.includes(fullNameSorted)) {
            directors.push(fullNameSorted)
          }

          const possibleKeys = [fullNameSorted, fullNameNatural, lastName, name]
          possibleKeys.forEach(key => {
            const trimmedKey = key.trim()
            if (trimmedKey) {
              directorIds[trimmedKey] = id
              directorMetadata[trimmedKey] = {
                country: decodeUTF8(d.countries?.[0]?.description || ''),
                totalFilm: d.totalFilm || 0
              }
            }
          })
        })
      }

      // Mapeo para Películas
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
              if (minutes >= 60) {
                minutes = 0
                hours += 1
              }
            }
          } else if (m.duration && typeof m.duration === 'object') {
            // Fallback for old object format
            hours = m.duration.hour || 0
            minutes = m.duration.minute || 0
          }

          const durationStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

          return {
            id: m.idfilm,
            name: decodeUTF8(m.filmName || ''),
            year: m.year,
            duration: durationStr,
            directors: Array.isArray(m.directed) ? m.directed.map((d: any) => normalizeName(decodeUTF8(d.description || ''))) : [],
            countries: Array.isArray(m.countries) ? m.countries.map((c: any) => decodeUTF8(c.description || '')) : [],
            genres: Array.isArray(m.genres) ? m.genres.map((g: any) => normalizeName(decodeUTF8(g.description || ''))) : [],
            imdbUrl: m.imdbUrl || '',
            rottenTomatoesUrl: m.rottenTomatoesUrl || '',
            letterboxdUrl: m.letterboxdUrl || '',
            imdbID: m.imdbID,
          }
        })
        : []

      // Mapeo para Géneros
      const genres: string[] = []
      const genreIds: Record<string, number> = {}
      const genreMetadata: Record<string, GenreMetadata> = {}

      if (Array.isArray(genresData)) {
        genresData.forEach((g: any) => {
          if (g.description) {
            const name = normalizeName(decodeUTF8(g.description))
            genres.push(name)
            genreIds[name] = g.idgenre
            genreMetadata[name] = { totalFilm: g.totalFilm || 0 }
          }
        })
      }

      console.log('Películas Mapeadas:', mappedMovies);
      console.log('Metadatos Directores:', directorMetadata);
      console.log('Metadatos Géneros:', genreMetadata);

      set({
        movies: mappedMovies,
        countries: Array.from(new Set(countries as string[])).sort(),
        countryIds,
        directors: Array.from(new Set(directors)).sort(),
        directorIds,
        directorMetadata,
        genres: Array.from(new Set(genres)).sort(),
        genreIds,
        genreMetadata,
        countryMetadata,
      })
    } catch (error) {
      console.error('Error fetching initial data:', error)
    }
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({ filters: { ...initialFilters } }),

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
      const newMetadata = { ...state.directorMetadata }
      if (metadata || newMetadata[oldName]) {
        newMetadata[newName] = metadata || newMetadata[oldName]
        if (oldName !== newName) delete newMetadata[oldName]
      }
      return {
        directors: state.directors.map((d) => (d === oldName ? newName : d)).sort(),
        directorMetadata: newMetadata,
        movies: state.movies.map((m) => ({
          ...m,
          directors: m.directors.map((d) => (d === oldName ? newName : d)),
        })),
      }
    }),

  deleteDirector: (name) =>
    set((state) => {
      const newMetadata = { ...state.directorMetadata }
      delete newMetadata[name]
      return {
        directors: state.directors.filter((d) => d !== name),
        directorMetadata: newMetadata,
        movies: state.movies.map((m) => ({
          ...m,
          directors: m.directors.filter((d) => d !== name),
        })),
      }
    }),

  addGenre: (name) =>
    set((state) => ({
      genres: [...state.genres, name].sort(),
    })),

  updateGenre: (oldName, newName) =>
    set((state) => ({
      genres: state.genres.map((g) => (g === oldName ? newName : g)).sort(),
      movies: state.movies.map((m) => ({
        ...m,
        genres: m.genres.map((g) => (g === oldName ? newName : g)),
      })),
    })),

  deleteGenre: (name) =>
    set((state) => ({
      genres: state.genres.filter((g) => g !== name),
      movies: state.movies.map((m) => ({
        ...m,
        genres: m.genres.filter((g) => g !== name),
      })),
    })),

  addCountry: (name, metadata) =>
    set((state) => ({
      countries: [...state.countries, name].sort(),
      countryMetadata: { ...state.countryMetadata, [name]: metadata || {} }
    })),

  updateCountry: (oldName, newName, metadata) =>
    set((state) => {
      const newMetadata = { ...state.countryMetadata }
      if (metadata || newMetadata[oldName]) {
        newMetadata[newName] = metadata || newMetadata[oldName]
        if (oldName !== newName) delete newMetadata[oldName]
      }
      return {
        countries: state.countries.map((c) => (c === oldName ? newName : c)).sort(),
        countryMetadata: newMetadata,
        movies: state.movies.map((m) => ({
          ...m,
          countries: m.countries.map((c) => (c === oldName ? newName : c)),
        })),
      }
    }),

  deleteCountry: (name) =>
    set((state) => {
      const newMetadata = { ...state.countryMetadata }
      delete newMetadata[name]
      return {
        countries: state.countries.filter((c) => c !== name),
        countryMetadata: newMetadata,
        movies: state.movies.map((m) => ({
          ...m,
          countries: m.countries.filter((c) => c !== name),
        })),
      }
    }),

  getFilteredMovies: () => {
    const { movies, filters } = get()
    const norm = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return movies.filter((movie) => {
      const matchesName = !filters.name || norm(movie.name).includes(norm(filters.name))
      const matchesCountry = !filters.country || movie.countries.some((c) => norm(c) === norm(filters.country))
      const matchesDirector = !filters.director || movie.directors.some((d) => norm(d) === norm(filters.director))
      const matchesGenre = !filters.genre || movie.genres.some((g) => norm(g) === norm(filters.genre))
      const matchesDuration = !filters.maxDuration || movie.duration <= filters.maxDuration

      return matchesName && matchesCountry && matchesDirector && matchesGenre && matchesDuration
    })
  },
}))

export default useMovieStore
