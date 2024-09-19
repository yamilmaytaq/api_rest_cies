import {Router, request} from "express";
import {methods as informesController} from "./../controllers/informes.controller.js";

const router = Router();

//Recuperar los servicios mas usados en los ultimos 7 dias
router.get("/serviciosutilizados", informesController.getServicioUsados);

//Recuperar los pacientes registrados en los ultimos 7 dias
router.get("/cantidadpacientes", informesController.getCantidadPacientes);

export default router;