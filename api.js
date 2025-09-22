
// --------    testes realizados para buscar o link da api correto ---------

// function pokemonsFotos(obj) {
//     console.log(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${obj.id}.png`)
// }



// --------    primeira função criada para buscar os pokemons  -------
// function pesquisaId(nome, divs) {
//     fetch(`https://pokeapi.co/api/v2/pokemon/${nome}/`)
//         .then(resp => resp.json())
//         .then(obj => {
//             // comola a imagem do pokemon no card
//             // pokemonsFotos(obj.id)
//             let img = document.createElement('img');
//             img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${obj.id}.png`;
        
            
//             // acrescenta o nome do pokemon
//             let nomePoke = document.createElement('p');
//             nomePoke.textContent = nome;

//             divs.appendChild(img);
//             divs.appendChild(nomePoke);

//         })
// }







// faz a requisição dos pokemons para API e adiciona o nome deles no option junto com o value:nome. Perenchendo o select com o nome de todos os pokemons. Limite de 250 nomes.
(function () {
    fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=250`)
        .then(resp => resp.json())
        .then(obj => {
            let lista = document.querySelector('#buscarPokemon');
            obj.results.forEach(item => {
                let option = document.createElement('option');
                option.value = item.name;
                // console.log(item.id);
                option.innerHTML = item.name;
                lista.appendChild(option);
            });
        });
})();

(function () {
    let form = document.querySelector('#addPokemon');
    form.addEventListener("submit", function (evt) {
        // -- previne o comportamento padrao do formulario
        evt.preventDefault();

        let nomePokemon = document.querySelector('#buscarPokemon').value;
        fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`)
        .then(resposta => resposta.json())
        .then(obj => {

            mostrarPokemon(obj);
            let pokemonsGuardados = JSON.parse(localStorage.getItem("pokemons"));
            if(!pokemonsGuardados) {
                pokemonsGuardados = [];
            }
            if(!pokemonsGuardados.includes(obj.name)) {
                pokemonsGuardados.push(obj.name);
                
                localStorage.setItem("pokemons", JSON.stringify(pokemonsGuardados));
                criarCardPokemon(obj);
            } 
        });
    });
})();

function mostrarPokemon(pokemon) {
    let divCard = document.getElementById('poke');
    // -- usei esse innerHTML vazio para apagar a busca do pokemon anterior --
    divCard.innerHTML = "";

    let divMostrar = document.createElement('div');
    divCard.appendChild(divMostrar);
    divMostrar.id = "mostrar";

    let img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    let nomeP = document.createElement('p');
    nomeP.textContent = pokemon.name;

    let status = document.createElement('button');
    status.textContent = 'Status';
    status.addEventListener('click', () => {
        botaoSkill (pokemon.name);
    })
    let descricao = document.createElement('button');
    descricao.textContent = 'Descrição';
    descricao.addEventListener('click', () => {
        botaoStatus(pokemon.name);
    })
    let audio = document.createElement('button');
    audio.textContent = 'Áudio';
    audio.addEventListener('click', () => {
        botaoAudio(pokemon.id);
    })

    // let grito = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`);

    // grito.play()
    divMostrar.appendChild(img);
    divMostrar.appendChild(nomeP);
    divMostrar.appendChild(status);
    divMostrar.appendChild(descricao);
    divMostrar.appendChild(audio);
}

function criarCardPokemon (pokemon) {
    let divCard = document.getElementById('pokemon');
    // -- usei esse innerHTML vazio para apagar a busca do pokemon anterior --
    // divCard.innerHTML = "";

    let divMostrar = document.createElement('div');
    divCard.appendChild(divMostrar);

    let img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    let nomeP = document.createElement('p');
    nomeP.textContent = pokemon.name;

    let button = document.createElement('button');
    button.textContent = 'remover';

    divMostrar.addEventListener('click', evt => {
        // console.log(evt);
        if (evt.target === button) {
            // busca o poquemon salvo no localstorage, retornando uma string e depois o .parce converte em um array
            let guardados = JSON.parse(localStorage.getItem("pokemons"));
            // encontra a posição indice do nome do pokemon
            let index = guardados.indexOf(pokemon.name);
            // remove o item index do array guardados
            guardados.splice(index, 1);
            // .stringify transforma o array em string e o .setItem salva novamento no localStorage
            localStorage.setItem("pokemons", JSON.stringify(guardados));
            // apaga a div da pagina
            divMostrar.remove();
        } else {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                .then(resposta => resposta.json())
                .then(obj => {
                    mostrarPokemon(obj);
                });
        }
    });
    
    divMostrar.appendChild(img);
    divMostrar.appendChild(nomeP);
    divMostrar.appendChild(button);
}

//  verifica se a lista está vazia.
function listarGuardados() {
    // busca os dados que estão armazenados no localStorage
    let guardados = JSON.parse(localStorage.getItem("pokemons"));
    if(guardados) {
        guardados.forEach(guardado => {
            fetch(`https://pokeapi.co/api/v2/pokemon/${guardado}`)
                .then(resposta => resposta.json())
                .then(obj => {
                    criarCardPokemon (obj);
                });
        })
    };
} listarGuardados();

function botaoSkill (nomePoke) {
    let divSkill = document.getElementById("poke");

    let divExistente = document.getElementById('descricao');
    if (divExistente) {
        divSkill.removeChild(divExistente);
    }

    let divM = document.createElement('div');
    divM.id = 'descricao';
    divSkill.appendChild(divM);

    fetch(`https://pokeapi.co/api/v2/pokemon/${nomePoke}/`)
        .then(resposta => resposta.json())
        .then(data => {
            
            let hp = document.createElement('p');
            hp.textContent = `HP: ${data.stats.find(stat => stat.stat.name === "hp").base_stat}`;
            
            let ataque = document.createElement('p');
            ataque.textContent = `Ataque: ${data.stats.find(stat => stat.stat.name === "attack").base_stat}`;
            
            let defesa = document.createElement('p');
            defesa.textContent = `Defesa: ${data.stats.find(stat => stat.stat.name === "defense").base_stat}`;
            
            let ataqueEspecial = document.createElement('p');
            ataqueEspecial.textContent = `Ataque Especial: ${data.stats.find(stat => stat.stat.name === "special-attack").base_stat}`;
            
            let defesaEspecial = document.createElement('p');
            defesaEspecial.textContent = `Defesa Especial: ${data.stats.find(stat => stat.stat.name === "special-defense").base_stat}`;

            let velocidade = document.createElement('p');
            velocidade.textContent = `Velocidade: ${data.stats.find(stat => stat.stat.name === "speed").base_stat}`;

            divM.appendChild(hp);
            divM.appendChild(ataque);
            divM.appendChild(defesa);
            divM.appendChild(ataqueEspecial);
            divM.appendChild(defesaEspecial);
            divM.appendChild(velocidade);
            })
}

function botaoStatus (nomePoke) {
    let divStatus = document.getElementById("poke");

    let divExistente = document.getElementById('descricao');
    if (divExistente) {
        divStatus.removeChild(divExistente);
    }

    let divM = document.createElement('div');
    divM.id = 'descricao';
    divStatus.appendChild(divM);
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${nomePoke}/`)
        .then(resposta => resposta.json())
        .then(data => {
            
            let tipo = document.createElement('p');
            tipo.textContent = `Espécie: ${data.types.map(type => type.type.name)}`;
            
            let altura = document.createElement('p');
            let alturaAPI = data.height*10
            altura.textContent = `Altura: ` + alturaAPI + ' cm';
            
            let peso = document.createElement('p');
            let pesoAPI = data.weight / 10;
            peso.textContent = `Peso: ` + pesoAPI + ' kg';
            
            let habilidade = document.createElement('p');
            habilidade.textContent = `Habilidades: ${data.abilities.map(abilities => abilities.ability.name)}`;
            
            divM.appendChild(tipo);
            divM.appendChild(altura);
            divM.appendChild(peso);
            divM.appendChild(habilidade);
            })
}

function botaoAudio (id) {

    let grito = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);

    grito.play()

}



