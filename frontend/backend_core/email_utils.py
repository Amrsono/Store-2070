import secrets
import logging

# Configure logging to simulate email sending
logger = logging.getLogger("email_service")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(asctime)s - EMAIL - %(message)s'))
logger.addHandler(handler)

def generate_verification_token():
    return secrets.token_urlsafe(32)

def send_verification_email(email: str, token: str):
    """
    Simulates sending a verification email.
    In a real app, this would use SMTP or an email service provider (SendGrid, AWS SES, etc).
    """
    verification_link = f"http://localhost:3000/verify-email?token={token}"
    email_content = f"""
    To: {email}
    Subject: Verify your Store 2070 Identity
    
    Welcome to the grid. 
    
    Please verify your identity by clicking the link below:
    {verification_link}
    
    If you did not initiate this link, ignore this transmission.
    """
    logger.info(f"Sending Verification Email:\n{email_content}")
    print(f"\n[EMAIL MOCK] Verification email sent to {email} with token: {token}\nLink: {verification_link}\n")

def send_welcome_email(email: str):
    """
    Simulates sending a welcome email after successful verification.
    """
    email_content = f"""
    To: {email}
    Subject: Identity Verified - Access Granted
    
    Your neural link is established. Welcome to Store 2070.
    
    Access your dashboard to view your gear and orders.
    """
    logger.info(f"Sending Welcome Email:\n{email_content}")
    print(f"\n[EMAIL MOCK] Welcome email sent to {email}\n")
