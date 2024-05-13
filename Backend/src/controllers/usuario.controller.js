import { pool } from "../database/conexion.js";

export const registrarUsuario = async (req, res) => {

    try {

        const rol = req.user.rol;
        if (rol === 'administrador') {

            const { nombre, apellidos, identificacion, email, rol } = req.body;
            const query = "INSERT INTO usuarios (nombre, apellidos, identificacion, email, rol, password) VALUES (?, ?, ?, ?, ?, ?)";
            let [result] = await pool.query(query, [nombre, apellidos, identificacion, email, rol, identificacion]);

            if (result.affectedRows > 0) {
                return res.status(200).json({ 'message': 'Usuario registrado exitosamente' });
            } else {
                return res.status(404).json({ 'message': 'No se encontraron registros de usuarios' }); 
            }


        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado'}); 
        }


    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });

    }
}



export const listarUsuarios = async (req, res) => {
    try {
        const rol = req.user.rol;
        if (rol === 'administrador') {
            const query = "SELECT * FROM usuarios";
            const [result] = await pool.query(query);

            if (result.length > 0) {
                return res.status(200).json(result);

            } else {
                return res.status(404).json({ 'message': 'No se encontraron registros de usuarios' });
            }
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}


export const listarUsuariosTrabajadores = async (req, res) => {
    try {
        const rol = req.user.rol;
        if (rol === 'administrador') {
            const query = "SELECT * FROM usuarios WHERE rol IN ('pasante', 'operario')";
            const [result] = await pool.query(query);

            if (result.length > 0) {
                return res.status(200).json(result);

            } else {
                return res.status(404).json({ 'message': 'No se encontraron registros de usuarios' });
            }
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}


export const buscarUsuarioPorIdentificacion = async (req, res) => {
    try {
        const rol = req.user.rol;
        if (rol === 'administrador') {

            const identificacion = req.params.id;

            const query = "SELECT * FROM usuarios WHERE identificacion = ?";

            const [result] = await pool.query(query, [identificacion]);

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ 'message': 'No se encontró ningún usuario con esa identificación' });
            }
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}


export const editarUsuario = async (req, res) => {
    try {
        const rol = req.user.rol;
        if (rol === 'administrador') {
            const id = req.params.id;

            console.log(id)

            const { nombre, apellidos, identificacion, email, rol, password } = req.body;

            const query = "UPDATE usuarios SET nombre = ?, apellidos = ?, identificacion = ?, email = ?, rol = ?, password = ? WHERE id_usuario = ?";

            const [result] = await pool.query(query, [nombre, apellidos, identificacion, email, rol, password, id]);

            if (result.affectedRows > 0) {
                return res.status(200).json({ 'message': 'Usuario actualizado exitosamente' });
            } else {
                return res.status(404).json({ 'message': 'No se encontró ningún usuario con ese ID' });
            }
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}


export const desactivarUsuario = async (req, res) => {
    try {
        const rol = req.user.rol;
        if (rol === 'administrador') {
            const id = req.params.id;
            // Obtener el estado actual del usuario
            const estadoActualQuery = "SELECT estado FROM usuarios WHERE id_usuario = ?";
            const [estadoActualResult] = await pool.query(estadoActualQuery, [id]);
            if (estadoActualResult.length === 0) {
                return res.status(404).json({ 'message': 'No se encontró ningún usuario con ese ID' });
            }
            const estadoActual = estadoActualResult[0].estado;

            // Cambiar el estado del usuario
            let nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
            const cambiarEstadoQuery = "UPDATE usuarios SET estado = ? WHERE id_usuario = ?";
            const [result] = await pool.query(cambiarEstadoQuery, [nuevoEstado, id]);

            if (result.affectedRows > 0) {
                return res.status(200).json({ 'message': `Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente` });
            } else {
                return res.status(404).json({ 'message': 'No se encontró ningún usuario con ese ID' });
            }
        } else {
            return res.status(403).json({ 'message': 'Error: usuario no autorizado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}





// Función para registrar un nuevo usuario
/*export const registrarUsuario2= async (req, res) => {
    try {
        const { nombre, apellidos, identificacion, email, rol, password } = req.body;
        const query = "INSERT INTO usuarios (nombre, apellidos, identificacion, email, rol, password) VALUES (?, ?, ?, ?, ?, ?)";
        await pool.query(query, [nombre, apellidos, identificacion, email, rol, password]);
        return res.status(200).json({ 'message': 'Usuario registrado exitosamente' });
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

// Función para listar todos los usuarios
export const listarUsuarios2 = async (req, res) => {
    try {
        const query = "SELECT * FROM usuarios";
        const result = await pool.query(query);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

// Función para buscar un usuario por identificación
export const buscarUsuarioPorIdentificacion2 = async (req, res) => {
    try {
        const { identificacion } = req.params;
        const query = "SELECT * FROM usuarios WHERE identificacion = ?";
        const result = await pool.query(query, [identificacion]);
        if (result.length > 0) {
            return res.status(200).json(result[0]);
        } else {
            return res.status(404).json({ 'message': 'No se encontró ningún usuario con esa identificación' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
} 

// Función para editar la información de un usuario
export const editarUsuario2 = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, identificacion, email, rol, password } = req.body;
        const query = "UPDATE usuarios SET nombre = ?, apellidos = ?, identificacion = ?, email = ?, rol = ?, password = ? WHERE id_usuario = ?";
        await pool.query(query, [nombre, apellidos, identificacion, email, rol, password, id]);
        return res.status(200).json({ 'message': 'Usuario actualizado exitosamente' });
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
}

// Función para desactivar un usuario
export const desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "UPDATE usuarios SET estado = 'inactivo' WHERE id_usuario = ?";
        await pool.query(query, [id]);
        return res.status(200).json({ 'message': 'Usuario desactivado exitosamente' });
    } catch (e) {
        return res.status(500).json({ 'message': 'Error: ' + e });
    }
} */
