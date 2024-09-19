import {Router, request} from "express";
import {methods as reportesController} from "./../controllers/reportes.controller.js";

const router = Router();

//Reportes usuarios
router.get("/usuarios", reportesController.getUsuarios);
router.get("/informeUsuarios", reportesController.getInformeUsuarios);


//Reportes pacientes
router.get("/pacientes", reportesController.getPacientes);
router.get("/informePacientes", reportesController.getInformePacientes);

//Reportes servicios
router.get("/informeServicios", reportesController.getInformeServicios);
router.get("/fechaServicios", reportesController.getFechaServicios);
router.get("/categorias", reportesController.listarCategorias);

//Reportes proveedores
router.get("/proveedores", reportesController.listarProveedores);
router.get("/informeProveedores", reportesController.getInformeProveedores);

//Reportes productos
router.get("/productos", reportesController.listarProductos);
router.get("/categoriaProductos", reportesController.listarCategoriasProductos);
router.get("/informeProductos", reportesController.getInformeProductos);

//Reportes reabastecimiento
router.get("/reabastecimiento", reportesController.listarReabastecimiento);
router.get("/nombreProveedorReabastecimiento", reportesController.listarNombreProveedorReabastecimiento);
router.get("/informeReabastecimiento", reportesController.getInformeReabastecimiento);

//Reportes ventas
router.get("/ventas", reportesController.listarVentas);
router.get("/nombreMedicamentoVentas", reportesController.listarNombreMedicamentosVentas);
router.get("/informeVentas", reportesController.getInformeVentas);

export default router;