package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		usersCollection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		usersCollection.PasswordAuth.Enabled = false
		usersCollection.OTP.Enabled = true
		usersCollection.OTP.Duration = 60

		return app.Save(usersCollection)
	}, func(app core.App) error {
		// add down queries...

		return nil
	})
}
