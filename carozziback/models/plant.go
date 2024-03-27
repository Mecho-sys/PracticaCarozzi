package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Plant struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarPlant(conn *gorm.DB, nombre, desc string) {
	p := Plant{
		Name:    nombre,
		Descrip: desc,
	}

	rs := conn.Create(&p)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarPlantas(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var plantas []Plant

	rs := conn.Find(&plantas)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen plantas igresadas")
		return
	}

	jsonData, err := json.Marshal(plantas)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarPlantaById(conn *gorm.DB, w http.ResponseWriter, r *http.Request, plantId int) {
	var planta Plant

	rs := conn.Where("id = ?", plantId).Find(&planta)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen plantas con esa id")
		return
	}

	jsonData, err := json.Marshal(planta)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ObtenerNombrePlantaPorID(conn *gorm.DB, plantId int) (string, error) {
	var planta Plant

	rs := conn.Select("name").Where("id = ?", plantId).First(&planta)
	if rs.Error != nil {
		return "", rs.Error
	}
	if rs.RowsAffected == 0 {
		return "", nil // No se encontró ninguna planta con esa ID
	}

	return planta.Name, nil
}
