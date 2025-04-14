import os
from cryptography.fernet import Fernet

def generate_key():
    """Generate a new encryption key."""
    return Fernet.generate_key()

def encrypt_message(message_content, key=None):
    """
    Encrypt a message using Fernet symmetric encryption.
    
    Args:
        message_content (str): The message content to encrypt
        key (bytes, optional): The encryption key to use. If None, a new key is generated.
        
    Returns:
        tuple: (encrypted_content, key)
    """
    if key is None:
        key = generate_key()
    
    f = Fernet(key)
    encrypted_content = f.encrypt(message_content.encode()).decode()
    
    return encrypted_content, key

def decrypt_message(encrypted_content, key):
    """
    Decrypt a message using Fernet symmetric encryption.
    
    Args:
        encrypted_content (str): The encrypted message content
        key (bytes): The encryption key used for encryption
        
    Returns:
        str: The decrypted message content
    """
    f = Fernet(key)
    decrypted_content = f.decrypt(encrypted_content.encode()).decode()
    
    return decrypted_content
