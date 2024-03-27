package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type EquipStatus struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarEquipStatus(conn *gorm.DB, tipo, descrip string) {
	es := EquipStatus{
		Name:    tipo,
		Descrip: descrip,
	}

	rs := conn.Create(&es)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarEquipStatus(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var estados []EquipStatus

	rs := conn.Find(&estados)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay estado de mantencion registrados")
		return
	}

	jsonData, err := json.Marshal(estados)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteStatusById(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&EquipStatus{})
}
