import express from 'express'
import apuestasRoutes from './routes/apuestas.routes.js'
import usuarioRoutes from "./routes/Usuario.routes.js";
import ApuestasRoutes from "./routes/Apuesta.routes.js";
import  historialRoutes  from "./routes/Historial.routes.js";

const app = express();

app.use(express.json());

app.use(apuestasRoutes);
app.use(usuarioRoutes);
app.use(ApuestasRoutes);
app.use(historialRoutes);

export default app