//Este job lo que hace es ver cada 10 segundos si una apuesta dada la hora cierre
//debe cerrarse o no y cuando se cierre ejecuta el stored procedure para cerrar la apuesta

import cron from "node-cron";
import { cerrarApuestasVencidas } from "../services/Apuesta.services.js"

export function iniciarJobCierreApuestas() {
  cron.schedule("*/10 * * * * *", cerrarApuestasVencidas); // cada 10 s

  cerrarApuestasVencidas(); 

  console.log("[Job] Cierre automático de apuestas iniciado");
}