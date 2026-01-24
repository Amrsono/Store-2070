import sqlite3

def add_columns():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("SELECT email_verified FROM users LIMIT 1")
    except sqlite3.OperationalError:
        print("Adding email_verified column...")
        cursor.execute("ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0")
        
    try:
        cursor.execute("SELECT verification_token FROM users LIMIT 1")
    except sqlite3.OperationalError:
        print("Adding verification_token column...")
        cursor.execute("ALTER TABLE users ADD COLUMN verification_token TEXT")

    conn.commit()
    conn.close()
    print("Database migration complete.")

if __name__ == "__main__":
    add_columns()
