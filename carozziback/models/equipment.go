package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Equipment struct {
	gorm.Model
	Id     uint
	Name   string
	AreaId int
}

func RegistrarEquipo(conn *gorm.DB, nombre string, areaId int) {
	e := Equipment{
		Name:   nombre,
		AreaId: areaId,
	}

	rs := conn.Create(&e)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarEquipos(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var equipos []Equipment

	rs := conn.Find(&equipos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen camiones")
		return
	}

	jsonData, err := json.Marshal(equipos)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarEquipById(conn *gorm.DB, w http.ResponseWriter, r *http.Request, equipId int) {
	var equipo Equipment

	rs := conn.Where("id = ?", equipId).Find(&equipo)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen equipos registrados")
		return
	}

	jsonData, err := json.Marshal(equipo)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarEquipByAreaId(conn *gorm.DB, w http.ResponseWriter, r *http.Request, idArea uint) {
	var equipos []Equipment

	rs := conn.Where("area_id = ?", idArea).Find(&equipos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen equipos registrados en esa Linea")
		return
	}

	jsonData, err := json.Marshal(equipos)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ObtenerNombreEquipoPorID(conn *gorm.DB, equipId int) (string, error) {
	var equipo Equipment

	rs := conn.Select("name").Where("id = ?", equipId).First(&equipo)
	if rs.Error != nil {
		return "", rs.Error
	}
	if rs.RowsAffected == 0 {
		return "", nil // No se encontró ninguna planta con esa ID
	}

	return equipo.Name, nil
}
