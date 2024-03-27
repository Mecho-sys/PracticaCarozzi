package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type AccessProfile struct {
	gorm.Model
	ProfileID    uint
	AccessListID uint
}

func RegisAccesProfile(conn *gorm.DB, perfil, list uint) {
	al := AccessProfile{
		ProfileID:    perfil,
		AccessListID: list,
	}

	rs := conn.Create(&al)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func CheckAccessProfile(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var accesos []AccessProfile

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
func DeleteAccessProfByProfId(conn *gorm.DB, codigo uint) {
	conn.Where("profile_id = ?", codigo).Delete(&AccessProfile{})
}
