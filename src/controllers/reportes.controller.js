import { getConnection } from "./../database/database.js";

////////////////////////////////////////////////////////////////////
//Informe usuarios
const getUsuarios = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT *, DATE_FORMAT(fecha_creacion, '%Y-%m-%d') AS fecha_creacion FROM usuarios WHERE estado = ? ORDER BY fecha_creacion DESC", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getInformeUsuarios = async (req, res) => {
    try {
      const fechaInicio = req.query.fechaInicio;
      const fechaFin = req.query.fechaFin;
      const estado = req.query.estado; // Nuevo parámetro para el estado
      
      let query = "SELECT *, DATE_FORMAT(fecha_creacion, '%Y-%m-%d') AS fecha_creacion FROM usuarios WHERE 1"; // Cambiar "WHERE estado = 1" por "WHERE 1" para permitir otras condiciones
      
      const queryParams = [];
      
      if (fechaInicio && fechaFin) {
        query += " AND fecha_creacion BETWEEN ? AND ?";
        queryParams.push(fechaInicio, fechaFin);
      }
      
      if (estado === "1") {
        query += " AND estado = 1"; // Agregar condición de estado activo
      } else if (estado === "0") {
        query += " AND estado = 0"; // Agregar condición de estado inactivo
      }
      
      const [result] = await getConnection.query(query, queryParams);
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  



////////////////////////////////////////////////////////////////////
//informes pacientes
const getPacientes = async (req, res) => {
    try {
        const [result] = await getConnection.query("SELECT *, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento FROM pacientes WHERE estado = 1");
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getInformePacientes = async (req, res) => {
    try {
      const fechaInicio = req.query.fechaInicio;
      const fechaFin = req.query.fechaFin;
      const genero = req.query.genero; // Obtener el parámetro de género desde la consulta
  
      let query = "SELECT *, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento FROM pacientes WHERE estado = 1";
  
      const queryParams = [];
  
      if (fechaInicio && fechaFin) {
        query += " AND fecha_nacimiento BETWEEN ? AND ?";
        queryParams.push(fechaInicio, fechaFin);
      }
  
      if (genero && (genero === 'Masculino' || genero === 'Femenino')) {
        query += " AND sexo = ?";
        queryParams.push(genero);
      }
  
      const [result] = await getConnection.query(query, queryParams);
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
}

/////////////////////////////////////////////////////////////////////////////
//Informes servicios
const getFechaServicios = async (req, res) => {
    try {
        const estado = true;
        const [result] = await getConnection.query("SELECT s.*, DATE_FORMAT(s.fecha_creacion, '%Y-%m-%d') AS fecha_creacion, c.nombre_categoria FROM servicios s INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = ? ORDER BY s.fecha_creacion DESC;", estado);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const getInformeServicios = async (req, res) => {
    try {
      const fechaInicio = req.query.fechaInicio;
      const fechaFin = req.query.fechaFin;
      const categoria = req.query.categoria;
  
      let query = "SELECT s.*, DATE_FORMAT(s.fecha_creacion, '%Y-%m-%d') AS fecha_creacion, c.nombre_categoria FROM servicios s INNER JOIN categoria_servicios c ON s.id_categoria = c.id WHERE s.estado = 1 ";
      const queryParams = [];
  
      if (fechaInicio && fechaFin) {
        query += " AND s.fecha_creacion BETWEEN ? AND ?";
        queryParams.push(fechaInicio, fechaFin);
      }

      if (categoria) {
        query += " AND c.nombre_categoria = ?";
        queryParams.push(categoria);
      }
  
      const [result] = await getConnection.query(query, queryParams);
      console.log(result);
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

/////////////////////////////////////////////////////////////////////////////
//Informes proveedores
const listarProveedores = async (req, res) => {
  try {
      const estado = true;
      const [result] = await getConnection.query("SELECT * FROM inventario_proveedores WHERE estado = ?", estado);
      console.log(result);
      res.json(result);
  } catch (error) {
      res.status(500).send(error.message);
  }
}

const getInformeProveedores = async (req, res) => {
  try {
    const estado = req.query.estado; // Nuevo parámetro para el estado
    
    let query = "SELECT * FROM inventario_proveedores WHERE 1"; // Cambiar "WHERE estado = 1" por "WHERE 1" para permitir otras condiciones
    
    const queryParams = [];
    
    if (estado === "1") {
      query += " AND estado = 1"; // Agregar condición de estado activo
    } else if (estado === "0") {
      query += " AND estado = 0"; // Agregar condición de estado inactivo
    }
    
    const [result] = await getConnection.query(query, queryParams);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/////////////////////////////////////////////////////////////////////////////
//Informe productos
const listarProductos = async (req, res) => {
  try {
      const estado = true;
      const [result] = await getConnection.query("SELECT m.*, DATE_FORMAT(m.fecha_caducidad, '%Y-%m-%d') AS fecha_caducidad, c.nombre_categoria, p.nombre_proveedor FROM inventario_medicamentos m JOIN inventario_categorias c ON m.categoria_id = c.id_categoria JOIN inventario_proveedores p ON m.proveedor_id = p.id_proveedor WHERE m.estado = ? ORDER BY m.fecha_creacion DESC", estado);
      console.log(result);
      res.json(result);
  } catch (error) {
      res.status(500).send(error.message);
  }
}

const listarCategoriasProductos = async (req, res) => {
  try {
      const [result] = await getConnection.query("SELECT * FROM inventario_categorias");
      res.json(result);
  } catch (error) {
      res.status(500).send(error.message);
  }
}

const getInformeProductos = async (req, res) => {
  try {
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    const nombre_categoria = req.query.nombre_categoria;

    let query = "SELECT m.*, DATE_FORMAT(m.fecha_caducidad, '%Y-%m-%d') AS fecha_caducidad, c.nombre_categoria, p.nombre_proveedor FROM inventario_medicamentos m JOIN inventario_categorias c ON m.categoria_id = c.id_categoria JOIN inventario_proveedores p ON m.proveedor_id = p.id_proveedor WHERE m.estado = 1";

    const queryParams = [];

    if (fechaInicio && fechaFin) {
      query += " AND m.fecha_caducidad BETWEEN ? AND ?";
      queryParams.push(fechaInicio, fechaFin);
    }
    if (nombre_categoria) {
      query += " AND c.nombre_categoria = ?";
      queryParams.push(nombre_categoria);
    }

    const [result] = await getConnection.query(query, queryParams);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

/////////////////////////////////////////////////////////////////////////////
//Informe reabastecimiento
const listarReabastecimiento = async (req, res) => {
  try {
      const estado = true;
      const [result] = await getConnection.query("SELECT r.*, DATE_FORMAT(r.fecha_reabastecimiento, '%Y-%m-%d') AS fecha_reabastecimiento , p.nombre_proveedor FROM inventario_reabastecimiento r INNER JOIN inventario_proveedores p ON r.id_proveedor = p.id_proveedor WHERE r.estado = ?", estado);
      console.log(result);
      res.json(result);
  } catch (error) {
      res.status(500).send(error.message);
  }
}

const listarNombreProveedorReabastecimiento = async (req, res) => {
  try {
    const estado = true;
    //const query = "SELECT DISTINCT p.nombre_proveedor FROM inventario_reabastecimiento r INNER JOIN inventario_proveedores p ON r.id_proveedor = p.id_proveedor WHERE r.estado = ?";
    const query = "SELECT nombre_proveedor FROM inventario_proveedores WHERE estado = ?";
    const [result] = await getConnection.query(query, estado);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getInformeReabastecimiento = async (req, res) => {
  try {
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    const nombre_proveedor = req.query.nombre_proveedor;

    let query = "SELECT r.*, DATE_FORMAT(r.fecha_reabastecimiento, '%Y-%m-%d') AS fecha_reabastecimiento , p.nombre_proveedor FROM inventario_reabastecimiento r INNER JOIN inventario_proveedores p ON r.id_proveedor = p.id_proveedor WHERE r.estado = 1";

    const queryParams = [];

    if (fechaInicio && fechaFin) {
      query += " AND r.fecha_reabastecimiento BETWEEN ? AND ?";
      queryParams.push(fechaInicio, fechaFin);
    }
    if (nombre_proveedor) {
      query += " AND p.nombre_proveedor = ?";
      queryParams.push(nombre_proveedor);
    }

    const [result] = await getConnection.query(query, queryParams);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


/////////////////////////////////////////////////////////////////////////////
//Informe ventas
const listarVentas = async (req, res) => {
  try {
      const estado = true;
      const [result] = await getConnection.query("SELECT iv.id_venta, im.nombre_medicamento, iv.cantidad_vendida,DATE_FORMAT(iv.fecha_venta, '%Y-%m-%d') AS fecha_venta, iv.total_venta FROM inventario_ventas iv JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento WHERE iv.estado = ?", estado);
      console.log(result);
      res.json(result);
  } catch (error) {
      res.status(500).send(error.message);
  }
}

const listarNombreMedicamentosVentas = async (req, res) => {
  try {
    const estado = true;
    const query = "SELECT DISTINCT im.nombre_medicamento FROM inventario_ventas iv JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento WHERE iv.estado = ?";
    const [result] = await getConnection.query(query, estado);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getInformeVentas = async (req, res) => {
  try {
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    const nombre_medicamento = req.query.nombre_medicamento;

    let query = "SELECT iv.id_venta, im.nombre_medicamento, iv.cantidad_vendida,DATE_FORMAT(iv.fecha_venta, '%Y-%m-%d') AS fecha_venta, iv.total_venta FROM inventario_ventas iv JOIN inventario_medicamentos im ON iv.id_medicamento = im.id_medicamento WHERE iv.estado = 1";

    const queryParams = [];

    if (fechaInicio && fechaFin) {
      query += " AND iv.fecha_venta BETWEEN ? AND ?";
      queryParams.push(fechaInicio, fechaFin);
    }
    if (nombre_medicamento) {
      query += " AND im.nombre_medicamento = ?";
      queryParams.push(nombre_medicamento);
    }

    const [result] = await getConnection.query(query, queryParams);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
}


export const methods = {
    getUsuarios,
    getInformeUsuarios,
    getInformePacientes,
    getPacientes,
    getInformeServicios,
    getFechaServicios,
    listarCategorias,
    listarProveedores,
    getInformeProveedores,
    listarProductos,
    listarCategoriasProductos,
    getInformeProductos,
    listarReabastecimiento,
    listarNombreProveedorReabastecimiento,
    getInformeReabastecimiento,
    listarVentas,
    listarNombreMedicamentosVentas,
    getInformeVentas
}
  