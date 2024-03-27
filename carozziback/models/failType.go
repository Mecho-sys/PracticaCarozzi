package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type FailureType struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarFalla(conn *gorm.DB, tipo, descrip string) {
	f := FailureType{
		Name:    tipo,
		Descrip: descrip,
	}

	rs := conn.Create(&f)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarFallas(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var fallas []FailureType

	rs := conn.Find(&fallas)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen fallas registradas")
		return
	}

	jsonData, err := json.Marshal(fallas)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarFailsByType(conn *gorm.DB, w http.ResponseWriter, r *http.Request, tipo string) {
	var fallas []FailureType

	rs := conn.Where("Type = ?", tipo).Find(&fallas)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen ese tipo de fallos")
		return
	}

	jsonData, err := json.Marshal(fallas)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteFallaByID(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&FailureType{})
}
