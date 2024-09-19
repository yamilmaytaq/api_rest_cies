import {Router, request} from "express";
import {methods as proveedoresController} from "../controllers/fproveedores.controller.js";

const router = Router();

//mostrar listado de proveedor registrados
router.get("/", proveedoresController.listarProveedoresDisponibles);

//mostrar listado de proveedor inactivos
router.get("/no", proveedoresController.listarProveedoresNoDisponibles);

//insercion de proveedores
router.post("/registrar", proveedoresController.addProveedor);

//modificar proveedores
router.put("/modificar/:id", proveedoresController.updateProveedor);

//eliminar proveedores
router.put("/eliminar/:id",proveedoresController.deleteProvedor);
router.put("/eliminarproveedores",proveedoresController.deleteProvedores);

//reactvivar los proveedores eliminados
router.put("/regresar/:id",proveedoresController.returnProvedor);
router.put("/regresarproveedores",proveedoresController.returnProvedores);

export default router;