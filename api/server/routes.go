package server

import "github.com/labstack/echo/v4"

func (s *Server) setRoutes(devMode bool) {
	// SECTION - Public Routes
	// - Index
	s.router.GET("/ping", func(c echo.Context) error {
		return c.JSON(200, "pong")
	})

	// SECTION - Guest Routes

	// SECTION - Private Routes

	// SECTION - Moderation Routes
}
