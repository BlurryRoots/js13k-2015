
browserify_cmd="node_modules/browserify/bin/cmd.js"
handlebars_cmd="node_modules/handlebars/bin/handlebars"
uglifyjs_cmd="node_modules/uglifyjs/bin/uglifyjs"
minify_cmd="node_modules/minify/bin/minify.js"

all: clean build-debug

build: build-debug

run: run-debug

clean:
	rm -rf build/*

setup:
	mkdir -p build

copy:
	cp -Rav assets/* build

debug: build-debug

# no copy task needed - empty folder
build-debug: setup
	$(browserify_cmd) src/main.js -o build/app.js
	node compile-index.js --debug

release: build-release

build-release: setup
	$(browserify_cmd) src/main.js -o build/app.js
	$(uglifyjs_cmd) -m -c -o build/app.compressed.js build/app.js
	node compile-index.js --release
	$(minify_cmd) build/index.html > build/index.min.html
	@echo "scale=2; `stat -c %s build/index.min.html` / 13000.0  * 100.0" | bc

run-release:
	$(BROWSER) build/index.min.html

run-debug:
	$(BROWSER) build/index.html