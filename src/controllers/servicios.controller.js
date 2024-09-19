import { getConnection } from "./../database/database.js";
import { uploadImageToStorage, deleteImageFromStorage } from "../service/googleCloud.js";



const getPacientes = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE estado = ?", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getServicios = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT s.*, c.nombre_categoria FROM servicios s INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = ? ORDER BY s.fecha_creacion DESC;", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const getContarFichasMasSolicitadas = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT s.nombre_servicio,c.nombre_categoria,COUNT(*) as total_fichas FROM registro_fichas f INNER JOIN servicios s ON f.id_servicio = s.id INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE f.estado = ? GROUP BY s.nombre_servicio, c.nombre_categoria ORDER BY total_fichas DESC", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getServiciosID = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT s.*, c.nombre_categoria FROM servicios s INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = ? AND s.id_categoria = ? AND s.estado_servicio = 'Habilitado' ORDER BY s.fecha_creacion DESC;", [estado, id_categoria]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getFichasServicio = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT s.nombre_servicio,COUNT(f.id) AS fichas_count FROM registro_fichas f INNER JOIN servicios s ON f.id_servicio = s.id INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = ? AND s.id_categoria = ? GROUP BY s.nombre_servicio;", [estado, id_categoria]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getFichasTotales = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT COUNT(f.id) AS fichas_totales FROM registro_fichas f WHERE f.estado = ?;", [estado]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getPacientesTotal = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT COUNT(id) AS pacientes_totales FROM pacientes WHERE estado = ?;", [estado]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getVentasPorMes = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT YEAR(fecha_venta) as Ano, MONTH(fecha_venta) as Mes, SUM(cantidad_vendida) as Ventas_Totales FROM inventario_ventas WHERE YEAR(fecha_venta) = 2023 AND estado = 1 GROUP BY YEAR(fecha_venta), MONTH(fecha_venta);", [estado]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



const getMedicosID = async (req, res) => {
    try {
        const { id_servicio } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT m.id,m.id_usuario,m.id_servicio, s.nombre_servicio, u.nombres, u.apellidos FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id INNER JOIN servicios s ON m.id_servicio = s.id WHERE m.estado = ? AND m.id_servicio = ? ORDER BY m.id_usuario DESC;", [estado, id_servicio]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getServiciosIDmedico = async (req, res) => {
    try {
        const { id_medico } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT m.id, h.fichas_disponibles, h.dia_semana, h.hora_inicio, h.hora_final,m.especialidad, u.nombres,u.apellidos,u.correo,u.rol, s.codigo,s.nombre_servicio FROM horarios_medicos h INNER JOIN medicos m ON h.id_medico = m.id INNER JOIN usuarios u ON m.id_usuario = u.id INNER JOIN servicios s ON m.id_servicio = s.id WHERE m.estado = ? AND h.id_medico = ? ORDER BY h.dia_semana ASC", [estado, id_medico]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const listarCategorias = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM categoria_servicios WHERE estado = ?", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const addServicio = async (req, res) => {
    try {
        const { nombre_servicio, descripcion_servicio, id_categoria } = req.body;

        const folder = 'servicios'
        const imageUrl = await uploadImageToStorage(req.file, folder);

        const [lastCodeResult] = await getConnection.query('SELECT codigo FROM servicios ORDER BY codigo DESC LIMIT 1');

        let newCode = 'SER-001';

        if (lastCodeResult.length > 0) {

            let lastCode = lastCodeResult[0].codigo;
            let lastNumber = parseInt(lastCode.replace('SER-', ''));
            let newNumber = lastNumber + 1;

            let formattedNumber = ("000" + newNumber).slice(-3);
            newCode = 'SER-' + formattedNumber;
        }

        const serviciosProps = { codigo: newCode, nombre_servicio, descripcion_servicio, id_categoria, ruta_imagen: imageUrl, 'estado_servicio': 'Habilitado', 'estado': true };
        const [result] = await getConnection.query("INSERT INTO servicios SET ?", serviciosProps);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const addCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion_categoria } = req.body;

        const folder = 'categoria_servicio'
        const imageUrlCategoria = await uploadImageToStorage(req.file, folder);

        const [lastCodeResult] = await getConnection.query('SELECT codigo FROM categoria_servicios ORDER BY codigo DESC LIMIT 1');

        let newCode = 'CAT-001';

        if (lastCodeResult.length > 0) {

            let lastCode = lastCodeResult[0].codigo;
            let lastNumber = parseInt(lastCode.replace('CAT-', ''));
            let newNumber = lastNumber + 1;

            let formattedNumber = ("000" + newNumber).slice(-3);
            newCode = 'CAT-' + formattedNumber;
        }

        const categoriaProps = {
            codigo: newCode,
            nombre_categoria,
            descripcion_categoria,
            ruta_imagen: imageUrlCategoria,
            'estado': true
        };
        const [result] = await getConnection.query("INSERT INTO categoria_servicios SET ?", categoriaProps);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}



const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_servicio, descripcion_servicio, id_categoria } = req.body;

        const folder = 'servicios';

        let imageUrl;

        // Verifica si se proporcionó un archivo antes de intentar subirlo
        if (req.file) {
            // Obtén la url de la imagen anterior de la base de datos
            const [oldImageResult] = await getConnection.query("SELECT ruta_imagen FROM servicios WHERE id = ?", [id]);
            const oldImageUrl = oldImageResult[0].ruta_imagen;

            // Borra la imagen anterior
            await deleteImageFromStorage(oldImageUrl, folder);

            // Sube la nueva imagen y obtén su url
            imageUrl = await uploadImageToStorage(req.file, folder);
        } else {
            // Si no se proporcionó un archivo, usa la url de la imagen anterior
            const [oldImageResult] = await getConnection.query("SELECT ruta_imagen FROM servicios WHERE id = ?", [id]);
            imageUrl = oldImageResult[0].ruta_imagen;
        }

        const serviciosProps = { nombre_servicio, descripcion_servicio, id_categoria, ruta_imagen: imageUrl, 'estado_servicio': 'Habilitado', 'estado': true };
        const [result] = await getConnection.query("UPDATE servicios SET ? WHERE id = ?", [serviciosProps, id]);

        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}




const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, descripcion_categoria } = req.body;
        const categoriaProps = { nombre_categoria, descripcion_categoria };
        const [result] = await getConnection.query("UPDATE categoria_servicios SET ? WHERE id = ?", [categoriaProps, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const estadoServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = 'Habilitado';
        const [result] = await getConnection.query("UPDATE servicios SET estado_servicio = ? WHERE id = ?", [estado, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteServicio = async (req, res) => {

    try {
        const { id } = req.params;
        const estado = 'Deshabilitado';
        const [result] = await getConnection.query("UPDATE servicios SET estado_servicio = ? WHERE id = ?", [estado, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteCategoria = async (req, res) => {

    try {
        const { id } = req.params;
        const estado = false;
        const [result] = await getConnection.query("UPDATE categoria_servicios SET estado = ? WHERE id = ?", [estado, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteServicios = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE servicios SET estado = ? WHERE id IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteCategorias = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE categoria_servicios SET estado = ? WHERE id IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//FICHAJE

const addFicha = async (req, res) => {
    try {
        const { id_paciente, id_medico, id_servicio, fecha } = req.body;

        const estado_ficha = 'Pendiente'

        const [existingEntry] = await getConnection.query(
            'SELECT * FROM registro_fichas WHERE id_paciente = ? AND id_medico = ? AND id_servicio = ? AND estado_ficha = ? AND DATE(fecha) = DATE(?)',
            [id_paciente, id_medico, id_servicio, estado_ficha, fecha]
        );

        if (existingEntry.length > 0) {
            return res.status(400).send('El paciente tiene una ficha pendiente el dia de hoy para el mismo servicio.');
        } else {
            const [lastCodeResult] = await getConnection.query('SELECT codigo FROM registro_fichas WHERE fecha = ? ORDER BY codigo DESC LIMIT 1', fecha);

            let newCode = 'FIC-001';

            if (lastCodeResult.length > 0) {

                let lastCode = lastCodeResult[0].codigo;
                let lastNumber = parseInt(lastCode.replace('FIC-', ''));
                let newNumber = lastNumber + 1;

                let formattedNumber = ("000" + newNumber).slice(-3);
                newCode = 'FIC-' + formattedNumber;
            }

            const fichasProps = { codigo: newCode, id_paciente, id_medico, id_servicio, fecha, 'estado_ficha': 'Pendiente', 'estado': true };
            const [result] = await getConnection.query("INSERT INTO registro_fichas SET ?", fichasProps);

            await getConnection.query("UPDATE horarios_medicos SET fichas_disponibles = fichas_disponibles - 1 WHERE id_medico = ?", [id_medico]);

            res.json(result);
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const getPacienteID = async (req, res) => {
    try {
        const { id } = req.params;
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE estado = ? AND id = ?", [estado, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getFichas = async (req, res) => {
    try {
        const estado = true;
        const { fecha } = req.params;
        const [result] = await getConnection.query("SELECT f.*, p.nombres AS nombre_paciente, p.apellidos AS apellido_paciente, p.ci, p.sexo, p.fecha_nacimiento, u.nombres AS nombre_medico, u.apellidos AS apellido_medico, s.nombre_servicio FROM registro_fichas f INNER JOIN pacientes p ON f.id_paciente = p.id INNER JOIN medicos m ON f.id_medico = m.id INNER JOIN usuarios u ON m.id_usuario = u.id INNER JOIN servicios s ON f.id_servicio = s.id WHERE f.estado = ? AND f.fecha = ? ORDER BY f.fecha_creacion DESC;", [estado, fecha]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



const cancelarFicha = async (req, res) => {
    try {
        const { id } = req.params;
        const estado_ficha = 'Cancelado';
        const [result] = await getConnection.query("UPDATE registro_fichas SET estado_ficha = ? WHERE id = ?", [estado_ficha, id]);
        res.json(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}


export const methods = {
    getServicios,
    addServicio,
    addCategoria,
    listarCategorias,
    updateServicio,
    estadoServicio,
    deleteServicio,
    deleteServicios,
    updateCategoria,
    deleteCategoria,
    deleteCategorias,
    getServiciosID,
    getServiciosIDmedico,
    getMedicosID,
    getPacientes,
    addFicha,
    getPacienteID,
    getFichas,
    cancelarFicha,
    getFichasServicio,
    getContarFichasMasSolicitadas,
    getFichasTotales,
    getPacientesTotal,
    getVentasPorMes,
}