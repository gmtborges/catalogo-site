dev: 
	@make -j3 air dev-landing dev-catalog

air: 
	@air

dev-landing: 
	@cd web/landing && npm run dev	

build-landing:
	@cd web/landing && npm run build

dev-catalog: 
	@cd web/catalog && npm run dev	

build-catalog:
	@cd web/catalog && npm run build
