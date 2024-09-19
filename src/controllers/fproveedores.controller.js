import { getConnection } from "./../database/database.js";


//mostrar un listado de proveedores
const listarProveedoresDisponibles = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT * FROM inventario_proveedores WHERE estado = ?", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//mostrar un listado de proveedores que estan eliminados o no activos
const listarProveedoresNoDisponibles = async (req, res) => {
    try {
        const estado = false;
        const [result] = await getConnection.query("SELECT * FROM inventario_proveedores WHERE estado = ?", estado);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//insertar nuevo proveedor
const addProveedor = async (req, res) => {
    try {
        const { nombre_proveedor, representante, telefono, descripcion_proveedor } = req.body;

        // Convertir el nombre del proveedor a mayúsculas para la comparación
        const nombreProveedorUpper = nombre_proveedor.toUpperCase();

        // Verificar si el proveedor ya existe en la base de datos
        const [existingProveedor] = await getConnection.query("SELECT * FROM inventario_proveedores WHERE UPPER(nombre_proveedor) = ?", [nombreProveedorUpper]);
        if (existingProveedor.length > 0) {
            return res.status(400).json({ message: 'El proveedor ya existe en la base de datos.' });
        }

        const estado = true;
        const proveedoresProps = { nombre_proveedor, representante, telefono, descripcion_proveedor, estado };
        const [result] = await getConnection.query("INSERT INTO inventario_proveedores SET ?", proveedoresProps);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}



//editar productos que estan mal registrados
const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_proveedor, representante, telefono, descripcion_proveedor} = req.body;
        const proveedoresProps = { nombre_proveedor, representante, telefono, descripcion_proveedor}
        const [result] = await getConnection.query("UPDATE inventario_proveedores SET ? WHERE id_proveedor = ?", [proveedoresProps, id]);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


//Eliminar(cambiar el estado) de los proveedores que yo no son necesarios
const deleteProvedor = async (req, res) => {
    try {
        const estado = false;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_proveedores SET estado = ? WHERE id_proveedor = ?",[estado , id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//Eliminar(cambiar el estado) de los proveedores que yo no son necesarios
const returnProvedor = async (req, res) => {
    try {
        const estado = true;
        const { id } = req.params;
        const [result] = await getConnection.query("UPDATE inventario_proveedores SET estado = ? WHERE id_proveedor = ?",[estado , id]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const deleteProvedores = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = false;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_proveedores SET estado = ? WHERE id_proveedor IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const returnProvedores = async (req, res) => {
    try {
        const { ids } = req.body;
        const estado = true;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs inválidos" });
        }
        const sql = "UPDATE inventario_proveedores SET estado = ? WHERE id_proveedor IN (?)";
        const [result] = await getConnection.query(sql, [estado, ids]);

        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export const methods = {
    listarProveedoresDisponibles,
    listarProveedoresNoDisponibles,
    addProveedor,
    updateProveedor,
    deleteProvedor,
    deleteProvedores,
    returnProvedor,
    returnProvedores
}