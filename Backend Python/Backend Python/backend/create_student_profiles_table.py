"""
Script to create student_profiles table directly in the database
"""
import asyncio
import asyncpg
from app.config import settings

async def create_student_profiles_table():
    # Parse DATABASE_URL
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
    elif db_url.startswith("postgresql://"):
        pass
    else:
        print("Unsupported database URL format")
        return
    
    try:
        # Connect to database
        conn = await asyncpg.connect(db_url)
        
        # Check if table already exists
        exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'student_profiles'
            );
        """)
        
        if exists:
            print("✓ student_profiles table already exists")
        else:
            # Create the table
            await conn.execute("""
                CREATE TABLE student_profiles (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    avatar_url TEXT,
                    bio TEXT,
                    location VARCHAR(255),
                    department VARCHAR(255) NOT NULL,
                    current_year VARCHAR(20) NOT NULL,
                    enrollment_year VARCHAR(4) NOT NULL,
                    expected_graduation_year VARCHAR(4) NOT NULL,
                    interests TEXT[],
                    skills TEXT[],
                    projects JSONB,
                    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
                    looking_for_mentorship BOOLEAN NOT NULL DEFAULT false,
                    mentorship_interests TEXT[],
                    is_public BOOLEAN NOT NULL DEFAULT true,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            """)
            
            # Create index
            await conn.execute("""
                CREATE INDEX IF NOT EXISTS ix_student_profiles_user_id 
                ON student_profiles(user_id);
            """)
            
            print("✓ student_profiles table created successfully")
        
        await conn.close()
        print("✓ Database connection closed")
        
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    asyncio.run(create_student_profiles_table())
