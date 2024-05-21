import express from "express";//Importacion de las herramientas, variables y objetos de otros archivos del mismo proyecto.
import path from 'path';
import { router as indexRouter} from "./routes/index.js";
import { router as homeRouter} from "./routes/concentrado.router.js";
import { router as loginRouter } from "./routes/user.router.js";
import { router as orderRouter } from "./routes/order.router.js";
import session from "express-session";
import flash from "connect-flash";
import { fileURLToPath } from "url";

const app = express();//Creamos nuestro objeto de tipo express.
const __filename = fileURLToPath(import.meta.url);//Obtenemos el nombre de nuestro archivo actual.
const __dirname = path.dirname(__filename);//Obtenemos la direcccion de la ruta del archivo actual.

app.listen('3048', function(){//Le inidcamos anuestra aplicacion que nos escuche en el puerto 8000.
    console.log('aplicacion inicializada');
});

app.set('view engine', 'ejs');//Le indicamos a la aplicacion que la manera en la que renderizara los archivos son en formato ejs.

//Declaracion de los archivos estaticos.
//A pesar de que otros archivos se encuntren en otras carpetas el añadir ".." nos ayuda a retroceder en la direccion actual.
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/../node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '*****',//Elige una frase secreta para la codificación de la sesión
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

//Le indicamos a la aplicacion que use los routers correspondientes.
app.use(indexRouter);
app.use(homeRouter);
app.use(loginRouter);
app.use(orderRouter);