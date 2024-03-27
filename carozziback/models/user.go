package models

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
}

func RegisUser(conn *gorm.DB, name, email, pass string) {
	tm := User{
		Name:     name,
		Email:    email,
		Password: pass,
	}

	rs := conn.Create(&tm)
	if rs.Error != nil {
		log.Println(rs.Error)
	}
}

func VerifyUser(db *gorm.DB, email, password string) (*User, error) {
	var user User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err // Usuario no encontrado
	}
	// Verificar contraseña
	if user.Password != password {
		return nil, ErrInvalidCredentials // Contraseña incorrecta
	}
	return &user, nil // Usuario y contraseña correctos
}

// ErrInvalidCredentials es un error que se utiliza cuando las credenciales de inicio de sesión son incorrectas
var ErrInvalidCredentials = errors.New("credenciales de inicio de sesión incorrectas")

func CheckUsers(conn *gorm.DB, w http.ResponseWriter, r *http.Request) {
	var usuarios []User

	rs := conn.Find(&usuarios)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No hay tipos de mantencion registrados")
		return
	}

	jsonData, err := json.Marshal(usuarios)
	if err != nil {
		log.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func CheckUserByMail(conn *gorm.DB, w http.ResponseWriter, r *http.Request, mail string) {
	var usuario User

	rs := conn.Select("name").Where("mail = ?", mail).First(&usuario)
	if rs.Error != nil {
		log.Println(rs.Error)
		return
	}
	if rs.RowsAffected == 0 {
		log.Println("No existen plantas con esa id")
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
func DeleteUserById(conn *gorm.DB, codigo uint) {
	conn.Where("id = ?", codigo).Delete(&User{})
}
