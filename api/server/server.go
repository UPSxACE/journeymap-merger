package server

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Server struct {
	router *echo.Echo
}

func NewServer(devMode bool) *Server {
	e := echo.New()

	// Essential Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{os.Getenv("CORS_ORIGIN")},
		AllowHeaders:     []string{"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"},
		AllowCredentials: true,
	}))

	server := &Server{router: e}

	server.setRoutes(devMode)

	return server
}

func (s *Server) Start(address string) error {
	return s.router.Start(address)
}
