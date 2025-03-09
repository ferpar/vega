# Variables
FRONTEND_DIR=frontend
BACKEND_DIR=backend
DIST_DIR=$(BACKEND_DIR)/dist

# Build the frontend and replace the dist folder
build-frontend:
	@echo "Building frontend..."
	cd $(FRONTEND_DIR) && npm run build
	@echo "Replacing dist folder..."
	cd ..
	rm -rf $(DIST_DIR)
	mkdir $(DIST_DIR)
	cp -r $(FRONTEND_DIR)/dist/* $(DIST_DIR)

# Start the backend and dev server
start-frontend-dev:
	@echo "Starting dev server..."
	cd $(FRONTEND_DIR) && npm run dev

# Start the backend server
start-backend:
	@echo "Starting backend server..."
	cd $(BACKEND_DIR) && npm start

# Start backend dev server
start-backend-dev:
	@echo "Starting backend dev server..."
	cd $(BACKEND_DIR) && npm run dev

.PHONY: build-frontend start-frontend-dev start-backend-dev start-backend
