import { getConnection } from "./../database/database.js";

//Conseguir los servicios mas usados en los ultimos 7 dias
const getServicioUsados = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await getConnection.query("SELECT s.id, c.nombre_categoria, s.nombre_servicio, COUNT(*) AS veces_utilizado FROM citas_programadas cp JOIN servicios s ON cp.id_servicio = s.id JOIN categoria_servicios c ON s.id_categoria = c.id WHERE cp.estado = 1 AND s.estado = 1 AND c.estado = 1 AND cp.fecha >= DATE_SUB(NOW(), INTERVAL 1 WEEK) GROUP BY s.id, c.nombre_categoria, s.nombre_servicio ORDER BY veces_utilizado DESC");
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Conseguir la cantidad de pacientes que se registraron en los ultimos 7 dias
const getCantidadPacientes = async (req, res) => {
    try {
        const { fecha_creacion } = req.params;
        const [result] = await getConnection.query("SELECT DATE_FORMAT(fecha_creacion, '%Y-%m-%d') AS fecha, COUNT(*) AS cantidad FROM pacientes WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK) GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m-%d') ORDER BY fecha;", fecha_creacion);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const methods = {
    getServicioUsados,
    getCantidadPacientes
}