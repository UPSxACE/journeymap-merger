package server

import (
	"fmt"
	"image"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"image/png"
)

var expectedFilenamePattern = `^[-]?\d+,\s*[-]?\d+\.png$`

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
		return c.NoContent(http.StatusBadRequest)
	}

	files := form.File["file"]

	type coordinateX = int
	type coordinateY = int

	var smallestX int
	var smallestY int
	var biggestX int
	var biggestY int
	var images = map[coordinateX](map[coordinateY]image.Image){}

	// perform verifications and calculate biggestX and biggestY
	for _, file := range files {
		if file.Size > 5*MiB {
			return c.NoContent(http.StatusRequestEntityTooLarge)
		}

		matched, err := regexp.MatchString(expectedFilenamePattern, file.Filename)
		if err != nil {
			return c.NoContent(http.StatusBadRequest)
		}

		if !matched {
			return c.NoContent(http.StatusBadRequest)
		}

		src, err := file.Open()
		if err != nil {
			return c.NoContent(http.StatusInternalServerError)
		}
		defer src.Close()

		// check if 512x512 and png
		img, format, err := image.Decode(src)
		if err != nil {
			return c.NoContent(http.StatusBadRequest)
		}

		if format != "png" {
			return c.NoContent(http.StatusBadRequest)
		}

		w := img.Bounds().Size().X
		h := img.Bounds().Size().Y
		if w != 512 || h != 512 {
			return c.NoContent(http.StatusBadRequest)
		}

		// split name
		nameWithoutExtension := strings.TrimSuffix(file.Filename, ".png")
		coordinates := strings.Split(nameWithoutExtension, ",")

		// get X and get Y (final map positions)
		x, err := strconv.Atoi(coordinates[0])
		if err != nil {
			return c.NoContent(http.StatusBadRequest)
		}
		y, err := strconv.Atoi(coordinates[1])
		if err != nil {
			return c.NoContent(http.StatusBadRequest)
		}

		if x > biggestX {
			biggestX = x
		}

		if x < smallestX {
			smallestX = x
		}

		if y > biggestY {
			biggestY = y
		}

		if y < smallestY {
			smallestY = y
		}

		if images[x] == nil {
			images[x] = map[coordinateY]image.Image{}
		}

		images[x][y] = img
	}

	fmt.Println(biggestX, biggestY)
	fmt.Println(smallestX, smallestY)

	dname, err := os.MkdirTemp("", "jm-temp")
	if err != nil {
		fmt.Println(err)
		return c.NoContent(http.StatusInternalServerError)
	}
	fmt.Println(dname)
	// defer os.RemoveAll(dname) // FIXME uncomment to delete temp folder after used

	totalW := (biggestX - smallestX + 1) * 512
	totalH := (biggestY - smallestY + 1) * 512
	rect := image.Rect(0, 0, totalW, totalH)
	newImage := image.NewRGBA(rect)

	for x, yMap := range images {
		for y, currentImage := range yMap {
			startingX := (x - smallestX) * 512
			startingY := (y - smallestY) * 512

			for cx := 0; cx < 512; cx++ {
				for cy := 0; cy < 512; cy++ {
					pixel := currentImage.At(cx, cy)
					newImage.Set(startingX+cx, startingY+cy, pixel)
				}
			}
		}
	}

	newFile, err := os.Create(filepath.Join(dname, "final.png"))
	if err != nil {
		fmt.Println(err)
		return c.NoContent(http.StatusInternalServerError)
	}
	defer newFile.Close()

	err = png.Encode(newFile, newImage)
	if err != nil {
		fmt.Println(err)
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.NoContent(http.StatusOK)
}
