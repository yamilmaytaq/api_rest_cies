import {Router, request} from "express";
import {methods as reabastecerController} from "../controllers/freabastecimiento.controller.js";

const router = Router();
    //Listar
router.get("/", reabastecerController.listarReabastecimientoDisponibles);
router.get("/productos", reabastecerController.listarReabastecimientoProductos);
router.get("/proveedores", reabastecerController.listarReabastecimientoProveeores);

//listar producto no disponibles
router.get("/no", reabastecerController.listarReabastecimientoNoDisponibles);

//Insercion
router.post("/registrar", reabastecerController.addReabastecimiento);

//Actualizar
router.put("/actualizar/:id",reabastecerController.updateReabastecimiento);

//Eliminar
router.put("/eliminar/:id", reabastecerController.deleteReabastecimiento);
router.put("/eliminarVarios", reabastecerController.deleteReabastecimientos);

//Reactivar lo rebastecimientos eliminados
router.put("/regresar/:id", reabastecerController.returnReabastecimiento);
router.put("/regresarVarios", reabastecerController.returnReabastecimientos);

export default router;