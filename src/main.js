import { printError, getJson, IconPaths, Traductor, Temporadas } from './auxiliares.js';

var categorias = ["equipamiento","minerales","curacion","nether_pociones","miscelaneo","inventario"]
var panel_on = [true,true,true]

var TEMPORADA_ACTUAL = 11;
var EPISODIO_ACTUAL = 1;
main()

function main() {
    loadPlayers(TEMPORADA_ACTUAL, EPISODIO_ACTUAL);
    loadSelectorEpisodios(TEMPORADA_ACTUAL, EPISODIO_ACTUAL);
}

async function loadPlayers(temp, ep) {
    var info_equipos = await getJson("../data/"+temp+"/equipos.json");
    var info_jugadores = await getJson("../data/"+temp+"/jugadores.json");
    for (let index = 0; index < Object.keys(info_equipos).length; index++) {
        let equipo = Object.keys(info_equipos)[index];
        let info_equipo = info_equipos[equipo];
        for (let i_miembro = 0; i_miembro < info_equipo["miembros"].length; i_miembro++) {
            const jugador = info_equipo["miembros"][i_miembro];
            let selectorHTML = document.getElementById("selector_jugador");
            let iconHTML = crearImgElem([IconPaths.iconos_jugadores + jugador + ".png"], 40, 40, info_jugadores[jugador]["nombre"]);
            iconHTML.onclick = function() {
                loadTeam(temp, ep, jugador);
            }
            selectorHTML.appendChild(iconHTML);
        }
    }
    loadTeam(TEMPORADA_ACTUAL, EPISODIO_ACTUAL, Object.keys(info_jugadores)[0]);
}

async function loadTeam(temp, ep, jugador) {
    var info_jugadores = await getJson("../data/"+temp+"/jugadores.json");
    var info_jugador = info_jugadores[jugador];
    var stats_jugadores = await getJson("../data/"+temp+"/"+ep+".json");
    var stats_jugador = stats_jugadores[jugador];
    if (info_jugador["equipo"] != null) {
        var info_equipo = await getJson("../data/"+temp+"/equipos.json");
        info_equipo = info_equipo[info_jugador["equipo"]];
        var numTeamMembers = info_equipo["miembros"].length;
    }
    for (let index = 0; index < numTeamMembers; index++) {
        jugador = info_equipo["miembros"][index];
        info_jugador = info_jugadores[jugador];
        stats_jugador = stats_jugadores[jugador];
        loadStats(info_jugador, stats_jugador, index+1);
    }
    for (let index = 2; index > numTeamMembers-1; index--) {
        // Si hay menos de tres jugadores (índice 2) tengo que apagar los paneles de los jugadores que no están en el equipo        
        apagarPanel(index+1);
    }
}

function hideAll(className) {
    var ele = document.getElementsByClassName(className);
    for (var i = 0; i < ele.length; i++ ) {
        ele[i].style.display = "none";
    }
}

function showAll(className, displayValue) {
    var ele = document.getElementsByClassName(className);
    for (var i = 0; i < ele.length; i++ ) {
        ele[i].style.setProperty("display",displayValue);
    }
}

function apagarPanel(numJugador) {
    if (numJugador > 2 && panel_on[numJugador-1]) {
        hideAll("stat"+numJugador);
        document.getElementById("stat"+numJugador).style.setProperty("display","none");
        panel_on[numJugador-1] = false;
    }
}

function prenderPanel(numJugador) {
    if (numJugador > 2 && !panel_on[numJugador-1]) {
        showAll("container stat"+numJugador, "flex");
        showAll("contenido stat"+numJugador, "flex");
        showAll("encabezados stat"+numJugador, "block");
        document.getElementById("stat"+numJugador).style.setProperty("display","initial");
        panel_on[numJugador-1] = true;
    }
}

async function loadStats(info_jugador, stats_jugador, numJugador) {
    prenderPanel(numJugador);
    clearStats(numJugador);
    updateStats(info_jugador, stats_jugador, numJugador);
}

function loadSelectorEpisodios() {
    let flechaIzqHTML = document.getElementById("ep_izq");
    let flechaDerHTML = document.getElementById("ep_der");
    flechaIzqHTML.onclick = function() {
        let max_temp_actual = Temporadas.cantEpisodios(TEMPORADA_ACTUAL);
        if (EPISODIO_ACTUAL>1) { //Episodio 1 es el primer episodio, porque asi coincide con los nombres de los .json 
            cambiarDeEpisodio(TEMPORADA_ACTUAL, EPISODIO_ACTUAL-1); 
        }
        if (EPISODIO_ACTUAL == 1) {
            //TODO: poner en gris la flecha izquierda
            flechaIzqHTML.style.setProperty("background-color", "#9e9e9e");
        } else if (EPISODIO_ACTUAL == max_temp_actual-1) {
            //Acabo de pasar del ultimo episodio al anteultimo, debo pintar la flecha derecha color de nuevo
            flechaDerHTML.style.setProperty("background-color", "#757575");
        }
    }
    flechaDerHTML.onclick = function() {
        let max_temp_actual = Temporadas.cantEpisodios(TEMPORADA_ACTUAL);
        if (EPISODIO_ACTUAL < max_temp_actual) { //Episodio 1 es el primer episodio, porque asi coincide con los nombres de los .json 
            cambiarDeEpisodio(TEMPORADA_ACTUAL, EPISODIO_ACTUAL+1); 
        }
        if (EPISODIO_ACTUAL == Temporadas.cantEpisodios(TEMPORADA_ACTUAL)) {
            //TODO: poner en gris la flecha derecha
            flechaDerHTML.style.setProperty("background-color", "#9e9e9e");
        } else if (EPISODIO_ACTUAL == 2) {
            //Acabo de pasar del ultimo episodio al anteultimo, debo pintar la flecha derecha color de nuevo
            flechaIzqHTML.style.setProperty("background-color", "#757575");
        }
    }
}

function cambiarDeEpisodio(temp, ep) {
    // Qué tiene que pasar cuando se cambia de episodio
    // Actualizar variable de episodio - ojo con máximo y mínimo de episodio
    //    Si la flecha no puede avanzar mas, cambiar el color?
    // Cargar las stats del nuevo episodio de
    //    El jugador actual O
    //    Cambiar de jugador
    let epNameHTML = document.getElementById("ep_name");
    epNameHTML.innerText = "Episodio " + ep;
    EPISODIO_ACTUAL = ep;
    console.log("Episodio actual: " + EPISODIO_ACTUAL);
    let selectorHTML = document.getElementById("selector_jugador");
    removeChildren(selectorHTML);
    loadPlayers(temp, ep);
}

function removeChildren(div){
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}

function clearAllStats() {
    clearStats(1);
    clearStats(2);
    clearStats(3);
}

function clearStats(numJugador) {
    removeChildren(document.getElementById("vida_"+numJugador));
    categorias.forEach(categoria => {
        let attr = categoria+"_"+numJugador;
        let categoryHTML = document.getElementById(attr);
        removeChildren(categoryHTML);
    });
}

function updateStats(info_jugador, stats_jugador, numJugador) {
    let nameHTML = document.getElementById("displayname_"+numJugador);
    nameHTML.innerHTML = info_jugador["nombre"]
    updateVida(numJugador, stats_jugador["vida"]);
    categorias.forEach(categoria => {
        let categoryHTML = document.getElementById(categoria+"_"+numJugador);
        crearLuegoAgregarContenido(categoria, categoryHTML, stats_jugador[categoria]);
    });
}

async function updateVida(numJugador, numVida) {
    let vidaHTML = document.getElementById("vida_"+numJugador);
    vidaHTML.appendChild(barraCorazones(numVida));
}

function barraCorazones(num) {
    let elem = document.createElement("div");
    for (let i = 0; i < Math.floor(num); i++) {
        elem.appendChild(crearImgElem([IconPaths.corazones+"hardcore_full.png"], 20, 20, "Hardcore full heart"));
    }
    if (!Number.isInteger(num)) {
        elem.appendChild(crearImgElem([IconPaths.corazones+"hardcore_half.png"], 20, 20, "Hardcore half heart"));
    }
    // Chequeo si falta agregar contenedores de corazón vacío; redondeo para arriba porque el medio corazon cuenta como un contenedor completo.
    while (Math.round(num) < 10) {
        elem.appendChild(crearImgElem([IconPaths.corazones+"heart_container.png"], 20, 20, "Empty heart container"));
        num++;
    }
    return elem;
}

function crearImgElem(imgs, height=null, width=null, alt=null) {
    let imgHTML = document.createElement("canvas");
    imgHTML.setAttribute("width",width);
    imgHTML.setAttribute("height",height);
    let ctx = imgHTML.getContext("2d");
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    imgs.forEach(imgPath => {
        let imgElem = document.createElement("img");
        imgElem.setAttribute("src", imgPath);
        imgElem.setAttribute("width",width);
        imgElem.setAttribute("height",height);
        imgElem.onload = function(){
            ctx.drawImage(imgElem, 0, 0, width, height);
        }
    });
    imgHTML.setAttribute("alt", alt);
    return imgHTML;
}

function crearItemElem(itemCant, pathsImgs, nombre) {
    let img = crearImgElem(pathsImgs, 32, 32, itemCant + " " + nombre);
    let imgWithText = document.createElement("div");
    imgWithText.style.setProperty("text-align", "center");
    imgWithText.appendChild(img);
    let textHTML = document.createElement("div");
    textHTML.innerText = itemCant;
    imgWithText.appendChild(textHTML);
    return imgWithText
}

async function crearLuegoAgregarContenido(categoria, categoryHTML, stats_jugador_en_categoria) {
    switch (categoria) {
        case "equipamiento":
            for (let k in stats_jugador_en_categoria) {
                let valores = stats_jugador_en_categoria[k];
                if (valores["material"] != null) {
                    let nombreImg = Traductor.equipamientoAImagenes(k, valores);
                    nombreImg = nombreImg.map((element) =>
                        IconPaths.equipamiento+element
                    );
                    let elemImg = crearImgElem(nombreImg, 32, 32, k + " " + valores["material"]);
                    categoryHTML.appendChild(elemImg);
                }
            }
            break;
        case "minerales":
            for (let k in stats_jugador_en_categoria) {
                let nombreImg = [IconPaths.minerales + Traductor.minerales[k] + ".png"];
                let elemItem = crearItemElem(stats_jugador_en_categoria[k], nombreImg, k);
                categoryHTML.appendChild(elemItem);
            }
            break;
        case "curacion":
            for (let k in stats_jugador_en_categoria) {
                let nombreImg = [IconPaths.curacion + Traductor.curacion[k] + ".png"];
                let elemItem = crearItemElem(stats_jugador_en_categoria[k], nombreImg, k);
                categoryHTML.appendChild(elemItem);
            }
            break;
        case "nether_pociones":
            for (let k in stats_jugador_en_categoria) {
                if (k == "pociones") { break; } //TODO: implementar pociones acá
                let nombreImg = [IconPaths.nether_pociones + Traductor.nether_pociones[k] + ".png"];
                let elemItem = crearItemElem(stats_jugador_en_categoria[k], nombreImg, k);
                categoryHTML.appendChild(elemItem);
            }
            break;
        case "miscelaneo":
            for (let k in stats_jugador_en_categoria) {
                let item = stats_jugador_en_categoria[k][0];
                let state = stats_jugador_en_categoria[k][1];
                if(state == true) {
                    let nombreImg = [Traductor.miscelaneo[item+"_path"] + Traductor.miscelaneo[item] + ".png"];
                    let dims = Traductor.miscelaneo[item+"_dims"];
                    let elemItem = crearImgElem(nombreImg, dims[0], dims[1], item);
                    categoryHTML.appendChild(elemItem);
                }
            }
            break;
        case "inventario":
            //TODO: completar con link a inventario?
            //categoryHTML.innerText = 5;
            break;
        default:
            categoryHTML.innerText = -1;
      }
}