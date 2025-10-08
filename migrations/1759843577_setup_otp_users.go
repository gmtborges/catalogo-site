package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		u, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}
		u.PasswordAuth.Enabled = false
		u.OTP.Enabled = true
		u.OTP.Length = 6
		u.OTP.Duration = 60

		return app.Save(u)
	}, func(app core.App) error {
		return nil
	})
}
