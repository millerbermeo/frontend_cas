import { pool } from "../database/conexion.js";
import { v4 as uuidv4 } from 'uuid';

// Resto de tu código aquí


export const agregarActividad = async (req, res) => {
    try {
        const { rol } = req.user;

        // Verificar si el usuario tiene el rol de administrador
        if (rol === 'administrador') {
            const { tipo_actividad, lugar_actividad, fecha_actividad, usuarios, elementos } = req.body;

            // Generar un nombre de actividad aleatorio
            const nombre_act = 'actividad_' + uuidv4().split('-')[0];

            // Iniciar Transaccion
            await pool.query('START TRANSACTION');

            // Insertar la actividad
            const [actividadResult] = await pool.query(
                'INSERT INTO actividades (tipo_actividad, nombre_act, lugar_actividad, fecha_actividad) VALUES (?, ?, ?, ?)',
                [tipo_actividad, nombre_act, lugar_actividad, fecha_actividad]
            );

            const id_actividad = actividadResult.insertId;

            // Insertar usuarios
            if (usuarios && usuarios.length > 0) {
                for (const usuario of usuarios) {
                    await pool.query(
                        'INSERT INTO usuarios_actividades (fk_usuario, fk_actividad) VALUES (?, ?)',
                        [usuario, id_actividad]
                    );
                }
            }

            // Insertar elementos
            if (elementos && elementos.length > 0) {
                for (const elemento of elementos) {
                    const { elemento_id, cantidad } = elemento;
                    // Restar la cantidad del elemento en la tabla correspondiente
                    await pool.query(
                        'UPDATE elementos SET cantidad = cantidad - ? WHERE id_elemento = ?',
                        [cantidad, elemento_id]
                    );
                    // Insertar la relación en la tabla intermedia
                    await pool.query(
                        'INSERT INTO elementos_actividades (fk_elemento, fk_actividad) VALUES (?, ?)',
                        [elemento_id, id_actividad]
                    );
                }
            }

            // Confirmar
            await pool.query('COMMIT');

            res.status(201).json({ success: true, message: 'Actividad con usuarios y elementos agregada exitosamente' });
        }
    } catch (error) {
        // Revertir en caso de error
        await pool.query('ROLLBACK');

        console.error('Error al insertar actividad con usuarios y elementos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' + error });
    }
};


    // export const actividadTerminada = async (req, res) => {
    //     try {
    //         const { rol } = req.user;

    //         if (rol ==='administrador') {
    //             let id = req.params.id
    //             let sql = `UPDATE actividades SET  estado_actividad = 'terminada' WHERE id_actividad = ${id} `

    //             await pool.query(sql)
    //             res.status(200).json({success: true, message: 'Estado Actualizado.'});
    //         } else {
    //             return res.status(403).json({'message': 'Error: usuario no autorizado'});
    //         }
    //     } catch (error) {
    //         console.error("Error actualizar estado:", error);
    //         res.status(500).json({ success: false,'message': 'Error interno del servidor' + error});
    //     }
    // };

    export const actividadTerminada = async (req, res) => {
        try {
            const rol = req.user.rol;
            if (rol === 'administrador') {
                const id = req.params.id;
                // Obtener el estado actual de la actividad
                const estadoActualQuery = "SELECT estado_actividad FROM actividades WHERE id_actividad = ?";
                const [estadoActualResult] = await pool.query(estadoActualQuery, [id]);
                if (estadoActualResult.length === 0) {
                    return res.status(404).json({ 'message': 'No se encontró ninguna actividad con ese ID' });
                }
                const estadoActual = estadoActualResult[0].estado_actividad;
    
                // Cambiar el estado de la actividad
                let nuevoEstado = estadoActual === 'asignada' ? 'terminada' : 'asignada';
                const cambiarEstadoQuery = "UPDATE actividades SET estado_actividad = ? WHERE id_actividad = ?";
                const [result] = await pool.query(cambiarEstadoQuery, [nuevoEstado, id]);
    
                if (result.affectedRows > 0) {
                    return res.status(200).json({ 'message': `Estado de la actividad cambiado a ${nuevoEstado}` });
                } else {
                    return res.status(404).json({ 'message': 'No se encontró ninguna actividad con ese ID' });
                }
            } else {
                return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
            }
        } catch (e) {
            return res.status(500).json({ 'message': 'Error: ' + e });
        }
    }
    

    

    export const actividadListarId = async (req, res) => {
        try {
            const { rol } = req.user;
            if (rol ==='administrador') {
                const id_actividad = req.params.id;
                const query = `select actividades.*,
                areas.nombre_area AS nombre_lugar
                from actividades
                join areas on areas.id_lugar = actividades.lugar_actividad WHERE id_actividad = ?`;
                const [result] = await pool.query(query, [id_actividad])

                if (result.length > 0){
                    return res.status(200).json(result);
                } else {
                    return res.status(403).json({'message': `No se encontraron registros de actividades con el id ${id_actividad}`});
                }
            } else {
                return res.status(403).json({'message': 'Error: usuario no autorizado'});
            }
        } catch (error) {
            return res.status(500).json({'message': 'Error: ' + e})
        }
    };

    export const actividadListar = async (req, res) => {

        try {
    
            {
    
                let query = `select actividades.*,
                areas.nombre_area AS nombre_lugar
                from actividades
                join areas on areas.id_lugar = actividades.lugar_actividad`;

                let [result] = await pool.query(query)
    
                if (result.length > 0) {
                    return res.status(200).json(result);
                } else {
                    return res.status(404).json({ 'message': 'No se encontraron registros de actividades' });
                }
    
            }
        } catch (e) {
            return res.status(500).json({ 'message': 'Error: ' + e });
        }
    };


    export const actividadActualizar = async (req, res) => {
        try {
            const { rol } = req.user;
    
            if (rol === 'administrador') {
                const id_actividad = req.params.id;
                const { nombre_act, estado_actividad, fecha_actividad } = req.body;
    
                const sql = `UPDATE actividades SET nombre_act = ?, estado_actividad = ?, lugar_actividad = lugar_actividad, fecha_actividad = ? WHERE id_actividad = ?`;
    
                await pool.query(sql, [nombre_act, estado_actividad, fecha_actividad, id_actividad]);
    
                res.status(200).json({ success: true, message: 'Actividad Actualizada.' });
            } else {
                return res.status(403).json({ message: 'Error: usuario no autorizado' });
            }
        } catch (error) {
            console.error("Error actualizar actividad:", error);
            res.status(500).json({ success: false, message: "Error interno del servidor." });
        }
    };
    
    
