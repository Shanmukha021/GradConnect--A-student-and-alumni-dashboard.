import asyncio
import asyncpg
from dotenv import load_dotenv
import os

load_dotenv()

async def test_connection():
    database_url = os.getenv("DATABASE_URL")
    print(f"Testing connection to: {database_url}")
    
    # Parse the URL
    if database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://", 1)
    
    try:
        # Try to connect
        conn = await asyncpg.connect(database_url)
        print("✓ Successfully connected to the database!")
        
        # Test a simple query
        version = await conn.fetchval('SELECT version()')
        print(f"✓ PostgreSQL version: {version}")
        
        await conn.close()
        print("✓ Connection closed successfully")
        return True
    except Exception as e:
        print(f"✗ Connection failed: {type(e).__name__}")
        print(f"✗ Error details: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
