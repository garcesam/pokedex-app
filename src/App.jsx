import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching Pokémon:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (!pokemon) return <p>Something went wrong.</p>

  return (
    <div className="App">
      <h1>{pokemon.name}</h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />
    </div>
  )
}

export default App