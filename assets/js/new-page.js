const urlParams = new URLSearchParams(window.location.search)

const pokemonId = urlParams.get("id")
const pokemonType = urlParams.get("type")
const pokemonName = urlParams.get("name")
const pokemonPhoto = urlParams.get("photo")
const pokemonTypes = urlParams.get("types").split(" ")
const offset = urlParams.get("offset")
const pokemonAbilities = urlParams.get("abilities").split(" ")
const pokemonBaseExperience = urlParams.get("base_experience")
const pokemonHeight = urlParams.get("height")
const pokemonWeight = urlParams.get("weight")
const pokemonStats = JSON.parse(decodeURIComponent(urlParams.get("stats")))
const pokemonEggGroups = urlParams.get("egg_groups").split(" ")
const pokemonSpecie = urlParams.get("specie")

const body = document.getElementById("body-new-page")
const detailsPokemon = document
  .getElementById("section-details")
  .querySelectorAll("details")
const header = document.getElementById("section-title").querySelector("header")
const detail = document.getElementById("section-title").querySelector(".detail")
const details1 = document
  .getElementById("details-1")
  .querySelector(".details-pokemon")
const details2 = document
  .getElementById("details-2")
  .querySelector(".details-pokemon")

detailsPokemon.forEach((details) => {
  details.addEventListener("toggle", () => {
    if (details.open) {
      detailsPokemon.forEach((otherDetails) => {
        if (otherDetails !== details && otherDetails.open) {
          otherDetails.open = false
        }
      })
    }
  })

  details.addEventListener("click", (event) => {
    if (details.open) {
      event.preventDefault()
    }
  })
})

body.classList.add(pokemonType)

header.innerHTML = `
  <button type="button" id="back" onclick="window.location.href = 'index.html?offset=${offset}'">
    <span class="material-symbols-outlined"> arrow_back </span>
  </button>
  <h1>${pokemonName}</h1>
  <span class="number">#${pokemonId}</span>
  <ol class="types">
    ${pokemonTypes
      .map((type) => `<li class="type ${type}">${type}</li>`)
      .join("")}
  </ol>`

detail.innerHTML = `
  <img src="${pokemonPhoto}" alt="${pokemonName}"/>
`
details1.innerHTML = `
  <table>
    <tr>
      <td><span class="span-cell">Species</span></td>
      <td>${pokemonSpecie}</td>
    </tr>
    <tr>
      <td><span class="span-cell">Height</span></td>
      <td>${cmToFeetInches(pokemonHeight * 10)} (${pokemonHeight * 10} cm)</td>
    </tr>
    <tr>
      <td><span class="span-cell">Weight</span></td>
      <td>${kgToLbs(pokemonWeight / 10)} lbs (${pokemonWeight / 10} kg)</td>
    </tr>
    <tr>
      <td><span class="span-cell">Abilities</span></td>
      <td>${pokemonAbilities.join(", ")}</td>
    </tr>
  </table>
  <table class="table-title">
    <tr>
      <th><h3>Spawning</h3></th>
    </tr>

    <tr>
      <td><span class="span-cell">Egg Groups</span></td>
      <td>${pokemonEggGroups.join(", ")}</td>
    </tr>
    <tr>
      <td><span class="span-cell">Base Exp.</span></td>
      <td>${pokemonBaseExperience}</td>
    </tr>
  </table>`

// Função para converter quilogramas em libras
function kgToLbs(kg) {
  let lbs = kg * 2.20462
  return lbs.toFixed(2)
}

// Função para converter centímetros em pés e polegadas
function cmToFeetInches(cm) {
  let totalInches = cm / 2.54
  let feet = Math.floor(totalInches / 12)
  let inches = (totalInches % 12).toFixed(1)
  return feet + "' " + inches + '"'
}

details2.innerHTML = `
  <table>
  <tr>
    <td><span class="span-cell">HP</span></td>
    <td>${pokemonStats.find((stat) => stat.name === "hp").base_stat}</td>
  </tr>
  <tr>
    <td><span class="span-cell">Attack</span></td>
    <td>${pokemonStats.find((stat) => stat.name === "attack").base_stat}</td>
  </tr>
  <tr>
    <td><span class="span-cell">Defense</span></td>
    <td>${pokemonStats.find((stat) => stat.name === "defense").base_stat}</td>
  </tr>
  <tr>
    <td><span class="span-cell">Special Attack</span></td>
    <td>${
      pokemonStats.find((stat) => stat.name === "special-attack").base_stat
    }</td>
  </tr>
  <tr>
    <td><span class="span-cell">Special Defense</span></td>
    <td>${
      pokemonStats.find((stat) => stat.name === "special-defense").base_stat
    }</td>
  </tr>
  <tr>
    <td><span class="span-cell">Speed</span></td>
    <td>${pokemonStats.find((stat) => stat.name === "speed").base_stat}</td>
  </tr>
  <tr>
    <td><span class="span-cell">Total</span></td>
    <td>${pokemonStats.reduce((soma, stat) => soma + stat.base_stat, 0)}</td>
  </tr>
  </table>`
