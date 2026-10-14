import {getConnection} from "../database/connection.js";
import sql from 'mssql'


//Filtrar apuestas que estan disponibles
export const getApuesta = async(req,res) =>{

    try {

        const pool = await getConnection();
        const result = await pool.request()
        .query("SELECT * FROM FN_Obtener_apuesta()");
        console.log(result.recordset);

        res.status(200).json(result.recordset)

        
    } catch (error) {

        console.log(error);
        res.status(500).json({mssg:'Error al listar Apuestas'});

        
    }
}

//Filtrar apuestas por nombre de apuesta y que estan disponible
//aqui se hara algo hardcore y es que pondre, debido a que el stored
//procedure lo requiere a catalogo como vacio (en el stored procedure manejo que encuentre uno o el otro)

export const getApuesta_nombre_apuesta = async(req,res) =>{

    try {

        const pool = await getConnection();
        const {Nombre_apuesta} = req.params;
        //Aqui esta el elemento hardcore que es catalogo, que lo deje vacio
        const catalogo = "";


        const result = await pool
        .request()
        .input("Nombre_apuesta",sql.NVarChar(100),Nombre_apuesta)
        .input("Categoria_apuesta",sql.NVarChar(100),null)
        .execute("sp_FiltrarApuestas")

        if(result.recordset.length === 0){

            return res.status(404).json({mssg:"Ninguna apuesta fue encontrada"});

        }

        res.status(200).json(result.recordset)
        

        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({mssg:'Error al listar Apuesta'});

    }


}

//Filtrar apuestas por categoria, lo mismo que la otra pero alreves

export const getApuesta_catalogo_apuesta = async(req,res) =>{

    try {

        const pool = await getConnection();
        const {Categoria_apuesta} = req.params;

        const result = await pool
        .request()
        .input("Nombre_apuesta",sql.NVarChar(100),null)
        .input("Categoria_apuesta",sql.NVarChar(100), Categoria_apuesta)
        .execute("sp_FiltrarApuestas")

        if(result.recordset.length === 0){

            return res.status(404).json({mssg:"Ninguna apuesta fue encontrada"});

        }
    
        res.status(200).json(result.recordset)
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({mssg:'Error al listar Apuesta'});

    }

}

//Insertar apuesta

export const postApuesta = async(req, res) =>{

    try {

        const pool = await getConnection();
        const {Nombre_apuesta,
            Categoria_apuesta,
            descripcion_apuesta,
            Fecha_cierre} = req.body;
        
        //Validaciones
        if(!Nombre_apuesta || String(Nombre_apuesta).length === 0 ){

         return res.status(400).json({mssg:"inserte una apuesta"});
        }

        if(!Categoria_apuesta || String(Categoria_apuesta).length === 0 ){

         return res.status(400).json({mssg:"inserte una categoria"});
        }

        if(!descripcion_apuesta || String(descripcion_apuesta).length === 0){

         return res.status(400).json({mssg:"inserte una descripcion"});
        }


        if (!Fecha_cierre || !isNaN(Fecha_cierre)) {

            return res.status(400).json({ mssg: "Fecha de cierre inválida" });

        }

        const result = await pool.request()
        .input("Nombre_apuesta",sql.NVarChar(60),Nombre_apuesta)
        .input("Categoria_apuesta",sql.NVarChar(60),Categoria_apuesta)
        .input("descripcion_apuesta",sql.NVarChar(150),descripcion_apuesta)
        .input("Fecha_cierre",sql.DateTime2,Fecha_cierre)
        .execute("SP_Insertar_Apuesta");

        res.status(201).json(
            {
                mssg:"Apuesta Creada con exito",
                nombre: Nombre_apuesta,
                categoria: Categoria_apuesta,
                descripcion_apuesta: descripcion_apuesta,
                fecha_de_cierre: Fecha_cierre
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({ message: 'Error al crear Apuesta', error: error.message });
    }
}
