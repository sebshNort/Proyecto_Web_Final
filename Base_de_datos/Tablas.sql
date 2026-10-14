CREATE DATABASE APUESTAS;

USE [APUESTAS]
GO

/****** Object:  Table [dbo].[Apuesta]    Script Date: 10/14/2026 2:03:10 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Apuesta](
	[id_apuesta] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_apuesta] [nvarchar](60) NOT NULL,
	[Categoria_apuesta] [nvarchar](60) NOT NULL,
	[Descripcion_apuesta] [nvarchar](150) NOT NULL,
	[Dinero_apostado] [decimal](11, 2) NOT NULL,
	[Estado_apuesta] [bit] NOT NULL,
	[Fecha_cierre] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_apuesta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


/****** Object:  Table [dbo].[Historial_Apuesta]    Script Date: 10/14/2026 2:03:31 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Historial_Apuesta](
	[id_Usuario] [int] NOT NULL,
	[id_apuesta] [int] NOT NULL,
	[Fecha_apuesta] [datetime] NOT NULL,
	[Fecha_cierre] [datetime] NULL,
	[Descripcion_apuesta] [nvarchar](120) NOT NULL,
	[Resultado_apuesta] [nvarchar](9) NULL,
	[Monto_inicial] [decimal](11, 2) NOT NULL,
	[Monto_actual] [decimal](11, 2) NOT NULL,
	[Ganancias] [decimal](11, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_Usuario] ASC,
	[id_apuesta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Historial_Apuesta] ADD  DEFAULT (getdate()) FOR [Fecha_cierre]
GO

ALTER TABLE [dbo].[Historial_Apuesta] ADD  DEFAULT ('') FOR [Resultado_apuesta]
GO

ALTER TABLE [dbo].[Historial_Apuesta] ADD  DEFAULT ((0)) FOR [Monto_inicial]
GO

ALTER TABLE [dbo].[Historial_Apuesta] ADD  DEFAULT ((0)) FOR [Monto_actual]
GO

ALTER TABLE [dbo].[Historial_Apuesta] ADD  DEFAULT ((0)) FOR [Ganancias]
GO

ALTER TABLE [dbo].[Historial_Apuesta]  WITH CHECK ADD  CONSTRAINT [FK_Historial_Apuesta_id_apuesta] FOREIGN KEY([id_apuesta])
REFERENCES [dbo].[Apuesta] ([id_apuesta])
GO

ALTER TABLE [dbo].[Historial_Apuesta] CHECK CONSTRAINT [FK_Historial_Apuesta_id_apuesta]
GO

ALTER TABLE [dbo].[Historial_Apuesta]  WITH CHECK ADD  CONSTRAINT [FK_Historial_Apuesta_id_Usuario] FOREIGN KEY([id_Usuario])
REFERENCES [dbo].[Usuario] ([id_Usuario])
GO

ALTER TABLE [dbo].[Historial_Apuesta] CHECK CONSTRAINT [FK_Historial_Apuesta_id_Usuario]
GO

/****** Object:  Table [dbo].[tApuestas]    Script Date: 10/14/2026 2:06:44 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tApuestas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[price] [decimal](10, 2) NULL,
	[quantity] [int] NULL,
	[description] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO



/****** Object:  Table [dbo].[Usuario]    Script Date: 10/14/2026 2:07:38 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Usuario](
	[id_Usuario] [int] IDENTITY(1,1) NOT NULL,
	[Contraseña_usuario] [nvarchar](255) NOT NULL,
	[Nombre_usuario] [nvarchar](60) NOT NULL,
	[Correo_usuario] [nvarchar](120) NOT NULL,
	[Monto_usuario] [decimal](11, 2) NOT NULL,
	[Fecha_ingreso] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_Usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


