//Importo Clase Contenedor para luego extender de ella
import Contenedor from './Contenedor.js';

class ContenedorProductos extends Contenedor {

    constructor() {
        super('./src/data/productos.json');
    }

    async actualizarStock(id, qty) {
        let prod = await this.getById(id)
        //Fundamental validar que no se intente restar más cantidad del stock disponible!
        if (prod && prod.stock + qty >= 0) { 
            prod.stock += qty
            return await this.editById(id, prod) //Esto retorna true cuando se edita correctamente
        } else {
            console.log('No es posible actualizar stock del producto con id', id)
            return false
        }
    }
}

//Function para validar si un objeto es un Producto válido
const isProducto = (obj) => {
    if (obj &&
        obj.nombre && typeof (obj.nombre) == 'string' &&
        obj.descripcion && typeof (obj.descripcion) == 'string' &&
        obj.codigo && typeof (obj.codigo) == 'string' &&
        obj.thumbnail && typeof (obj.thumbnail) == 'string' &&
        obj.precio && typeof (obj.precio) == 'number' &&
        obj.stock && typeof (obj.stock) == 'number' &&
        Object.keys(obj).length == 6) {
        return true
    } else {
        return false
    }
}

export { ContenedorProductos, isProducto }