import sqlite3

conn = sqlite3.connect('backend/fishguard_history.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print('Tables in fishguard_history.db:', tables)

for t in tables:
    tname = t[0]
    cursor.execute(f"PRAGMA table_info({tname});")
    cols = cursor.fetchall()
    cursor.execute(f"SELECT COUNT(*) FROM {tname};")
    cnt = cursor.fetchone()[0]
    print(f"\nTable {tname} ({cnt} rows):")
    for c in cols:
        print(f"  {c[1]} ({c[2]})")
    
    # Show sample rows
    cursor.execute(f"SELECT * FROM {tname} LIMIT 3;")
    sample = cursor.fetchall()
    print("  Sample rows:")
    for s in sample:
        print("   ", s)

conn.close()
