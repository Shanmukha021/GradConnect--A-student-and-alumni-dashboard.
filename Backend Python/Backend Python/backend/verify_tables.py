import asyncio
import asyncpg
from dotenv import load_dotenv
import os

load_dotenv()

async def verify_tables():
    database_url = os.getenv("DATABASE_URL")
    
    # Parse the URL
    if database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://", 1)
    
    try:
        conn = await asyncpg.connect(database_url)
        print("✓ Connected to database")
        
        # Check for tables
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        print(f"\n✓ Found {len(tables)} tables:")
        for table in tables:
            print(f"  - {table['table_name']}")
        
        await conn.close()
        return True
    except Exception as e:
        print(f"✗ Error: {type(e).__name__}: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(verify_tables())
