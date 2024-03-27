package models

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"gorm.io/gorm"
)

type Binnacle struct {
	gorm.Model
	Id                  uint
	Mant                string
	Mant2               string
	Mant3               string
	ShiftManager        string
	Comp                string
	Equip               string
	Area                string
	Plant               string
	Fecha               time.Time
	FechaReal           string
	EquipStatus         string
	TypeMant            string
	Speciality          string
	Turn                string
	InitTime            string
	FinishTime          string
	Duration            string
	WorkOrder           string
	DescActivity        string
	Content             string
	FailureType         string
	FailureMode         string
	Content2            string
	Comments            string
	ShiftValidation     bool
	MainManagValidation bool
	SupValidation       bool
}

func RegistrarBinnEntry(conn *gorm.DB, mant1, mant2, mant3, jefe string, compN, equipoN, areaN, plantaN, fechaReal string, estadoEquipo, tipoMant, especialidad, turno, inicio, fin, duracion string, ordenTrabajo, descActividad, descripcion, tipoFalla, modoFalla, descripcion2, comentarios string, valJefe, valMainMant, valSup bool) {
	p := Binnacle{
		Mant:                mant1,
		Mant2:               mant2,
		Mant3:               mant3,
		ShiftManager:        jefe,
		Comp:                compN,
		Equip:               equipoN,
		Area:                areaN,
		Plant:               plantaN,
		Fecha:               time.Now(),
		FechaReal:           fechaReal,
		EquipStatus:         estadoEquipo,
		TypeMant:            tipoMant,
		Speciality:          especialidad,
		Turn:                turno,
		InitTime:            inicio,
		FinishTime:          fin,
		Duration:            duracion,
		WorkOrder:           ordenTrabajo,
		DescActivity:        descActividad,
		Content:             descripcion,
		FailureType:         tipoFalla,
		FailureMode:         modoFalla,
		Content2:            descripcion2,
		Comments:            comentarios,
		ShiftValidation:     valJefe,
		MainManagValidation: valMainMant,
		SupValidation:       valSup,
	}

	rs := conn.Create(&p)

	if rs.Error != nil {
		log.Println(rs.Error)
	}

}

func ConsultarBinnacle(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var bitacoras []Binnacle

	rs := conn.Find(&bitacoras)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen camiones")
		return
	}

	jsonData, err := json.Marshal(bitacoras)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
