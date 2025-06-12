package main

import (
	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/gmtborges/catalogo-site/internal/view/page"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	e := echo.New()
	e.Static("/static", "assets/dist")
	e.GET("/", func(c echo.Context) error {
		return page.LandingIndex().Render(c.Request().Context(), c.Response())
	})

	log.Fatal().Err(e.Start(":1323"))
}
