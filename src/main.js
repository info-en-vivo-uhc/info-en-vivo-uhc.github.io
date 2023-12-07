import { printError, getJson } from './auxiliares.js';

var categorias = ["equipamiento","minerales","curacion","nether_pociones","miscelaneo","inventario"]

main()

function main() {
    loadStats(11, 1, "elrichmc", null);
}

async function loadStats(temp, ep, jugador, equipo) {
    if (equipo == null) {
        var info_jugadores = await getJson("../data/"+temp+"/jugadores.json");
        var info_jugador = info_jugadores[jugador];
        var stats_jugadores = await getJson("../data/"+temp+"/"+ep+".json");
        var stats_jugador = stats_jugadores[jugador];
        updateStats(info_jugador, stats_jugador, 1);
    } else {
        var equipo_data = await getJson("../data/"+temp+"/equipos.json");
        //equipo_data[equipo];
    }
}

function updateStats(info_jugador, stats_jugador, numJugador) {
    let nameHTML = document.getElementById("displayname_"+numJugador); // Encuentra el elemento "p" en el sitio
    nameHTML.innerHTML = info_jugador["nombre"]
    let vidaHTML = document.getElementById("vida_"+numJugador); // Encuentra el elemento "p" en el sitio
    vidaHTML.appendChild(crearCorazones(stats_jugador["vida"]));
    categorias.forEach(categoria => {
        let attr = categoria+"_"+numJugador;
        let categoryHTML = document.getElementById(attr); // Encuentra el elemento "p" en el sitio
        console.log("JUGADOR: "+info_jugador["nombre"]+"\nCategoria: "+categoria+"\nStats: "+JSON.stringify(stats_jugador[categoria]));
        categoryHTML.innerHTML = crearContenido(categoria, categoryHTML, stats_jugador[categoria]);
    });
}

function crearCorazones(num) {
    var elem = document.createElement("div");
    for (let i = 0; i < Math.floor(num); i++) {
        let cora = document.createElement("img");
        cora.setAttribute("src", "../img/assets/hardcore_full.png");
        cora.setAttribute("height", "20px");
        cora.setAttribute("width", "20px");
        cora.setAttribute("alt", "Hardcore full heart");
        elem.appendChild(cora);
    }
    if (!Number.isInteger(num)) {
        let medio_cora = document.createElement("img");
        medio_cora.setAttribute("src", "../img/assets/hardcore_half.png");
        medio_cora.setAttribute("height", "20px");
        medio_cora.setAttribute("width", "20px");
        medio_cora.setAttribute("alt", "Hardcore half heart");
        elem.appendChild(medio_cora);
    }
    // Chequeo si falta agregar contenedores de corazón vacío; redondeo para arriba porque el medio corazon cuenta como un contenedor completo.
    while (Math.round(num) < 10) {
        let cora_vacio = document.createElement("img");
        cora_vacio.setAttribute("src", "../img/assets/heart_container.png");
        cora_vacio.setAttribute("height", "20px");
        cora_vacio.setAttribute("width", "20px");
        cora_vacio.setAttribute("alt", "Empty heart container");
        elem.appendChild(cora_vacio);
        num++;
    }
    return elem;
}

function crearContenido(categoria, categoryHTML, stats) {
    return 1;
}