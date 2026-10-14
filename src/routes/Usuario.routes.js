import { Router } from "express";
import { 
    getUsuario,
    getUsuario_by_Name,
    postUsuario,
    putUsuario_contraseña,
    putUsuario_monto,
    delUsuario

} 
from "../controllers/Usuario.controller.js";

//Incompleto

const router = Router()

//Ver usuarios
router.get('/Usuario',getUsuario);

//Filtralos por nombre
router.get('/Usuario/:name',getUsuario_by_Name)

//Insertar usuario
router.post('/Usuario',postUsuario)

//Actualizar contraseña del usuario

router.put('/Usuario/password/:id_nusuario',putUsuario_contraseña)

//Actualizar monto del usuario

router.put('/Usuario/monto/:id_nusuario',putUsuario_monto)

//Eliminar usuario dada su password y id

router.delete('/Usuario/:id_nusuario',delUsuario)

export default router;