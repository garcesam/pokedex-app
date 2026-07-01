import { useState, useEffect } from 'react'
import GrassRustle from './components/GrassRustle'
import './App.css'

const typeColors = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
}

function formatHeightWeight(heightDecimeters, weightHectograms) {
  const meters = heightDecimeters / 10
  const feetTotal = meters * 3.28084
  const feet = Math.floor(feetTotal)
  const inches = Math.round((feetTotal - feet) * 12)

  const kg = weightHectograms / 10
  const lbs = (kg * 2.20462).toFixed(1)

  return {
    height: `${meters.toFixed(1)} m (${feet}'${inches}")`,
    weight: `${kg.toFixed(1)} kg (${lbs} lbs)`,
  }
}

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [pokemonName, setPokemonName] = useState('bulbasaur')
  const [pokemon, setPokemon] = useState(null)
  const [description, setDescription] = useState('')
  const [genus, setGenus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [allNames, setAllNames] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Fetch the full list of Pokémon names once, on first load (powers autocomplete)
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
      .then((response) => response.json())
      .then((data) => setAllNames(data.results.map((p) => p.name)))
      .catch((err) => console.error('Failed to load Pokémon list:', err))
  }, [])

  // Fetch the selected Pokémon (and its species data) whenever pokemonName changes
  useEffect(() => {
    setLoading(true)
    setError(null)
    setDescription('')
    setGenus('')

    const cleanName = pokemonName.toLowerCase().trim()

    fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`)
      .then((response) => {
        if (!response.ok) throw new Error('Pokémon not found')
        return response.json()
      })
      .then((data) => {
        setPokemon(data)
        // Species data (flavor text, genus) lives at a separate URL, chained here
        return fetch(data.species.url)
      })
      .then((response) => response.json())
      .then((speciesData) => {
        const englishEntry = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === 'en'
        )
        const cleanedText = englishEntry
          ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ')
          : 'No description available.'
        setDescription(cleanedText)

        const englishGenus = speciesData.genera.find(
          (g) => g.language.name === 'en'
        )
        setGenus(englishGenus ? englishGenus.genus : '')

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
    setShowSuggestions(false)
  }

  function handleSuggestionSelect(name) {
    setSearchInput(name)
    setPokemonName(name)
    setShowSuggestions(false)
  }

  function handleCardMouseMove(event) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()

  // Mouse position relative to the card, as a -1 to 1 range from center
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5

  const maxTilt = 14 // degrees

  setTilt({
    rotateY: x * maxTilt * 2,   // left/right mouse movement tilts around vertical axis
    rotateX: -y * maxTilt * 2,  // up/down mouse movement tilts around horizontal axis (inverted so it feels natural)
  })
}

function handleCardMouseLeave() {
  setIsHovering(false)
  setTilt({ rotateX: 0, rotateY: 0 })
}

  const suggestions =
    searchInput.trim().length > 0
      ? allNames
          .filter((name) => name.startsWith(searchInput.trim().toLowerCase()))
          .slice(0, 8)
      : []

  const mainType = pokemon?.types?.[0]?.type?.name
  const bgColor = typeColors[mainType] || '#888'
  const hw = pokemon ? formatHeightWeight(pokemon.height, pokemon.weight) : null

  return (
    <div className="app">
      <GrassRustle />

      <div className="search-panel">
        <h1 className="title">Smélvindex</h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-wrapper">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)}
              placeholder="Search a Pokémon..."
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((name) => (
                  <li
                    key={name}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSuggestionSelect(name)
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit">Search</button>
        </form>

        {loading && <p className="status">Loading...</p>}
        {error && <p className="status error">{error}</p>}
      </div>

      {pokemon && !loading && !error && (
        <div
          className="card"
          style={{
            backgroundColor: bgColor,
            transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovering ? 1.04 : 1})`,
            transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease',
          }}
          onMouseMove={handleCardMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-header">
            <h2 className="pokemon-name">{pokemon.name}</h2>
            <span className="card-id">No. {String(pokemon.id).padStart(3, '0')}</span>
          </div>

          {genus && <p className="genus">{genus}</p>}

          <div className="artwork-frame">
            <img
              className="sprite-pixel"
              src={pokemon.sprites.front_default}
              alt={`${pokemon.name} pixel sprite`}
            />
          </div>

          <div className="types">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className="type-badge">
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="info-row">
            <div className="info-block">
              <span className="info-label">Height</span>
              <span className="info-value">{hw.height}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Weight</span>
              <span className="info-value">{hw.weight}</span>
            </div>
          </div>

          <div className="abilities">
            <span className="info-label">Abilities</span>
            <div className="ability-list">
              {pokemon.abilities.map((a) => (
                <span key={a.ability.name} className="ability-badge">
                  {a.ability.name.replace('-', ' ')}
                  {a.is_hidden && <em> (hidden)</em>}
                </span>
              ))}
            </div>
          </div>

          <p className="description">{description}</p>
        </div>
      )}
    </div>
  )
}

export default App