dev: 
	@make -j3 air landing catalog

air: 
	@air

landing: 
	@cd web/landing && npm run dev	

catalog: 
	@cd web/catalog && npm run dev	
