.PHONY: web web-dev clean

# Web / landing page
web:
	@echo "Building landing page..."
	@cd web && npm run build

web-dev:
	@echo "Starting landing page dev server..."
	@cd web && npm run dev

# Clean
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf dist build out
	@rm -rf web/dist
