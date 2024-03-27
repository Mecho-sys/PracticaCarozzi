package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"example.com/carozziback/connection"
	"example.com/carozziback/models"
	"github.com/gin-gonic/gin"
	"github.com/tealeg/xlsx"
	"gorm.io/gorm"
)

// una funcion para manejar errores
func errorFatal(err error) {
	if err != nil {
		log.Fatalln(err.Error())
	}
}

// Struct de apoyo para la creacion de una bitacora
type BinnData struct {
	Id                  uint
	Mant                string
	Mant2               string
	Mant3               string
	ShiftManager        string
	Comp                int
	Equip               int
	Area                int
	Plant               int
	FechaReal           string
	EquipStatus         string
	TypeMant            string
	Speciality          string
	Turn                string
	InitTime            string
	FinishTime          string
	Duration            string
	WorkOrder           string
	DescActivity        string
	Content             string
	FailureType         string
	FailureMode         string
	Content2            string
	Comments            string
	ShiftValidation     bool
	MainManagValidation bool
	SupValidation       bool
}

// para estandarizar el ingreso de datos a
// funcion para crear interType, failType, speciality, failmode y descActivity
type DataToSend struct {
	Name    string
	Descrip string
}
type UserInfo struct {
	Email    string
	Password string
}
type RelInfo struct {
	ProfileID    string
	AccessListID string
}
type RelInfo2 struct {
	UserID    string
	ProfileID string
}

// creacion de excel para descargar de la bitacora
func generateExcel(conn *gorm.DB, filePath string) error {
	// Consulta los ingresos desde la base de datos
	var bitacora []models.Binnacle
	if err := conn.Find(&bitacora).Error; err != nil {
		return err
	}

	// Crea un nuevo archivo Excel
	file := xlsx.NewFile()
	sheet, err := file.AddSheet("Bitacora de mantencion")
	if err != nil {
		return err
	}

	// Agrega encabezados
	headers := []string{"Id", "Mantenedor 1", "Mantenedor 2", "Mantenedor 3", "Jefe de turno", "Planta", "Línea", "Equipo", "Componente", "Fecha del ingreso", "Fecha del trabajo", "Estado del equipo", "Tipo de mantencion", "Especialidad", "Turno", "Hora inicio", "Hora fin", "Duración", "Orden de trabajo", "Descripcion de Act", "Desripcion de trabajo", "Tipo de falla", "Modo de Falla", "Descripcion de falla", "Comentarios", "Val 1", "Val 2", "Val 3"}
	headerRow := sheet.AddRow()
	for _, header := range headers {
		cell := headerRow.AddCell()
		cell.Value = header
	}

	// Agrega datos de ingresos al archivo Excel
	for _, bitacora := range bitacora {
		dataRow := sheet.AddRow()
		dataRow.AddCell().SetInt(int(bitacora.Id))
		dataRow.AddCell().SetString(bitacora.Mant)
		dataRow.AddCell().SetString(bitacora.Mant2)
		dataRow.AddCell().SetString(bitacora.Mant3)
		dataRow.AddCell().SetString(bitacora.ShiftManager)
		dataRow.AddCell().SetString(bitacora.Plant)
		dataRow.AddCell().SetString(bitacora.Area)
		dataRow.AddCell().SetString(bitacora.Equip)
		dataRow.AddCell().SetString(bitacora.Comp)
		dataRow.AddCell().SetDate(bitacora.Fecha)
		dataRow.AddCell().SetString(bitacora.FechaReal)
		dataRow.AddCell().SetString(bitacora.EquipStatus)
		dataRow.AddCell().SetString(bitacora.TypeMant)
		dataRow.AddCell().SetString(bitacora.Speciality)
		dataRow.AddCell().SetString(bitacora.Turn)
		dataRow.AddCell().SetString(bitacora.InitTime)
		dataRow.AddCell().SetString(bitacora.FinishTime)
		dataRow.AddCell().SetString(bitacora.Duration)
		dataRow.AddCell().SetString(bitacora.WorkOrder)
		dataRow.AddCell().SetString(bitacora.DescActivity)
		dataRow.AddCell().SetString(bitacora.Content)
		dataRow.AddCell().SetString(bitacora.FailureType)
		dataRow.AddCell().SetString(bitacora.FailureMode)
		dataRow.AddCell().SetString(bitacora.Content2)
		dataRow.AddCell().SetString(bitacora.Comments)
		dataRow.AddCell().SetBool(bitacora.ShiftValidation)
		dataRow.AddCell().SetBool(bitacora.MainManagValidation)
		dataRow.AddCell().SetBool(bitacora.SupValidation)
	}

	// Guarda el archivo Excel
	if err := file.Save(filePath); err != nil {
		return err
	}

	return nil
}

// DATABASE_URL="sqlserver://localhost:1433;database=Pruebas;user=sa;password=2015nico;trustServerCertificate=true"
func main() {
	// (nombreUsuario, Contraseña, Puerto, nombre de base de datos)
	conn, err := connection.GetConnection("sa", "2015nico", "1433", "Pruebas")
	errorFatal(err)
	// se Crean o actualizan las tablas en la base de datos
	/*
		conn.AutoMigrate(&models.Worker{})
		conn.AutoMigrate(&models.FailureType{})
		conn.AutoMigrate(&models.FailureMode{})
		conn.AutoMigrate(&models.Speciality{})
		conn.AutoMigrate(&models.IntervType{})
		conn.AutoMigrate(&models.Binnacle{})
		conn.AutoMigrate(&models.Plant{})
		conn.AutoMigrate(&models.Area{})
		conn.AutoMigrate(&models.Component{})
		conn.AutoMigrate(&models.Equipment{})
		conn.AutoMigrate(&models.EquipStatus{})
		conn.AutoMigrate(&models.TypeMant{})
		conn.AutoMigrate(&models.DescActivity{})
	*/
	conn.AutoMigrate(&models.User{})
	conn.AutoMigrate(&models.Profile{})
	conn.AutoMigrate(&models.AccessList{})
	conn.AutoMigrate(&models.AccessProfile{})
	conn.AutoMigrate(&models.ProfileUser{})
	conn.AutoMigrate(&models.Validate{})

	_ = conn

	//Creando el servidor para luego usarlo en las rutas
	router := gin.Default()
	corsMiddleware := func() gin.HandlerFunc {
		return func(c *gin.Context) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

			if c.Request.Method == "OPTIONS" {
				c.AbortWithStatus(http.StatusNoContent)
			} else {
				c.Next()
			}
		}
	}

	router.Use(corsMiddleware())

	/*
		Planta (Creacion/edicion/eliminacion)
	*/

	router.GET("/api/plants", func(c *gin.Context) {
		models.ConsultarPlantas(conn, c.Writer, c.Request)
	})
	router.POST("api/newPlant", func(ctx *gin.Context) {
		var ingresoData models.Plant
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarPlant(
			conn,
			ingresoData.Name,
			ingresoData.Descrip,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.GET("/api/plantById/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.ConsultarPlantaById(conn, c.Writer, c.Request, int(codigoUint))
	})

	/*
		Area (Creacion/edicion/eliminacion)
	*/

	router.GET("/api/areas", func(c *gin.Context) {
		models.ConsultarAreas(conn, c.Writer, c.Request)
	})
	router.POST("api/newArea", func(ctx *gin.Context) {
		var ingresoData models.Area
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarArea(
			conn,
			ingresoData.Name,
			ingresoData.PlantId,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.GET("/api/areaByPlant/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.ConsultarAreaByPlantId(conn, c.Writer, c.Request, uint(codigoUint))
	})
	/*
		Equipos (Creacion/edicion/eliminacion)
	*/

	router.GET("/api/equips", func(c *gin.Context) {
		models.ConsultarEquipos(conn, c.Writer, c.Request)
	})
	router.POST("api/newEquip", func(ctx *gin.Context) {
		var ingresoData models.Equipment
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarEquipo(
			conn,
			ingresoData.Name,
			ingresoData.AreaId,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.GET("/api/equipByArea/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.ConsultarEquipByAreaId(conn, c.Writer, c.Request, uint(codigoUint))
	})

	/*
		Componentes (Creacion/edicion/eliminacion)
	*/

	router.GET("/api/Comps", func(c *gin.Context) {
		models.ConsultarComps(conn, c.Writer, c.Request)
	})
	router.POST("api/newComp", func(ctx *gin.Context) {
		var ingresoData models.Component
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarComp(
			conn,
			ingresoData.Name,
			ingresoData.NroComp,
			ingresoData.NroFails,
			ingresoData.EquipId,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.GET("/api/CompByEquip/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.ConsultarCompByEquipId(conn, c.Writer, c.Request, uint(codigoUint))
	})

	/*
		Fallas de los equipos (Creacion/edicion/eliminacion)
	*/

	router.GET("/api/fails", func(c *gin.Context) {
		models.ConsultarFallas(conn, c.Writer, c.Request)
	})
	router.POST("api/newFail", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarFalla(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteFail/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteFallaByID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		Modo de Falla de un equipo (Creacion/edicion/eliminacion)
	*/

	router.GET("/api/failsMode", func(c *gin.Context) {
		models.ConsultarModoFallas(conn, c.Writer, c.Request)
	})
	router.POST("api/newFailMode", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarModoFalla(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteFailMode/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteModoFallaByID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		Estado del equipo durante el proceso (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/equipStatus", func(c *gin.Context) {
		models.ConsultarEquipStatus(conn, c.Writer, c.Request)
	})
	router.POST("api/newStatus", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarEquipStatus(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteStatus/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteStatusById(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		Especialidad de un mantenimiento (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/specialities", func(c *gin.Context) {
		models.ConsultarEspecialidades(conn, c.Writer, c.Request)
	})
	router.POST("api/newSpec", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarEspecialidad(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteSpec/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteSpecByID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		tipo de mantenimiento (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/mantType", func(c *gin.Context) {
		models.ConsultarTypeMant(conn, c.Writer, c.Request)
	})
	router.POST("api/newMantType", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarTypeMant(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteMantType/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteTypeMantById(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		tipo de intervencion (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/intType", func(c *gin.Context) {
		models.ConsultarTipoInterv(conn, c.Writer, c.Request)
	})
	router.POST("api/newTipeInt", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarTipoInterv(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteTypeInt/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteTipoIntervByID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		descripcion de actividades (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/activities", func(c *gin.Context) {
		models.ConsultarDescActivity(conn, c.Writer, c.Request)
	})
	router.POST("api/newActiv", func(ctx *gin.Context) {
		var ingresoData DataToSend
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarActivity(conn, ingresoData.Name, ingresoData.Descrip)
	})
	router.DELETE("/api/deleteActiv/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteActivityByID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	/*
		Trabajadores (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/manteiners", func(c *gin.Context) {
		models.ConsultarManten(conn, c.Writer, c.Request)
	})

	router.GET("/api/Shifts", func(c *gin.Context) {
		models.ConsultarShift(conn, c.Writer, c.Request)
	})

	router.POST("api/newWorker", func(ctx *gin.Context) {
		var ingresoData models.Worker
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegistrarWorker(
			conn,
			ingresoData.Name,
			ingresoData.Role,
			ingresoData.Speciality,
			ingresoData.IdEmpre,
			ingresoData.Comment,
			ingresoData.Turn,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})

	router.DELETE("/api/deleteWorker/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteWorkerByID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})
	/*
		Ingreso en la bitacora (Creacion/edicion/eliminacion)
	*/
	router.GET("/api/binnacle", func(c *gin.Context) {
		models.ConsultarBinnacle(conn, c.Writer, c.Request)
	})

	router.POST("api/newBinnEntry", func(ctx *gin.Context) {
		var ingresoData BinnData
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		nombrePlanta, err := models.ObtenerNombrePlantaPorID(conn, ingresoData.Plant)
		if err != nil {
			log.Println(err)
			return
		}
		nombreArea, err := models.ObtenerNombreAreaPorID(conn, ingresoData.Area)
		if err != nil {
			log.Println(err)
			return
		}
		nombreEquipo, err := models.ObtenerNombreEquipoPorID(conn, ingresoData.Equip)
		if err != nil {
			log.Println(err)
			return
		}
		nombreComp, err := models.ObtenerNombreCompPorID(conn, ingresoData.Comp)
		if err != nil {
			log.Println(err)
			return
		}

		models.RegistrarBinnEntry(
			conn,
			ingresoData.Mant,
			ingresoData.Mant2,
			ingresoData.Mant3,
			ingresoData.ShiftManager,
			nombreComp,
			nombreEquipo,
			nombreArea,
			nombrePlanta,
			ingresoData.FechaReal,
			ingresoData.EquipStatus,
			ingresoData.TypeMant,
			ingresoData.Speciality,
			ingresoData.Turn,
			ingresoData.InitTime,
			ingresoData.FinishTime,
			ingresoData.Duration,
			ingresoData.WorkOrder,
			ingresoData.DescActivity,
			ingresoData.Content,
			ingresoData.FailureType,
			ingresoData.FailureMode,
			ingresoData.Content2,
			ingresoData.Comments,
			ingresoData.ShiftValidation,
			ingresoData.MainManagValidation,
			ingresoData.SupValidation,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})

	router.GET("/api/binnacle/downExcel", func(c *gin.Context) {
		filePath := "Bitacora de mantencion.xlsx" // Nombre del archivo Excel a generar
		if err := generateExcel(conn, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar el archivo Excel"})
			return
		}

		// Envía el archivo Excel como respuesta
		c.Header("Content-Disposition", "attachment; filename="+filePath)
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.File(filePath)
	})
	router.GET("/api/countTurn", func(c *gin.Context) {
		models.ConsultarYContarBinnacle(conn, c.Writer, c.Request)
	})

	/*
		Usuarios
	*/
	router.GET("/api/users", func(c *gin.Context) {
		models.CheckUsers(conn, c.Writer, c.Request)
	})
	router.POST("api/newUser", func(ctx *gin.Context) {
		var ingresoData models.User
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegisUser(
			conn,
			ingresoData.Name,
			ingresoData.Email,
			ingresoData.Password,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.DELETE("/api/deleteUser/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteUserById(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})
	router.POST("/api/login", func(ctx *gin.Context) {
		var loginData UserInfo
		if err := ctx.ShouldBindJSON(&loginData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		user, err := models.VerifyUser(conn, loginData.Email, loginData.Password)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales incorrectas"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Inicio de sesión exitoso", "user": user})
	})

	router.GET("/api/profiles", func(c *gin.Context) {
		models.CheckProfile(conn, c.Writer, c.Request)
	})
	router.POST("api/newProfile", func(ctx *gin.Context) {
		var ingresoData models.Profile
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegisProfile(
			conn,
			ingresoData.Name,
			ingresoData.Descrip,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.DELETE("/api/deleteProfile/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteProfileById(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})
	router.GET("/api/accesList", func(c *gin.Context) {
		models.CheckAccess(conn, c.Writer, c.Request)
	})
	router.POST("api/newAccess", func(ctx *gin.Context) {
		var ingresoData models.AccessList
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		models.RegisAccessPerm(
			conn,
			ingresoData.Name,
			ingresoData.Descrip,
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.DELETE("/api/deleteAccess/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteAccessById(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})
	router.GET("/api/profList", func(c *gin.Context) {
		models.CheckAccessProfile(conn, c.Writer, c.Request)
	})
	router.POST("api/newAccesProf", func(ctx *gin.Context) {
		var ingresoData RelInfo
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Convertir los valores de cadena de ingresoData.ProfileID y ingresoData.AccessListID a uint
		profileID, err := strconv.Atoi(ingresoData.ProfileID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "ProfileID debe ser un número entero"})
			return
		}

		accessListID, err := strconv.Atoi(ingresoData.AccessListID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "AccessListID debe ser un número entero"})
			return
		}
		models.RegisAccesProfile(
			conn,
			uint(profileID),
			uint(accessListID),
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})
	router.DELETE("/api/deleteProfileAccess/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteAccessProfByProfId(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	router.GET("/api/profUser", func(c *gin.Context) {
		models.CheckProfileUser(conn, c.Writer, c.Request)
	})
	router.POST("api/newProfUser", func(ctx *gin.Context) {
		var ingresoData RelInfo2
		if err := ctx.ShouldBindJSON(&ingresoData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		userID, err := strconv.Atoi(ingresoData.UserID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "UserID debe ser un número entero"})
			return
		}

		profileID, err := strconv.Atoi(ingresoData.ProfileID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "ProfileID debe ser un número entero"})
			return
		}
		models.RegisProfileUSer(
			conn,
			uint(userID),
			uint(profileID),
		)
		ctx.JSON(http.StatusOK, gin.H{"message": "Ingreso registrado con éxito"})
	})

	router.DELETE("/api/deleteProfUser/:codigo", func(c *gin.Context) {
		codigo := c.Param("codigo")
		codigoUint, err := strconv.ParseUint(codigo, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro de código no es un número válido"})
			return
		}
		models.DeleteProfUserByUserID(conn, uint(codigoUint))
		c.JSON(http.StatusOK, gin.H{"message": "Ingreso eliminado con éxito"})
	})

	// Esto mantiene el servidor abierto en el puerto que esta asignado
	router.Run(":8080")
	fmt.Println("OK!!!")

}
