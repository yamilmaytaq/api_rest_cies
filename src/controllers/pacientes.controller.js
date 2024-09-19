import { getConnection } from "./../database/database.js";

//Busqueda
const getPacientes = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT *, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento FROM pacientes WHERE estado = 1");
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const getPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE estado = 1 AND id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getHistoriaClinica = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT * FROM historia_medica WHERE id_paciente = ?", id);

        if (result.length === 0) {
            return res.status(404).json({ message: 'El paciente no tiene registrado su historia clinica.' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getEvolucionPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT * FROM evolucion_medica WHERE id_paciente = ?", id);

        if (result.length === 0) {
            return res.status(404).json({ message: 'El paciente aun no tiene evoluciones.' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getMedicoIDConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT u.id AS idUsuario,m.id AS idMedico, m.especialidad, u.nombres,u.apellidos,u.correo,u.rol,u.estadoMedico,s.nombre_servicio FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id INNER JOIN servicios s ON m.id_servicio = s.id WHERE m.estado = 1 AND u.id = ?", id);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getFichasMedico = async (req, res) => {
    try {
        const estado = true;
        const { fecha, id } = req.params;
        const [result] = await getConnection.query("SELECT f.*, p.nombres AS nombre_paciente, p.apellidos AS apellido_paciente, p.ci, p.sexo, p.fecha_nacimiento FROM registro_fichas f INNER JOIN pacientes p ON f.id_paciente = p.id INNER JOIN medicos m ON f.id_medico = m.id INNER JOIN usuarios u ON m.id_usuario = u.id WHERE f.estado = ? AND f.fecha = ? AND u.id = ? ORDER BY f.fecha_creacion DESC;", [estado, fecha, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const finalizarFicha = async (req, res) => {
    try {
        const { id } = req.params;
        const estado_ficha = 'Finalizado';
        const [result] = await getConnection.query("UPDATE registro_fichas SET estado_ficha = ? WHERE id = ?", [estado_ficha, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const addEvolucionMedica = async (req, res) => {
    try {
        const { id, id_paciente, nota_evolucion, peso, altura, imc, tratamiento, fecha_evolucion } = req.body;
        const estado_ficha = 'Finalizado';

        const [existingEvolucion] = await getConnection.query("SELECT * FROM evolucion_medica WHERE id_paciente = ? AND fecha_evolucion = ?", [id_paciente, fecha_evolucion]);

        if (existingEvolucion.length > 0) {
            res.status(400).json({ message: 'Ya existe una evolución médica para este paciente en la fecha especificada' });
            return;
        }
        await getConnection.query("UPDATE registro_fichas SET estado_ficha = ? WHERE id = ?", [estado_ficha, id]);

        const evolucionProps = { id_paciente, nota_evolucion, peso, altura, imc, tratamiento, fecha_evolucion, estado: true };
        const [result] = await getConnection.query("INSERT INTO evolucion_medica SET ?", evolucionProps);

        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}



//Insercion
const addPaciente = async (req, res) => {
    try {
        const { nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia } = req.body;

        const pacientesProps = { nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, 'estado': true, usuario, contrasenia };

        const [result] = await getConnection.query("INSERT INTO pacientes SET ?", pacientesProps);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const addHistoriaMedica = async (req, res) => {
    try {
        const { id_paciente, motivo_consulta, enfermedad_actual, antecedentes, diagnostico_cie, diagnostico_medico, tratamiento, observaciones, presion_arterial, peso, talla, temperatura_corporal, frecuencia_respiratoria, frecuencia_cardiaca, saturacion_oxigeno, examen_fisico_general, examen_piel } = req.body;

        const historiaClinicaProps = { id_paciente, motivo_consulta, enfermedad_actual, antecedentes, diagnostico_cie, diagnostico_medico, tratamiento, observaciones, presion_arterial, peso, talla, temperatura_corporal, frecuencia_respiratoria, frecuencia_cardiaca, saturacion_oxigeno, examen_fisico_general, examen_piel, 'estado': true };

        const [result] = await getConnection.query("INSERT INTO historia_medica SET ?", historiaClinicaProps);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Actualizacion
const updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia } = req.body;
        const pacientesProps = { nombres, apellidos, ci, fecha_nacimiento, sexo, telefono, correo_electronico, pais, ciudad, provincia, zona, calle, usuario, contrasenia, 'estado': true }
        const [result] = await getConnection.query("UPDATE pacientes SET ? WHERE id = ?", [pacientesProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Eliminacion
const deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE pacientes SET estado = ? WHERE id = ? ", [estado, id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deletePacientes = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE pacientes SET estado = ? WHERE id IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export const methods = {
    getPacientes,
    getPaciente,
    addPaciente,
    deletePaciente,
    updatePaciente,
    deletePacientes,
    getHistoriaClinica,
    addHistoriaMedica,
    getMedicoIDConsulta,
    getFichasMedico,
    finalizarFicha,
    addEvolucionMedica,
    getEvolucionPaciente
}