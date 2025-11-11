import os
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
	DATABASE_URL: str = Field(..., env="DATABASE_URL")
	JWT_SECRET: str = Field(..., env="JWT_SECRET")
	JWT_EXPIRES_IN: str = Field("24h", env="JWT_EXPIRES_IN")
	REFRESH_TOKEN_EXPIRES_IN: str = Field("7d", env="REFRESH_TOKEN_EXPIRES_IN")
	UPLOAD_DIR: str = Field("./backend/uploads", env="UPLOAD_DIR")
	ENV: str = Field("development", env="ENV")
	LINKEDIN_CLIENT_ID: str = Field(..., env="LINKEDIN_CLIENT_ID")
	LINKEDIN_CLIENT_SECRET: str = Field(..., env="LINKEDIN_CLIENT_SECRET")
	LINKEDIN_REDIRECT_URI: str = Field(..., env="LINKEDIN_REDIRECT_URI")

	class Config:
		env_file = ".env"
		case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
	settings = Settings()  # type: ignore[call-arg]
	# Normalize upload dir
	settings.UPLOAD_DIR = os.path.normpath(settings.UPLOAD_DIR)
	return settings


settings = get_settings()



