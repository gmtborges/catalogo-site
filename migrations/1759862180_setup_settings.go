package migrations

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
		settings := app.Settings()
		smtpHost := os.Getenv("SMTP_HOST")
		smtpPort, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
		smtpUsername := os.Getenv("SMTP_USER")
		smtpPassword := os.Getenv("SMTP_PASSWORD")

		// for all available settings fields you could check
		// https://github.com/pocketbase/pocketbase/blob/develop/core/settings_model.go#L121-L130
		settings.Meta.AppName = "catalogo.site"
		settings.Meta.AppURL = "https://catalogo.site"
		settings.Meta.SenderName = "catalogo.site"
		settings.Meta.SenderAddress = "contato@catalogo.site"
		settings.SMTP.Enabled = true
		settings.SMTP.Host = smtpHost
		settings.SMTP.Port = smtpPort
		settings.SMTP.Username = smtpUsername
		settings.SMTP.Password = smtpPassword

		return app.Save(settings)
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
