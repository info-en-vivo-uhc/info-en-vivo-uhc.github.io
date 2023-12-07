import { printError, getJson } from './auxiliares.js';

var categorias = ["equipamiento","minerales","curacion","nether_pociones","miscelaneo","inventario"]

main()

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
    let p = document.getElementById("displayname_"+numJugador); // Encuentra el elemento "p" en el sitio
    p.innerHTML = info_jugador["nombre"]
    categorias.forEach(categoria => {
        let attr = categoria+"_"+numJugador;
        let p = document.getElementById(attr); // Encuentra el elemento "p" en el sitio
        console.log("JUGADOR: "+info_jugador["nombre"]+"\nCategoria: "+categoria+"\nStats: "+JSON.stringify(stats_jugador[categoria]));
        //p.innerHTML = createContent(categoria, p, stats_jugador[categoria]);
    });
}

function main() {
    loadStats(11, 1, "elrichmc", null);
}