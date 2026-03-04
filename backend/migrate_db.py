import sqlite3
import os
from pathlib import Path
from datetime import datetime

def find_database():
    """Find the database file automatically"""
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.db'):
                return os.path.join(root, file)
    return None

def migrate():
    """Add missing columns to database"""
    
    db_path = find_database()
    
    if not db_path:
        print("❌ Database file not found!")
        return
    
    print(f"📂 Found database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check current schema
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"📊 Tables found: {', '.join(tables)}")
    
    print("\n🔧 Running migrations...")
    
    # SQLite-compatible migrations (no CURRENT_TIMESTAMP in ALTER TABLE)
    migrations = [
        # Add created_at to badges (NULL allowed, then update)
        ("ALTER TABLE badges ADD COLUMN created_at TIMESTAMP", "badges.created_at"),
        
        # Add last_updated to progress (NULL allowed, then update)
        ("ALTER TABLE progress ADD COLUMN last_updated TIMESTAMP", "progress.last_updated"),
    ]
    
    for sql, column_name in migrations:
        try:
            cursor.execute(sql)
            print(f"  ✓ Added {column_name}")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print(f"  ⚠ {column_name} already exists, skipping")
            else:
                print(f"  ⚠ Warning for {column_name}: {e}")
    
    # Update NULL timestamps with current time
    try:
        current_time = datetime.utcnow().isoformat()
        
        cursor.execute("UPDATE badges SET created_at = ? WHERE created_at IS NULL", (current_time,))
        updated_badges = cursor.rowcount
        if updated_badges > 0:
            print(f"  ✓ Set created_at for {updated_badges} badge(s)")
        
        cursor.execute("UPDATE progress SET last_updated = ? WHERE last_updated IS NULL", (current_time,))
        updated_progress = cursor.rowcount
        if updated_progress > 0:
            print(f"  ✓ Set last_updated for {updated_progress} progress record(s)")
            
    except Exception as e:
        print(f"  ⚠ Timestamp update warning: {e}")
    
    # Update existing users' level
    try:
        cursor.execute("UPDATE users SET level = '1' WHERE level = 'Beginner' OR level = 'beginner'")
        updated = cursor.rowcount
        if updated > 0:
            print(f"  ✓ Updated {updated} user level(s)")
    except Exception as e:
        print(f"  ⚠ Level update warning: {e}")
    
    conn.commit()
    conn.close()
    
    print("\n✅ Migration complete! Restart your server.")
    print(f"📂 Database location: {os.path.abspath(db_path)}")

if __name__ == "__main__":
    migrate()
