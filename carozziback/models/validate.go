package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Validate struct {
	gorm.Model
	Id          uint
	IdUser      string
	IdBinnacle  string
	CargoWorker string
}

func RegisValidate(conn *gorm.DB, user, binn, worker string) {
	val := Validate{
		IdUser:      user,
		IdBinnacle:  binn,
		CargoWorker: worker,
	}

	rs := conn.Create(&val)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func CheckValidates(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var accesos []Validate

	rs := conn.Find(&accesos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay ninguna bitacora validada registrada")
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
func DeleteValidateById(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&Validate{})
}
