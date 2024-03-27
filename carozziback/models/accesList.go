package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type AccessList struct {
	gorm.Model
	Name    string
	Descrip string
}

func RegisAccessPerm(conn *gorm.DB, accion, desc string) {
	al := AccessList{
		Name:    accion,
		Descrip: desc,
	}

	rs := conn.Create(&al)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func CheckAccess(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var accesos []AccessList

	rs := conn.Find(&accesos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay tipos de mantencion registrados")
		return
	}

	jsonData, err := json.Marshal(accesos)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
func DeleteAccessById(conn *gorm.DB, codigo uint) {
	conn.Where("Id = ?", codigo).Delete(&AccessList{})
}
