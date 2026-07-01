import GrassRustle from './components/GrassRustle'
import { useState, useEffect } from 'react'
import './App.css'

const typeColors = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
}

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [pokemonName, setPokemonName] = useState('bulbasaur')
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase().trim()}`)
      .then((response) => {
        if (!response.ok) throw new Error('Pokémon not found')
        return response.json()
      })
      .then((data) => {
        setPokemon(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setPokemon(null)
        setLoading(false)
      })
  }, [pokemonName])

  function handleSubmit(event) {
    event.preventDefault()
    setPokemonName(searchInput)
  }

  const mainType = pokemon?.types?.[0]?.type?.name
  const bgColor = typeColors[mainType] || '#888'

  return (
    <div className="app">
      <GrassRustle />
      <h1 className="title">Pokédex</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search a Pokémon..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}

      {pokemon && !loading && !error && (
        <div className="card" style={{ backgroundColor: bgColor }}>
          <span className="card-id">#{String(pokemon.id).padStart(3, '0')}</span>
          <img
            className="sprite"
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <h2 className="pokemon-name">{pokemon.name}</h2>
          <div className="types">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className="type-badge">
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App