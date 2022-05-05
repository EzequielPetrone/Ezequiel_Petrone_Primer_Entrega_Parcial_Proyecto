//Importo clase Contenedora e instancio. También una fx de utilidad
const { ContenedorProductos, isProducto } = require('../models/ContenedorProductos')
const contenedorProductos = new ContenedorProductos()

//Importo express y configuro Routers
const express = require("express");
const { Router } = express
const routerProductos = Router()

//Configuro para poder leer sin problemas los req.body
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({ extended: true }))

//GET '/api/productos' -> devuelve todos los productos.
routerProductos.get("/", async (req, res) => {
    try {
        res.json(await contenedorProductos.getAll())

    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//GET '/api/productos/:id' -> devuelve un producto según su id.
routerProductos.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const prod = await contenedorProductos.getById(id)
        if (prod) {
            res.json(prod)
        } else {
            throw `Producto con id ${id} NO encontrado`
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
routerProductos.post("/", async (req, res) => {
    try {
        if (isProducto(req.body)) {
            const prod = { timeStamp: Date.now(), ...req.body }
            const newId = await contenedorProductos.save(prod)
            if (newId) {
                res.json({ id: newId, ...prod })
            } else {
                throw 'No se pudo crear el producto'
            }
        } else {
            throw 'La estructura de objeto Producto recibida no es correcta'
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        if (isProducto(req.body)) {
            if (await contenedorProductos.editById(id, req.body)) {
                res.json(await contenedorProductos.getById(id))
            } else {
                throw `No se pudo editar producto con id ${id}`
            }
        } else {
            throw 'La estructura de objeto Producto recibida no es correcta'
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

//DELETE '/api/productos/:id' -> elimina un producto según su id.
routerProductos.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        if (await contenedorProd.deleteById(id)) {
            res.json({ ok: `Eliminado del file producto con id ${id}` })
        } else {
            throw `No hay producto con id ${id} para eliminar. Contenido del file sigue igual`
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

module.exports = routerProductos