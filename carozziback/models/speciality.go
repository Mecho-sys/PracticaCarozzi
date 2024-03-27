package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Speciality struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarEspecialidad(conn *gorm.DB, tipo, descrip string) {
	s := Speciality{
		Name:    tipo,
		Descrip: descrip,
	}

	rs := conn.Create(&s)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarEspecialidades(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var especs []Speciality

	rs := conn.Find(&especs)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen especialidades registradas")
		return
	}

	jsonData, err := json.Marshal(especs)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteSpecByID(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&Speciality{})
}
