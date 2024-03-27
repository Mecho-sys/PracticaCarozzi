package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Worker struct {
	gorm.Model
	Id         uint
	Name       string
	Role       string
	Speciality string
	Turn       bool //bool
	IdEmpre    string
	Comment    string
}

func RegistrarWorker(conn *gorm.DB, nombre, cargo, espec, idEmpresa, coment string, turno bool) {
	w := Worker{
		Name:       nombre,
		Role:       cargo, //mantendor/jefetuno/admistrativo
		Speciality: espec, //mecanico /electrico /soldador
		Turn:       turno, // para si esta trabajando por turnos (true turno, false administrativo)
		IdEmpre:    idEmpresa,
		Comment:    coment,
	}

	rs := conn.Create(&w)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarShift(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var jefes []Worker
	rs := conn.Where("role = ?", "jefe de turno").Find(&jefes)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen jefes de turno ingresados")
		return
	}

	jsonData, err := json.Marshal(jefes)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarManten(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var mantenedores []Worker
	rs := conn.Where("role = ?", "Mantenedor").Find(&mantenedores)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen mantenedores ingresados")
		return
	}

	jsonData, err := json.Marshal(mantenedores)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarWorkerByID(conn *gorm.DB, codigo uint) {
	var trabajador Worker
	rs := conn.Where("id = ?", codigo).Find(&trabajador)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen trabajadores con ese codigo")
		return
	}
}

func DeleteWorkerByID(conn *gorm.DB, codigo uint) {
	conn.Where("Id = ?", codigo).Delete(&Worker{})
}
