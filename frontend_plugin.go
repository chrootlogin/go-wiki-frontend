package main

import (
	"strings"
	"time"
	"net/http"
	"path/filepath"

	"github.com/hashicorp/go-plugin"
	"github.com/chrootlogin/go-wiki-plugin-sdk"

	"github.com/chrootlogin/go-wiki-frontend/gosrc/frontend"
)

type goWikiPlugin struct {
	module.GoWikiPlugin
}

func (p *goWikiPlugin) Init() {
	p.RegisterRoute("/", func(request module.HTTPRequest) module.HTTPResponse {
		content, err := frontend.Asset("index.html")
		if err != nil {
			return module.HTTPResponse{
				Status: http.StatusNotFound,
				Body: "Not found",
			}
		}

		t := time.Now().AddDate(0,0,-30)

		return module.HTTPResponse{
			Status: http.StatusOK,
			Headers: map[string]string{
				"Content-Type": "text/html",
				"Cache-Control": "no-cache, no-store, must-revalidate",
				"Expires": t.Format(time.RFC1123),
			},
			Body: string(content),
		}
	})

	p.RegisterRoute("/static/*asset", func(request module.HTTPRequest) module.HTTPResponse {
		url := strings.TrimLeft(request.URL.String(), "/")

		content, err := frontend.Asset(url)
		if err != nil {
			return module.HTTPResponse{
				Status: http.StatusNotFound,
				Body: "Not found",
			}
		}

		t := time.Now().AddDate(0,0,365)
		response :=  module.HTTPResponse{
			Status: http.StatusOK,
			Headers: map[string]string{
				"Cache-Control": "public, max-age=31536000",
				"Expires": t.Format(time.RFC1123),
			},
			Body: string(content),
		}

		switch filepath.Ext(url) {
		case ".js":
			response.Headers["Content-Type"] = "text/javascript"
		case ".css":
			response.Headers["Content-Type"] = "text/css"
		case ".svg":
			response.Headers["Content-Type"] = "image/svg+xml"
		case ".ttf":
			response.Headers["Content-Type"] = "font/ttf"
		case ".woff":
			response.Headers["Content-Type"] = "font/woff"
		case ".woff2":
			response.Headers["Content-Type"] = "font/woff2"
		case ".eot":
			response.Headers["Content-Type"] = "application/vnd.ms-fontobject"
		default:
			response.Headers["Content-Type"] = "application/octet-stream"
		}

		return response
	})
}

func (p *goWikiPlugin) Name() string {
	return "Frontend"
}

func (p *goWikiPlugin) Version() string {
	return "0.0.1"
}

func main() {
	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: module.HandshakeConfig,
		Plugins:         module.PluginMap(&goWikiPlugin{}),
	})
}