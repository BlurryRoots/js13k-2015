
browserify_cmd="node_modules/browserify/bin/cmd.js"
handlebars_cmd="node_modules/handlebars/bin/handlebars"
uglifyjs_cmd="node_modules/uglifyjs/bin/uglifyjs"

all: clean build

clean:
	rm -rf build/*

setup:
	mkdir -p build

copy:
	cp -Rav assets/* build

# no copy task needed - empty folder
build: setup
	# $(browserify_cmd) src/main.js -t brfs -o build/app.js
	$(browserify_cmd) src/main.js -o build/app.js
	$(uglifyjs_cmd) -c -o build/app.compressed.js build/app.js
	node compile-index.js
