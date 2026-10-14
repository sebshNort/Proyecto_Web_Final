//Aqui se hace el servicio que se lee cuando una apuesta debe cerrarse
//Ademas afecta al historial aquellas apuestas que se cerradon

import { getConnection } from "../database/connection.js"
import sql from "mssql"

let ejecutando = false;

export async function cerrarApuestasVencidas() {
  if (ejecutando) return [];
  ejecutando = true;

  try {
    const pool = await getConnection();
    const result = await pool.request().execute("sp_CerrarApuestasVencidas");
    const cerradas = result.recordset ?? [];

    // 2. Por cada apuesta cerrada, liquida historial y usuarios

    for (const apuesta of cerradas) {
      
        try {
           await pool.request()
          .input("id_apuesta", sql.Int, apuesta.id_apuesta)
          .execute("SP_Modificar_historial");   
          console.log(`La apuesta de id ${apuesta.id_apuesta} cual es ${apuesta.Nombre_apuesta} fue eliminada con exito`)
      } 
       catch (err) {

        console.error(`[Job] Error liquidando apuesta ${apuesta.id_apuesta}:`, err.message);

      }
    } 
    return cerradas;

  } 
  catch (error) {

    console.error("[Job] Error al cerrar apuestas:", error.message);
    return [];

  } 
   finally {
    ejecutando = false;
  }
}