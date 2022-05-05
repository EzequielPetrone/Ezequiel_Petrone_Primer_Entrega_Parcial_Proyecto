//Importo Clase Contenedor para luego extender de ella
const Contenedor = require('./Contenedor')

class ContenedorCarritos extends Contenedor {

    constructor() {
        super('./src/data/carritos.json');
    }

    // TODO gestion stock
}

module.exports = { ContenedorCarritos }