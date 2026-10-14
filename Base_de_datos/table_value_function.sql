USE [APUESTAS]
GO

/****** Object:  UserDefinedFunction [dbo].[FN_Listar_historial]    Script Date: 10/14/2026 2:15:56 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE FUNCTION [dbo].[FN_Listar_historial]()
RETURNS TABLE
AS
RETURN (
    SELECT * FROM Historial_Apuesta WHERE Resultado_apuesta = 'Gano'  OR Resultado_apuesta = 'Perdio'
);   
GO

/****** Object:  UserDefinedFunction [dbo].[FN_Obtener_apuesta]    Script Date: 10/14/2026 2:16:16 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE FUNCTION [dbo].[FN_Obtener_apuesta]()
RETURNS TABLE
AS
RETURN (
    SELECT * FROM Apuesta WHERE Estado_apuesta = 1
);   
GO


/****** Object:  UserDefinedFunction [dbo].[FN_ObtenerCliente]    Script Date: 10/14/2026 2:16:47 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE FUNCTION [dbo].[FN_ObtenerCliente](@Nombre_usuario varchar(50))
RETURNS TABLE
AS
RETURN (
    SELECT * FROM Usuario WHERE Nombre_usuario = @Nombre_usuario
);   
GO


/****** Object:  UserDefinedFunction [dbo].[FN_ObtenerUsuarios]    Script Date: 10/14/2026 2:17:08 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE   FUNCTION [dbo].[FN_ObtenerUsuarios]()
RETURNS TABLE
AS
RETURN (
    SELECT TOP(10) Nombre_usuario,[Fecha_ingreso], Monto_usuario FROM Usuario 
);   
GO







