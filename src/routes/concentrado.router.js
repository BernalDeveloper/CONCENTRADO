import express from 'express';
import { nueva_ruta, rutas, pdf} from "../controllers/concentrado.controller.js";

const router = express.Router();

router.get('/home/:id?', rutas);
router.post('/new/:id?', nueva_ruta);
router.get('/pdf/:id?/:idRuta?/:Complete?', pdf);

export {router}