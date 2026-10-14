import { Router } from "express";
import {  
    getApuesta,
    getApuesta_nombre_apuesta,
    getApuesta_catalogo_apuesta,
    postApuesta

} from "../controllers/Apuesta.controller.js";

const router = Router();

//Ver apuestas activas

router.get('/Apuesta',getApuesta)

//Filtrar apuesta por nombre

router.get('/Apuesta/:Nombre_apuesta',getApuesta_nombre_apuesta)

//Filtrar apuesta por categoria
router.get('/Apuesta/Categoria/:Categoria_apuesta',getApuesta_catalogo_apuesta)

//Insertar apuesta

router.post('/Apuesta',postApuesta)

export default router;
