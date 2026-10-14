USE [APUESTAS]
GO

/****** Object:  UserDefinedFunction [dbo].[fn_ResultadoApuesta]    Script Date: 10/14/2026 2:18:05 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE   FUNCTION [dbo].[fn_ResultadoApuesta]
(
    @id_Usuario INT,
    @id_apuesta INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @Resultado BIT;

    SET @Resultado =
        CASE WHEN ABS(CHECKSUM(CONCAT(@id_Usuario, @id_apuesta, SYSUTCDATETIME()))) % 2 = 0
             THEN 1 ELSE 0 END;

    RETURN @Resultado;  -- 1 = victoria, 0 = derrota
END
GO


/****** Object:  UserDefinedFunction [dbo].[fn_SubstraerOAmplificarGanancias]    Script Date: 10/14/2026 2:18:18 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE   FUNCTION [dbo].[fn_SubstraerOAmplificarGanancias]
(
   @resultado_apuesta bit,
   @monto DECIMAL(11,2)
)
RETURNS DECIMAL(11,2)
AS
BEGIN
--esta funcion se encarga de calcular en base al monto dado en la apuesta
--multiplicado por una tasa, esta tasa puede ser negativa si pierde o positiva si gana
    DECLARE @tasa_derrota DECIMAL(3,2)
    DECLARE @tasa_victoria DECIMAL(3,2)

    SET @tasa_derrota = -2.50
    SET @tasa_victoria = 0.50

    DECLARE @Resultado DECIMAL(11,2);

    IF(@resultado_apuesta = 1)
     BEGIN
      SET @Resultado = @monto * @tasa_victoria
    END

    IF(@resultado_apuesta = 0)
     BEGIN
     SET @Resultado = @monto * @tasa_derrota
    END

    RETURN @Resultado;  -- 1 = victoria, 0 = derrota
END
GO


