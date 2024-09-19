import {Router, request} from "express";
import {methods as ventasController} from "../controllers/fventas.controller.js";

const router = Router();

//mostrar listado de ventas, medicamentos y pacientes registrados
router.get("/", ventasController.listarVentasDisponibles); 
router.get("/medicamentos", ventasController.listarVentasMedicamento); 
router.get("/pacientes", ventasController.listarVentasPaciente);

//mostrar listado de ventas con estado false
router.get("/no", ventasController.listarVentasNoDisponibles);

//insercion y modificacion del campo cantidad
router.post("/registrar", ventasController.addVenta);

//modificar proveedores
router.put("/modificar/:id", ventasController.updateVenta);

//eliminar producto
router.put("/eliminar/:id",ventasController.deleteVenta);
router.put("/eliminarventas",ventasController.deleteVentas);

//eliminar producto
router.put("/recuperar/:id",ventasController.recuperarVenta);
router.put("/recuperarVentas",ventasController.recuperarVentas);

//Estadisticas
router.get("/ventaMedicamento", ventasController.mostrarVentasPorMedicamento);
router.get("/ventaMedicamentoMasVendido", ventasController.mostrarMedicamentoMasVendido);
router.get("/ventasPromedioMes", ventasController.mostrarPromedioVentasPorMes);
router.get("/ventaTotal", ventasController.mostrarVentasTotales);


export default router;