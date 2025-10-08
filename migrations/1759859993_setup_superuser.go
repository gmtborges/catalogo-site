package migrations

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	m.Register(func(app core.App) error {
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}
		email := os.Getenv("EMAIL")
		password := os.Getenv("PASSWORD")

		record := core.NewRecord(superusers)
		record.Set("email", email)
		record.Set("password", password)

		return app.Save(record)
	}, func(app core.App) error {
		return nil
	})
}
