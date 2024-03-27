package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Area struct {
	gorm.Model
	Id      uint
	Name    string
	PlantId int16
}

func RegistrarArea(conn *gorm.DB, nombre string, plantId int16) {
	a := Area{
		Name:    nombre,
		PlantId: plantId,
	}

	rs := conn.Create(&a)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarAreas(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var areas []Area

	rs := conn.Find(&areas)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen areas ingresadas")
		return
	}

	jsonData, err := json.Marshal(areas)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarAreaByPlantId(conn *gorm.DB, w http.ResponseWriter, r *http.Request, idPlanta uint) {
	var area []Area

	rs := conn.Where("plant_id = ?", idPlanta).Find(&area)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen areas asociadas a esa planta")
		return
	}

	jsonData, err := json.Marshal(area)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ObtenerNombreAreaPorID(conn *gorm.DB, areaId int) (string, error) {
	var area Area

	rs := conn.Select("name").Where("id = ?", areaId).First(&area)
	if rs.Error != nil {
		return "", rs.Error
	}
	if rs.RowsAffected == 0 {
		return "", nil // No se encontró ninguna planta con esa ID
	}

	return area.Name, nil
}
