from app.models import Response, ResponseTemplate
import random

class ResponseGenerator:
    """
    Service for generating customized responses based on message content and user preferences.
    For the MVP, this uses template-based responses with simple customization.
    """
    
    def __init__(self):
        """Initialize the response generator."""
        self.templates = {}
        self.load_default_templates()
    
    def load_default_templates(self):
        """Load default response templates by category."""
        # These would typically be loaded from the database
        # For MVP, we'll define some basic templates here
        self.templates = {
            "greeting": [
                "Hey there! Thanks for your message! 💕",
                "Hi! So happy to hear from you! 😊",
                "Hello! Thanks for reaching out! 💋"
            ],
            "thank_you": [
                "Thank you so much for your support! I really appreciate it! 💖",
                "Thanks for the love! You're amazing! 😘",
                "Thank you! Fans like you make this all worthwhile! 💕"
            ],
            "content_request": [
                "I'd be happy to create that content for you! Let me know what you have in mind! 😉",
                "That sounds like a fun request! I'll add it to my list! 💋",
                "I love custom requests! Let me see what I can do for you! 💖"
            ],
            "subscription": [
                "Thanks for subscribing! Can't wait to share more exclusive content with you! 💕",
                "Welcome to my page! So excited to have you here! 😘",
                "Thank you for subscribing! You're going to love what I have planned! 💋"
            ],
            "general": [
                "Thanks for your message! I'll get back to you soon! 💖",
                "I appreciate you reaching out! I'll respond as soon as I can! 😊",
                "Thanks for connecting! I'll reply properly when I have a moment! 💕"
            ]
        }
    
    def _detect_message_category(self, message_text):
        """
        Detect the category of a message to select appropriate response templates.
        
        Args:
            message_text (str): The message content
            
        Returns:
            str: The detected category
        """
        message_lower = message_text.lower()
        
        # Simple keyword matching for MVP
        if any(word in message_lower for word in ["subscribe", "joined", "signed up"]):
            return "subscription"
        elif any(word in message_lower for word in ["thank", "thanks", "tip", "tipped", "payment"]):
            return "thank_you"
        elif any(word in message_lower for word in ["request", "custom", "specific", "create", "make"]):
            return "content_request"
        elif any(word in message_lower for word in ["hi", "hello", "hey", "greetings"]):
            return "greeting"
        else:
            return "general"
    
    def _adjust_template(self, template, flirtiness, friendliness, formality):
        """
        Adjust a template based on style parameters.
        
        For MVP, this does simple adjustments to the template.
        In production, this would use more sophisticated NLP techniques.
        
        Args:
            template (str): The template to adjust
            flirtiness (float): 0.0 to 1.0
            friendliness (float): 0.0 to 1.0
            formality (float): 0.0 to 1.0
            
        Returns:
            str: The adjusted template
        """
        # For MVP, we'll do simple emoji and punctuation adjustments
        
        # Adjust emoji usage based on flirtiness and friendliness
        emoji_count = int((flirtiness + friendliness) * 3)  # 0 to 6 emojis
        
        flirty_emojis = ["💋", "😘", "💖", "😉", "🔥", "💕"]
        friendly_emojis = ["😊", "💗", "👋", "🤗", "✨", "💯"]
        
        # Select emoji set based on which parameter is higher
        emoji_set = flirty_emojis if flirtiness > friendliness else friendly_emojis
        
        # Add emojis to the end of the template
        template_with_emojis = template
        if emoji_count > 0:
            # Remove existing emojis first
            for emoji in flirty_emojis + friendly_emojis:
                template_with_emojis = template_with_emojis.replace(emoji, "")
            
            # Add new emojis
            emojis = " " + " ".join(random.sample(emoji_set, min(emoji_count, len(emoji_set))))
            template_with_emojis = template_with_emojis.rstrip() + emojis
        
        # Adjust formality
        if formality < 0.3:
            # Less formal: more exclamation marks, contractions
            template_with_emojis = template_with_emojis.replace(".", "!")
            template_with_emojis = template_with_emojis.replace(" will ", " 'll ")
            template_with_emojis = template_with_emojis.replace(" are ", " 're ")
        elif formality > 0.7:
            # More formal: fewer exclamation marks, proper grammar
            template_with_emojis = template_with_emojis.replace("!", ".")
            template_with_emojis = template_with_emojis.replace(" 'll ", " will ")
            template_with_emojis = template_with_emojis.replace(" 're ", " are ")
        
        return template_with_emojis
    
    def generate_response(self, message, user):
        """
        Generate a customized response based on message content and user preferences.
        
        Args:
            message (Message): The message to respond to
            user (User): The user who will send the response
            
        Returns:
            Response: A new response object
        """
        # Detect message category
        category = self._detect_message_category(message.content)
        
        # Select a random template from the category
        if category in self.templates and self.templates[category]:
            template = random.choice(self.templates[category])
        else:
            template = random.choice(self.templates["general"])
        
        # Adjust template based on user's style preferences
        adjusted_content = self._adjust_template(
            template, 
            user.flirtiness, 
            user.friendliness, 
            user.formality
        )
        
        # Create response object
        response = Response(
            user_id=user.id,
            message_id=message.id,
            content=adjusted_content,
            is_auto_generated=True,
            template_used=category,
            flirtiness=user.flirtiness,
            friendliness=user.friendliness,
            formality=user.formality
        )
        
        return response
