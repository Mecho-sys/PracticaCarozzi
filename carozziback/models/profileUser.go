package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type ProfileUser struct {
	gorm.Model
	UserID    uint
	ProfileID uint
}

func RegisProfileUSer(conn *gorm.DB, user, perfilacc uint) {
	al := ProfileUser{
		UserID:    user,
		ProfileID: perfilacc,
	}

	rs := conn.Create(&al)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func CheckProfileUser(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var accesos []ProfileUser

	rs := conn.Find(&accesos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay ningun perfil de usuario registrados")
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
func DeleteProfUserByUserID(conn *gorm.DB, codigo uint) {
	conn.Where("user_id = ?", codigo).Delete(&ProfileUser{})
}
