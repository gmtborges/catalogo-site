package main

import (
	"log"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/gmtborges/catalogo-site/web/catalog"
	"github.com/gmtborges/catalogo-site/web/landing"
)

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/{path...}", func(e *core.RequestEvent) error {
			host := e.Request.Host
			if hasSubdomain(host) {
				return apis.Static(catalog.DistDirFS, true)(e)
			}
			return apis.Static(landing.DistDirFS, true)(e)
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func hasSubdomain(host string) bool {
	if colonIndex := strings.LastIndex(host, ":"); colonIndex != -1 {
		host = host[:colonIndex]
	}
	if strings.Contains(host, ".localhost") {
		return true
	}
	if strings.Contains(host, ".catalogo.site") {
		return true
	}
	return false
}
