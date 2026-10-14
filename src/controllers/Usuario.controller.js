import {getConnection} from "../database/connection.js";
import sql from 'mssql'

export const getUsuario = async (req,res) =>{

    try {
        //Obtenemos el pool de conexiones
        const pool = await getConnection();
        const result = await pool
        .request()
        .query("SELECT * FROM FN_ObtenerUsuarios()")
        //console.log(result.recordset);

        res.json(result.recordset)

    } catch (err) {

        console.log(err);
        res.status(500).json({mssg:'Error al listar usuarios'});
        
    }

}

//Obtener Usuario por nombre

export const getUsuario_by_Name = async(req,res) =>{

    try {

        const pool = await getConnection();
        const result = await pool.request()
        .input("name",sql.VarChar(50),req.params.name)
        .query("SELECT * FROM FN_ObtenerCliente(@name)")

        if(result.rowsAffected[0] === 0){

            return res.status(404).json({mssg:'No se ha encontrado dicho nombre'});
        }

        res.status(200).json(result.recordset);

    } catch (error) {
        
        console.log(error);   
        res.status(404).json({mssg:"usuario no encontrado",problema:error.message})
    }

}

//Insertar usuario

export const postUsuario = async (req,res) =>{

    try {

        const pool = await getConnection();
        const {Nombre_usuario, password, Correo_usuario, Monto_usuario } = req.body;
        //Validaciones 

        if(!Nombre_usuario || String(Nombre_usuario).length === 0 ){

         return res.status(400).json({mssg:"inserte un nombre"});
        }

        if(!password || String(password).length === 0 ){

         return res.status(400).json({mssg:"inserte una contraseña"});
        }

        if(!Correo_usuario || String(Correo_usuario).length === 0){

         return res.status(400).json({mssg:"inserte un correo"});
        }

       const result = await pool.request()
       .input("Nombre_usuario",sql.VarChar(60),Nombre_usuario)
       .input("password",sql.NVarChar(255),password)
       .input("Correo_usuario",sql.VarChar(120),Correo_usuario)
       .input("Monto_usuario",sql.Decimal(11,2),Monto_usuario)
       .execute("SP_Insertar_usuario");

       //const newId = result.recordset && result.recordset[0] ? result.recordset[0].Id : null;
       //if (!newId) return res.status(500).json({ message: 'No se pudo obtener el ID insertado' });

      //console.log(newId);

       res.status(201).json({

        mssg:"usuario creado con exito",
        nombre:Nombre_usuario,
        correo:Correo_usuario,
        monto: Monto_usuario
       });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear usuario', error: err.message });
    }
}

//Actualizar Contraseña dado el id

export const putUsuario_contraseña = async (req,res) =>{

    try {

        const pool = await getConnection();
        const {vieja_password,nueva_password} = req.body

        if(!vieja_password || String(vieja_password).length === 0){

         res.status(400).json({mssg:"inserte la contraseña"});

        }

        if(!nueva_password || String(nueva_password).length === 0){

         res.status(400).json({mssg:"inserte la contraseña"});

        }


        const id = parseInt(req.params.id_nusuario,10);
        const result = await pool
        .request()
        .input("id_nusuario",sql.Int,id)
        .input("vieja_password",sql.NVarChar(255),vieja_password)
        .input("nueva_password",sql.NVarChar(255),nueva_password)
        .execute("SP_Actualizar_usuario_password")

        if(result.rowsAffected[0] === 0){

            res.status(404).json({msg:"Usuario no encontrado"})
        }

        res.json(result.recordset[0]);
    } catch (error) {
        
        console.log(error)
        res.status(500).json({mssg:"error al actualizar contraseña",problema:error.message})
    }
}


//Actualizar monto de usuario

export const putUsuario_monto = async (req,res) =>{

    try {

        const pool = await getConnection();
        const id = parseInt(req.params.id_nusuario,10);
        
        const {password,monto_usuario} = req.body
        const result = await pool.request()
        .input("id_nusuario",sql.Int,id)
        .input("password",sql.NVarChar(255),password)
        .input("monto_usuario",sql.Decimal(11,2),monto_usuario)
        .execute("SP_Actualizar_usuario_dinero")

        if(result.rowsAffected[0] === 0){

            res.status(404).json({msg:"Usuario no encontrado"})
        }

        res.json(result.recordset[0]);
        
    } catch (error) {

        console.log(error)
        res.status(500).json({mssg:"error al actualizar monto",problema:error.message})

    }
}

//Eliminar usuario dado id

export const delUsuario = async (req,res) => {

    try {

        const pool = await getConnection();
        const id = parseInt(req.params.id_nusuario,10);
        const result = await pool
        .request()
        .input("id_nusuario",sql.Int,id)
        .input("password",sql.NVarChar(255),req.body.password)
        .execute("SP_Eliminar_usuario");

        if(result.rowsAffected[0] ===0){

            res.status(404).json({mssg: "Usuario no encontrado"});
        }

        res.status(200).json({mssg:"usuario eliminado con exito"});

    } catch (error) {

        console.log(error);
        res.status(500).json({mssg:"Error al eliminar el usuario",problema:error.message})
        
    }

}