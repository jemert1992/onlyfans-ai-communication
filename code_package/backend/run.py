from flask import Flask, send_from_directory
import os

def create_app():
    app = Flask(__name__, static_folder='../frontend/build')
    
    # Import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.messages import messages_bp
    from app.routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
