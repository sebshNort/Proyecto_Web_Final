import {getConnection} from "../database/connection.js";
import sql from 'mssql'

export const getApuestas = async (req,res) =>{

    //obtenemos la conexion con la base de datos
    const pool = await getConnection()
    const result = await pool.request().query('SELECT * FROM tApuestas')
    res.json(result.recordset)
}

export const getApuesta = async (req,res) =>{

    console.log(req.params.id);

    const pool = await getConnection();
    const result = await pool.
    request()
    .input("id",sql.Int, req.params.id)
    .query("SELECT * FROM tApuestas where id = @id");

    if(result.rowsAffected[0] ===0){

        return res.status(404).json({message:"Product not found"});
    }

    return res.json(result.recordset[0]);
}

export const postApuestas =  async (req,res) =>{

    const pool = await getConnection();
    const result = await pool
    .request()
    .input("nombre",sql.VarChar(200),req.body.nombre)
    .input("price",sql.Decimal,req.body.price)
    .input("quantity",sql.Int,req.body.quantity)
    .input("description",sql.Text,req.body.description)
    .query(

        "INSERT INTO tApuestas (nombre,price,quantity,description) VALUES (@nombre,@price,@quantity,@description); SELECT SCOPE_IDENTITY() AS id"

    )

    console.log(result)

    res.json({

        id:result.recordset[0].id,
        name: req.body.nombre,
        descripcion:req.body.description,
        quantity: req.body.quantity,
        price: req.body.price

    })

}


export const putApuesta = async (req,res) =>{

    const pool = await getConnection();
    const result = await pool
    .request()
    .input("id",sql.Int,req.params.id)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("price", sql.Decimal, req.body.price)
    .input("quantity", sql.Int, req.body.quantity)
    .input("description", sql.Text, req.body.description)
    .query("UPDATE tApuestas SET nombre = @nombre, price = @price, quantity = @quantity,description = @description where id = @id;")

    if(result.rowsAffected[0] === 0){

        res.status(404).json({msg:"Product not found"})
    }

    res.json({

        msg:"actualizado de forma exitosa",
        id:req.params.id,
        name: req.body.nombre,
        descripcion:req.body.description,
        quantity: req.body.quantity,
        price: req.body.price

    })


}

export const deleteApuesta = async (req,res)=>{

    const pool = await getConnection()
    const result = await pool.request()
    .input("id",sql.Int,req.params.id)
    .query("DELETE FROM tApuestas where id = @id")

    if(result.rowsAffected === 0){

        res.status(404).json({mssg: "Product not found"});

    }

    res.status(200).json({msg:"elimiado con exito"});

}