import { printError, getJson, IconPaths, Traductor } from './auxiliares.js';

var categorias = ["equipamiento","minerales","curacion","nether_pociones","miscelaneo","inventario"]

main()
var TEMPORADA = 11;
var EPISODIO = 1;

function main() {
    let temporada = 11;
    let episodio = 1;
    loadPlayers(temporada, episodio);
}

async function loadPlayers(temp, ep) {
    var info_jugadores = await getJson("../data/"+temp+"/jugadores.json");
    for (let jugador in info_jugadores) {
        let selectorHTML = document.getElementById("selector_jugador");
        let iconHTML = crearImgElem([IconPaths.jugadores + jugador + "_icon.png"], 40, 40, info_jugadores[jugador]["nombre"]);
        iconHTML.onclick = function() {
            loadStats(TEMPORADA, EPISODIO, jugador, null, 1);
        }
        selectorHTML.appendChild(iconHTML);
    }
    loadStats(temp, ep, Object.keys(info_jugadores)[0], null, 1);
}

async function loadStats(temp, ep, jugador, equipo, numJugador) {
    clearStats(numJugador);
    if (equipo == null) {
        var info_jugadores = await getJson("../data/"+temp+"/jugadores.json");
        var info_jugador = info_jugadores[jugador];
        var stats_jugadores = await getJson("../data/"+temp+"/"+ep+".json");
        var stats_jugador = stats_jugadores[jugador];
        updateStats(info_jugador, stats_jugador, numJugador);
    } else {
        var equipo_data = await getJson("../data/"+temp+"/equipos.json");
        //equipo_data[equipo];
    }
}

function removeChildren(div){
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
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