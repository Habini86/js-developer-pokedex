const pokemonList = document.getElementById("pokemonList")
const loadMoreButton = document.getElementById("loadMoreButton")
let pokemonItems
const maxRecords = 151
let limit = 10
let offset = 0
const urlParams = new URLSearchParams(window.location.search)
const offset_url = urlParams.get("offset")

const updateCachedPokemons = (pokemons) => {
  localStorage.setItem("cached_pokemons", JSON.stringify(pokemons))
}

const convertPokemonToLi = (pokemon) => {
  loadMoreButton.style.display = "inline-block"
  return `
    <li class="pokemon ${pokemon.type}" id="${pokemon.id}"
    data-abilities="${pokemon.abilities}"
    data-base-experience="${pokemon.base_experience}"
    data-height="${pokemon.height}"
    data-weight="${pokemon.weight}"
    data-stats='${JSON.stringify(pokemon.stats)}'
    data-egg-groups="${pokemon.egg_groups}"
    data-specie="${pokemon.specie}">        
      <span class="number">#${("00" + pokemon.id).slice(-3)}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types
            .map((type) => `<li class="type ${type}">${type}</li>`)
            .join("")}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `
}

loadMoreButton.addEventListener("click", () => {
  loadMoreButton.style.display = "none"
  offset += limit
  loadPokemons()
})

const loadPokemonItems = (offset, limit, cachedPokemons = []) => {
  const pokemonsToLoad = cachedPokemons.slice(offset, offset + limit)
  const newHtml = pokemonsToLoad.map(convertPokemonToLi).join("")
  pokemonList.innerHTML += newHtml
}

// Funções auxiliares
const getPokemonId = (pokemon) =>
  pokemon.querySelector(".number").textContent.replace("#", "")
const getPokemonType = (pokemon) => pokemon.querySelector(".type").textContent
const getPokemonTypes = (pokemon) =>
  Array.from(pokemon.querySelectorAll(".type"))
    .map((type) => type.textContent)
    .join(" ")
const getPokemonName = (pokemon) => pokemon.querySelector(".name").textContent
const getPokemonPhoto = (pokemon) => pokemon.querySelector("img").src

const getPokemonAbilities = (pokemon) =>
  pokemon.dataset.abilities.split(",").join(" ")
const getPokemonBaseExperience = (pokemon) =>
  Number(pokemon.dataset.baseExperience)
const getPokemonHeight = (pokemon) => Number(pokemon.dataset.height)
const getPokemonWeight = (pokemon) => Number(pokemon.dataset.weight)
const getPokemonStats = (pokemon) => pokemon.dataset.stats
const getPokemonEggGroups = (pokemon) =>
  pokemon.dataset.eggGroups.split(",").join(" ")
const getPokemonSpecie = (pokemon) => pokemon.dataset.specie

const removeLoadMoreButtonIfLastPage = (qtdRecordsWithNextPage) => {
  qtdRecordsWithNextPage >= maxRecords &&
    loadMoreButton.parentElement.removeChild(loadMoreButton)
}

// Função para anexar eventos de clique aos Pokemons
const attachClickEventsToPokemon = () => {
  pokemonItems = document.querySelectorAll(".pokemon")

  pokemonItems.forEach(function (pokemon) {
    pokemon.addEventListener("click", function () {
      const id = getPokemonId(pokemon)
      const firstType = getPokemonType(pokemon)
      const types = getPokemonTypes(pokemon)
      const name = getPokemonName(pokemon)
      const photo = getPokemonPhoto(pokemon)

      const abilities = getPokemonAbilities(pokemon)
      const base_experience = getPokemonBaseExperience(pokemon)
      const height = getPokemonHeight(pokemon)
      const weight = getPokemonWeight(pokemon)
      const stats = getPokemonStats(pokemon)
      const egg_groups = getPokemonEggGroups(pokemon)
      const specie = getPokemonSpecie(pokemon)

      window.location.search !== "" && offset == 0
        ? (offset = parseInt(offset_url))
        : (offset = offset)

      window.location.href = `new-page.html?id=${id}&type=${firstType}&name=${name}&photo=${photo}&types=${types}&offset=${offset}&abilities=${abilities}&base_experience=${base_experience}&height=${height}&weight=${weight}&stats=${encodeURIComponent(
        stats
      )}&egg_groups=${egg_groups}&specie=${specie}`
    })
  })
}

const loadPokemons = () => {
  let cachedPokemons = JSON.parse(localStorage.getItem("cached_pokemons")) || []
  if (cachedPokemons.length === 0 && parseInt(offset_url) > 0) {
    offset = 0
  }

  const qtdRecordsWithNextPage = offset + limit

  if (
    cachedPokemons.length >= offset + limit ||
    cachedPokemons.length === maxRecords
  ) {
    loadPokemonItems(offset, limit, cachedPokemons)
    attachClickEventsToPokemon()
    removeLoadMoreButtonIfLastPage(qtdRecordsWithNextPage)
  } else if (cachedPokemons.length < maxRecords) {
    const newLimit =
      qtdRecordsWithNextPage >= maxRecords ? maxRecords - offset : limit

    pokeApi
      .getPokemons(cachedPokemons.length, newLimit)
      .then((pokemons = []) => {
        cachedPokemons = [...cachedPokemons, ...pokemons]
        updateCachedPokemons(cachedPokemons)
        loadPokemonItems(offset, limit, cachedPokemons)
        attachClickEventsToPokemon()

        removeLoadMoreButtonIfLastPage(qtdRecordsWithNextPage)
      })
      .then(() => {
        window.location.search !== "" && offset == 0
          ? (offset = parseInt(offset_url))
          : (offset = offset)
        limit = 10
      })
  }
}

window.location.search !== "" && offset_url != 0
  ? (limit = parseInt(offset_url) + 10)
  : (limit = limit)

loadPokemons()

// Funções para limpar o cache
const clear = () => localStorage.clear()

// Função para verificar o cache
const key = () =>
  console.log(JSON.parse(localStorage.getItem("cached_pokemons")))
