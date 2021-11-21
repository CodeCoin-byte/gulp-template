create:
	mkdir -p src src/assets src/assets/{js,img,style}
	touch src/index.html src/assets/style/style.css src/assets/js/index.js
install:
	npm install
build:
	gulp build
start:
	gulp