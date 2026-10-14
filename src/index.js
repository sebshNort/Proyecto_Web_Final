import app from './app.js'
import { config } from "./config.js";
import { getConnection } from "./database/connection.js";
import { iniciarJobCierreApuestas } from "./jobs/cierreApuestas.job.js"

getConnection()

//app.listen(5000);

app.listen(5000,() => {
    iniciarJobCierreApuestas();
})

console.log('WAITING ON PORT 5000, Inspeccion de apuestas iniciada')