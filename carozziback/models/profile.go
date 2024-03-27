package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Profile struct {
	gorm.Model
	Name    string
	Descrip string
}

func RegisProfile(conn *gorm.DB, name, descrip string) {
	p := Profile{
		Name:    name,
		Descrip: descrip,
	}

	rs := conn.Create(&p)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func CheckProfile(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var accesos []Profile

	rs := conn.Find(&accesos)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay perfiles registrados")
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

func CheckProfileByName(conn *gorm.DB, w http.ResponseWriter, r *http.Request, nombre string) {
	var usuario Profile

	rs := conn.Select("name").Where("name = ?", nombre).First(&usuario)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen perfiles con ese nombre")
		return
	}

	jsonData, err := json.Marshal(usuario)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func DeleteProfileById(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&Profile{})
}
