import express from 'express';
import { nuevo_pedido, pedidos, nombre, eliminar_pedido} from '../controllers/order.controller.js';

const router = express.Router();

router.get('/orders/:idRuta?', pedidos);
router.post('/home/:id?', nuevo_pedido);
router.post('/order/edit/:id?', nombre);
router.delete('/order/delete/:idFolio?', eliminar_pedido);

export{router}