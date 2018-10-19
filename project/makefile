
browserify_cmd="node_modules/browserify/bin/cmd.js"
handlebars_cmd="node_modules/handlebars/bin/handlebars"
uglifyjs_cmd="node_modules/uglify-js/bin/uglifyjs"
minify_cmd="node_modules/minify/bin/minify.js"
yuidocjs_cmd="node_modules/yuidocjs/lib/./cli.js"

all: clean build-debug

build: build-debug

run: run-debug

clean:
	rm -rf build/*

setup:
	mkdir -p build

copy:
	cp -Rav assets/* build

clean-doc:
	rm -rf doc

doc: clean-doc
	@echo "Updating documentation ..."
	@$(yuidocjs_cmd) -o doc src > /dev/null

debug: build-debug

# no copy task needed - empty folder
build-debug: setup
	$(browserify_cmd) -t brfs src/main.js -o build/app.js
	node compile-index.js --debug

release: build-release

build-release: setup
	$(browserify_cmd) -t brfs src/main.js -o build/app.js
	$(uglifyjs_cmd) -m -c -o build/app.compressed.js build/app.js
	node compile-index.js --release
	$(minify_cmd) build/index.html > build/index.min.html

size-limit:
	@echo "scale=2; `stat -c %s build/index.min.html` / 13000.0  * 100.0" | bc

run-release:
	$(BROWSER) build/index.min.html

run-debug:
	$(BROWSER) build/index.html