package connection

import (
	"fmt"

	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

func GetConnection(user, pass, port, dbname string) (*gorm.DB, error) {
	// github.com/denisenkom/go-mssqldb
	// la base de datos es mysql
	dsn := fmt.Sprintf("sqlserver://%s:%s@localhost:%s?database=%s", user, pass, port, dbname)
	return gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
}
