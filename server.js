//Importo express y creo server app. 
import express from 'express';
const app = express();

//Importo Routes
import routerProductos from './src/routes/routerProductos.js';
import routerCarrito from './src/routes/routerCarrito.js';

try {
    //Seteo Routes
    app.use('/api/productos', routerProductos)
    app.use('/api/carrito', routerCarrito)

    //Gestiono rutas no parametrizadas
    app.use('*', (req, res) => res.status(404).json({ error: 'Page not found' }))

    //Configuro Middleware de manejo de errores
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: err });
    })

    /*
    //Lanzo index.html
    app.get("/", (req, res) => {
        try {
            res.sendFile(__dirname + '/public/index.html')

        } catch (error) {
            res.status(500).json({ error: error });
        }
    })
    
    //Seteo Static
    app.use('/static', express.static(__dirname + '/public'));
    */

    //Defino puerto y Pongo a escuchar al server
    const PUERTO = process.env.PORT || 8080;
    const server = app.listen(PUERTO, () => console.log('Servidor HTTP escuchando en puerto:', server.address().port))

    //Server Error handling
    server.on("error", (err) => console.log('Error en el servidor:', err))

} catch (error) {
    console.log('Error en el hilo principal:', error);
}


