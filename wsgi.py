import sys
import os

# Add the backend directory to the path
backend_path = os.path.join(os.path.dirname(__file__), 'code_package/backend')
sys.path.insert(0, backend_path)

# Also add the app directory to the path
app_path = os.path.join(backend_path, 'app')
sys.path.insert(0, app_path)

# Try a different import approach
from run import app

if __name__ == "__main__":
    app.run()
