const pokeApi = {}

const convertPokeApiDetailToPokemon = async (pokeDetail) => {
  const pokemon = new Pokemon()
  pokemon.id = pokeDetail.id
  pokemon.name = pokeDetail.name

  pokemon.abilities = pokeDetail.abilities.map(
    (abilitySlot) => abilitySlot.ability.name
  )
  pokemon.base_experience = pokeDetail.base_experience
  pokemon.height = pokeDetail.height
  pokemon.weight = pokeDetail.weight
  pokemon.stats = pokeDetail.stats.map((statSlot) => {
    return {
      name: statSlot.stat.name,
      base_stat: statSlot.base_stat,
    }
  })

  const speciesData = await fetch(pokeDetail.species.url).then((response) =>
    response.json()
  )

  pokemon.egg_groups = speciesData.egg_groups.map((eggGroup) => eggGroup.name)
  pokemon.specie = speciesData.genera
    .find((genera) => genera.language.name === "en")
    .genus.replace(" Pokémon", "")

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
}
