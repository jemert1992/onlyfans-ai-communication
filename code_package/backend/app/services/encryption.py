from app.utils.encryption import encrypt_message, decrypt_message
from cryptography.fernet import Fernet
import os
import uuid

class EncryptionService:
    """
    Service for handling message encryption and decryption.
    Uses Fernet symmetric encryption for message content.
    """
    
    def __init__(self):
        """Initialize the encryption service."""
        # In production, this would use a more sophisticated key management system
        # For MVP, we'll use a simple approach with a master key
        self.master_key = os.environ.get('ENCRYPTION_MASTER_KEY', Fernet.generate_key())
        self.fernet = Fernet(self.master_key)
    
    def encrypt_message(self, message_content):
        """
        Encrypt a message and return the encrypted content and key ID.
        
        Args:
            message_content (str): The message content to encrypt
            
        Returns:
            tuple: (encrypted_content, key_id)
        """
        # Generate a unique key ID for this encryption
        key_id = str(uuid.uuid4())
        
        # Encrypt the content
        encrypted_content = self.fernet.encrypt(message_content.encode()).decode()
        
        return encrypted_content, key_id
    
    def decrypt_message(self, encrypted_content, key_id):
        """
        Decrypt a message using the stored key.
        
        Args:
            encrypted_content (str): The encrypted message content
            key_id (str): The key ID used for encryption
            
        Returns:
            str: The decrypted message content
        """
        # In a production system, we would retrieve the specific key using the key_id
        # For MVP, we use the master key for all messages
        decrypted_content = self.fernet.decrypt(encrypted_content.encode()).decode()
        
        return decrypted_content
