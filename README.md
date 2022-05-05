# Backend - Primer Entrega Parcial Proyecto - EZEQUIEL PETRONE

Gracias tanto a los comentarios del código como a los errores que devuelve cada endpoint es fácil entender el funcionamiento, de todos modos algunas notas:

-La variable que maneja el boolean de ADMIN está en routerCarrito.js

-Reutilicé la clase Contenedor que había desarrollado en las primeras entregas ya que estaba bastante completa, es por eso que las clases que extiendan de la misma me quedaron tan simples.

-Se valida tanto al momento de dar de alta un producto como al editarlo que la estructura del req.body recibido sea la correcta.

-Cuando se quiere eliminar un producto del file, primero se valida que ese producto no esté en algún carrito. En dicho caso se solicita primero eliminarlo de cada carrito y luego eliminarlo del file de productos.

-Cuando se agrega un producto a un carrito sólo se necesita id del producto y qty deseada (esa qty es el stock del producto dentro del array productos del carrito). Si el producto no existe aún en dicho carrito lo agrega pero si ya existe suma la qty actual a la original.

-Cuando se agrega un producto a un carrito se descuenta la qty seleccionada del stock del producto en el file de productos. SE VALIDA QUE HAYA STOCK SUFICIENTE ANTES DE HACER DICHA OPERACIÓN.

-Cuando se elimina un producto de un carrito se devuelve la qty que poseía al stock del file de productos. Si se elimina un carrito entero, devuelve stock por cada uno de los productos incluídos.

-Entiendo que la gestión de errores está bien encarada. Al menos con los muchos tests que hice no logré encontrarle alguna falla.

-Me hubiese encantado tener tiempo para hacer el FrontEnd también. Hasta me parece más dicertido testearlo así. Pero bueno me até a lo obligatorio y dejé lo opcional por razones de fuerza mayor.

-Le agregué al package.json la entrada: "type": "module" para poder utilizar import en vez de require. ¿Está bien hacerlo así? o debería haber utilizado algún bundle (ej babel) o algo por el estilo? esas clases son las que me perdí...