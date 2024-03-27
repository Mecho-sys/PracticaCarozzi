package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type IntervType struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarTipoInterv(conn *gorm.DB, tipo, descrip string) {
	it := IntervType{
		Name:    tipo,
		Descrip: descrip,
	}

	rs := conn.Create(&it)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarTipoInterv(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var intervs []IntervType

	rs := conn.Find(&intervs)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen especialidades registradas")
		return
	}

	jsonData, err := json.Marshal(intervs)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteTipoIntervByID(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&IntervType{})
}
