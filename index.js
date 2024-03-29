const pokemonTab = document.getElementById("pokemon");

async function getPokemonEvolutionChain(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const data = await response.json();
        const evolutionChainURL = data.evolution_chain.url;

        const responseChain = await fetch(evolutionChainURL);
        const evolutionData = await responseChain.json();
        
        const chain = [];
        let current = evolutionData.chain;
        
        while (current) {
            if (current.species.name !== data.name) {
                chain.push({
                    name: current.species.name,
                    id: current.species.url.split("/")[6]
                });
            }
            current = current.evolves_to[0];
        }

        return chain;
    } catch (error) {
        console.error("Erreur lors de la récupération de la chaîne d'évolution:", error);
        return [];
    }
}


async function getPokemonWeaknesses(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();

        const types = data.types.map(type => type.type.name);
        const weaknesses = await Promise.all(types.map(async (type) => {
            const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const typeData = await typeResponse.json();
            const doubleDamageFrom = typeData.damage_relations.double_damage_from.map(damageType => damageType.name);
            return doubleDamageFrom;
        }));

        return weaknesses.flat();
    } catch (error) {
        console.error("Erreur lors de la récupération des faiblesses du Pokémon:", error);
        return [];
    }
}

async function getPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();

        return {
            name: data.name,
            height: data.height,
            weight: data.weight,
            weaknesses: await getPokemonWeaknesses(pokemonId)
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du Pokémon:", error);
        return null;
    }
}

async function pokemonlist() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();
        
        const cardPoke = document.getElementById("cardPoke");
        cardPoke.innerHTML = "";

        for (const pokemon of data.results) {
            const pokemonId = pokemon.url.split("/")[6];
            const evolutionChain = await getPokemonEvolutionChain(pokemonId);
            const evolutions = evolutionChain.map((evolution) => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png" alt="${evolution.name}" data-pokemon-id="${evolution.id}" class="evolution-image">`).join(" ");

            const pokemonDetails = await getPokemonDetails(pokemonId);
            const height = pokemonDetails.height;
            const weight = pokemonDetails.weight;
            const weaknesses = pokemonDetails.weaknesses.join(", ");

            const card = document.createElement("div");
            card.classList.add("card", "mb-3");
            card.id = `pokemon-${pokemonId}`;
            card.style.maxWidth = "940px";
            card.style.backgroundColor = "rgb(255, 154, 2)";
            card.style.borderColor = "green";
            card.style.marginTop = "10px";
            card.style.borderStyle = "solid";
            card.style.borderRadius = "20px";
            card.style.borderWidth = "4px";

            const responseSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
            const speciesData = await responseSpecies.json();
            const description = speciesData.flavor_text_entries.find((entry) => entry.language.name === "en").flavor_text.replace(/[^a-zA-Z0-9.,!?é ]/g, '');

            const responsePokemon = await fetch(pokemon.url);
            const pokemonData = await responsePokemon.json();
            const typeNames = pokemonData.types.map((type) => type.type.name).join(", ");

            card.innerHTML = `
            <div class="row g-0">
                <div class="col-md-3 d-flex flex-column align-items-center">
                    <img src="images/gameboy.png" class="img-fluid rounded-start" style="margin-bottom: -20px;">
                    <div class="position-relative" style="margin-top: -190px;">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" class="img-fluid rounded-start" alt="${pokemon.name}">
                    </div>
                    <h5 class="card-title text-center" style="margin-top: 125px;">${pokemon.name}</h5>
                    <p class="card-text">#${String(pokemonId).padStart(3, '0')}</p>
                </div>
                <div class="col-md-9">
                    <div class="card-body">
                        <p class="card-text">Description : ${description}</p>
                        <p class="card-text">Size and weight : ${height} dm, ${weight} hg</p>
                        <p class="card-text">Type : ${typeNames}</p>
                        <p class="card-text">Weaknesses : ${weaknesses}</p>
                        <p class="evolution-icons">Evolutions :<br>${evolutions}</p>
                    </div>
                </div>
            </div>`;

            cardPoke.appendChild(card);
        }

                const evolutionImages = document.querySelectorAll(".evolution-image");
        evolutionImages.forEach(image => {
            image.addEventListener("mouseenter", () => {
                image.style.cursor = "pointer";
            });
        
            image.addEventListener("mouseleave", () => {
                image.style.cursor = "auto";
            });
        
            image.addEventListener("click", () => {
                const pokemonId = image.dataset.pokemonId;
                const targetCard = document.getElementById(`pokemon-${pokemonId}`);
                if (targetCard) {
                    const windowHeight = window.innerHeight;
                    const cardHeight = targetCard.offsetHeight;
                    const offsetTop = targetCard.offsetTop;
                    const scrollTo = offsetTop - (windowHeight - cardHeight) / 2;
                    window.scrollTo({ top: scrollTo, behavior: "smooth" });
                }
            });
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon:", error);
    }
}

pokemonlist();



function SearchPoke() {
    const pokeFound = document.getElementById("pokemon-name").value.toLowerCase();
    const allPokemon = document.querySelectorAll(".card");
    
    allPokemon.forEach(card => {
        const pokemonName = card.querySelector(".card-title").textContent.toLowerCase();
        const pokemonId = card.querySelector(".card-text").textContent.replace("#", "").trim();

        if (pokemonName.includes(pokeFound) || pokemonId.includes(pokeFound)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

const inputField = document.getElementById("pokemon-name");
inputField.addEventListener("input", SearchPoke);








window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("btnScrollToTop").style.display = "block";
    } else {
        document.getElementById("btnScrollToTop").style.display = "none";
    }
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
}