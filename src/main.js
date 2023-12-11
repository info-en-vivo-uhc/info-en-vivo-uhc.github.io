import { printError, getJson, IconPaths, Traductor } from './auxiliares.js';

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
    updateVida(numJugador, stats_jugador["vida"]);
    categorias.forEach(categoria => {
        let attr = categoria+"_"+numJugador;
        let categoryHTML = document.getElementById(attr); // Encuentra el elemento "p" en el sitio
        //console.log("JUGADOR: "+info_jugador["nombre"]+"\nCategoria: "+categoria+"\nStats: "+JSON.stringify(stats_jugador[categoria]));
        crearLuegoAgregarContenido(categoria, categoryHTML, stats_jugador[categoria]);
    });
}

async function updateVida(numJugador, numVida) {
    let vidaHTML = document.getElementById("vida_"+numJugador); // Encuentra el elemento "p" en el sitio
    vidaHTML.appendChild(barraCorazones(numVida));
}

function barraCorazones(num) {
    let elem = document.createElement("div");
    for (let i = 0; i < Math.floor(num); i++) {
        elem.appendChild(crearImgElem(IconPaths.corazones+"hardcore_full.png"), "20px", "20px", "Hardcore full heart");
    }
    if (!Number.isInteger(num)) {
        elem.appendChild(crearImgElem(IconPaths.corazones+"hardcore_half.png"), "20px", "20px", "Hardcore half heart");
    }
    // Chequeo si falta agregar contenedores de corazón vacío; redondeo para arriba porque el medio corazon cuenta como un contenedor completo.
    while (Math.round(num) < 10) {
        elem.appendChild(crearImgElem(IconPaths.corazones+"heart_container.png"), "20px", "20px", "Empty heart container");
        num++;
    }
    return elem;
}

function crearImgElem(path, height=null, width=null, alt=null) {
    /*
    let imgHTML = document.createElement("canvas");
    let ctx = imgHTML.getContext("2d");
    ctx.drawImage(path, 0, 0, width, height);
    imgHTML.setAttribute("alt", alt);
    */
    let imgHTML = document.createElement("img");
    imgHTML.setAttribute("src", path);
    imgHTML.setAttribute("height", height);
    imgHTML.setAttribute("width", width);
    imgHTML.setAttribute("alt", alt);
    return imgHTML;
}

async function crearLuegoAgregarContenido(categoria, categoryHTML, stats_jugador_en_categoria) {
    let elem = document.createElement("div");
    switch (categoria) {
        case "equipamiento":
            for (let k in stats_jugador_en_categoria) {
                let nombreImg = Traductor.traducirEquipamiento(k, stats_jugador_en_categoria[k]);
                let elemImg = crearImgElem(IconPaths.equipamiento+nombreImg, 32, 32, k + " " + stats_jugador_en_categoria[k]["material"]);
                elem.appendChild(elemImg);
            }
            break;
        case "minerales":
            elem.innerText = 1;
            break;
        case "curacion":
            elem.innerText = 2;
            break;
        case "nether_pociones":
            elem.innerText = 3;
            break;
        case "miscelaneo":
            elem.innerText = 4;
            break;
        case "inventario":
            elem.innerText = 5;
            break;
        default:
            elem.innerText = -1;
      }
      categoryHTML.appendChild(elem); 
}