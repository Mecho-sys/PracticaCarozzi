package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type FailureMode struct {
	gorm.Model
	Id      uint
	Name    string
	Descrip string
}

func RegistrarModoFalla(conn *gorm.DB, modo, descrip string) {
	f := FailureMode{
		Name:    modo,
		Descrip: descrip,
	}

	rs := conn.Create(&f)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarModoFallas(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var modos []FailureMode

	rs := conn.Find(&modos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen fallas registradas")
		return
	}

	jsonData, err := json.Marshal(modos)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteModoFallaByID(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&FailureMode{})
}
