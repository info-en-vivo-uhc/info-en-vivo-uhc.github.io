export { printError, getJson, IconPaths, Traductor }

function printError(error, path, explicit) {
    console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}, JSON Path: ${path}. This error probably occurs because JSON file has a syntax error or does not exist`);
}
    
async function getJson(path){
    try {
        let response = await fetch(path);
        var data = await response.json()
    } catch(err){
        if (err instanceof SyntaxError) {
            printError(err, path, true);
        } else {
            printError(err, path, false);
        }
    }
    return data;
}

class IconPaths {
    //static hearts = "../minecraft-assets/assets/minecraft/textures/gui/sprites/hud/heart";    
    static corazones = "../img/assets/";
    static equipamiento = "../minecraft-assets/assets/minecraft/textures/item/";
    static material = this.equipamiento;  
    static minerales = this.equipamiento;  
    static curacion = this.equipamiento;  
}

class Traductor {
    static material = 
    {
        "hierro": "iron",
        "oro": "golden",
        "cuero": "leather",
        "piedra": "stone",
        "madera": "wooden",
        "netherite": "netherite",
        "cota de malla": "chainmail",
        "diamante": "diamond"
    };
    static equipamiento = 
    {
        "pies": "boots",
        "cuerpo":"chestplate",
        "cabeza": "helmet",
        "piernas": "leggings",
        "hacha": "axe",
        "hoz": "hoe",
        "pico": "pickaxe",
        "pala": "shovel",
        "espada": "sword",
        "arco": "bow",
        "ballesta": "crossbow_arrow"
    }
    static minerales = this.material;
    static curacion = 
    {
        "manzana": "apple",
        "manzana_oro": "golden_apple",
        "melon_oro": "glistering_melon_slice"
    };
    static nether_pociones =
    {
        "blazerod": "blaze_rod",
        "ojoarana": "spider_eye"
    };
    static miscelaneo = 
    {
        "escudo": "shield",
        "escudo_path": IconPaths.equipamiento
    };
    static equipamientoAImagenes(tipo, valores) {
        let material = ""
        if (valores["material"] != null) {
            material = Traductor.material[valores["material"]] + "_"
        }
        let images = [material + Traductor.equipamiento[tipo] + ".png"];
        if (material == "leather_") {
            images.push(material + Traductor.equipamiento[tipo] + "_overlay.png");
        }
        return images;
    }
}