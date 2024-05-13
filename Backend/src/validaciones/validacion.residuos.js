import { body } from 'express-validator';

// Funciones de validación para las rutas de residuos
export const validarRegistroResiduo = [
    body('nombre_residuo').notEmpty().withMessage('El nombre del residuo es requerido').isString().withMessage('El nombre del residuo debe ser una cadena de texto'),
    body('residuo').notEmpty().withMessage('El campo residuo es requerido').toInt().isInt().withMessage('El residuo debe ser un número entero'),
    body('tipo_residuo').notEmpty().withMessage('El tipo de residuo es requerido').toInt().isInt().withMessage('El tipo de residuo debe ser un número entero'),
    body('unidad_medida').notEmpty().withMessage('La unidad de medida es requerida').toInt().isInt().withMessage('La unidad de medida debe ser un número entero'),
    body('fk_alm').notEmpty().withMessage('El ID del almacenamiento es requerido').toInt().isInt().withMessage('El ID del almacenamiento debe ser un número entero')  
];

export const validarRegistroMovimiento = [
    body('id_residuo').notEmpty().withMessage('El ID del residuo es requerido').toInt().isInt().withMessage('El ID del residuo debe ser un número entero'),
    // body('destino').notEmpty().withMessage('El destino es requerido').toInt().isInt().withMessage('El destino debe ser un número entero'),
    body('usuario_adm').notEmpty().withMessage('El usuario administrador es requerido').toInt().isInt().withMessage('El usuario administrador debe ser un número entero')
];

export const validarRegistroAlmacenamiento = [
    body('nombre_alm').notEmpty().withMessage('El nombre del almacenamiento es requerido').isString().withMessage('El nombre del almacenamiento debe ser una cadena de texto')
];

export const validarRegistroEmpresa = [
    body('nombre_empresa').notEmpty().withMessage('El nombre de la empresa es requerido').isString().withMessage('El nombre de la empresa debe ser una cadena de texto'),
    body('descripcion_empresa').notEmpty().withMessage('La descripción de la empresa es requerida').isString().withMessage('La descripción de la empresa debe ser una cadena de texto'),
    body('contacto_empresa').notEmpty().withMessage('El contacto de la empresa es requerido').isString().withMessage('El contacto de la empresa debe ser una cadena de texto')
];

export const validarActualizarResiduo = [
    // body('nombre_residuo').notEmpty().withMessage('El nombre del residuo es requerido').isString().withMessage('El nombre del residuo debe ser una cadena de texto'),
    // body('residuo').notEmpty().withMessage('El campo residuo es requerido').toInt().isInt().withMessage('El residuo debe ser un número entero'),
    // body('tipo_residuo').notEmpty().withMessage('El tipo de residuo es requerido').toInt().isInt().withMessage('El tipo de residuo debe ser un número entero'),
    // body('cantidad').notEmpty().withMessage('La cantidad es requerida').toInt().isInt().withMessage('La cantidad debe ser un número entero'),
    // body('unidad_medida').notEmpty().withMessage('La unidad de medida es requerida').toInt().isInt().withMessage('La unidad de medida debe ser un número entero'),
    // body('fk_alm').notEmpty().withMessage('El ID del almacenamiento es requerido').toInt().isInt().withMessage('El ID del almacenamiento debe ser un número entero')
];

// Exportar las funciones de validación
export default {
    validarRegistroResiduo,
    validarRegistroMovimiento,
    validarRegistroAlmacenamiento,
    validarRegistroEmpresa,
    validarActualizarResiduo
};
