package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type Component struct {
	gorm.Model
	Id       uint
	Name     string
	NroComp  string
	NroFails string
	EquipId  int
}

func RegistrarComp(conn *gorm.DB, nombre, nroComp, nroFallas string, equipId int) {
	c := Component{
		Name:     nombre,
		NroComp:  nroComp,
		NroFails: nroFallas,
		EquipId:  equipId,
	}

	rs := conn.Create(&c)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func ConsultarComps(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var componentes []Component

	rs := conn.Find(&componentes)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen componentes registrados")
		return
	}

	jsonData, err := json.Marshal(componentes)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarCompById(conn *gorm.DB, w http.ResponseWriter, r *http.Request, compId int) {
	var componente Component

	rs := conn.Where("id = ?", compId).Find(&componente)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existe un componente con ese identificador")
		return
	}

	jsonData, err := json.Marshal(componente)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ConsultarCompByEquipId(conn *gorm.DB, w http.ResponseWriter, r *http.Request, equipId uint) {
	var componentes []Component

	rs := conn.Where("equip_id = ?", equipId).Find(&componentes)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existe un componente con ese identificador")
		return
	}

	jsonData, err := json.Marshal(componentes)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func ObtenerNombreCompPorID(conn *gorm.DB, compId int) (string, error) {
	var componente Component

	rs := conn.Select("name").Where("id = ?", compId).First(&componente)
	if rs.Error != nil {
		return "", rs.Error
	}
	if rs.RowsAffected == 0 {
		return "", nil // No se encontró ninguna planta con esa ID
	}

	return componente.Name, nil
}
