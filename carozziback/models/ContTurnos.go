package models

import (
	"encoding/json"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type TurnCounts struct {
	Morning   int `json:"morning"`
	Afternoon int `json:"afternoon"`
	Night     int `json:"night"`
}

func CountEntriesByTurn(conn *gorm.DB) (TurnCounts, error) {
	var counts TurnCounts

	results := make(map[string]int)

	rs := conn.Model(&Binnacle{}).
		Select("turn, count(*) as count").
		Group("turn").
		Pluck("count, turn", &results)

	if rs.Error != nil {
		log.Println("Error al ejecutar la consulta SQL:", rs.Error)
		return TurnCounts{}, rs.Error
	}

	log.Println("Resultados de la consulta:", results)

	for turn, count := range results {
		switch turn {
		case "Mañana":
			counts.Morning = count
		case "Tarde":
			counts.Afternoon = count
		case "Noche":
			counts.Night = count
		}
	}

	return counts, nil
}

func ConsultarYContarBinnacle(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	// Consulta y cuenta las entradas por turno
	counts, err := CountEntriesByTurn(conn)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error al obtener los recuentos de entradas por turno", http.StatusInternalServerError)
		return
	}

	// Serializa los recuentos a JSON
	jsonData, err := json.Marshal(counts)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error al serializar los recuentos de entradas a JSON", http.StatusInternalServerError)
		return
	}

	// Establece el tipo de contenido y escribe los datos en la respuesta HTTP
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
