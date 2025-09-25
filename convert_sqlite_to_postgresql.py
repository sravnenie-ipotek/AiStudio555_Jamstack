#!/usr/bin/env python3
import sqlite3
import json
import sys
from datetime import datetime

def convert_sqlite_to_postgresql(sqlite_file, output_file):
    """Convert SQLite database to PostgreSQL-compatible SQL"""
    
    conn = sqlite3.connect(sqlite_file)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"-- Local Database Export for Railway PostgreSQL\n")
        f.write(f"-- Generated: {datetime.now()}\n")
        f.write(f"-- Source: {sqlite_file}\n\n")
        f.write("BEGIN;\n\n")
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            print(f"Processing table: {table_name}")
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            # Drop and create table
            f.write(f"-- Table: {table_name}\n")
            f.write(f"DROP TABLE IF EXISTS {table_name} CASCADE;\n")
            
            # Create table with PostgreSQL syntax
            f.write(f"CREATE TABLE {table_name} (\n")
            col_definitions = []
            
            for col in columns:
                col_name = col[1]
                col_type = col[2].upper()
                not_null = "NOT NULL" if col[3] else ""
                default_val = f"DEFAULT {col[4]}" if col[4] else ""
                
                # Convert SQLite types to PostgreSQL
                if col_type == "INTEGER":
                    if col[5]:  # Primary key
                        pg_type = "SERIAL PRIMARY KEY"
                    else:
                        pg_type = "INTEGER"
                elif col_type in ["TEXT", "VARCHAR"]:
                    pg_type = "TEXT"
                elif col_type == "REAL":
                    pg_type = "REAL"
                elif col_type == "BOOLEAN":
                    pg_type = "BOOLEAN"
                else:
                    pg_type = "TEXT"  # Default fallback
                
                col_def = f"    {col_name} {pg_type}"
                if not col[5] and not_null:  # Not primary key but not null
                    col_def += f" {not_null}"
                if default_val and not col[5]:
                    col_def += f" {default_val}"
                    
                col_definitions.append(col_def)
            
            f.write(",\n".join(col_definitions))
            f.write("\n);\n\n")
            
            # Insert data
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            
            if rows:
                # Get column names
                column_names = [description[0] for description in cursor.description]
                
                for row in rows:
                    values = []
                    for i, value in enumerate(row):
                        if value is None:
                            values.append("NULL")
                        elif isinstance(value, str):
                            # Escape single quotes and handle JSON
                            escaped_value = value.replace("'", "''")
                            values.append(f"'{escaped_value}'")
                        elif isinstance(value, (int, float)):
                            values.append(str(value))
                        elif isinstance(value, bool):
                            values.append("true" if value else "false")
                        else:
                            values.append(f"'{str(value).replace(\"'\", \"''\")}'")
                    
                    f.write(f"INSERT INTO {table_name} ({', '.join(column_names)}) VALUES ({', '.join(values)});\n")
            
            f.write("\n")
        
        f.write("COMMIT;\n")
    
    conn.close()
    print(f"✅ Conversion complete: {output_file}")

if __name__ == "__main__":
    convert_sqlite_to_postgresql("data.db", f"local_db_for_railway_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql")
