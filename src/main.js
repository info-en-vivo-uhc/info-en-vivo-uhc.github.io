import { printError, getJson } from './aux.js';

async function loadStats(temp, ep, jugador, equipo) {
    if (equipo == null) {
        var jugador_data = await getJson("../data/"+temp+"/equipos.json");
        var jugador_actual = jugador_data[jugador];
        var ep_data = await getJson("../data/"+temp+"/"+ep+".json");
        var ep_actual = ep_data[jugador];
        updateStats(jugador_actual, ep_actual, 1);
    } else {
        var equipo_data = await getJson("../data/"+temp+"/equipos.json");
        //equipo_data[equipo];
    }
}

function updateStats(jugador_actual, ep_actual, numJugador) {

}
