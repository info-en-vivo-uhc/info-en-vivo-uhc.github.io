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
    static nether_pociones = this.equipamiento;  
    static jugadores = "../img/jugadores/";
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
    static minerales = 
    {
        "hierro": "iron_ingot",
        "oro": "gold_ingot",
        "cuero": "leather",
        "netherite": "netherite",
        "diamante": "diamond",
        "esmeralda": "emerald",
        "lapis_lazuli": "lapis_lazuli"
    };
    static curacion = 
    {
        "manzana": "apple",
        "manzana_oro": "golden_apple",
        "melon_oro": "glistering_melon_slice"
    };
    static nether_pociones =
    {
        "blazerod": "blaze_rod",
        "ojoarana": "spider_eye",
        "polvoblaze": "blaze_powder"
    };
    static miscelaneo = 
    {
        "escudo": "shield",
        "escudo_path": "../img/assets/",
        "escudo_dims": [40, 21],
        "brewing_stand": "brewing_stand",
        "brewing_stand_path": IconPaths.equipamiento,
        "brewing_stand_dims": [40, 40],
        "aldea": "village",
        "aldea_path": "../img/assets/",
        "aldea_dims": [35, 40],
        "semillas_melon": "melon_seeds",
        "semillas_melon_path": "../img/assets/",
        "semillas_melon_dims": [40,40]
    };
    static equipamientoAImagenes(tipo, valores) {
        let images = []
        let material = ""
        if (! (valores["material"] == null || valores["material"] == "none")) {
            material = Traductor.material[valores["material"]] + "_"
        }
        images.push(material + Traductor.equipamiento[tipo] + ".png");
        if (material == "leather_") {
            images.push(material + Traductor.equipamiento[tipo] + "_overlay.png");
        }
        return images;
    }
}