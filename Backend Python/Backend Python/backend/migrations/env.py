from __future__ import annotations
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# this is the Alembic Config object, which provides access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
	fileConfig(config.config_file_name)

# Override sqlalchemy.url via env var if provided
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
	# Convert asyncpg URL to psycopg2 URL for Alembic
	if DATABASE_URL.startswith("postgresql+asyncpg://"):
		DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
	elif DATABASE_URL.startswith("postgres://"):
		DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
	config.set_main_option("sqlalchemy.url", DATABASE_URL)

# add your model's MetaData object here for 'autogenerate' support
# from app.models.base import Base
# from app.models import user, alumni, events, jobs, donations, chats, announcements_mentorship
# target_metadata = Base.metadata

target_metadata = None

def run_migrations_offline() -> None:
	url = config.get_main_option("sqlalchemy.url")
	context.configure(
		url=url,
		literal_binds=True,
		compare_type=True,
	)

	with context.begin_transaction():
		context.run_migrations()


def run_migrations_online() -> None:
	connectable = engine_from_config(
		config.get_section(config.config_ini_section, {}),
		prefix="sqlalchemy.",
		poolclass=pool.NullPool,
	)

	with connectable.connect() as connection:
		context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)

		with context.begin_transaction():
			context.run_migrations()


if context.is_offline_mode():
	run_migrations_offline()
else:
	run_migrations_online()

