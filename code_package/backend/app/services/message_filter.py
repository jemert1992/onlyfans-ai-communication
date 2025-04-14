from app.models import Message
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

class MessageFilter:
    """
    Service for filtering and classifying messages based on content.
    Uses a pre-trained model to detect inappropriate content and classify risk levels.
    """
    
    def __init__(self, model_name="distilbert-base-uncased"):
        """Initialize the message filter with a pre-trained model."""
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=3)
        
        # Risk level mapping
        self.risk_levels = {
            0: "safe",
            1: "low-risk",
            2: "high-risk"
        }
    
    def classify_message(self, message_text):
        """
        Classify a message text and return risk level and score.
        
        For MVP, this uses a simplified classification approach.
        In production, this would use a fine-tuned model specific to adult content.
        
        Args:
            message_text (str): The message content to classify
            
        Returns:
            tuple: (risk_level, risk_score)
        """
        # For MVP, use keyword-based classification
        high_risk_keywords = [
            "address", "location", "phone number", "meet up", "meetup", 
            "personal", "private", "home", "hotel", "physical", 
            "underage", "minor", "illegal", "drugs"
        ]
        
        low_risk_keywords = [
            "discount", "price", "money", "payment", "venmo", "paypal",
            "cash", "offer", "deal", "special request", "custom", 
            "personal", "private", "snapchat", "instagram", "whatsapp"
        ]
        
        # Convert to lowercase for case-insensitive matching
        message_lower = message_text.lower()
        
        # Check for high risk keywords first
        for keyword in high_risk_keywords:
            if keyword in message_lower:
                # Calculate a risk score based on keyword presence
                return "high-risk", 0.9
        
        # Then check for low risk keywords
        for keyword in low_risk_keywords:
            if keyword in message_lower:
                return "low-risk", 0.6
        
        # If no keywords matched, consider it safe
        return "safe", 0.1
    
    def process_message(self, message):
        """
        Process a message object, classify it, and update its risk level.
        
        Args:
            message (Message): The message object to process
            
        Returns:
            Message: The updated message object
        """
        risk_level, risk_score = self.classify_message(message.content)
        
        # Update message with classification results
        message.risk_level = risk_level
        message.risk_score = risk_score
        
        return message
    
    def should_auto_respond(self, message, user):
        """
        Determine if a message should receive an automatic response
        based on its risk level and user preferences.
        
        Args:
            message (Message): The classified message
            user (User): The user who received the message
            
        Returns:
            bool: Whether the message should be auto-responded
        """
        if message.risk_level == "safe" and user.auto_respond_safe:
            return True
        elif message.risk_level == "low-risk" and user.auto_respond_low_risk:
            return True
        elif message.risk_level == "high-risk" and user.auto_respond_high_risk:
            return True
        
        return False
