//Importo Clase Contenedor para luego extender de ella
import Contenedor from './Contenedor.js';

class ContenedorCarritos extends Contenedor {

    constructor() {
        super('./src/data/carritos.json');
    }

    async existeProductoEnCarrito(idProd) {
        //Esta función sirve para detectar si cierto producto existe o no en algún carrito.
        //devuelve la qty de ocurrencias
        try {
            let arrayCarr = await this.getAll()
            let count = 0
            for (const carr of arrayCarr) {
                count += carr.productos.reduce((n, p) => n + (p.id == idProd), 0);
            }
            return count
        } catch (error) {
            console.log(error);
            return count
        }
    }
}

export { ContenedorCarritos }