import api from './api';

//Listar historial en base a las apuestas ganadas y perdidas

export async function ObtenerHistorial(){

    const {data} = await api.get('/Historial');
    return data;
}

//Filtrar historial por nombre

export async function ObtenerHistorial_por_nombre(Nombre_usuario){

    const {data} = await api.get(`/Historial/${Nombre_usuario}`);
    return data;
}

//Insertar datos al historial

export async function InsertarHistorial({Id_usuario,Id_apuesta,Monto}){

    const {data} = await api.post('/Historial',{Id_usuario,Id_apuesta,Monto});
    return data;
}