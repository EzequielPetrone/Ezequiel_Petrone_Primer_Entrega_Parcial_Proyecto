//Constante booleana hardcodeada que emula si el user es ADMIN o no (luego se reemplaza por lógica de login)
const ADMIN = true

//Importo clase Contenedora e instancio. También una fx de utilidad
import { ContenedorProductos, isProducto } from '../models/ContenedorProductos.js';
import { ContenedorCarritos } from '../models/ContenedorCarritos.js';
const contenedorProductos = new ContenedorProductos()
const contenedorCarritos = new ContenedorCarritos()

//Importo express y configuro Routers
import express, { json, urlencoded } from "express";
const { Router } = express
const routerProductos = Router()

//Configuro para poder leer sin problemas los req.body
routerProductos.use(json())
routerProductos.use(urlencoded({ extended: true }))

//GET '/api/productos' -> devuelve todos los productos.
routerProductos.get("/", async (req, res) => {
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        res.json(await contenedorProductos.getAll())
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//GET '/api/productos/:id' -> devuelve un producto según su id.
routerProductos.get("/:id", async (req, res) => {
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        const id = req.params.id
        const prod = await contenedorProductos.getById(id)
        if (prod) {
            res.json(prod)
        } else {
            errCode = -3
            throw `Producto con id ${id} NO encontrado`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
routerProductos.post("/", async (req, res) => {
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        if (ADMIN) {
            //Primero valido que lo recibido en el body del request sea un producto bien formado
            //en mi definición el formato correcto sería: {nombre, descripcion, codigo, thumbnail, precio, stock}
            if (isProducto(req.body)) {
                const prod = { timeStamp: Date.now(), ...req.body } //Le agrego el timeStamp de creación y lo guardo
                const newId = await contenedorProductos.save(prod)
                if (newId) {
                    res.json({ id: newId, ...prod })
                } else {
                    errCode = -4
                    throw 'No se pudo crear el producto'
                }
            } else {
                errCode = -5
                throw 'Bad Request Body. Estructura esperada: {nombre, descripcion, codigo, thumbnail, precio, stock}'
            }
        } else {
            errCode = -1
            throw `ruta ${req.originalUrl} (método ${req.method}) no autorizada. Sólo ADMIN`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put("/:id", async (req, res) => {
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        if (ADMIN) {
            const id = req.params.id
            //Primero valido que lo recibido en el body del request sea un producto bien formado
            //en mi definición el formato correcto sería: {nombre, descripcion, codigo, thumbnail, precio, stock}
            if (isProducto(req.body)) {
                if (await contenedorProductos.editById(id, req.body)) { //Este método editById de la clase Contenedor es interesante su funcionalidad 
                    res.json(await contenedorProductos.getById(id))
                } else {
                    errCode = -6
                    throw `No se pudo editar producto con id ${id}`
                }
            } else {
                errCode = -5
                throw 'Bad Request Body. Estructura esperada: {nombre, descripcion, codigo, thumbnail, precio, stock}'
            }
        } else {
            errCode = -1
            throw `ruta ${req.originalUrl} (método ${req.method}) no autorizada. Sólo ADMIN`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

//DELETE '/api/productos/:id' -> elimina un producto según su id.
routerProductos.delete("/:id", async (req, res) => {
    let errCode = 0 //Utilizo esta variable para manejar diferentes códigos de error
    try {
        if (ADMIN) {
            const id = req.params.id
            const count = await contenedorCarritos.existeProductoEnCarrito(id)
            //Valido antes de eliminar que ese producto no esté involucrado en algún carrito
            if (count == 0) {
                if (await contenedorProductos.deleteById(id)) {
                    res.json({ ok: `Eliminado del file producto con id ${id}` })
                } else {
                    errCode = -3
                    throw `No hay producto con id ${id} para eliminar`
                }
            } else {
                errCode = -20
                throw `No se ha eliminado el producto con id ${id} porque aparece ${count} veces en el listado de Carritos. Primero eliminarlo de cada carrito`
            }
        } else {
            errCode = -1
            throw `ruta ${req.originalUrl} (método ${req.method}) no autorizada. Sólo ADMIN`
        }
    } catch (error) {
        res.status(500).json({ error: errCode, descripcion: error });
    }
})

export default routerProductos