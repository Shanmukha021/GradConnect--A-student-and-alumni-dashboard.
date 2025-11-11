# Database Setup Guide

## Problem
The Aiven Cloud PostgreSQL database is unreachable due to network/DNS issues:
```
socket.gaierror: [Errno 11001] getaddrinfo failed
```

## Solution: Install Local PostgreSQL

### Step 1: Install PostgreSQL on Windows

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the latest PostgreSQL installer (version 15 or higher recommended)

2. **Run the Installer:**
   - During installation, set the password for the `postgres` user to: `password`
   - Keep the default port: `5432`
   - Install all components (PostgreSQL Server, pgAdmin, Command Line Tools)

### Step 2: Create the Database

After installation, open **pgAdmin** or use **psql** command line:

#### Option A: Using pgAdmin
1. Open pgAdmin
2. Connect to the local PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `alumni_platform`
5. Click "Save"

#### Option B: Using Command Line (psql)
```bash
# Open PowerShell or Command Prompt
psql -U postgres

# Enter password: password

# Create database
CREATE DATABASE alumni_platform;

# Exit
\q
```

### Step 3: Run Database Migrations

Once PostgreSQL is installed and the database is created:

```bash
cd "D:\SANIA SEP\Backend Python\Backend Python\backend"

# Run migrations (if you have Alembic set up)
alembic upgrade head

# Or run the verification script
python verify_tables.py
```

### Step 4: Start the Application

```bash
uvicorn app.main:app --reload
```

## Alternative: Use SQLite for Quick Testing

If you want to test quickly without installing PostgreSQL, you can temporarily use SQLite:

1. Update `.env`:
```env
DATABASE_URL=sqlite+aiosqlite:///./alumni_platform.db
```

2. Install aiosqlite:
```bash
pip install aiosqlite
```

3. Run the app:
```bash
uvicorn app.main:app --reload
```

## Troubleshooting

### PostgreSQL Service Not Running
```bash
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# Start the service if needed
Start-Service postgresql-x64-15  # Replace with your version
```

### Connection Still Failing
- Verify PostgreSQL is listening on port 5432
- Check Windows Firewall settings
- Ensure the password in `.env` matches your PostgreSQL password
- Try connecting with pgAdmin to verify credentials

## Current Configuration

The `.env` file has been updated to use:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/alumni_platform
```

Make sure to:
1. Install PostgreSQL
2. Create the `alumni_platform` database
3. Update the password in `.env` if you used a different password during installation
