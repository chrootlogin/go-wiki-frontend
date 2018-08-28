NPM=npm
DEP=dep
GO=go
GOBINDATA=go-bindata

all: web_app

web_app:
	$(NPM) install
	NODE_ENV=production $(NPM) run build

go_plugin:
	$(DEP) ensure
	$(GOBINDATA) -pkg frontend -prefix dist/ -o gosrc/frontend/frontend.go dist/ dist/static/
	$(GO) build -o frontend_plugin frontend_plugin.go

clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf vendor