//Importo clases Contenedoras e instancio.
const { ContenedorCarritos } = require('../models/ContenedorCarritos')
const contenedorCarritos = new ContenedorCarritos()
const { ContenedorProductos } = require('../models/ContenedorProductos')
const contenedorProductos = new ContenedorProductos()

//Importo express y configuro Routers
const express = require("express");
const { Router } = express
const routerCarrito = Router()

//Configuro para poder leer sin problemas los req.body
routerCarrito.use(express.json())
routerCarrito.use(express.urlencoded({ extended: true }))

//GET '/api/carrito' -> devuelve array con todos los carritos registrados.
routerCarrito.get("/", async (req, res) => {
    try {
        res.json(await contenedorCarritos.getAll())

    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//POST '/api/carrito' -> crea un carrito y lo devuelve con su id asignado.
routerCarrito.post("/", async (req, res) => {
    try {
        const carrito = { timeStamp: Date.now(), productos: [] }
        const newId = await contenedorCarritos.save(carrito)
        if (newId) {
            res.json({ id: newId, ...carrito })
        } else {
            throw 'No se pudo crear el carrito'
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//DELETE '/api/carrito/:id' -> elimina un carrito según su id (pero antes devuelve stock de productos)
routerCarrito.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        //TODO: primero tengo que devolver el stock a los productos...
        if (await contenedorCarritos.deleteById(id)) {
            res.json({ ok: `Eliminado del file carrito con id ${id}` })
        } else {
            throw `No hay carrito con id ${id} para eliminar. Contenido del file sigue igual`
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//GET '/api/carrito/:id/productos' -> devuelve productos de un carrito según su id.
routerCarrito.get("/:id/productos", async (req, res) => {
    try {
        const id = req.params.id
        const carrito = await contenedorCarritos.getById(id)
        if (carrito && carrito.productos) {
            res.json(carrito.productos)
        } else {
            throw `Carrito con id ${id} NO encontrado / sin array de productos `
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//POST '/api/carrito/:id/productos' -> Incorpora producto a carrito según su id.
routerCarrito.post("/:id/productos", async (req, res) => {
    //En mi diseño el body que se recibe del Front es un objeto con la siguiente estructura: {idProd, qty}
    //es decir, el id del producto en el contenedor de productos y la cantidad a agregar en el carrito
    try {
        const { idProd, qty } = req.body
        if (idProd && qty > 0) { //Primero valido el body del request recibido

            const id = req.params.id //Tomo el id del Carrito de los params del req
            const carrito = await contenedorCarritos.getById(id)

            if (carrito && carrito.productos) { //Valido que exista carrito con el id recibido

                if (await contenedorProductos.actualizarStock(idProd, - qty)) { //Valido que se pueda actualizar el stock del maestro de productos según la qty recibida

                    const index = carrito.productos.findIndex(p => p.id == idProd)
                    if (index >= 0) { //Si ya existe el producto en el carrito le sumo la qty deseada
                        console.log('entra en el if index', idProd)
                        carrito.productos[index].stock += qty

                    } else { //Sino lo agrego como nuevo elemento
                        const prod = await contenedorProductos.getById(idProd)
                        prod.stock = qty
                        carrito.productos.push(prod)
                    }
                    await contenedorCarritos.editById(id, carrito) //Escribo el carrito editado
                    res.json({ ok: `${qty} unidades del producto con id ${idProd} agregadas al carrito con id ${id}` })

                } else {
                    throw `No puede actualizarse el stock del producto con id ${idProd}`
                }
            } else {
                throw `No existe carrito con id ${id}`
            }
        } else {
            throw `Bad Request Body`
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//DELETE '/api/carrito/:id/productos/:id_prod' -> elimina un producto de un carrito según sus ids (pero antes devuelve stock de productos)
routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
    try {
        const { id, id_prod } = req.params
        res.json(req.params) //TODO: ELIMINAR ESTA LINEA
        /*
        //TODO: primero tengo que devolver el stock a los productos...
        const prod = null
        if (await contenedorProductos.actualizarStock(id_prod, qty)) {

            if (false) {
                res.json({ ok: `Eliminado del file carrito con id ${id}` })
            } else {
                throw `No hay carrito con id ${id} para eliminar. Contenido del file sigue igual`
            }
        } else {
            throw `No puede devolverse el stock al producto con id ${id_prod}`
        }
        */
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

module.exports = routerCarrito