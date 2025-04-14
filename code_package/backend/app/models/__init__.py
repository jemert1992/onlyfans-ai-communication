from datetime import datetime, timedelta
from app import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import func

class User(db.Model):
    """User model for creators using the system."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # User profile information
    display_name = db.Column(db.String(100), nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)
    
    # Response style preferences
    flirtiness = db.Column(db.Float, default=0.5)  # 0.0 to 1.0
    friendliness = db.Column(db.Float, default=0.7)  # 0.0 to 1.0
    formality = db.Column(db.Float, default=0.3)  # 0.0 to 1.0
    
    # Automation preferences
    auto_respond_safe = db.Column(db.Boolean, default=True)
    auto_respond_low_risk = db.Column(db.Boolean, default=False)
    auto_respond_high_risk = db.Column(db.Boolean, default=False)
    
    # Relationships
    messages = db.relationship('Message', backref='recipient', lazy='dynamic')
    responses = db.relationship('Response', backref='creator', lazy='dynamic')
    
    def __repr__(self):
        return f'<User {self.username}>'


class Message(db.Model):
    """Message model for incoming messages from followers."""
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sender_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Message classification
    risk_level = db.Column(db.String(20), default='unclassified')  # safe, low-risk, high-risk
    risk_score = db.Column(db.Float, default=0.0)  # 0.0 to 1.0
    
    # Message status
    is_read = db.Column(db.Boolean, default=False)
    is_archived = db.Column(db.Boolean, default=False)
    is_flagged = db.Column(db.Boolean, default=False)
    
    # Encryption fields
    is_encrypted = db.Column(db.Boolean, default=True)
    encryption_key_id = db.Column(db.String(36), nullable=True)
    
    # Auto-deletion tracking
    scheduled_deletion = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    responses = db.relationship('Response', backref='original_message', lazy='dynamic')
    
    def __init__(self, *args, **kwargs):
        super(Message, self).__init__(*args, **kwargs)
        # Set scheduled deletion date (30 days from creation by default)
        from app.config import Config
        retention_period = Config.MESSAGE_RETENTION_PERIOD
        self.scheduled_deletion = datetime.utcnow() + timedelta(seconds=retention_period)
    
    def __repr__(self):
        return f'<Message {self.id} from {self.sender_name}>'
    
    @hybrid_property
    def is_expired(self):
        """Check if message is past its retention period."""
        return self.scheduled_deletion <= datetime.utcnow()


class Response(db.Model):
    """Response model for outgoing messages to followers."""
    __tablename__ = 'responses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Response metadata
    is_auto_generated = db.Column(db.Boolean, default=False)
    template_used = db.Column(db.String(50), nullable=True)
    
    # Style parameters used
    flirtiness = db.Column(db.Float, nullable=True)
    friendliness = db.Column(db.Float, nullable=True)
    formality = db.Column(db.Float, nullable=True)
    
    # Encryption fields
    is_encrypted = db.Column(db.Boolean, default=True)
    encryption_key_id = db.Column(db.String(36), nullable=True)
    
    # Auto-deletion tracking
    scheduled_deletion = db.Column(db.DateTime, nullable=True)
    
    def __init__(self, *args, **kwargs):
        super(Response, self).__init__(*args, **kwargs)
        # Set scheduled deletion date (30 days from creation by default)
        from app.config import Config
        retention_period = Config.MESSAGE_RETENTION_PERIOD
        self.scheduled_deletion = datetime.utcnow() + timedelta(seconds=retention_period)
    
    def __repr__(self):
        return f'<Response {self.id} to message {self.message_id}>'
    
    @hybrid_property
    def is_expired(self):
        """Check if response is past its retention period."""
        return self.scheduled_deletion <= datetime.utcnow()


class ResponseTemplate(db.Model):
    """Model for response templates that can be customized."""
    __tablename__ = 'response_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # e.g., greeting, thank-you, content-request
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Default style parameters
    default_flirtiness = db.Column(db.Float, default=0.5)
    default_friendliness = db.Column(db.Float, default=0.7)
    default_formality = db.Column(db.Float, default=0.3)
    
    def __repr__(self):
        return f'<ResponseTemplate {self.name}>'
