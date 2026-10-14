import { Router } from "express";
import { 
    getHistorial,
    getHistorial_por_nombre,
    postHistorial

 } from "../controllers/Historial.controller.js";



const router = Router();

//Listar historial-en base a las apuestas ganadas y perdidas

router.get('/Historial',getHistorial);

//Filtrar historial

router.get('/Historial/:Nombre_usuario',getHistorial_por_nombre)

//Insertar una nueva apuesta y usuario al historial y monto
router.post('/Historial',postHistorial)

export default router;
