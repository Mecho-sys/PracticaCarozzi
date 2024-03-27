package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type DescActivity struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarActivity(conn *gorm.DB, tipo, descrip string) {
	da := DescActivity{
		Name:    tipo,
		Descrip: descrip,
	}

	rs := conn.Create(&da)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarDescActivity(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var actividades []DescActivity

	rs := conn.Find(&actividades)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay actividades de mantencion registrados")
		return
	}

	jsonData, err := json.Marshal(actividades)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteActivityByID(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&DescActivity{})
}
