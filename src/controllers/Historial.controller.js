import {getConnection} from "../database/connection.js";
import sql from 'mssql'

//Obtener historial

export const getHistorial = async (req,res) =>{

    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM FN_Listar_historial()")
        console.log(result.recordsets);


        res.status(200).json(result.recordset)
        
    } 
    catch (error) {

        console.log(error);
        res.status(500).json({msg:"Error al listar historial"});   
    }
}

//Filtrar historial por nombre

export const getHistorial_por_nombre = async (req,res) =>{

    try {

        const pool = await getConnection();

        const {Nombre_usuario} = req.params;


        const result = await pool
        .request()
        .input("Nombre_usuario",sql.NVarChar(60),Nombre_usuario)
        .execute("SP_Filtrar_historialusuario");

        
        res.status(200).json(result.recordset);        
    } 
    catch (error) {

        //console.log(error);
        res.status(500).json({msg:"Error al consultar el historial",error:error.message});
    }
}


//Insertar una apuesta al historial

export const postHistorial = async (req,res) =>{

    try {

        const pool = await getConnection();
        const {Id_usuario, Id_apuesta, Monto} = req.body;
       

       const result = await pool.request()
       .input("Id_usuario",sql.Int,Id_usuario)
       .input("Id_apuesta",sql.Int,Id_apuesta)
       .input("Monto",sql.Decimal(11,2),Monto)
       .execute("SP_Registrar_Historial");

       res.status(201).json({
        mssg:"Historial registradocon exito",
        codigo_usuario:Id_usuario,
        codigo_apuesta:Id_apuesta,
        monto: Monto
       });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al Registrar usuario y apuesta', error: err.message });
    }
}