import { Router } from "express";
import { validarToken } from "../controllers/validator.controller.js";
import { actualizarResiduoId, buscarResiduoId, deleteResiduoId, listarActividades, listarAdmin, listarAlmacenamientos, listarEmpresas, listarMovimientos, listarResiduo, listarTiposResiduos, registrarAlmacenamiento, registrarEmpresas, registrarMovimiento, registrarResiduo, registrarSalida } from "../controllers/residuo.controller.js";
import { validarRegistroResiduo, validarRegistroMovimiento, validarRegistroAlmacenamiento, validarRegistroEmpresa, validarActualizarResiduo } from "../validaciones/validacion.residuos.js";

const router = Router();

router.post('/registrar', validarToken, validarRegistroResiduo, registrarResiduo);

router.post('/registrarmov', validarToken, validarRegistroMovimiento, registrarMovimiento);

router.post('/registrarsalida', validarToken, validarRegistroMovimiento, registrarSalida);

router.post('/registraralm', validarToken, validarRegistroAlmacenamiento, registrarAlmacenamiento);

router.post('/registrarempresa', validarToken, validarRegistroEmpresa, registrarEmpresas);

router.put('/actualizar/:id', validarToken, validarActualizarResiduo, actualizarResiduoId);

router.delete('/eliminar/:id', validarToken, deleteResiduoId);

router.get('/listar', validarToken, listarResiduo);
router.get('/listar_mov', validarToken, listarMovimientos);
router.get('/listar_tipos', validarToken, listarTiposResiduos);
router.get('/listar_alm', validarToken, listarAlmacenamientos);
router.get('/buscar/:id', validarToken, buscarResiduoId);

router.get('/listar_empresas', validarToken, listarEmpresas);
router.get('/listar_admin', validarToken, listarAdmin);
router.get('/listar_actividad', validarToken, listarActividades);

export default router;
