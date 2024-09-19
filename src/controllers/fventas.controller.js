import { getConnection } from "./../database/database.js";

//mostrar un listado de ventas
const listarVentasDisponibles = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT iv.id_venta, iv.id_medicamento, im.nombre_medicamento, iv.cantidad_vendida, iv.fecha_venta, iv.total_venta, p.nombres, p.apellidos FROM inventario_ventas iv JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento JOIN pacientes p ON iv.paciente_id = p.id WHERE iv.estado = ? ", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//mostrar un listado de ventas no disponibles
const listarVentasNoDisponibles = async (req, res) => {
    try {
        const estado = false;
        const [result] = await getConnection.query("SELECT iv.id_venta, im.nombre_medicamento, iv.cantidad_vendida, DATE_FORMAT(iv.fecha_venta, '%d-%m-%Y') AS fecha_venta, iv.total_venta, p.nombres, p.apellidos FROM inventario_ventas iv JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento JOIN pacientes p ON iv.pacientes_id = p.id WHERE iv.estado = ? ", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//liscar todos los medicamentos que estan activos
const listarVentasMedicamento = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM inventario_medicamentos WHERE estado = ?", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//listar pacientes para el registro de venta
const listarVentasPaciente = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM pacientes WHERE estado = ?", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//insertar nuevo registro de ventas 
const addVenta = async (req, res) => {
    try {
        const estado = true;
        const { id_medicamento, cantidad_vendida, paciente_id, fecha_venta, total_venta } = req.body;
        await getConnection.query("UPDATE inventario_medicamentos SET cantidad = cantidad - ? WHERE id_medicamento = ?", [cantidad_vendida, id_medicamento]);
        const ventasProps = { id_medicamento, cantidad_vendida, paciente_id, fecha_venta, total_venta, estado }
        const [result] = await getConnection.query("INSERT INTO inventario_ventas SET ?", ventasProps);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//editar las ventas que estan mal registradas
const updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_medicamento, cantidad_vendida, fecha_venta, total_venta } = req.body;
        const ventasProps = { id_medicamento, cantidad_vendida, fecha_venta, total_venta }
        const [result] = await getConnection.query("UPDATE inventario_ventas SET ? WHERE id_venta = ?", [ventasProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Eliminar(cambiar el estado) de los proveedores que yo no son necesarios
const deleteVenta = async (req, res) => {
    try {
        const estado = false;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_ventas SET estado = ? WHERE id_venta = ?", [estado, id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const deleteVentas = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_ventas SET estado = ? WHERE id_venta IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Eliminar(cambiar el estado) de los proveedores que yo no son necesarios
const recuperarVenta = async (req, res) => {
    try {
        const estado = true;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_ventas SET estado = ? WHERE id_venta = ?", [estado, id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const recuperarVentas = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = true;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_ventas SET estado = ? WHERE id_venta IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Estadisticas
const mostrarVentasPorMedicamento = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT iv.id_medicamento, im.nombre_medicamento, SUM(iv.cantidad_vendida) AS cantidadTotal, SUM(iv.total_venta) AS VentasPorMedicamento FROM inventario_ventas iv INNER JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento GROUP BY iv.id_medicamento ORDER BY VentasPorMedicamento DESC LIMIT 10;");
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const mostrarMedicamentoMasVendido = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT iv.id_medicamento,im.nombre_medicamento, SUM(iv.cantidad_vendida) AS CantidadVendida FROM inventario_ventas iv INNER JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento GROUP BY iv.id_medicamento ORDER BY CantidadVendida DESC LIMIT 1;");
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const mostrarPromedioVentasPorMes = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT t.Mes, t.TotalVentasMes, (t.TotalVentasMes / (SELECT SUM(total_venta) FROM inventario_ventas) * 100) AS Porcentaje FROM (SELECT DATE_FORMAT(fecha_venta, '%Y-%m') AS Mes, SUM(total_venta) AS TotalVentasMes FROM inventario_ventas GROUP BY Mes) AS t;");
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const mostrarVentasTotales = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT SUM(cantidad_vendida) AS total_cantidad_vendida, SUM(CAST(total_venta AS DECIMAL(10,2))) AS total_venta FROM inventario_ventas WHERE estado = ?;", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const methods = {
    listarVentasDisponibles,
    listarVentasNoDisponibles,
    listarVentasMedicamento,
    listarVentasPaciente,
    addVenta,
    updateVenta,
    deleteVenta,
    deleteVentas,
    recuperarVenta,
    recuperarVentas,
    mostrarVentasTotales,
    mostrarVentasPorMedicamento,
    mostrarMedicamentoMasVendido,
    mostrarPromedioVentasPorMes
}