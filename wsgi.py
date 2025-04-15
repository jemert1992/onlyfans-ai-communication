import sys
import os

# Print current directory and list files for debugging
print(f"Current directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")

# Try to list files in the code_package directory
try:
    print(f"Files in code_package: {os.listdir('code_package')}")
    # Try to list files in the backend directory
    try:
        print(f"Files in code_package/backend: {os.listdir('code_package/backend')}")
    except Exception as e:
        print(f"Error listing code_package/backend: {e}")
except Exception as e:
    print(f"Error listing code_package: {e}")

# Simplified approach - try to import app directly
try:
    from code_package.backend.app import app
    print("Successfully imported app from code_package.backend.app")
except Exception as e:
    print(f"Error importing from code_package.backend.app: {e}")

# Fallback to a simple Flask app for testing
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World! This is a temporary app to verify deployment."

if __name__ == "__main__":
    app.run()
