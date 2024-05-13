//RUTAS SEBAS
import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { listarElementos, registrarElemento, eliminarElemento, actualizarElemento} from "../controllers/elementos.controller.js";

const router = Router();

// Ruta para listar elementos
router.get('/listar', validarToken, listarElementos);
// Ruta para registrar un elemento
router.post('/registrar', validarToken, registrarElemento);

// Ruta para eliminar un elemento por su ID
router.delete('/eliminar/:id', validarToken, eliminarElemento);

// Ruta para actualizar un elemento por su ID
router.put('/actualizar/:id', validarToken, actualizarElemento);

export default router;
