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

# Coming soon — platform targets will be added when tech stack is chosen
# See ARCHITECTURE.md and docs/decisions/ for progress on tech stack decisions
#
# macos:
# 	@cd macos && ...
#
# windows:
# 	@cd windows && ...
#
# linux:
# 	@cd linux && ...
#
# test:
# 	@cd tests && ...
