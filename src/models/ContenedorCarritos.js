//Importo Clase Contenedor para luego extender de ella
import Contenedor from './Contenedor.js';

class ContenedorCarritos extends Contenedor {

    constructor() {
        super('./src/data/carritos.json');
    }

    // TODO gestion stock
}

export { ContenedorCarritos }