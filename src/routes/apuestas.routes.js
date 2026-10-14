import {Router} from "express"
import {deleteApuesta, getApuesta, 
       getApuestas, 
       postApuestas,
       putApuesta}
    from "../controllers/apuestas.controllers.js"

const router = Router()

router.get("/apuestas",getApuestas);

router.get("/apuestas:id",getApuesta)

router.post("/apuestas",postApuestas)

router.put("/apuestas/:id",putApuesta)

router.delete("/apuestas/:id",deleteApuesta)

export default router;