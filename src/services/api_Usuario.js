import api from './api';

// GET /Usuario
export const obtenerUsuarios = async () => {
  const { data } = await api.get('/Usuario');
  return data;
};


// Get por nombre

export async function obtenerUsuario_por_nombre(Nombre_usuario){

    const {data} = await api.get(`/Usuario/${Nombre_usuario}`);
    return data;
}

//Insertar usuario

export async function CrearUsuario({Nombre_usuario,password,Correo_usuario,Monto_usuario}){

    const {data} = await api.post('/Usuario',{Nombre_usuario,password,Correo_usuario,Monto_usuario});
    return data;

}

//Actualizar password del usuario

export async function ActualizarUsuario_password(id,{vieja_password,nueva_password}){

    const {data} = await api.put(`/Usuario/password/${id}`,{vieja_password,nueva_password})
    return data;
}

//Actualizar monto del usuario

export async function ActualizarUsuario_monto(id,{password,monto_usuario}){

    const {data} = await api.put(`/Usuario/monto/${id}`,{password,monto_usuario})
    return data;
}


//Eliminar usuario

export async function EliminarUsuario(id,{password}){

    const {data} = await api.delete(`/Usuario/${id}`,{ data: { password } });
    return data;

}