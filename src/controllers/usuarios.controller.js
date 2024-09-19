import { getConnection } from "./../database/database.js";
import { uploadImageToStorage, deleteImageFromStorage } from "../service/googleCloud.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const saltRounds = 10;

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, 'secretKey', { expiresIn: '1h' });
    return token;
}

const getUsuarios = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE estado = ? AND correo != ?", [estado,'gtr010yam@gmail.com']);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE id = ?", id);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getUsuariosEstado = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE correo != ?", ['gtr010yam@gmail.com']);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getMedicos = async (req, res) => {
    try {
        const rol = 'medico';
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM usuarios WHERE rol = ? AND estado = ?", [rol, estado]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getMedicoID = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM medicos WHERE id_usuario = ? AND estado = ?", [id_usuario, estado]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getHorariosMedicoID = async (req, res) => {
    try {
        const id_medico = req.params.id_medico;
        const [result] = await getConnection.query("SELECT * FROM horarios_medicos WHERE id_medico = ? ORDER BY FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')", id_medico);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Login
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const estado = true;

        const [usuario] = await getConnection.query("SELECT * FROM usuarios WHERE correo = ? AND estado = ?", [username, estado]);
        if (usuario.length > 0) {

            const match = await bcrypt.compare(password, usuario[0].contrasenia);
            if (match) {
                const token = generateToken(usuario[0].id);
                res.status(200).json({ token, usuario });
            } else {
                res.status(401).json({ message: "Correo o contraseña incorrectos" });
            }
        } else {
            res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}



const addUsuarios = async (req, res) => {
    try {
        const { nombres, apellidos, correo, contrasenia, rol, estadoMedico } = req.body;

        const [existingUser] = await getConnection.query("SELECT * FROM usuarios WHERE correo = ?", correo);
        if (existingUser.length > 0) {
            return res.status(400).send('Este correo ya está en uso.');
        }

        const hashedContrasenia = await bcrypt.hash(contrasenia, saltRounds);

        const usuariosProps = { nombres, apellidos, correo, contrasenia: hashedContrasenia, rol, 'imagen_perfil': null, estadoMedico, 'estado': false }
        const [result] = await getConnection.query("INSERT INTO usuarios SET ?", usuariosProps);

        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
}


const addMedico = async (req, res) => {
    try {
        const { id_usuario, id_servicio, especialidad } = req.body;
        const estadoMedico = 'Registrado';
        const medicoProps = { id_usuario, id_servicio, especialidad, 'estado': true }

        await getConnection.query("UPDATE usuarios SET estadoMedico = ? WHERE id = ?", [estadoMedico, id_usuario]);

        const [result] = await getConnection.query("INSERT INTO medicos SET ?", medicoProps);

        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const addHorarioMedico = async (req, res) => {
    try {
        const { id_medico, dia_semana, hora_inicio, hora_final, fichas_disponibles } = req.body;

        const [existingRows] = await getConnection.query("SELECT * FROM horarios_medicos WHERE id_medico = ? AND dia_semana = ?", [id_medico, dia_semana]);

        if (existingRows.length > 0) {
            return res.status(400).send("Ya existe un horario para este médico en el mismo día.");
        }

        const horarioProps = { id_medico, dia_semana, hora_inicio, hora_final, fichas_disponibles }

        const [result] = await getConnection.query("INSERT INTO horarios_medicos SET ?", horarioProps);

        res.json(result);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Actualizacion
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, correo } = req.body;

        const usuariosProps = { nombres, apellidos, correo }

        const [result] = await getConnection.query("UPDATE usuarios SET ? WHERE id = ?", [usuariosProps, id]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateImagenPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const folder = 'usuarios';
        let imageUrl;

        const [oldImageResult] = await getConnection.query("SELECT imagen_perfil FROM usuarios WHERE id = ?", [id]);
        const oldImageUrl = oldImageResult[0].imagen_perfil;

        if (req.file) {
            if(oldImageUrl) {
                await deleteImageFromStorage(oldImageUrl, folder);
            }
            imageUrl = await uploadImageToStorage(req.file, folder);
        } else {
            imageUrl = oldImageUrl;
        }

        const [result] = await getConnection.query("UPDATE usuarios SET imagen_perfil = ? WHERE id = ?", [imageUrl, id]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



const updateEstadoHabilitado = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = true;
        const [result] = await getConnection.query("UPDATE usuarios SET estado = ? WHERE id = ?", [estado, id]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateEstadoDeshabilitado = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE usuarios SET estado = ? WHERE id = ?", [estado, id]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Eliminacion
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE usuarios SET estado = ? WHERE id = ? ", [estado, id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const validarUsuarioExistente = async (req, res) => {
    const { correo, contrasenia } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({
            correo,
            contrasenia,
        });

        if (usuarioExistente) {
            return res.status(200).json({ existente: true });
        } else {
            return res.status(200).json({ existente: false });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error al verificar usuario existente" });
    }
};



export const methods = {
    getUsuarios,
    getUsuario,
    addUsuarios,
    deleteUsuario,
    updateUsuario,
    loginUser,
    validarUsuarioExistente,
    getMedicos,
    addMedico,
    getMedicoID,
    getHorariosMedicoID,
    addHorarioMedico,
    updateEstadoHabilitado,
    updateEstadoDeshabilitado,
    getUsuariosEstado,
    updateImagenPerfil
}
