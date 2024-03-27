package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type TypeMant struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarTypeMant(conn *gorm.DB, tipo, descrip string) {
	tm := TypeMant{
		Name:    tipo,
		Descrip: descrip,
	}

	rs := conn.Create(&tm)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarTypeMant(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var tiposMant []TypeMant

	rs := conn.Find(&tiposMant)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay tipos de mantencion registrados")
		return
	}

	jsonData, err := json.Marshal(tiposMant)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteTypeMantById(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&TypeMant{})
}
