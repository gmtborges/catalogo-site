dev: 
	@make -j4 templ js css air

air:
	@air

templ:
	@templ generate --watch --proxy=http://localhost:1323

css:
	@npx -y @tailwindcss/cli --watch -i assets/app.css --minify -o assets/dist/output.css

js:
	@npx -y esbuild assets/main.js --bundle --minify --outfile=assets/dist/bundle.js
