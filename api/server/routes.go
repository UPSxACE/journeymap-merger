package server

import (
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const (
	_ = 1 << (10 * iota)
	KiB
	MiB
	GiB
	TiB
)

func (s *Server) setRoutes(devMode bool) {
	// SECTION - Public Routes
	// - Index
	s.router.Use(middleware.BodyLimit("200M"))
	s.router.GET("/ping", func(c echo.Context) error {
		return c.JSON(200, "pong")
	})
	s.router.POST("/merge", s.postMergeRoute)

	// SECTION - Guest Routes

	// SECTION - Private Routes

	// SECTION - Moderation Routes
}

func (s *Server) postMergeRoute(c echo.Context) error {

	form, err := c.MultipartForm()
	if err != nil {
		return c.NoContent(400)
	}

	files := form.File["file"]

	for _, file := range files {
		if file.Size > 5*MiB {
			return c.NoContent(413)
		}

		// Source
		src, err := file.Open()
		if err != nil {
			return c.NoContent(500)
		}
		defer src.Close()

		dname, err := os.MkdirTemp("", "jm-temp")
		if err != nil {
			fmt.Println(err)
			return c.NoContent(500)
		}
		fmt.Println(dname)
		defer os.RemoveAll(dname)

		// Destination
		dst, err := os.Create(filepath.Join(dname, file.Filename))
		if err != nil {
			fmt.Println(err)
			return c.NoContent(500)
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			return c.NoContent(500)
		}

	}

	// files, err := c.FormFile("file")
	// if err != nil {
	// 	return c.NoContent(400)
	// }
	// files.Open()

	fmt.Printf("%#v\n", files)

	return c.NoContent(200)
}
