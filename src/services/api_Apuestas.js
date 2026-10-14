import api from './api';

//Get apuestas activas

export async function ObtenerApuestas(){

    const {data} = await api.get('/Apuesta');
    return data;

}

//Ver apuestas por nombre

export async function ObtenerApuestas_por_Nombre(Nombre_apuesta){

    const {data} = await api.get(`/Apuesta/${Nombre_apuesta}`)
    return data;
}

//Ver apuestas por categoria

export async function ObtenerApuestas_por_categoria(Categoria_apuesta){

    const {data} = await api.get(`/Apuesta/Categoria/${Categoria_apuesta}`)
    return data;
}

//Insertar Apuesta

export async function InsertarApuesta({Nombre_apuesta,Categoria_apuesta,descripcion_apuesta,Fecha_cierre}){

    const {data} = await api.post('/Apuesta');
    return;
}


