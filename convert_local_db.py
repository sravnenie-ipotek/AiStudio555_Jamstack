#!/usr/bin/env python3
import sqlite3
from datetime import datetime

def convert_local_db():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f"local_db_for_railway_{timestamp}.sql"
    
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"-- Local Database Export for Railway PostgreSQL\n")
        f.write(f"-- Generated: {datetime.now()}\n\n")
        f.write("BEGIN;\n\n")
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            print(f"Processing table: {table_name}")
            
            f.write(f"-- Table: {table_name}\n")
            f.write(f"DROP TABLE IF EXISTS {table_name} CASCADE;\n")
            
            # Get table structure for PostgreSQL
            cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table_name}'")
            create_sql = cursor.fetchone()[0]
            
            # Simple conversion: replace AUTOINCREMENT with SERIAL
            pg_sql = create_sql.replace("AUTOINCREMENT", "").replace("INTEGER PRIMARY KEY", "SERIAL PRIMARY KEY")
            f.write(f"{pg_sql};\n\n")
            
            # Export data
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            
            if rows:
                column_names = [description[0] for description in cursor.description]
                
                for row in rows:
                    values = []
                    for value in row:
                        if value is None:
                            values.append("NULL")
                        elif isinstance(value, str):
                            escaped = value.replace("'", "''").replace("\\", "\\\\")
                            values.append(f"'{escaped}'")
                        elif isinstance(value, bool):
                            values.append("true" if value else "false")
                        else:
                            values.append(str(value))
                    
                    f.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES ({', '.join(values)});\n")
            
            f.write("\n")
        
        f.write("COMMIT;\n")
    
    conn.close()
    print(f"✅ Local database exported: {output_file}")
    return output_file

if __name__ == "__main__":
    convert_local_db()
