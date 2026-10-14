USE [APUESTAS]
GO

/****** Object:  StoredProcedure [dbo].[SP_Actualizar_usuario_dinero]    Script Date: 10/14/2026 2:10:58 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[SP_Actualizar_usuario_dinero](@id_nusuario int,@password nvarchar(255), @monto_usuario DECIMAL(11,2))
AS
BEGIN
--Primero se ve si la contraseña es la correcta
DECLARE @Encrypted_Password NVARCHAR(255)
 SELECT @Encrypted_Password =  HASHBYTES('SHA2_512', @password);
 
IF EXISTS (SELECT 0 FROM Usuario where id_Usuario = @id_nusuario and Contraseña_usuario = @Encrypted_Password)
BEGIN
--Si existe lo unico que haremos es inyectar mas dinero

UPDATE Usuario SET Monto_usuario += @monto_usuario where id_Usuario = @id_nusuario and Contraseña_usuario = @Encrypted_Password
SELECT('ACTUALIZADO CON EXITO')
RETURN
END

ELSE
 BEGIN

 RAISERROR('usuario no existente, intentelo de nuevo',16,1)
 END


END
GO


/****** Object:  StoredProcedure [dbo].[SP_Actualizar_usuario_password]    Script Date: 10/14/2026 2:11:40 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[SP_Actualizar_usuario_password](@id_nusuario int,@vieja_password nvarchar(255),@nueva_password nvarchar(255))
AS
BEGIN

DECLARE @Encrypted_Password NVARCHAR(255)
 SELECT @Encrypted_Password =  HASHBYTES('SHA2_512', @vieja_password); 

--Ver si el usuario ingreso la contraseña correcta
IF EXISTS (SELECT 0 FROM Usuario where id_Usuario = @id_nusuario AND Contraseña_usuario = @Encrypted_Password)
BEGIN

--Ahora lo que se hace es incriptar la nueva contraseña y actualizar

DECLARE @Encrypted_Password2 NVARCHAR(255)
 SELECT @Encrypted_Password2 =  HASHBYTES('SHA2_512', @nueva_password);

 --Veamos si esta contraseña ya existe

 IF EXISTS (SELECT 0 FROM Usuario WHERE Contraseña_usuario = @Encrypted_Password2)
 BEGIN

 RAISERROR('Esta contraseña ya existe',16,1)
 RETURN
 END

UPDATE Usuario SET Contraseña_usuario = @Encrypted_Password2 where id_Usuario = @id_nusuario and Contraseña_usuario = @Encrypted_Password
SELECT('ACTUALIZADA CON EXITO')
END

ELSE
BEGIN

RAISERROR('Usuario no encontrado,intentelo de nuevo',16,1)

END

END
GO


/****** Object:  StoredProcedure [dbo].[sp_CerrarApuestasVencidas]    Script Date: 10/14/2026 2:12:01 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE   PROCEDURE [dbo].[sp_CerrarApuestasVencidas]
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Apuesta
    SET Estado_apuesta = 0
    OUTPUT inserted.id_apuesta, inserted.Nombre_apuesta, inserted.Categoria_apuesta
    WHERE Estado_apuesta = 1
      AND Fecha_cierre <= SYSUTCDATETIME();
      SELECT('CERRADA CON EXITO');
END
GO


/****** Object:  StoredProcedure [dbo].[SP_Eliminar_usuario]    Script Date: 10/14/2026 2:12:18 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




CREATE PROCEDURE [dbo].[SP_Eliminar_usuario](@id_nusuario int,@password NVARCHAR(255))
AS
BEGIN

--PRIMERO ENCRIPTAMOS
DECLARE @Encrypted_Password NVARCHAR(255)
 SELECT @Encrypted_Password =  HASHBYTES('SHA2_512', @password); 
 
 --Buscar si existe para eliminar

 IF EXISTS (SELECT 0 FROM Usuario Where id_Usuario = @id_nusuario and @Encrypted_Password = Contraseña_usuario)
  BEGIN
  
  DELETE FROM Usuario Where id_Usuario = @id_nusuario and @Encrypted_Password = Contraseña_usuario
  SELECT('ELIMINADA')
  RETURN
  END

 ELSE
 BEGIN

 RAISERROR('No existe dicho usuario',16,1)

 END


END
GO

/****** Object:  StoredProcedure [dbo].[SP_Filtrar_historialusuario]    Script Date: 10/14/2026 2:12:40 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE   PROCEDURE [dbo].[SP_Filtrar_historialusuario](@Nombre_usuario nvarchar(60))
AS 
BEGIN

--BUSCAMOS EL NOMBRE

IF EXISTS (SELECT 0 FROM Usuario where Nombre_usuario = @Nombre_usuario)
 BEGIN
 --SI LO ENCUENTRA DAME EL ID PARA FILTRAR
 DECLARE @Id_usuario_temp int

 SELECT @Id_usuario_temp = id_Usuario from Usuario where Nombre_usuario = @Nombre_usuario

 --AHORA FILTRAMOS

 SELECT[Fecha_apuesta]
      ,[Fecha_cierre]
      ,[Descripcion_apuesta]
      ,[Resultado_apuesta]
      ,[Monto_inicial]
      ,[Monto_actual]
      ,[Ganancias] FROM Historial_Apuesta where id_Usuario = @Id_usuario_temp
END


ELSE
 BEGIN

 RAISERROR('Usuario no encontrado, intentelo utilizando el nombre correctamente escrito',16,1)

END



END
GO


/****** Object:  StoredProcedure [dbo].[sp_FiltrarApuestas]    Script Date: 10/14/2026 2:13:13 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO





CREATE   PROCEDURE [dbo].[sp_FiltrarApuestas]
    @Nombre_apuesta     NVARCHAR(100) = NULL,
    @Categoria_apuesta  NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        [id_apuesta],
        [Nombre_apuesta],
        [Categoria_apuesta],
        [Descripcion_apuesta],
        [Dinero_apostado],
        [Estado_apuesta]
    FROM Apuesta
    WHERE
        (@Nombre_apuesta IS NULL OR [Nombre_apuesta] LIKE '%' + @Nombre_apuesta + '%')
        AND
        (@Categoria_apuesta IS NULL OR [Categoria_apuesta] = @Categoria_apuesta )
        AND Estado_apuesta = 1
    ORDER BY [id_apuesta] DESC;
END
GO


/****** Object:  StoredProcedure [dbo].[SP_Insertar_Apuesta]    Script Date: 10/14/2026 2:13:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE   PROCEDURE [dbo].[SP_Insertar_Apuesta](@Nombre_apuesta nvarchar(60), 
@Categoria_apuesta nvarchar(60), @descripcion_apuesta nvarchar(150), @Fecha_cierre DATETIME2)

AS

BEGIN

-- 0 es que finalizo la apuesta
-- 1 es que no finalizo la apuesta



IF EXISTS (SELECT Nombre_apuesta From Apuesta where Nombre_apuesta = @Nombre_apuesta AND Estado_apuesta = 1)
--Verificar el estado y categoria
BEGIN
DECLARE @Estado_apuesta_temp bit
DECLARE @Categoria_apuesta_temp nvarchar(60)

SELECT @Estado_apuesta_temp = [Estado_apuesta] from Apuesta where Nombre_apuesta = @Nombre_apuesta 
SELECT @Categoria_apuesta_temp = [Categoria_apuesta] from Apuesta where Categoria_apuesta = @Categoria_apuesta 
 
 --Pero debemos tomar en cuenta si es otra categoria (osea hockey en vez de futbol)
 --Primero vemos si son diferentes

 IF (@Categoria_apuesta_temp = @Categoria_apuesta)
 BEGIN
 --YA EXISTE UNA EN CURSO
  IF (@Estado_apuesta_temp = 1)
  BEGIN
  RAISERROR('Ya existe una apuesta en curso',16,1);
  RETURN
 END

 END
 END

--Sino existe pues se crea una nueva apuesta


 INSERT INTO [Apuesta]
           ([Nombre_apuesta]
           ,[Categoria_apuesta]
           ,[Descripcion_apuesta]
           ,[Dinero_apostado]
           ,[Estado_apuesta]
           ,[Fecha_cierre])
  VALUES
           (@Nombre_apuesta
           ,@Categoria_apuesta
           ,@descripcion_apuesta
           ,0.00
           ,1
           ,@Fecha_cierre)

  SELECT ('Insertado correctamente');

END
GO

/****** Object:  StoredProcedure [dbo].[SP_Insertar_usuario]    Script Date: 10/14/2026 2:13:54 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SP_Insertar_usuario](@Nombre_usuario VARCHAR(60), @password NVARCHAR(255),@Correo_usuario VARCHAR(120),@Monto_usuario DECIMAL(11,2))
AS 
 BEGIN

 DECLARE @Encrypted_Password NVARCHAR(255)
 SELECT @Encrypted_Password =  HASHBYTES('SHA2_512', @password);   

 --Buscar si existe el usuario dado la contraseña, correo y nombre
 IF EXISTS (SELECT 0 FROM Usuario where @Correo_usuario = Correo_usuario AND @Encrypted_Password = Contraseña_usuario AND @Nombre_usuario = Nombre_usuario)
  BEGIN
  RAISERROR('Usuario existente',16,1)
  RETURN 
  END

  --Ver si existe el correo y Contraseña Mas no el usuario
  IF EXISTS (SELECT 0 FROM Usuario where @Correo_usuario = Correo_usuario AND @Encrypted_Password = Contraseña_usuario AND @Nombre_usuario <> Nombre_usuario)
  BEGIN
  RAISERROR('Correo y Contraseña existentes',16,1)
  RETURN 
  END


 --Ver si existe dicha contraseña mas no el correo
  IF EXISTS (SELECT 0 FROM Usuario where @Correo_usuario <> Correo_usuario AND @Encrypted_Password = Contraseña_usuario)
  BEGIN
  RAISERROR('La contraseña ya existe',16,1)
  RETURN 
  END

  --Ver si existe el correo pero la contraseña no
  IF EXISTS (SELECT 0 FROM Usuario where @Correo_usuario = Correo_usuario AND @Encrypted_Password <> Contraseña_usuario)
  BEGIN
   RAISERROR('El correo ya existe',16,1)
  RETURN
  END

  --Ver si existe el nombre del usuario

  IF EXISTS (SELECT 0 FROM Usuario where @Nombre_usuario = Nombre_usuario)
  BEGIN
   RAISERROR('Nombre de usuario ya existe',16,1)
  RETURN
  END


  --Si las otras no machean, crear usuario
 
  IF NOT EXISTS (SELECT 0 FROM Usuario where @Correo_usuario = Correo_usuario AND @Encrypted_Password = Contraseña_usuario AND @Nombre_usuario = Nombre_usuario)
 BEGIN

 DECLARE @PASSWORD_TEMPORAL NVARCHAR(255)

 SET @PASSWORD_TEMPORAL = @password 
 -- Ejemplo de encriptación hash segura
SELECT @PASSWORD_TEMPORAL =  HASHBYTES('SHA2_512', @PASSWORD_TEMPORAL);   
    
  INSERT INTO Usuario
           ([Contraseña_usuario]
           ,[Nombre_usuario]
           ,[Correo_usuario]
           ,[Monto_usuario]
           ,[Fecha_ingreso])
     VALUES
           (@PASSWORD_TEMPORAL
           ,@Nombre_usuario
           ,@Correo_usuario
           ,@Monto_usuario
           ,GETDATE())

 END


END
GO


/****** Object:  StoredProcedure [dbo].[SP_Modificar_historial]    Script Date: 10/14/2026 2:14:18 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE     PROCEDURE [dbo].[SP_Modificar_historial] 
(@id_apuesta int)
AS
BEGIN

--VERIFICAR SI LA APUESTA EXISTE Y SU ESTADO ESTA CERRADO

IF EXISTS(SELECT 0 FROM Apuesta where id_apuesta = @id_apuesta AND Estado_apuesta = 0)
 BEGIN
 --AHORA es buscar el id de usuario en historial
 DECLARE @Id_usuariotemp int
 SELECT @Id_usuariotemp = id_usuario from Historial_Apuesta where id_apuesta = @id_apuesta

 --Obtener fecha cierre
 DECLARE @Fecha_cierre_temp datetime2
 SELECT @Fecha_cierre_temp = Fecha_cierre from Apuesta where id_apuesta = @id_apuesta
 
 DECLARE @Resultado_apuesta BIT 
 SELECT @Resultado_apuesta = [dbo].[fn_ResultadoApuesta](@Id_usuariotemp, @id_apuesta);

 -- ver cual es el resultado de la apuesta
 
 --VEMOS SI GANO (OSEA 1), se le inserta al usuario
 IF(@Resultado_apuesta = 1)
  BEGIN
  DECLARE @Monto_usuario DECIMAL(11,2)
  SELECT @Monto_usuario = Monto_inicial from Historial_Apuesta where id_Usuario = @Id_usuariotemp
  
  --Obtener balance del usuario
  DECLARE @Monto_balance DECIMAL(11,2)
  SELECT @Monto_balance = Monto_usuario from Usuario where id_Usuario = @Id_usuariotemp




  DECLARE @Resultado_apuesta_ganador Decimal(11,2)
  SELECT @Resultado_apuesta_ganador =[dbo].[fn_SubstraerOAmplificarGanancias](@Resultado_apuesta,@Monto_usuario)
  DECLARE @Ganancia_neta DECIMAL (11,2) 
  SELECT @Ganancia_neta = @Monto_usuario  + @Resultado_apuesta_ganador

  
  UPDATE Historial_Apuesta SET Resultado_apuesta = 'Gano', Monto_actual = @Resultado_apuesta_ganador, Ganancias = @Ganancia_neta, Fecha_cierre = @Fecha_cierre_temp  where id_Usuario = @Id_usuariotemp AND id_apuesta = @id_apuesta
  --Ahora al usuario
  UPDATE Usuario SET Monto_usuario = @Monto_balance + @Ganancia_neta  where id_Usuario = @Id_usuariotemp


  RETURN 

 END

 --VEMOS SI PERDIO
 IF(@Resultado_apuesta = 0)
  BEGIN
  --SI PERDIO SE DEBE SUBSTRAER DINERO, ESTE SE GUARDA EN GANANCIA Y SE LE SUBSTRAE AL USUARIO
  
  DECLARE @Monto_usuario_2 DECIMAL(11,2)
  SELECT @Monto_usuario_2 = Monto_inicial from Historial_Apuesta where id_Usuario = @Id_usuariotemp
  
  --Obtener balance del usuario

  DECLARE @Monto_balance2 DECIMAL(11,2)
  SELECT @Monto_balance2 = Monto_usuario from Usuario where id_Usuario = @Id_usuariotemp

  DECLARE @Resultado_apuesta_perdedor Decimal(11,2) 
  SELECT @Resultado_apuesta_perdedor = [dbo].[fn_SubstraerOAmplificarGanancias](@Resultado_apuesta,@Monto_usuario_2)
  
  DECLARE @Ganancia_neta_2 DECIMAL (11,2) 
  SELECT @Ganancia_neta_2 = @Monto_usuario_2  + @Resultado_apuesta_perdedor

   UPDATE Historial_Apuesta SET Resultado_apuesta = 'Perdio', Monto_actual = @Resultado_apuesta_perdedor, Ganancias = @Ganancia_neta_2, Fecha_cierre =@Fecha_cierre_temp  where id_Usuario = @Id_usuariotemp AND id_apuesta = @id_apuesta
  --Ahora al usuario
  UPDATE Usuario SET Monto_usuario = @Monto_balance2 + @Ganancia_neta_2  where id_Usuario = @Id_usuariotemp

  RETURN

 END
 

END


END
GO

/****** Object:  StoredProcedure [dbo].[SP_Registrar_Historial]    Script Date: 10/14/2026 2:14:39 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE   PROCEDURE [dbo].[SP_Registrar_Historial](@Id_usuario int, @Id_apuesta int,@Monto DECIMAL(11,2))
AS 
BEGIN 

--Verificar si el id_apuesta existe y si existe, ver si la apuesta esta activa

IF EXISTS(SELECT 0 FROM Apuesta WHERE id_apuesta =@Id_apuesta AND Estado_apuesta = 1)
 BEGIN
 --Buscar la informacion de la tabla apuesta
 DECLARE @Fecha_Cierre DATETIME2
 DECLARE @Descripcion nvarchar (150)

 SELECT @Fecha_Cierre = [Fecha_cierre] , @Descripcion = [Descripcion_apuesta] FROM Apuesta where id_apuesta = @Id_apuesta
  END

ELSE
BEGIN

 RAISERROR('La apuesta no existe',16,1)
 RETURN

END

--Evaluo al usuario, si es que existe

IF EXISTS(SELECT 0 FROM Usuario where id_Usuario = @Id_usuario)
 BEGIN


 --Como ambos existen lo unico que debo saber es si no estan previamente registrados

  IF EXISTS(SELECT 0 FROM Historial_Apuesta where id_Usuario = @Id_usuario AND id_apuesta = @Id_apuesta)
   BEGIN

   RAISERROR('Apuesta ya registrada',16,1)
   RETURN

   END

   --Insertamos en el historial
  ELSE
   BEGIN

    --Actualizamos

    Update Usuario set Monto_usuario = Monto_usuario - @Monto where id_Usuario = @Id_usuario

    INSERT INTO [Historial_Apuesta]
           ([id_Usuario]
           ,[id_apuesta]
           ,[Fecha_apuesta]
           ,[Fecha_cierre]
           ,[Descripcion_apuesta]
           ,[Monto_inicial])
     VALUES
           (@Id_usuario
           ,@Id_apuesta
           , SYSUTCDATETIME()
           ,@Fecha_Cierre
           ,@Descripcion
           ,@Monto)

        SELECT('Registrado exitosamente')

        RETURN
   END

END

ELSE
   BEGIN

   RAISERROR('Usuario no existe',16,1)
   RETURN
   END

END
GO









