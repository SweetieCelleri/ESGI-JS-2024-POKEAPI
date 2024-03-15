const pokemonTab = document.getElementById("pokemon");
const recherche = document.getElementById("recherche");



recherche.addEventListener("click", function () {
  
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151", options)
    .then((response) => response.json())
    .then((id) => {
        pokemonTab.innerHTML = "";
        id.results.forEach((ids) => {
            let newRow = pokemonTab.insertRow();
            let newCell = newRow.insertCell();
            newCell.innerHTML = ids.name;
        });
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des détails du livre:", error);
    });
});








function pokemonlist () {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((response) => response.json())
    .then((data) => {
        pokemonTab.innerHTML = "";
        data.results.forEach((pokemon) => {
            let newRow = pokemonTab.insertRow();
            let newCell = newRow.insertCell();
            newCell.innerHTML = `<p>Le nom du pokémon est : ${pokemon.name}</p>
            <p>Description : ${pokemon.description}</p>
            <p>Type : ${pokemon.url}</p>`;
        });
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des détails:", error);
    });
};

pokemonlist()
