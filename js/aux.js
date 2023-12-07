export { printError, getJson }

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