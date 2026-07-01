import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [pokemonName, setPokemonName] = useState('bulbasaur')
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Pokémon not found')
        }
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

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search a Pokémon..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {pokemon && !loading && !error && (
        <div>
          <h1>{pokemon.name}</h1>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
      )}
    </div>
  )
}

export default App