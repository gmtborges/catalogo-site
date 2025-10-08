package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		storesCollection := core.NewBaseCollection("stores")

		storesCollection.ListRule = types.Pointer("id = @request.auth.id")
		storesCollection.ViewRule = types.Pointer("id = @request.auth.id")
		storesCollection.CreateRule = types.Pointer("")
		storesCollection.UpdateRule = types.Pointer("id = @request.auth.id")
		storesCollection.DeleteRule = types.Pointer("id = @request.auth.id")

		storesCollection.Fields.Add(&core.TextField{
			Name:     "name",
			Required: true,
			Max:      100,
		})

		usersCollection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		storesCollection.Fields.Add(&core.RelationField{
			Name:          "user",
			Required:      true,
			CascadeDelete: true,
			CollectionId:  usersCollection.Id,
		})

		storesCollection.Fields.Add(&core.TextField{
			Name:     "subdomain",
			Required: true,
			Max:      30,
		})

		storesCollection.Fields.Add(&core.TextField{
			Name:     "cnpj",
			Required: true,
			Max:      14,
		})

		storesCollection.Fields.Add(&core.TextField{
			Name:     "cnpj",
			Required: true,
			Max:      14,
		})

		storesCollection.Fields.Add(&core.FileField{
			Name:      "banner",
			MimeTypes: []string{"image/png", "image/jpeg", "image/svg+xml", "image/webp"},
		})

		storesCollection.Fields.Add(&core.AutodateField{
			Name:     "created",
			OnCreate: true,
		})

		storesCollection.Fields.Add(&core.AutodateField{
			Name:     "updated",
			OnCreate: true,
			OnUpdate: true,
		})

		storesCollection.AddIndex("idx_stores_subdomain", true, "subdomain", "")
		storesCollection.AddIndex("idx_stores_cnpj", true, "cnpj", "")

		return app.Save(storesCollection)
	}, func(app core.App) error {
		storesCollection, err := app.FindCollectionByNameOrId("stores")
		if err != nil {
			return err
		}

		return app.Delete(storesCollection)
	})
}
