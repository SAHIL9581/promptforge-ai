import sqlite3
import os

def add_missing_columns():
    # Find the database file
    db_file = 'promptforge.db'
    if not os.path.exists(db_file):
        db_file = 'app.db'
    if not os.path.exists(db_file):
        print("❌ Database file not found!")
        print("Please tell me your database filename.")
        return
    
    print(f"Found database: {db_file}")
    
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    existing_columns = [col[1] for col in columns]
    
    print(f"Existing columns: {existing_columns}")
    print()
    
    # Add bio column
    if 'bio' not in existing_columns:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''")
            conn.commit()
            print("✅ Added 'bio' column")
        except Exception as e:
            print(f"❌ Error adding bio: {e}")
    else:
        print("⚠️ 'bio' column already exists")
    
    # Add streak column
    if 'streak' not in existing_columns:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN streak INTEGER DEFAULT 0")
            conn.commit()
            print("✅ Added 'streak' column")
        except Exception as e:
            print(f"❌ Error adding streak: {e}")
    else:
        print("⚠️ 'streak' column already exists")
    
    # Add last_attempt_date column
    if 'last_attempt_date' not in existing_columns:
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN last_attempt_date DATE")
            conn.commit()
            print("✅ Added 'last_attempt_date' column")
        except Exception as e:
            print(f"❌ Error adding last_attempt_date: {e}")
    else:
        print("⚠️ 'last_attempt_date' column already exists")
    
    conn.close()
    print("\n✅ Migration complete! All data preserved.")

if __name__ == "__main__":
    print("=" * 50)
    print("Adding new columns to database...")
    print("=" * 50)
    add_missing_columns()
